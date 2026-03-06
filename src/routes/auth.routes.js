import { Router } from "express";
import * as AuthController from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../models/schemas.js";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimiters.js";

const router = Router();

router.post("/register", registerLimiter, validate(registerSchema), AuthController.register);
router.post("/login", loginLimiter, validate(loginSchema), AuthController.login);

export default router;
