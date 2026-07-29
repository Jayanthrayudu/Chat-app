import { Link } from "react-router-dom";
import { MessageCircleOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ink-950 px-4 text-center">
      <MessageCircleOff size={40} className="text-mist-300" />
      <h1 className="font-display text-2xl font-semibold text-mist-50">Page not found</h1>
      <p className="max-w-xs text-sm text-mist-300">The page you're looking for doesn't exist.</p>
      <Link
        to="/chat"
        className="mt-2 rounded-lg bg-signal px-4 py-2 text-sm font-medium text-white hover:bg-signal-dark"
      >
        Back to chat
      </Link>
    </div>
  );
}
