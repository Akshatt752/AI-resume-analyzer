import Analysis from "../models/Analysis.js";
import { httpError } from "../middleware/errorHandler.js";
import { extractText } from "../services/parser.js";
import { resolveTarget, listRoles } from "../services/keywords.js";
import { scoreResume } from "../services/scorer.js";
import { getAIFeedback } from "../services/ai.js";

export async function analyze(req, res) {
  if (!req.file) throw httpError(400, "Please upload your resume (PDF or DOCX)");

  const roleId = req.body?.roleId;
  const jobDescription = typeof req.body?.jobDescription === "string" ? req.body.jobDescription : "";
  if (jobDescription.length > 15000) throw httpError(400, "Job description is too long (max 15,000 characters)");

  // Validate the target before the slower file parsing
  const target = resolveTarget({ roleId, jobDescription });

  const resumeText = await extractText(req.file.buffer);
  if (resumeText.length < 200) {
    throw httpError(
      422,
      "Couldn't read enough text from this file. If it's a scanned image, export your resume as a text-based PDF."
    );
  }

  const { bullets, ...result } = scoreResume(resumeText, target.keywords);

  // The score never depends on the AI: if Groq is down or rate-limited we still return it
  let aiFeedback = null;
  let aiStatus = "skipped";
  if (process.env.GROQ_API_KEY) {
    try {
      aiFeedback = await getAIFeedback({
        resumeText,
        targetLabel: target.label,
        score: result.score,
        matched: result.matchedKeywords,
        missing: result.missingKeywords,
        bullets,
      });
      aiStatus = "ok";
    } catch (err) {
      console.error("AI feedback failed:", err.message);
      aiStatus = "failed";
    }
  }

  const analysis = await Analysis.create({
    user: req.user._id,
    fileName: req.file.originalname,
    targetLabel: target.label,
    jobDescription: jobDescription.trim() || undefined,
    resumeText,
    ...result,
    aiFeedback,
    aiStatus,
  });

  res.status(201).json({ analysis });
}

export async function listAnalyses(req, res) {
  const analyses = await Analysis.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .select("fileName targetLabel score aiStatus createdAt");
  res.json({ analyses });
}

export async function getAnalysis(req, res) {
  const analysis = await Analysis.findOne({ _id: req.params.id, user: req.user._id });
  if (!analysis) throw httpError(404, "Analysis not found");
  res.json({ analysis });
}

export async function deleteAnalysis(req, res) {
  const deleted = await Analysis.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!deleted) throw httpError(404, "Analysis not found");
  res.status(204).end();
}

export function getRoles(req, res) {
  res.json({ roles: listRoles() });
}
