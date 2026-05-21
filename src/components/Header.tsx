import { Leaf, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-10 w-full border-b border-stone-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          <span className="text-base font-semibold tracking-tight">Plants</span>
        </div>
        <div className="flex items-center gap-3">
          {user?.email && (
            <span className="hidden text-sm text-stone-600 sm:inline">
              {user.email}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-md border border-stone-200 px-2.5 py-1.5 text-sm text-stone-700 transition hover:bg-stone-100"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
