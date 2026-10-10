import { findSkills } from "./keywords.js";
import { findSections, findContactInfo, findBullets } from "./parser.js";

const ACTION_VERBS = new Set([
  "achieve", "analyze", "architect", "automate", "boost", "build", "built", "collaborate", "complete", "configure",
  "construct", "contribute", "coordinate", "create", "cut", "debug", "decrease", "deliver", "deploy",
  "design", "develop", "drive", "drove", "engineer", "enhance", "establish", "execute", "expand",
  "generate", "grew", "grow", "identify", "implement", "improve", "increase", "initiate", "integrate",
  "introduce", "launch", "lead", "led", "maintain", "manage", "mentor", "migrate", "model", "modernize",
  "optimize", "orchestrate", "organize", "own", "pioneer", "plan", "present", "produce", "program",
  "publish", "redesign", "reduce", "refactor", "research", "resolve", "restructure", "revamp", "scale",
  "secure", "ship", "simplify", "solve", "spearhead", "streamline", "strengthen", "test", "train",
  "transform", "troubleshoot", "upgrade", "win", "won", "write", "wrote", "apply", "craft",
]);

const WEAK_PHRASES = [
  "responsible for", "worked on", "helped with", "helped in", "duties included", "involved in",
  "tasked with", "assisted with", "assisted in", "participated in",
];

// "Developed", "developing", "develops" and "optimized" all reduce to a verb in the list
function leadingVerb(bullet) {
  const word = bullet.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, "");
  const forms = [
    word,
    word.replace(/ied$/, "y"),
    word.replace(/ed$/, ""),
    word.replace(/d$/, ""),
    word.replace(/ing$/, ""),
    word.replace(/ing$/, "e"),
    word.replace(/es$/, ""),
    word.replace(/s$/, ""),
  ];
  return forms.some((f) => ACTION_VERBS.has(f)) ? word : null;
}

// A digit not glued to a letter, so "40%", "3x" and "10k users" count but "ES6" and "HTML5" don't
const hasNumber = (s) => /(?<![a-z])\d/i.test(s);

function scoreKeywords(text, targetKeywords) {
  const found = findSkills(text);
  const matched = targetKeywords.filter((k) => found.has(k));
  const missing = targetKeywords.filter((k) => !found.has(k));
  const ratio = matched.length / targetKeywords.length;

  // Nobody matches 100% of a job's keywords, so 80% coverage already earns full marks
  const score = Math.round(40 * Math.min(1, ratio / 0.8));
  const tips = [];
  if (missing.length) {
    tips.push(`Missing keywords: ${missing.slice(0, 8).join(", ")}. Add the ones you genuinely know to your skills or project bullets.`);
  }
  if (ratio < 0.5) tips.push("Mirror the exact wording from the job posting; ATS software looks for literal matches.");

  return {
    category: { key: "keywords", label: "Keyword match", score, max: 40, tips },
    matched,
    missing,
  };
}

function scoreSections(sections) {
  const checks = [
    { ok: sections.has("education"), points: 5, tip: "Add an Education section with your degree and dates." },
    { ok: sections.has("skills"), points: 5, tip: "Add a dedicated Skills section; ATS systems scan it first." },
    {
      ok: sections.has("experience") || sections.has("projects"),
      points: 6,
      tip: "Add an Experience or Projects section that shows what you built.",
    },
    { ok: sections.has("summary"), points: 2, tip: "Add a 2–3 line Summary at the top tailored to the role." },
    {
      ok: sections.has("certifications"),
      points: 2,
      tip: "Add Certifications or Achievements to stand out.",
    },
  ];
  return categoryFromChecks("sections", "Resume sections", 20, checks);
}

function scoreContact(contact) {
  const checks = [
    { ok: contact.email, points: 3, tip: "Add a professional email address." },
    { ok: contact.phone, points: 3, tip: "Add a phone number with country code." },
    { ok: contact.linkedin, points: 2, tip: "Add your LinkedIn profile URL (linkedin.com/in/...)." },
    { ok: contact.github, points: 2, tip: "Add your GitHub or portfolio link." },
  ];
  return categoryFromChecks("contact", "Contact info", 10, checks);
}

