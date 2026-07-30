import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ErrorMessage from "../common/ErrorMessage";

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await register(username.trim(), password, email.trim());
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        setError("That username is already taken.");
      } else if (err?.request && !err?.response) {
        setError("Can't reach the server. Is the backend running on port 8080?");
      } else {
        setError(
          "Password must contain 6 letters"
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="reg-username" className="mb-1.5 block text-sm font-medium text-mist-200">
          Username
        </label>
        <input
          id="reg-username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border border-ink-700 bg-ink-800 px-3.5 py-2.5 text-mist-50 placeholder:text-mist-300/40 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/40"
          placeholder="username"
        />
      </div>

      <div>
        <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-mist-200">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-ink-700 bg-ink-800 px-3.5 py-2.5 text-mist-50 placeholder:text-mist-300/40 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/40"
          placeholder="username@example.com"
        />
      </div>

      <div>
        <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-mist-200">
          Password
        </label>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-ink-700 bg-ink-800 px-3.5 py-2.5 text-mist-50 placeholder:text-mist-300/40 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/40"
          placeholder="••••••••"
        />
      </div>

      <ErrorMessage message={error} />
      {success && (
        <p className="rounded-lg border border-emerald-900/50 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-200">
          Account created. Redirecting to sign in...
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-signal px-4 py-2.5 font-medium text-white transition hover:bg-signal-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        <UserPlus size={17} />
        {submitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
