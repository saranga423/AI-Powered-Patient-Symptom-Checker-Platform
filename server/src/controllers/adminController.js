import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateAdminPassword } from "../utils/tokens.js";

export async function createAdmin(req, res) {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Valid admin email is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (await User.exists({ email: normalizedEmail })) {
    return res.status(409).json({ message: "Admin email already exists" });
  }

  const generatedPassword = generateAdminPassword();
  const passwordHash = await bcrypt.hash(generatedPassword, 12);

  const admin = await User.create({
    email: normalizedEmail,
    passwordHash,
    role: "ADMIN"
  });

  res.status(201).json({
    message: "Admin created successfully",
    admin: { id: admin._id, email: admin.email, role: admin.role },
    generatedPassword
  });
}