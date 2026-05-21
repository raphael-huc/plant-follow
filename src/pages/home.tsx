import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ChevronRight, Leaf, RefreshCw } from "lucide-react";
import { getPlants } from "../api/plants";
import type { Plant } from "../types/schema";
import { Header } from "../components/Header";

export function Home() {
  const [plants, setPlants] = useState<Plant[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPlants();
      setPlants(response ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unknown error while fetching data",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My plants</h1>
            <p className="mt-1 text-sm text-stone-500">
              {plants
                ? `${plants.length} ${plants.length === 1 ? "entry" : "entries"}`
                : "Loading your collection…"}
            </p>
          </div>
          <button
            type="button"
            onClick={fetchPlants}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <div className="flex-1">
              <p className="font-medium">Couldn't load plants</p>
              <p className="mt-0.5 text-red-600/90">{error}</p>
            </div>
            <button
              type="button"
              onClick={fetchPlants}
              className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading && !plants && (
          <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="h-4 w-4 animate-pulse rounded bg-stone-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200" />
              </li>
            ))}
          </ul>
        )}

        {!isLoading && plants && plants.length === 0 && !error && (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-stone-200 px-6 py-12 text-center">
            <Leaf className="h-8 w-8 text-stone-300" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-stone-700">
                No plants yet
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Your collection will appear here once you add some.
              </p>
            </div>
          </div>
        )}

        {plants && plants.length > 0 && (
          <ul className="divide-y divide-stone-200 overflow-hidden rounded-lg border border-stone-200 bg-white">
            {plants.map((plant) => (
              <li key={plant.id}>
                <Link
                  to={`/plant/${plant.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition hover:bg-stone-50"
                >
                  <Leaf
                    className="h-4 w-4 text-emerald-600"
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-sm text-stone-800">
                    {plant.name}
                  </span>
                  <ChevronRight
                    className="h-4 w-4 text-stone-400"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
