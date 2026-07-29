import { AlertTriangle, RotateCw } from "lucide-react";

export default function ErrorMessage({ message, onRetry, className = "" }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={`flex items-start gap-2 rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-200 ${className}`}
    >
      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-400" />
      <div className="flex-1">
        <p>{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-red-300 underline decoration-red-700 underline-offset-2 hover:text-red-100"
          >
            <RotateCw size={12} />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
