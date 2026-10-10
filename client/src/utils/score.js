// One place that decides how a score looks, so numbers, bars and badges always agree
export function scoreTone(score, max = 100) {
  const pct = (score / max) * 100;
  if (pct >= 80) return { label: "Strong match", text: "text-good", bg: "bg-good", soft: "bg-good/10" };
  if (pct >= 60) return { label: "Good, needs polish", text: "text-mid", bg: "bg-mid", soft: "bg-mid/10" };
  return { label: "Needs work", text: "text-low", bg: "bg-low", soft: "bg-low/10" };
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

// The same weights the server uses; shown on the landing page so users know how scoring works
export const SCORE_WEIGHTS = [
  { label: "Keyword match", points: 40, note: "Skills the job asks for that appear in your resume. Synonyms count, so “node” matches Node.js." },
  { label: "Sections", points: 20, note: "Education, skills, projects or experience, a summary, certifications." },
  { label: "Impact", points: 15, note: "Bullets that open with an action verb and back it up with a number." },
  { label: "Format & length", points: 15, note: "A sensible word count, real bullet points, no “responsible for”." },
  { label: "Contact info", points: 10, note: "Email, phone, LinkedIn and GitHub, where a recruiter expects them." },
];
