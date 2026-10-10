import { scoreTone } from "../utils/score";
import SectionHeading from "./SectionHeading";

export default function Breakdown({ categories }) {
  return (
    <section>
      <SectionHeading number="02" title="Breakdown" />
      <ul className="mt-6">
        {categories.map((c) => {
          const tone = scoreTone(c.score, c.max);
          return (
            <li key={c.key} className="border-t border-line py-5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium">{c.label}</span>
                <span className="font-mono text-sm">
                  <span className={tone.text}>{c.score}</span>
                  <span className="text-ink-3"> / {c.max}</span>
                </span>
              </div>
              <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${tone.bg}`} style={{ width: `${(c.score / c.max) * 100}%` }} />
              </div>
              {c.tips.length > 0 ? (
                <ul className="mt-3.5 space-y-2">
                  {c.tips.map((tip) => (
                    <li key={tip} className="flex gap-2.5 text-sm leading-relaxed text-ink-2">
                      <span className="font-hand text-lg leading-5 text-accent" aria-hidden="true">
                        →
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-good">Nothing to fix here.</p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
