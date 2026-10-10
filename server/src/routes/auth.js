import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, me } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Slows down password guessing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again in a few minutes" },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", protect, me);

export default router;
