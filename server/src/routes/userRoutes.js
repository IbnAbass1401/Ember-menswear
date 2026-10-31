import { Router } from "express";
import rateLimit from "express-rate-limit";
import { updateMe, changePassword } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema, changePasswordSchema } from "../validators/userValidator.js";

const router = Router();

// Stops someone with a stolen session from guessing the current password forever
const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again later." },
});

router.use(protect);

router.patch("/me", validate(updateProfileSchema), updateMe);
router.patch("/me/password", passwordLimiter, validate(changePasswordSchema), changePassword);

export default router;