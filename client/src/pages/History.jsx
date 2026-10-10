import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Trash2 } from "lucide-react";
import api, { getErrorMessage } from "../api/client";
import { PageSpinner } from "../components/Spinner";
import { formatDate, scoreTone } from "../utils/score";

export default function History() {
  const [analyses, setAnalyses] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/analyses")
      .then(({ data }) => setAnalyses(data.analyses))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await api.delete(`/analyses/${id}`);
      setAnalyses((list) => list.filter((a) => a._id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (!analyses && !error) return <PageSpinner />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your reports</p>
          <h1 className="mt-3 font-serif text-5xl leading-none sm:text-6xl">History</h1>
        </div>
        <Link to="/analyze" className="btn-primary">
          New report
        </Link>
      </div>

      {error && <p className="mt-8 border-l-2 border-low bg-low/10 px-4 py-3 text-sm">{error}</p>}

      {analyses?.length === 0 && (
        <div className="mt-12 border-t border-line pt-12">
          <p className="font-serif text-3xl">Nothing here yet.</p>
          <p className="mt-2 text-ink-2">Every resume you check is saved here, so you can see your score improve.</p>
          <Link to="/analyze" className="btn-primary mt-8">
            Check my first resume <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      )}

      {analyses?.length > 0 && (
        <ul className="mt-12 border-t border-line">
          {analyses.map((a) => {
            const tone = scoreTone(a.score);
            return (
              <li key={a._id} className="group flex items-center gap-3 border-b border-line">
                <Link to={`/analysis/${a._id}`} className="flex min-w-0 flex-1 items-center gap-5 py-5">
                  <span className={`w-14 shrink-0 font-serif text-5xl leading-none ${tone.text}`}>{a.score}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium group-hover:underline group-hover:decoration-accent group-hover:underline-offset-4">
                      {a.targetLabel}
                    </span>
                    <span className="mt-1 block truncate font-mono text-xs text-ink-3">
                      {a.fileName} · {formatDate(a.createdAt)}
                    </span>
                  </span>
                </Link>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="rounded-md p-2 text-ink-3 transition hover:bg-muted hover:text-low"
                  aria-label={`Delete report for ${a.fileName}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
