import { useChat } from "../../hooks/useChat";
import { X, MessageCircle } from "lucide-react";

export default function ToastContainer() {
  const { toasts, dismissToast } = useChat();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start gap-2 rounded-xl border border-ink-700 bg-ink-800 px-4 py-3 shadow-lg max-w-xs"
        >
          <MessageCircle size={16} className="mt-0.5 shrink-0 text-signal" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-mist-50">{toast.senderUsername}</p>
            <p className="truncate text-xs text-mist-300">{toast.content}</p>
          </div>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 text-mist-400 hover:text-mist-50"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}