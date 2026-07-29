import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm animate-fade-in rounded-2xl border border-ink-700 bg-ink-900 p-5 shadow-panel"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-mist-50">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1 text-mist-300 hover:bg-ink-800 hover:text-mist-50 focus:outline-none focus:ring-2 focus:ring-signal-light"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
