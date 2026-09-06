import Submission from "../models/Submission.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^(?:\+94|0)?7\d{8}$/;

function validate(body, partial = false) {
  const errors = {};

  if (!partial || body.firstName !== undefined) {
    if (!String(body.firstName || "").trim()) errors.firstName = "First name is required";
  }
  if (!partial || body.lastName !== undefined) {
    if (!String(body.lastName || "").trim()) errors.lastName = "Last name is required";
  }
  if (!partial || body.email !== undefined) {
    if (!emailRegex.test(String(body.email || "").trim())) errors.email = "Valid email is required";
  }
  if (!partial || body.gender !== undefined) {
    if (!["MALE", "FEMALE", "OTHER"].includes(body.gender)) errors.gender = "Invalid gender";
  }
  if (!partial || body.mobileNumber !== undefined) {
    if (!mobileRegex.test(String(body.mobileNumber || "").replace(/\s/g, ""))) {
      errors.mobileNumber = "Enter a valid local mobile number";
    }
  }
  if (!partial || body.address !== undefined) {
    if (!String(body.address || "").trim()) errors.address = "Address is required";
  }

  return errors;
}

export async function createSubmission(req, res) {
  const errors = validate(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: "Validation failed", errors });

  const email = req.body.email.trim().toLowerCase();
  if (await Submission.exists({ email })) {
    return res.status(409).json({ message: "A submission with this email already exists" });
  }

  const submission = await Submission.create({
    ...req.body,
    email,
    userCreated: req.user._id,
    dateCreated: new Date()
  });

  res.status(201).json({ message: "Application submitted successfully", submission });
}

export async function getSubmissions(req, res) {
  const { gender, search } = req.query;
  const filter = {};

  if (gender && ["MALE", "FEMALE", "OTHER"].includes(gender)) {
    filter.gender = gender;
  }

  if (search?.trim()) {
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { firstName: { $regex: escaped, $options: "i" } },
      { lastName: { $regex: escaped, $options: "i" } }
    ];
  }

  const submissions = await Submission.find(filter)
    .populate("userCreated", "email role")
    .populate("userModified", "email role")
    .sort({ dateCreated: -1 });

  res.json({ submissions });
}

export async function getSubmission(req, res) {
  const submission = await Submission.findById(req.params.id);
  if (!submission) return res.status(404).json({ message: "Submission not found" });
  res.json({ submission });
}

export async function updateSubmission(req, res) {
  const errors = validate(req.body, true);
  if (Object.keys(errors).length) return res.status(400).json({ message: "Validation failed", errors });

  const update = { ...req.body };
  if (update.email) update.email = update.email.trim().toLowerCase();

  const submission = await Submission.findById(req.params.id);
  if (!submission) return res.status(404).json({ message: "Submission not found" });

  if (update.email && update.email !== submission.email && await Submission.exists({ email: update.email })) {
    return res.status(409).json({ message: "Another submission already uses this email" });
  }

  Object.assign(submission, update, {
    userModified: req.user._id,
    dateModified: new Date()
  });

  await submission.save();
  res.json({ message: "Submission updated successfully", submission });
}

export async function deleteSubmission(req, res) {
  const submission = await Submission.findByIdAndDelete(req.params.id);
  if (!submission) return res.status(404).json({ message: "Submission not found" });
  res.json({ message: "Submission deleted successfully" });
}