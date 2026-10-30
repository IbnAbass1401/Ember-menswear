import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createProductSchema, updateProductSchema } from "../validators/productValidator.js";

const router = Router();

router.get("/", getProducts);
router.get("/:slug", getProduct);

router.post("/", protect, restrictTo("admin"), validate(createProductSchema), createProduct);
router.patch("/:id", protect, restrictTo("admin"), validate(updateProductSchema), updateProduct);
router.delete("/:id", protect, restrictTo("admin"), deleteProduct);

export default router;