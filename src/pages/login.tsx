import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { DirectusClient } from "../api/directus";

interface LoginLocationState {
  error?: string;
}

const IS_DEV = import.meta.env.VITE_MODE === "dev";
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const SHOW_ADMIN_LOGIN = IS_DEV && !!ADMIN_EMAIL && !!ADMIN_PASSWORD;

export default function Login() {
  const { status, login } = useAuth();
  const [email, setEmail] = useState(IS_DEV ? (ADMIN_EMAIL ?? "") : "");
  const [password, setPassword] = useState(
    IS_DEV ? (ADMIN_PASSWORD ?? "") : "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const incomingError = (location.state as LoginLocationState | null)?.error;

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/home", { replace: true });
    }
  }, [status, navigate]);

  useEffect(() => {
    if (!incomingError) return;
    setError(incomingError);
    navigate(location.pathname, { replace: true, state: {} });
  }, [incomingError, navigate, location.pathname]);

  const attemptLogin = async (creds: { email: string; password: string }) => {
    setError(null);
    setSubmitting(true);
    try {
      await login(creds.email, creds.password);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    attemptLogin({ email, password });
  };

  const handleLoginAsAdmin = () => {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;
    attemptLogin({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  };

  const handleGoogleLogin = () => {
    const redirect = `${window.location.origin}/auth/callback`;
    const url = DirectusClient.getInstance().ssoLoginUrl("google", redirect);
    window.location.assign(url);
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <RefreshCw
          className="h-5 w-5 animate-spin text-stone-400"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-semibold text-stone-800">
          Huc House Login
        </h1>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={submitting}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 48 48"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.1 35 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C39.9 36.3 44 30.7 44 24c0-1.3-.1-2.4-.4-3.5z"
            />
          </svg>
          Sign in with Google
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-stone-200" />
          <span className="text-xs uppercase tracking-wide text-stone-400">
            or
          </span>
          <div className="h-px flex-1 bg-stone-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
              className="w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-emerald-200 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
              className="w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-emerald-200 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>

          {SHOW_ADMIN_LOGIN && (
            <button
              type="button"
              onClick={handleLoginAsAdmin}
              disabled={submitting}
              className="w-full rounded-md border border-stone-300 bg-white px-4 py-2 font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
            >
              {submitting ? "Logging in..." : "Login as Admin (dev)"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
