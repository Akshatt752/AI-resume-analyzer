import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api, { getErrorMessage } from "../api/client";
import UploadBox from "../components/UploadBox";
import Spinner from "../components/Spinner";

const PROGRESS_STEPS = ["Reading your resume…", "Matching keywords…", "Scoring sections…", "Writing notes…"];

function Step({ number, title, children }) {
  return (
    <fieldset>
      <legend className="mb-4 flex items-baseline gap-3">
        <span className="font-mono text-xs text-accent">{number}</span>
        <span className="font-medium">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}

export default function Analyze() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("role");
  const [roleId, setRoleId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    api
      .get("/roles")
      .then(({ data }) => {
        setRoles(data.roles);
        setRoleId((current) => current || data.roles[0]?.id || "");
      })
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  // Rotate the progress message while we wait, so the user knows work is happening
  useEffect(() => {
    if (!submitting) return;
    const id = setInterval(() => setStep((s) => Math.min(s + 1, PROGRESS_STEPS.length - 1)), 900);
    return () => clearInterval(id);
  }, [submitting]);

  const canSubmit = file && (mode === "role" ? roleId : jobDescription.trim().length >= 30);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const body = new FormData();
    body.append("resume", file);
    if (mode === "role") body.append("roleId", roleId);
    else body.append("jobDescription", jobDescription);

    setError("");
    setStep(0);
    setSubmitting(true);
    try {
      const { data } = await api.post("/analyze", body);
      navigate(`/analysis/${data.analysis._id}`, { state: { analysis: data.analysis } });
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  const tabClass = (active) =>
    `-mb-px border-b-2 pb-3 text-sm transition ${
      active ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink-2"
    }`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="eyebrow">New report</p>
      <h1 className="mt-3 font-serif text-5xl leading-none sm:text-6xl">Check your resume</h1>
      <p className="mt-4 text-ink-2">Upload your resume and tell us what you're applying for.</p>

      <form onSubmit={handleSubmit} className="mt-12 space-y-12">
        <Step number="01" title="Your resume">
          <UploadBox file={file} onChange={setFile} onError={setError} />
        </Step>

        <Step number="02" title="What you're applying for">
          <div className="mb-6 flex gap-6 border-b border-line" role="tablist">
            <button type="button" role="tab" aria-selected={mode === "role"} className={tabClass(mode === "role")} onClick={() => setMode("role")}>
              Pick a role
            </button>
            <button type="button" role="tab" aria-selected={mode === "jd"} className={tabClass(mode === "jd")} onClick={() => setMode("jd")}>
              Paste a job posting
            </button>
          </div>

          {mode === "role" ? (
            <div>
              <label htmlFor="role" className="label">
                Job role
              </label>
              <select id="role" className="input" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label htmlFor="jd" className="label">
                Job description
              </label>
              <textarea
                id="jd"
                rows={8}
                className="input resize-y leading-relaxed"
                placeholder="Paste the full posting. We'll pick out the skills it asks for."
                value={jobDescription}
                maxLength={15000}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <p className="mt-1.5 text-right font-mono text-[11px] text-ink-3">{jobDescription.length} / 15000</p>
            </div>
          )}
        </Step>

        {error && (
          <p className="border-l-2 border-low bg-low/10 px-4 py-3 text-sm text-ink" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full py-3.5 text-base" disabled={!canSubmit || submitting}>
          {submitting ? (
            <Spinner className="size-4" label={PROGRESS_STEPS[step]} />
          ) : (
            <>
              Get my report <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
