import { MessageCircle, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ConnectionStatus from "../chat/ConnectionStatus";
import { useChat } from "../../hooks/useChat";

export default function Header() {
  const { user, logout } = useAuth();
  const { connectionStatus } = useChat();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-ink-800 bg-ink-900 px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal text-white">
          <MessageCircle size={17} />
        </div>
        <span className="font-display text-base font-semibold tracking-tight text-mist-50">Relay</span>
        <ConnectionStatus status={connectionStatus} className="ml-2 hidden sm:flex" />
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/profile"
          className="hidden items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-mist-200 hover:bg-ink-800 sm:flex"
        >
          <Settings size={16} />
          <span>{user?.username || "Profile"}</span>
        </Link>
        <button
          type="button"
          onClick={logout}
          aria-label="Log out"
          className="flex items-center gap-1.5 rounded-lg border border-ink-700 px-2.5 py-1.5 text-sm text-mist-200 hover:bg-ink-800 hover:text-mist-50 focus:outline-none focus:ring-2 focus:ring-signal-light"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
}
