import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { DirectusClient } from "../api/directus";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const directus = DirectusClient.getInstance();
      await directus.sdk
        .refresh()
        .then((response) => {
          setAuthorized(true);
        })
        .catch(() => {
          setAuthorized(false);
        });
    };

    checkAuth();
  }, []);

  // Tant que le token est en cours de vérification
  if (authorized === null) {
    return <div>Checking auth...</div>;
  }

  // Redirection vers la page de login si pas autorisé
  if (!authorized) {
    return <Navigate to="/" replace />;
  }

  return children;
}
