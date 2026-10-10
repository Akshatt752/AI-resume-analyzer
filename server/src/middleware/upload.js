import multer from "multer";
import { httpError } from "./errorHandler.js";

const ALLOWED_EXTENSIONS = /\.(pdf|docx)$/i;

// Files stay in memory: we only need the text, so nothing is written to disk
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_EXTENSIONS.test(file.originalname)) cb(null, true);
    else cb(httpError(400, "Only PDF or DOCX files are allowed"));
  },
});
