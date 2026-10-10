import SectionHeading from "./SectionHeading";

// Shows "[X%]"-style blanks from the AI as dashed fill-in-the-blank marks
function WithBlanks({ text }) {
  return text.split(/(\[[^\]]+\])/g).map((part, i) =>
    /^\[.+\]$/.test(part) ? (
      <span key={i} className="mx-0.5 border-b border-dashed border-accent px-0.5 font-mono text-[0.85em] text-accent">
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    )
  );
}

export default function AIFeedback({ feedback, status }) {
  if (status !== "ok" || !feedback) {
    return (
      <section className="py-12">
        <SectionHeading number="01" title="Reviewer's notes" />
        <p className="mt-6 max-w-2xl border-l-2 border-mid pl-5 leading-relaxed text-ink-2">
          {status === "failed"
            ? "The notes couldn't be written this time; the free AI service was probably busy. Your score and breakdown below are complete. Run the check again in a minute to get notes."
            : "Reviewer's notes are switched off on this server. Your score and breakdown below are complete."}
        </p>
      </section>
    );
  }

  return (
    <section className="py-12">
      <SectionHeading number="01" title="Reviewer's notes" note="written by AI from your results" />

      <blockquote className="mt-8 max-w-3xl border-l-2 border-accent pl-6 font-serif text-2xl leading-snug sm:text-[1.7rem]">
        {feedback.summary}
      </blockquote>

      <div className="mt-12 grid gap-12 md:grid-cols-2">
        <div>
          <h3 className="eyebrow">What's working</h3>
          <ul className="mt-3 divide-y divide-line border-t border-line">
            {feedback.strengths.map((s) => (
              <li key={s} className="flex gap-3 py-3.5 text-[15px] leading-relaxed text-ink-2">
                <span className="font-mono text-good">+</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow">Fix these first</h3>
          <ol className="mt-3 divide-y divide-line border-t border-line">
            {feedback.improvements.map((s, i) => (
              <li key={s} className="flex gap-3 py-3.5 text-[15px] leading-relaxed text-ink-2">
                <span className="font-mono text-xs leading-6 text-accent">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {feedback.rewrittenBullets.length > 0 && (
        <div className="mt-14">
          <h3 className="eyebrow">Line edits</h3>
          <p className="mt-2 text-sm text-ink-3">Fill the dashed blanks with your real numbers before using these.</p>
          <ul className="mt-5 space-y-4">
            {feedback.rewrittenBullets.map((b) => (
              <li key={b.original} className="sheet p-5 sm:p-6">
                <p className="text-sm text-ink-3 line-through decoration-accent/70 decoration-[1.5px]">{b.original}</p>
                <p className="mt-3 flex gap-2 leading-relaxed">
                  <span className="font-hand text-xl leading-6 text-accent" aria-hidden="true">
                    →
                  </span>
                  <span>
                    <WithBlanks text={b.improved} />
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
