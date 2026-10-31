import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createOrder, getMyOrders, getOrder } from "../controllers/orderController.js";
import { payOrder, verifyOrder } from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema, verifyPaymentSchema } from "../validators/orderValidator.js";

const router = Router();

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many orders. Please try again later." },
});



const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many payment requests. Please try again later." },
});

router.use(protect);

router.post("/", orderLimiter, validate(createOrderSchema), createOrder);
router.get("/mine", getMyOrders); // must stay above "/:id"
router.get("/:id", getOrder);
router.post("/:id/pay", paymentLimiter, payOrder);
router.post("/:id/verify", paymentLimiter, validate(verifyPaymentSchema), verifyOrder);

export default router;