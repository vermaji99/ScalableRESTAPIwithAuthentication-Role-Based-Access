import * as UserService from "../services/user.service.js";
import { ok, noContent } from "../utils/response.js";

export const list = async (req, res, next) => {
  try {
    const data = await UserService.listUsers({ limit: req.query.limit, offset: req.query.offset });
    return ok(res, data.items, { total: data.total });
  } catch (e) {
    next(e);
  }
};

export const me = async (req, res, next) => {
  try {
    const data = await UserService.getUserById(req.user.id);
    return ok(res, data);
  } catch (e) {
    next(e);
  }
};

export const getById = async (req, res, next) => {
  try {
    const data = await UserService.getUserById(req.params.id);
    return ok(res, data);
  } catch (e) {
    next(e);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const data = await UserService.updateOwnProfile(req.user.id, req.body);
    return ok(res, data);
  } catch (e) {
    next(e);
  }
};

export const adminUpdate = async (req, res, next) => {
  try {
    const data = await UserService.adminUpdateUser(req.params.id, req.body);
    return ok(res, data);
  } catch (e) {
    next(e);
  }
};

export const adminDelete = async (req, res, next) => {
  try {
    await UserService.adminDeleteUser(req.params.id);
    return noContent(res);
  } catch (e) {
    next(e);
  }
};
