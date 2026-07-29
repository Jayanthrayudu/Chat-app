import { Pencil, Trash2 } from "lucide-react";

export default function MessageActions({ onEdit, onDelete, className = "" }) {
  return (
    <div
      className={`flex items-center gap-0.5 rounded-lg border border-ink-700 bg-ink-800 p-0.5 shadow-panel ${className}`}
    >
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit message"
        className="rounded-md p-1.5 text-mist-300 hover:bg-ink-700 hover:text-mist-50"
      >
        <Pencil size={13} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete message"
        className="rounded-md p-1.5 text-mist-300 hover:bg-red-950 hover:text-red-300"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
