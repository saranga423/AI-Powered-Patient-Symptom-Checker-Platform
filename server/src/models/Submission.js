import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"], required: true },
    mobileNumber: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    feedback: { type: String, default: "", trim: true },
    userCreated: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dateCreated: { type: Date, default: Date.now },
    userModified: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    dateModified: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);