import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const REASON_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS:
    "This Google account isn't authorized to sign in. Contact an administrator to set up your access.",
  INVALID_PROVIDER: "Invalid authentication provider.",
  INVALID_TOKEN: "Invalid or expired authentication token.",
  SERVICE_UNAVAILABLE: "Authentication service is unavailable.",
};

function messageForReason(reason: string | null): string {
  if (!reason) return "SSO sign-in failed.";
  return REASON_MESSAGES[reason] ?? `SSO sign-in failed (${reason}).`;
}

export default function AuthCallback() {
  const { refreshSession } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason");

  useEffect(() => {
    let cancelled = false;

    if (reason) {
      navigate("/", {
        replace: true,
        state: { error: messageForReason(reason) },
      });
      return;
    }

    (async () => {
      try {
        await refreshSession();
        if (cancelled) return;
        navigate("/home", { replace: true });
      } catch {
        if (cancelled) return;
        navigate("/", {
          replace: true,
          state: { error: messageForReason(null) },
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshSession, navigate, reason]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <RefreshCw
        className="h-5 w-5 animate-spin text-stone-400"
        aria-hidden="true"
      />
    </div>
  );
}
