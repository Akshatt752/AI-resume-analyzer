// Hand-drawn "red pen" marks. They stretch to fit whatever they wrap and use the
// current text colour, so <HandCircle className="text-accent" /> draws in red.

export function HandCircle({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 120"
      preserveAspectRatio="none"
      className={`pointer-events-none ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M152 16C118 3 52 6 22 33C-3 57 16 101 82 109C143 116 194 92 189 55C186 29 150 9 96 13"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function Squiggle({ className = "" }) {
  return (
    <svg
      viewBox="0 0 300 16"
      preserveAspectRatio="none"
      className={`pointer-events-none ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 11C58 5 108 3 158 7.5C204 11.5 252 12.5 297 4"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
