import "./config/env.js";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 8000;

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
