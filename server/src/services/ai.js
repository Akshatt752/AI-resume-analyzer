// AI feedback via Groq's free API (OpenAI-compatible chat completions endpoint)
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Groq validates the model output against this schema, so we always get the same shape back
const FEEDBACK_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    improvements: { type: "array", items: { type: "string" } },
    rewrittenBullets: {
      type: "array",
      items: {
        type: "object",
        properties: { original: { type: "string" }, improved: { type: "string" } },
        required: ["original", "improved"],
        additionalProperties: false,
      },
    },
  },
  required: ["summary", "strengths", "improvements", "rewrittenBullets"],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `You are an experienced technical recruiter who reviews resumes for ATS (applicant tracking system) readiness.
Give specific, honest, actionable feedback that refers to the actual content of the resume.
Rules:
- Only state facts that appear in the resume. Never invent experience, employers, tools or numbers.
- Judge the resume at the level it shows (student, fresher, experienced). Never assume a senior role.
- In rewrites keep the candidate's real role and scope: don't add leadership, team size or results that aren't in the original.
- When a rewritten bullet needs a metric the resume doesn't have, use a placeholder like [X%] or [N users] for the candidate to fill in.
- Write directly to the candidate as "you"/"your". Don't use their name or he/she.
- Keep each point to one or two sentences.`;

function buildPrompt({ resumeText, targetLabel, score, matched, missing, bullets }) {
  const bulletList = bullets.slice(0, 15).map((b) => `- ${b}`).join("\n") || "(no bullet points found)";

  return `Target role: ${targetLabel}
Rule-based ATS score: ${score}/100
Keywords found: ${matched.join(", ") || "none"}
Keywords missing: ${missing.join(", ") || "none"}

Return JSON with:
- summary: 2-3 sentence overall assessment for this role
- strengths: 3-5 strengths
- improvements: 4-6 improvements, most important first
- rewrittenBullets: up to 3 of the weakest project or work-experience bullet points below (skip certifications, awards and course lines), "original" copied exactly, "improved" rewritten with a strong action verb and, where a metric naturally fits, a placeholder for it

Bullet points:
${bulletList}

Resume:
"""
${resumeText.slice(0, 12000)}
"""`;
}

export async function getAIFeedback(input) {
  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(input) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "resume_feedback", strict: true, schema: FEEDBACK_SCHEMA },
      },
      temperature: 0.4,
      max_completion_tokens: 4000,
      // gpt-oss models think before answering; "medium" balances speed and quality
      ...(model.startsWith("openai/gpt-oss") && { reasoning_effort: "medium" }),
    }),
    signal: AbortSignal.timeout(45_000),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Groq API ${res.status}: ${data.error?.message || res.statusText}`);
  }

  // Models sometimes emit non-breaking hyphens (U+2011), which some fonts render as boxes
  return JSON.parse(data.choices[0].message.content.replace(/\u2011/g, "-"));
}
