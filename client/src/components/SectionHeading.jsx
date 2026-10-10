export default function SectionHeading({ number, title, note }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="font-mono text-xs text-accent">{number}</span>
      <h2 className="font-serif text-3xl leading-none sm:text-4xl">{title}</h2>
      {note && <span className="text-sm text-ink-3">{note}</span>}
    </div>
  );
}
