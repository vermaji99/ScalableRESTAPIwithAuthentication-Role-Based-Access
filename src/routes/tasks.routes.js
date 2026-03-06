import { Router } from "express";
import * as TasksController from "../controllers/tasks.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createTaskSchema, updateTaskSchema, listQuerySchema } from "../models/schemas.js";

const router = Router();

router.get("/", requireAuth, validate(listQuerySchema, "query"), TasksController.list);
router.post("/", requireAuth, validate(createTaskSchema), TasksController.create);
router.get("/:id", requireAuth, TasksController.getById);
router.patch("/:id", requireAuth, validate(updateTaskSchema), TasksController.update);
router.put("/:id", requireAuth, validate(updateTaskSchema), TasksController.replace);
router.delete("/:id", requireAuth, TasksController.remove);

export default router;
