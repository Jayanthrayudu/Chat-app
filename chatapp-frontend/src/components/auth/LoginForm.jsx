import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import ErrorMessage from "../common/ErrorMessage";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate("/chat", { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError("Incorrect username or password.");
      } else if (err?.request && !err?.response) {
        setError("Can't reach the server. Is the backend running on port 8080?");
      } else {
        setError("Something went wrong signing you in. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-mist-200">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border border-ink-700 bg-ink-800 px-3.5 py-2.5 text-mist-50 placeholder:text-mist-300/40 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/40"
          placeholder="username"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-mist-200">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-ink-700 bg-ink-800 px-3.5 py-2.5 pr-10 text-mist-50 placeholder:text-mist-300/40 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/40"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mist-300 hover:text-mist-50"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      <ErrorMessage message={error} />

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-signal px-4 py-2.5 font-medium text-white transition hover:bg-signal-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogIn size={17} />
        {submitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
