import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../context/auth";
import Spinner from "../components/Spinner";

// One form for both /login and /register
export default function Auth({ mode }) {
  const isRegister = mode === "register";
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/analyze";

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={redirectTo} replace />;

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isRegister) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-16 sm:py-24">
      <p className="eyebrow">{isRegister ? "New account" : "Welcome back"}</p>
      <h1 className="mt-3 font-serif text-5xl leading-none">{isRegister ? "Create an account" : "Log in"}</h1>
      <p className="mt-4 text-ink-2">
        {isRegister ? "Your reports are saved so you can track how your resume improves." : "Pick up where you left off."}
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        {error && (
          <p className="border-l-2 border-low bg-low/10 px-4 py-3 text-sm text-ink" role="alert">
            {error}
          </p>
        )}

        {isRegister && (
          <div>
            <label htmlFor="name" className="label">
              Name
            </label>
            <input id="name" className="input" value={form.name} onChange={update("name")} required autoComplete="name" />
          </div>
        )}
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input id="email" type="email" className="input" value={form.email} onChange={update("email")} required autoComplete="email" />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input"
            value={form.password}
            onChange={update("password")}
            required
            minLength={6}
            autoComplete={isRegister ? "new-password" : "current-password"}
          />
          {isRegister && <p className="mt-1.5 font-mono text-[11px] text-ink-3">At least 6 characters</p>}
        </div>

        <button type="submit" className="btn-primary w-full py-3" disabled={submitting}>
          {submitting ? <Spinner className="size-4" /> : isRegister ? "Create account" : "Log in"}
        </button>
      </form>

      <p className="mt-8 border-t border-line pt-6 text-sm text-ink-2">
        {isRegister ? "Already have an account? " : "New here? "}
        <Link to={isRegister ? "/login" : "/register"} state={location.state} className="link font-medium text-ink">
          {isRegister ? "Log in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
