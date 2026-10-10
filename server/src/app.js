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
// Browsers send the origin without a trailing slash, so normalise whatever was pasted into CLIENT_URL
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim().replace(/\/+$/, ""));
app.use(cors({ origin: allowedOrigins }));
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
