import SectionHeading from "./SectionHeading";

export default function Keywords({ matched, missing }) {
  const total = matched.length + missing.length;

  return (
    <section>
      <SectionHeading number="03" title="Keywords" note={`${matched.length} of ${total} found`} />

      <div className="mt-6 border-t border-line pt-5">
        <h3 className="eyebrow">In your resume</h3>
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-2 leading-relaxed">
          {matched.length ? (
            matched.map((k) => (
              <mark key={k} className="marker">
                {k}
              </mark>
            ))
          ) : (
            <span className="text-sm text-ink-3">None of the target keywords were found.</span>
          )}
        </p>
      </div>

      {missing.length > 0 && (
        <div className="mt-6 border-t border-line pt-5">
          <h3 className="eyebrow">Missing</h3>
          <p className="mt-1.5 text-sm text-ink-3">Add the ones you've actually used, in your skills or project bullets.</p>
          <p className="mt-3 flex flex-wrap gap-2">
            {missing.map((k) => (
              <span key={k} className="rounded-[4px] border border-dashed border-line-strong px-2 py-0.5 text-sm text-ink-2">
                + {k}
              </span>
            ))}
          </p>
        </div>
      )}
    </section>
  );
}
