import crypto from "crypto";
import jwt from "jsonwebtoken";

export function createAccessToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" }
  );
}

export function createRefreshToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d" }
  );
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateAdminPassword() {
  return crypto.randomBytes(9).toString("base64url") + "A1!";
}