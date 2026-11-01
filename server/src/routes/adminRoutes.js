import { Router } from "express";
import { getStats } from "../controllers/adminController.js";
import {
  listOrders,
  getAdminOrder,
  updateOrderStatus,
} from "../controllers/adminOrderController.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateOrderStatusSchema } from "../validators/adminValidator.js";

const router = Router();

// Everything under /api/admin needs a logged-in admin
router.use(protect, restrictTo("admin"));

router.get("/stats", getStats);

router.get("/orders", listOrders);
router.get("/orders/:id", getAdminOrder);
router.patch("/orders/:id/status", validate(updateOrderStatusSchema), updateOrderStatus);

export default router;