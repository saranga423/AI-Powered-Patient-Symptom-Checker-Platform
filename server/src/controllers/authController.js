import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  createAccessToken,
  createRefreshToken,
  hashToken
} from "../utils/tokens.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCredentials(email, password) {
  if (!emailRegex.test(email || "")) return "A valid email is required";
  if (!password || password.length < 4) return "Password must be at least 4 characters";
  return null;
}

async function issueTokens(user) {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();
  return { accessToken, refreshToken };
}

export async function registerCustomer(req, res) {
  const { email, password, confirmPassword } = req.body;
  const validation = validateCredentials(email, password);

  if (validation) return res.status(400).json({ message: validation });
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    email: normalizedEmail,
    passwordHash,
    role: "CUSTOMER"
  });

  const tokens = await issueTokens(user);

  res.status(201).json({
    message: "Customer registered successfully",
    user: { id: user._id, email: user.email, role: user.role },
    ...tokens
  });
}

async function loginByRole(req, res, role) {
  const { email, password } = req.body;
  const validation = validateCredentials(email, password);
  if (validation) return res.status(400).json({ message: validation });

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
    role
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const tokens = await issueTokens(user);
  res.json({
    message: "Login successful",
    user: { id: user._id, email: user.email, role: user.role },
    ...tokens
  });
}

export async function customerLogin(req, res) {
  return loginByRole(req, res, "CUSTOMER");
}

export async function adminLogin(req, res) {
  return loginByRole(req, res, "ADMIN");
}

export async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.userId);

    if (!user || !user.refreshTokenHash || hashToken(refreshToken) !== user.refreshTokenHash) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const tokens = await issueTokens(user);
    res.json(tokens);
  } catch {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}

export async function logout(req, res) {
  const user = await User.findById(req.user._id);
  if (user) {
    user.refreshTokenHash = null;
    await user.save();
  }
  res.json({ message: "Logged out successfully" });
}

export async function me(req, res) {
  res.json({
    user: { id: req.user._id, email: req.user.email, role: req.user.role }
  });
}