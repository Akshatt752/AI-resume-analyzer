import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/auth";
import ThemeToggle from "./ThemeToggle";
import Wordmark from "./Wordmark";

const linkClass = ({ isActive }) =>
  `px-2 py-1 text-sm transition ${
    isActive
      ? "text-ink underline decoration-accent decoration-2 underline-offset-[10px]"
      : "text-ink-2 hover:text-ink"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Wordmark className="text-[22px] sm:text-2xl" />

        <div className="flex items-center gap-1 sm:gap-3">
          {user ? (
            <>
              <NavLink to="/analyze" className={linkClass}>
                Analyze
              </NavLink>
              <NavLink to="/history" className={linkClass}>
                History
              </NavLink>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-ink-2 transition hover:bg-muted hover:text-ink"
                aria-label="Log out"
              >
                <LogOut className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link to="/login" className="px-2 py-1 text-sm text-ink-2 transition hover:text-ink">
                Log in
              </Link>
              <Link to="/register" className="btn-primary px-4 py-2">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
