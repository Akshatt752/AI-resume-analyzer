import { SKILLS } from "../data/skills.js";
import { ROLES } from "../data/roles.js";
import { httpError } from "../middleware/errorHandler.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

// One regex per skill, built once. The lookarounds act as word boundaries that also
// work for spellings containing symbols like "c++", "node.js" or "ci/cd".
const SKILL_PATTERNS = Object.entries(SKILLS).map(([name, variants]) => ({
  name,
  regex: new RegExp(`(?<![a-z0-9])(?:${variants.map(escapeRegex).join("|")})(?![a-z0-9+#])`, "i"),
}));

for (const role of ROLES) {
  const unknown = role.keywords.filter((k) => !SKILLS[k]);
  if (unknown.length) throw new Error(`Role "${role.id}" uses unknown skills: ${unknown.join(", ")}`);
}

// Returns the canonical names of every known skill mentioned in the text
export function findSkills(text) {
  return new Set(SKILL_PATTERNS.filter(({ regex }) => regex.test(text)).map(({ name }) => name));
}

export function listRoles() {
  return ROLES.map(({ id, label }) => ({ id, label }));
}

// Decides which keywords the resume is scored against.
// A pasted job description wins when we can recognise enough skills in it.
export function resolveTarget({ roleId, jobDescription }) {
  const role = ROLES.find((r) => r.id === roleId);
  const jd = (jobDescription || "").trim();

  if (jd) {
    const jdSkills = [...findSkills(jd)];
    if (jdSkills.length >= 3) {
      return { label: role ? `${role.label} (custom job description)` : "Custom job description", keywords: jdSkills };
    }
    if (!role) {
      throw httpError(400, "Couldn't find enough technical skills in that job description. Pick a job role instead.");
    }
  }

  if (!role) throw httpError(400, "Please choose a job role or paste a job description");
  return { label: role.label, keywords: role.keywords };
}