function scoreImpact(bullets) {
  if (bullets.length === 0) {
    return {
      key: "impact",
      label: "Impact & action verbs",
      score: 0,
      max: 15,
      tips: ["Describe your work as bullet points that start with action verbs (Built, Designed, Reduced...)."],
    };
  }

  const verbs = bullets.map(leadingVerb);
  const actionRatio = verbs.filter(Boolean).length / bullets.length;
  const numberRatio = bullets.filter(hasNumber).length / bullets.length;
  const presentTense = verbs.filter((v) => v?.endsWith("ing")).length;

  const score = Math.round(7 * actionRatio + 8 * Math.min(1, numberRatio / 0.5));
  const tips = [];
  if (actionRatio < 0.8) tips.push("Start every bullet with a strong action verb (Built, Led, Optimized, Automated).");
  if (numberRatio < 0.5) {
    tips.push("Quantify your impact: numbers like users served, % faster, or time saved make bullets far stronger.");
  }
  if (presentTense > bullets.length / 2) {
    tips.push('Use past tense for finished work ("Developed" rather than "Developing").');
  }

  return { key: "impact", label: "Impact & action verbs", score, max: 15, tips };
}

function scoreFormat(text, bullets) {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const lower = text.toLowerCase();
  const pronouns = (lower.match(/(?<![a-z])(i|me|my|myself)(?![a-z])/g) || []).length;
  const weakPhrases = WEAK_PHRASES.filter((p) => lower.includes(p));

  let lengthPoints = 2;
  if (wordCount >= 350 && wordCount <= 800) lengthPoints = 8;
  else if (wordCount >= 250 && wordCount <= 1000) lengthPoints = 5;

  const tips = [];
  if (wordCount < 350) tips.push(`Only ${wordCount} words: add more detail to your projects and experience.`);
  if (wordCount > 800) tips.push(`${wordCount} words is long: trim to the most relevant content (aim for 1 page).`);
  if (bullets.length < 4) tips.push("Use bullet points so recruiters and ATS can scan your work quickly.");
  if (pronouns > 2) tips.push('Avoid first-person words like "I" and "my"; start bullets with verbs instead.');
  if (weakPhrases.length) tips.push(`Replace weak phrases: ${weakPhrases.map((p) => `"${p}"`).join(", ")}.`);

  const score =
    lengthPoints +
    (bullets.length >= 4 ? 3 : bullets.length > 0 ? 1 : 0) +
    (pronouns <= 2 ? 2 : 0) +
    (weakPhrases.length === 0 ? 2 : weakPhrases.length <= 2 ? 1 : 0);

  return { category: { key: "format", label: "Format & length", score, max: 15, tips }, wordCount };
}

function categoryFromChecks(key, label, max, checks) {
  return {
    key,
    label,
    max,
    score: checks.reduce((sum, c) => sum + (c.ok ? c.points : 0), 0),
    tips: checks.filter((c) => !c.ok).map((c) => c.tip),
  };
}

export function scoreResume(text, targetKeywords) {
  const sections = findSections(text);
  const bullets = findBullets(text);

  const keywords = scoreKeywords(text, targetKeywords);
  const format = scoreFormat(text, bullets);
  const breakdown = [
    keywords.category,
    scoreSections(sections),
    scoreContact(findContactInfo(text)),
    scoreImpact(bullets),
    format.category,
  ];

  return {
    score: breakdown.reduce((sum, c) => sum + c.score, 0),
    breakdown,
    matchedKeywords: keywords.matched,
    missingKeywords: keywords.missing,
    bullets,
    stats: { wordCount: format.wordCount, bulletCount: bullets.length, sectionsFound: [...sections] },
  };
}
