import * as TaskService from "../services/task.service.js";
import { ok, created, noContent } from "../utils/response.js";

export const list = async (req, res, next) => {
  try {
    const pagination = { limit: req.query.limit, offset: req.query.offset };
    const data =
      req.user.role === "admin"
        ? await TaskService.listAllTasks(pagination)
        : await TaskService.listMyTasks(req.user.id, pagination);
    return ok(res, data.items, { total: data.total });
  } catch (e) {
    next(e);
  }
};

export const getById = async (req, res, next) => {
  try {
    const task = await TaskService.getTaskById(req.params.id);
    if (task.userId.toString() !== req.user.id && req.user.role !== "admin") {
      const err = new Error("Not allowed");
      err.status = 403;
      err.code = "forbidden";
      throw err;
    }
    return ok(res, task);
  } catch (e) {
    next(e);
  }
};

export const create = async (req, res, next) => {
  try {
    const task = await TaskService.createTask(req.user.id, req.body);
    return created(res, task);
  } catch (e) {
    next(e);
  }
};

export const update = async (req, res, next) => {
  try {
    const task = await TaskService.getTaskById(req.params.id);
    if (task.userId.toString() !== req.user.id && req.user.role !== "admin") {
      const err = new Error("Not allowed");
      err.status = 403;
      err.code = "forbidden";
      throw err;
    }
    const updated = await TaskService.updateTask(task._id, req.body);
    return ok(res, updated);
  } catch (e) {
    next(e);
  }
};

export const replace = async (req, res, next) => {
  try {
    const task = await TaskService.getTaskById(req.params.id);
    if (task.userId.toString() !== req.user.id && req.user.role !== "admin") {
      const err = new Error("Not allowed");
      err.status = 403;
      err.code = "forbidden";
      throw err;
    }
    const updated = await TaskService.updateTask(task._id, req.body);
    return ok(res, updated);
  } catch (e) {
    next(e);
  }
};

export const remove = async (req, res, next) => {
  try {
    const task = await TaskService.getTaskById(req.params.id);
    if (task.userId.toString() !== req.user.id && req.user.role !== "admin") {
      const err = new Error("Not allowed");
      err.status = 403;
      err.code = "forbidden";
      throw err;
    }
    await TaskService.deleteTask(task._id);
    return noContent(res);
  } catch (e) {
    next(e);
  }
};
