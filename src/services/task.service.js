import Task from "../models/Task.js";

export const listMyTasks = async (userId, pagination = {}) => {
  const limit = Math.min(pagination.limit || 20, 100);
  const skip = pagination.offset || 0;
  
  const [items, total] = await Promise.all([
    Task.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments({ userId })
  ]);
  
  return { items, total };
};

export const listAllTasks = async (pagination = {}) => {
  const limit = Math.min(pagination.limit || 20, 100);
  const skip = pagination.offset || 0;
  
  const [items, total] = await Promise.all([
    Task.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments()
  ]);
  
  return { items, total };
};

export const getTaskById = async (id) => {
  const task = await Task.findById(id);
  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    err.code = "task_not_found";
    throw err;
  }
  return task;
};

export const createTask = async (userId, data) => {
  const task = await Task.create({ ...data, userId });
  return task;
};

export const updateTask = async (id, data) => {
  const task = await Task.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    err.code = "task_not_found";
    throw err;
  }
  return task;
};

export const deleteTask = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    err.code = "task_not_found";
    throw err;
  }
};
