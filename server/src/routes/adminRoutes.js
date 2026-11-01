import { Router } from "express";
import { getStats } from "../controllers/adminController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

// Everything under /api/admin needs a logged-in admin
router.use(protect, restrictTo("admin"));

router.get("/stats", getStats);

export default router;