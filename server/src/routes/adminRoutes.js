import { Router } from "express";
import { getStats } from "../controllers/adminController.js";
import {
  listOrders,
  getAdminOrder,
  updateOrderStatus,
} from "../controllers/adminOrderController.js";
import { listUsers } from "../controllers/adminUserController.js";
import { uploadProductImages } from "../controllers/uploadController.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { uploadImages } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { updateOrderStatusSchema } from "../validators/adminValidator.js";

const router = Router();

// Everything under /api/admin needs a logged-in admin
router.use(protect, restrictTo("admin"));

router.get("/stats", getStats);

router.get("/orders", listOrders);
router.get("/orders/:id", getAdminOrder);
router.patch("/orders/:id/status", validate(updateOrderStatusSchema), updateOrderStatus);

router.get("/users", listUsers);

// Product image uploads (multipart, field name: images)
router.post("/uploads", uploadImages, uploadProductImages);

export default router;