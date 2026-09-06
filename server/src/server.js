import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "full-stack-assignment-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/submissions", submissionRoutes);

app.use(notFound);
app.use(errorHandler);

async function seedAdmin() {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!email || !password) return;

  const exists = await User.exists({ email: email.toLowerCase() });
  if (!exists) {
    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({
      email: email.toLowerCase(),
      passwordHash,
      role: "ADMIN"
    });
    console.log(`Seed admin created: ${email}`);
  }
}

const PORT = process.env.PORT || 5000;

connectDB()
  .then(seedAdmin)
  .then(() => {
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("Startup failed:", err);
    process.exit(1);
  });