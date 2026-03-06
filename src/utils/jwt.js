import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const signAccessToken = (user) => {
  const payload = { email: user.email, role: user.role };
  const options = { expiresIn: config.JWT_EXPIRES_IN, subject: (user.id || user._id).toString() };
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, options);
};
