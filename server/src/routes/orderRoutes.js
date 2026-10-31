import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createOrder, getMyOrders, getOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema } from "../validators/orderValidator.js";

const router = Router();

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many orders. Please try again later." },
});

router.use(protect);

router.post("/", orderLimiter, validate(createOrderSchema), createOrder);
router.get("/mine", getMyOrders); // must stay above "/:id"
router.get("/:id", getOrder);

export default router;