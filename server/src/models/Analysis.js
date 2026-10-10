import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    key: String,
    label: String,
    score: Number,
    max: Number,
    tips: [String],
  },
  { _id: false }
);

const feedbackSchema = new mongoose.Schema(
  {
    summary: String,
    strengths: [String],
    improvements: [String],
    rewrittenBullets: [{ _id: false, original: String, improved: String }],
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    targetLabel: { type: String, required: true },
    jobDescription: String,
    resumeText: String,
    score: { type: Number, required: true },
    breakdown: [categorySchema],
    matchedKeywords: [String],
    missingKeywords: [String],
    stats: {
      wordCount: Number,
      bulletCount: Number,
      sectionsFound: [String],
    },
    aiFeedback: feedbackSchema,
    aiStatus: { type: String, enum: ["ok", "failed", "skipped"], default: "skipped" },
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);
