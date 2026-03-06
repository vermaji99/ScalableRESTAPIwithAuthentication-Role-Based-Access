import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: { code: "unauthorized", message: "Missing or invalid token" } });
  }
  try {
    const payload = jwt.verify(token, config.JWT_ACCESS_SECRET);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: { code: "unauthorized", message: "Invalid token" } });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: { code: "unauthorized", message: "Not authenticated" } });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: { code: "forbidden", message: "Insufficient role" } });
  }
  next();
};

export const authMiddleware = requireAuth;
export const authorizeRoles = requireRole;
