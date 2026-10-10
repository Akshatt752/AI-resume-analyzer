import { useRef, useState } from "react";
import { FileText, Upload } from "lucide-react";

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = /\.(pdf|docx)$/i;

export default function UploadBox({ file, onChange, onError }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const pick = (picked) => {
    if (!picked) return;
    if (!ACCEPTED.test(picked.name)) return onError("Please choose a PDF or DOCX file.");
    if (picked.size > MAX_SIZE) return onError("File is too large (max 5 MB).");
    onError("");
    onChange(picked);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files[0]);
  };

  if (file) {
    return (
      <div className="sheet flex items-center gap-4 px-4 py-4">
        <FileText className="size-8 shrink-0 stroke-[1.25] text-ink-2" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{file.name}</p>
          <p className="font-mono text-xs text-ink-3">{(file.size / 1024).toFixed(0)} KB · ready</p>
        </div>
        <button type="button" onClick={() => onChange(null)} className="link text-sm text-ink-2">
          Replace
        </button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current.click()}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-6 py-12 text-center transition ${
        dragging ? "border-ink bg-muted" : "border-line-strong bg-card hover:border-ink-3"
      }`}
    >
      <Upload className="size-6 stroke-[1.5] text-ink-3" aria-hidden="true" />
      <p className="mt-4 text-ink">
        Drop your resume here, or <span className="underline decoration-accent decoration-2 underline-offset-4">browse</span>
      </p>
      <p className="mt-1.5 font-mono text-xs text-ink-3">PDF or DOCX · up to 5 MB</p>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
