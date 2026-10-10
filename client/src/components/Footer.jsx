import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "../context/auth";
import { ThemeSwitch } from "./ThemeToggle";
import Wordmark from "./Wordmark";

const REPO_URL = "https://github.com/Akshatt752/AI-resume-analyzer";
const YEAR = new Date().getFullYear();
const PROFILE_URL = "https://github.com/Akshatt752";

function Column({ title, children }) {
  return (
    <div>
      <h3 className="eyebrow">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function ExternalLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-ink-2 transition hover:text-ink">
      {children}
      <ArrowUpRight className="size-3.5" aria-hidden="true" />
    </a>
  );
}

export default function Footer() {
  const { user } = useAuth();
  const internal = "text-ink-2 transition hover:text-ink";

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-14 sm:grid-cols-3 sm:px-6 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Wordmark className="text-3xl" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-2">
            An ATS checker that shows its working: a score you can trace line by line, the keywords you're missing, and
            notes on what to fix first.
          </p>
        </div>

        <Column title="Product">
          <li>
            <Link to={user ? "/analyze" : "/register"} className={internal}>
              Check a resume
            </Link>
          </li>
          <li>
            <Link to="/history" className={internal}>
              Your reports
            </Link>
          </li>
          <li>
            <Link to="/#scoring" className={internal}>
              How scoring works
            </Link>
          </li>
        </Column>

        <Column title="Project">
          <li>
            <ExternalLink href={REPO_URL}>Source code</ExternalLink>
          </li>
          <li className="text-ink-3">React · Express · MongoDB</li>
          <li className="text-ink-3">AI notes via Groq</li>
        </Column>

        <Column title="Made by">
          <li className="text-ink">Akshat Verma</li>
          <li>
            <ExternalLink href={PROFILE_URL}>GitHub</ExternalLink>
          </li>
        </Column>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs leading-relaxed text-ink-3">
            © {YEAR} Akshat Verma. Files are read in memory and never stored; only the extracted
            text is saved to your history.
          </p>
          <ThemeSwitch />
        </div>
      </div>
    </footer>
  );
}
