import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { httpError } from "../middleware/errorHandler.js";

// Detect the real file type from its first bytes instead of trusting the file name
export async function extractText(buffer) {
  const signature = buffer.subarray(0, 4).toString("latin1");
  let raw;

  if (signature.startsWith("%PDF")) {
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      raw = (await parser.getText()).text;
    } catch {
      throw httpError(422, "This PDF couldn't be read. It may be corrupted or password-protected.");
    } finally {
      await parser.destroy();
    }
  } else if (signature.startsWith("PK")) {
    try {
      raw = (await mammoth.extractRawText({ buffer })).value;
    } catch {
      throw httpError(422, "This DOCX file couldn't be read.");
    }
  } else {
    throw httpError(400, "Unsupported file. Please upload a PDF or DOCX resume.");
  }

  return cleanText(raw);
}

function cleanText(text) {
  return text
    .replace(/^-- \d+ of \d+ --$/gm, "") // page markers added by pdf-parse
    .replace(/[ \t]+/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Heading patterns are matched against short lines only, so a sentence that merely
// mentions "experience" isn't mistaken for a section heading.
const SECTION_HEADINGS = {
  summary: /^(professional |career )?(summary|objective|profile|about( me)?)$/i,
  education: /^(education|academics?|academic (background|qualifications?)|qualifications?)$/i,
  experience: /^(work |professional |relevant )?(experience|employment( history)?|internships?|work history)$/i,
  projects: /^(academic |personal |key |technical )?projects?$/i,
  skills: /^(technical |key |core )?(skills|technologies|tech stack|competencies)( & tools| and tools)?$/i,
  certifications: /^(certifications?|certificates?|achievements?|awards|honou?rs|accomplishments)( (&|and) (achievements?|awards))?$/i,
};

export function findSections(text) {
  const found = new Set();
  for (const line of text.split("\n")) {
    const heading = line.replace(/[:|•\-–_]+$/g, "").trim();
    if (heading.length === 0 || heading.length > 40) continue;
    for (const [section, pattern] of Object.entries(SECTION_HEADINGS)) {
      if (pattern.test(heading)) found.add(section);
    }
  }
  return found;
}

export function findContactInfo(text) {
  // A phone number is any digit run with separators that has 10–13 digits in total,
  // which skips years and date ranges like "2022 – 2026"
  const phoneCandidates = text.match(/\+?\(?\+?\d[\d\s().-]{8,18}\d/g) || [];
  const hasPhone = phoneCandidates.some((c) => {
    const digits = c.replace(/\D/g, "").length;
    return digits >= 10 && digits <= 13;
  });

  return {
    email: /[\w.+-]+@[\w-]+\.[\w.-]+/.test(text),
    phone: hasPhone,
    linkedin: /linkedin\.com\/in\//i.test(text),
    github: /github\.com\/[\w-]+/i.test(text),
  };
}

const BULLET_START = /^[•●▪◦‣∙·*\-–]\s*/;
const LABELLED_LIST = /^[^:]{1,35}:/; // e.g. "Frontend: React, Tailwind" in a skills section

// Bullet points are where recruiters look for impact, so we score them separately
export function findBullets(text) {
  return text
    .split("\n")
    .filter((line) => BULLET_START.test(line))
    .map((line) => line.replace(BULLET_START, "").trim())
    .filter((line) => !LABELLED_LIST.test(line) && line.split(/\s+/).length >= 4);
}
