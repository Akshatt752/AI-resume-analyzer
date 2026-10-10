import { Link } from "react-router-dom";

export default function Wordmark({ className = "" }) {
  return (
    <Link to="/" className={`font-serif leading-none tracking-tight text-ink ${className}`}>
      Resume Analyzer<span className="text-accent">.</span>
    </Link>
  );
}
