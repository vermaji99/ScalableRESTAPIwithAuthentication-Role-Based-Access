import { Router } from "express";

const router = Router();

router.get("/readiness", (req, res) => res.json({ status: "ready" }));

export default router;
