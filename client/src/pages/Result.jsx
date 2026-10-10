import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import api, { getErrorMessage } from "../api/client";
import AIFeedback from "../components/AIFeedback";
import Breakdown from "../components/Breakdown";
import Keywords from "../components/Keywords";
import SectionHeading from "../components/SectionHeading";
import { HandCircle } from "../components/Marks";
import { PageSpinner } from "../components/Spinner";
import { formatDate, scoreTone } from "../utils/score";

const SHORT_LABELS = { keywords: "Keywords", sections: "Sections", contact: "Contact", impact: "Impact", format: "Format" };

// Each category is a segment sized by its weight and filled by the points earned
function ScoreBar({ categories }) {
  return (
    <div className="mt-7">
      <div className="flex gap-1">
        {categories.map((c) => (
          <div
            key={c.key}
            className="h-2 overflow-hidden rounded-[2px] bg-muted"
            style={{ flexGrow: c.max, flexBasis: 0 }}
            title={`${c.label}: ${c.score}/${c.max}`}
          >
            <div className="h-full bg-ink" style={{ width: `${(c.score / c.max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-2 hidden gap-1 sm:flex">
        {categories.map((c) => (
          <span key={c.key} className="font-mono text-[10.5px] leading-snug text-ink-3" style={{ flexGrow: c.max, flexBasis: 0 }}>
            <span className="block">{SHORT_LABELS[c.key] ?? c.label}</span>
            {c.score}/{c.max}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Result() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Coming straight from the Analyze page we already have the data; otherwise fetch it
  const passed = location.state?.analysis;
  const [analysis, setAnalysis] = useState(passed?._id === id ? passed : null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (analysis?._id === id) return;
    api
      .get(`/analyses/${id}`)
      .then(({ data }) => setAnalysis(data.analysis))
      .catch((err) => setError(getErrorMessage(err)));
  }, [id, analysis]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await api.delete(`/analyses/${id}`);
      navigate("/history", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="font-serif text-3xl">{error}</p>
        <Link to="/history" className="btn-secondary mt-8">
          Back to your reports
        </Link>
      </div>
    );
  }
  if (!analysis) return <PageSpinner />;

  const tone = scoreTone(analysis.score);
  const { stats } = analysis;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="eyebrow min-w-0 truncate">
          Report · {formatDate(analysis.createdAt)} · {analysis.fileName}
        </p>
        <div className="flex gap-2">
          <Link to="/analyze" className="btn-secondary px-4 py-2">
            New report
          </Link>
          <button onClick={handleDelete} className="btn-secondary px-4 py-2 text-low">
            Delete
          </button>
        </div>
      </div>

      <header className="mt-10 grid gap-10 border-b border-line pb-12 md:grid-cols-[auto_1fr] md:items-center md:gap-14">
        <div className="flex items-end gap-1">
          <div className={`relative px-7 py-3 ${tone.text}`}>
            <HandCircle className="absolute inset-0 h-full w-full" />
            <span className="font-serif text-[7rem] leading-[0.9] tracking-tight sm:text-[8.5rem]">{analysis.score}</span>
          </div>
          <span className="mb-3 font-mono text-sm text-ink-3">/100</span>
        </div>
        <div className="min-w-0">
          <p className={`font-serif text-2xl italic ${tone.text}`}>{tone.label}</p>
          <h1 className="mt-1 font-serif text-4xl leading-[1.05] sm:text-5xl">{analysis.targetLabel}</h1>
          <p className="mt-4 font-mono text-xs text-ink-3">
            {stats.wordCount} words · {stats.bulletCount} bullets · {stats.sectionsFound.length} sections found
          </p>
          <ScoreBar categories={analysis.breakdown} />
        </div>
      </header>

      <AIFeedback feedback={analysis.aiFeedback} status={analysis.aiStatus} />

      <div className="grid gap-14 border-t border-line pt-12 lg:grid-cols-2 lg:gap-16">
        <Breakdown categories={analysis.breakdown} />
        <div className="space-y-14">
          <Keywords matched={analysis.matchedKeywords} missing={analysis.missingKeywords} />

          {analysis.resumeText && (
            <section>
              <SectionHeading number="04" title="What the ATS sees" />
              <details className="group mt-6 border-t border-line pt-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm text-ink-2 hover:text-ink">
                  The plain text pulled from your file. If it looks jumbled here, an ATS will struggle with it too.
                  <ChevronDown className="size-4 shrink-0 transition group-open:rotate-180" aria-hidden="true" />
                </summary>
                <pre className="mt-4 max-h-96 overflow-auto rounded-md bg-muted p-4 font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap text-ink-2">
                  {analysis.resumeText}
                </pre>
              </details>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
