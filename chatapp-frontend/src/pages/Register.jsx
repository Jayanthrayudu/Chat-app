import { Navigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import RegisterForm from "../components/auth/RegisterForm";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal text-white">
            <UserPlus size={22} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-mist-50">Create your account</h1>
          <p className="text-sm text-mist-300">Join Relay to start chatting</p>
        </div>

        <div className="rounded-2xl border border-ink-800 bg-ink-900 p-6 shadow-panel">
          <RegisterForm />
        </div>

        <p className="mt-5 text-center text-sm text-mist-300">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-signal-light hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
