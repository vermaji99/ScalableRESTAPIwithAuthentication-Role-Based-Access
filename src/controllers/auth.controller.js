import * as AuthService from "../services/auth.service.js";
import { created, ok } from "../utils/response.js";

export const register = async (req, res, next) => {
  try {
    const user = await AuthService.register(req.body);
    return created(res, user);
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body);
    return ok(res, result);
  } catch (e) {
    next(e);
  }
};
