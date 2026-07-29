import { Navigate, Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal text-white">
            <MessageCircle size={22} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-mist-50">Welcome back</h1>
          <p className="text-sm text-mist-300">Sign in to continue to Relay</p>
        </div>

        <div className="rounded-2xl border border-ink-800 bg-ink-900 p-6 shadow-panel">
          <LoginForm />
        </div>

        <p className="mt-5 text-center text-sm text-mist-300">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-signal-light hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
