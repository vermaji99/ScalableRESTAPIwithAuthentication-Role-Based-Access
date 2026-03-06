import { Router } from "express";
import * as UsersController from "../controllers/users.controller.js";
import { requireAuth, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

router.get("/me", requireAuth, UsersController.me);
router.patch("/me", requireAuth, UsersController.updateMe);
router.get("/", requireAuth, authorizeRoles("admin"), UsersController.list);
router.get("/:id", requireAuth, authorizeRoles("admin"), UsersController.getById);
router.patch("/:id", requireAuth, authorizeRoles("admin"), UsersController.adminUpdate);
router.delete("/:id", requireAuth, authorizeRoles("admin"), UsersController.adminDelete);

export default router;
