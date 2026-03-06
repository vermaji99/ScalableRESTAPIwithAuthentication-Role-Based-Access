import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./users.routes.js";
import taskRoutes from "./tasks.routes.js";
import healthRoutes from "./health.routes.js";

export const routerV1 = Router();

routerV1.use("/auth", authRoutes);
routerV1.use("/users", userRoutes);
routerV1.use("/tasks", taskRoutes);
routerV1.use("/", healthRoutes);
