import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

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

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/home", { replace: true });
    }
  }, [status, navigate]);

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

          {error && <p className="text-sm text-red-600">{error}</p>}

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
