import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/auth";
import MarkedUpResume from "../components/MarkedUpResume";
import { Squiggle } from "../components/Marks";
import { SCORE_WEIGHTS } from "../utils/score";

const FEATURES = [
  {
    title: "A score you can trace",
    text: "Out of 100, split into five parts, so you can see exactly where each point went and what it would take to win it back.",
  },
  {
    title: "The keywords you're missing",
    text: "Pick a role or paste a real job posting. You'll see which skills it asks for that your resume never mentions.",
  },
  {
    title: "Notes from a reviewer",
    text: "What's working, what to fix first, and rewrites of your weakest bullet points, with blanks for your real numbers.",
  },
];

export default function Landing() {
  const { user } = useAuth();
  const { hash } = useLocation();
  const cta = user ? "/analyze" : "/register";

  // Support links like /#scoring from other pages
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-16 px-4 pt-14 pb-20 sm:px-6 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:pt-24">
        <div>
          <p className="eyebrow">ATS resume checker</p>
          <h1 className="mt-5 font-serif text-[2.9rem] leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Read your resume the way{" "}
            <span className="relative inline-block italic">
              the software
              <Squiggle className="absolute -bottom-1 left-0 h-3 w-full text-accent" />
            </span>{" "}
            does.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2">
            Most applications pass through an applicant tracking system before a person reads them. Upload yours and
            see the score it would get, the keywords it's missing, and what to change.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link to={cta} className="btn-primary px-6 py-3 text-base">
              Check my resume <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a href="#scoring" className="link text-sm text-ink-2">
              How the score works
            </a>
          </div>
          <p className="mt-10 font-mono text-xs text-ink-3">PDF or DOCX · 9 job roles or any job posting · free</p>
        </div>

        <MarkedUpResume />
      </section>

      <section className="border-t border-line">
        <ol className="mx-auto grid max-w-6xl divide-y divide-line px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0">
          {FEATURES.map((f, i) => (
            <li key={f.title} className="py-12 md:px-8 md:first:pl-0 md:last:pr-0">
              <span className="font-mono text-xs text-accent">0{i + 1}</span>
              <h2 className="mt-3 font-serif text-3xl leading-tight">{f.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-2">{f.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="scoring" className="scroll-mt-20 border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
          <div>
            <p className="eyebrow">The score</p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.08] sm:text-5xl">No black box. Every point is accounted for.</h2>
            <p className="mt-6 leading-relaxed text-ink-2">
              The number comes from fixed rules, not from asking an AI to guess, so the same resume always gets the same
              score. AI only writes the reviewer's notes that come with it.
            </p>
          </div>

          <div>
            <div className="flex gap-1" aria-hidden="true">
              {SCORE_WEIGHTS.map((w, i) => (
                <div
                  key={w.label}
                  className={`h-2.5 rounded-[2px] ${i === 0 ? "bg-accent" : "bg-ink"}`}
                  style={{ flexGrow: w.points, flexBasis: 0, opacity: i === 0 ? 1 : 0.85 - i * 0.14 }}
                />
              ))}
            </div>
            <ul className="mt-8">
              {SCORE_WEIGHTS.map((w) => (
                <li key={w.label} className="grid grid-cols-[4.5rem_1fr] items-baseline gap-4 border-t border-line py-5">
                  <span className="font-serif text-5xl leading-none">{w.points}</span>
                  <div>
                    <p className="font-medium">{w.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-2">{w.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-8 rounded-md bg-ink px-7 py-12 text-paper sm:px-12 md:flex-row md:items-end">
          <h2 className="max-w-xl font-serif text-4xl leading-[1.08] sm:text-5xl">
            Find out what the software thinks <span className="italic">before</span> you hit apply.
          </h2>
          <Link
            to={cta}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-paper px-6 py-3 font-medium text-ink transition hover:opacity-90"
          >
            Check my resume <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
