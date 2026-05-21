import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <RefreshCw
          className="h-5 w-5 animate-spin text-stone-400"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/" replace />;
  }

  return children;
}
