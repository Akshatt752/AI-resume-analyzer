// Imported first in index.js so every other module sees the variables from .env
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const required = ["MONGO_URI", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}. Copy .env.example to .env and fill them in.`);
  process.exit(1);
}

if (!process.env.GROQ_API_KEY) {
  console.warn("GROQ_API_KEY not set: analyses will return the ATS score without AI feedback.");
}
