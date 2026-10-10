import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import analysisRoutes from "./routes/analysis.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Render and Vercel sit behind a proxy; needed so rate limiting sees the real client IP
app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: (process.env.CLIENT_URL || "http://localhost:5173").split(",") }));
app.use(express.json({ limit: "1mb" }));

app.use(
  "/api",
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 200, standardHeaders: "draft-8", legacyHeaders: false })
);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api", analysisRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
