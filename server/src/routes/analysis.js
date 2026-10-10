import { Router } from "express";
import rateLimit from "express-rate-limit";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  analyze,
  listAnalyses,
  getAnalysis,
  deleteAnalysis,
  getRoles,
} from "../controllers/analysisController.js";

const router = Router();

// Each analysis calls the AI, so keep users well inside Groq's free-tier limits
const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => req.user.id,
  message: { message: "You've run a lot of analyses. Please wait a few minutes and try again." },
});

router.get("/roles", getRoles);

// protect runs before upload so anonymous requests never get their files parsed
router.post("/analyze", protect, analyzeLimiter, upload.single("resume"), analyze);
router.get("/analyses", protect, listAnalyses);
router.get("/analyses/:id", protect, getAnalysis);
router.delete("/analyses/:id", protect, deleteAnalysis);

export default router;
