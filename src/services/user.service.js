import User from "../models/User.js";

export const listUsers = async (pagination = {}) => {
  const limit = Math.min(pagination.limit || 20, 100);
  const skip = pagination.offset || 0;
  
  const [items, total] = await Promise.all([
    User.find().select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments()
  ]);
  
  return { items, total };
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    err.code = "user_not_found";
    throw err;
  }
  return user;
};

export const updateOwnProfile = async (id, data) => {
  const allowed = {};
  if (data.email) allowed.email = data.email;
  if (data.name) allowed.name = data.name;
  
  const user = await User.findByIdAndUpdate(id, allowed, { new: true, runValidators: true }).select("-password");
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    err.code = "user_not_found";
    throw err;
  }
  return user;
};

export const adminUpdateUser = async (id, data) => {
  const allowed = {};
  if (data.email) allowed.email = data.email;
  if (data.role) allowed.role = data.role;
  if (data.name) allowed.name = data.name;
  
  const user = await User.findByIdAndUpdate(id, allowed, { new: true, runValidators: true }).select("-password");
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    err.code = "user_not_found";
    throw err;
  }
  return user;
};

export const adminDeleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    err.code = "user_not_found";
    throw err;
  }
};
