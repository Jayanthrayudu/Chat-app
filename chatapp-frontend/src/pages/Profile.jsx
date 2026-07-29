import { Link } from "react-router-dom";
import { ArrowLeft, LogOut, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-ink-950 px-4 py-8">
      <div className="mx-auto max-w-md">
        <Link
          to="/chat"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-mist-300 hover:text-mist-50"
        >
          <ArrowLeft size={15} />
          Back to chat
        </Link>

        <div className="rounded-2xl border border-ink-800 bg-ink-900 p-6 shadow-panel">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-signal text-2xl font-semibold text-white">
              {user?.username?.[0]?.toUpperCase() || <User size={28} />}
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-mist-50">
                {user?.username || "Unknown user"}
              </h1>
              <p className="text-sm text-mist-300">Signed in</p>
            </div>
          </div>

          <div className="space-y-3 border-t border-ink-800 pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-mist-300">Username</span>
              <span className="font-medium text-mist-50">{user?.username || "—"}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-ink-700 px-4 py-2.5 text-sm font-medium text-mist-200 hover:bg-ink-800 hover:text-mist-50"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
