import "./App.css";
import { Home } from "./pages/home.tsx";
import Login from "./pages/login.tsx";
import AuthCallback from "./pages/auth-callback.tsx";
import { PlantDetail } from "./pages/plant-detail.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./auth/AuthProvider.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/plant/:id",
    element: (
      <ProtectedRoute>
        <PlantDetail />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
