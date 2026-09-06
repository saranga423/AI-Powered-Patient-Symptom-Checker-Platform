import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication token required" });
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(payload.userId).select("-passwordHash -refreshTokenHash");

    if (!user) return res.status(401).json({ message: "User no longer exists" });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not authorized for this resource" });
    }
    next();
  };
}