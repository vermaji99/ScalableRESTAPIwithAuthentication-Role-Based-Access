import User from "../models/User.js";
import { signAccessToken } from "../utils/jwt.js";

export const register = async ({ name, email, password, role }) => {
  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error("Email already registered");
    err.status = 409;
    err.code = "email_exists";
    throw err;
  }
  
  const user = await User.create({ name, email, password, role: role || "user" });
  
  const userResponse = user.toObject();
  delete userResponse.password;
  
  return userResponse;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    err.code = "invalid_credentials";
    throw err;
  }
  
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    err.code = "invalid_credentials";
    throw err;
  }
  
  const token = signAccessToken({ id: user._id, email: user.email, role: user.role });
  
  const userResponse = user.toObject();
  delete userResponse.password;
  
  return { token, user: userResponse };
};
