import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Header } from "../components/Header";
import { PlantInfoCard } from "../components/PlantInfoCard";
import { WateringHistory } from "../components/WateringHistory";
import { WaterNowButton } from "../components/WaterNowButton";
import { getPlant, getWateringRecords } from "../api/plants";
import type { Plant, WateringRecord } from "../types/schema";

export function PlantDetail() {
  const { id } = useParams<{ id: string }>();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [records, setRecords] = useState<WateringRecord[] | null>(null);
  const [loadingPlant, setLoadingPlant] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async (plantId: string) => {
    setLoadingRecords(true);
    try {
      const data = await getWateringRecords(plantId);
      setRecords(data);
    } finally {
      setLoadingRecords(false);
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoadingPlant(true);
    setError(null);
    (async () => {
      try {
        const [plantData] = await Promise.all([
          getPlant(id),
          fetchRecords(id),
        ]);
        if (cancelled) return;
        setPlant(plantData);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't load this plant.",
        );
      } finally {
        if (!cancelled) setLoadingPlant(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, fetchRecords]);

  const handleWatered = () => {
    if (id) fetchRecords(id);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          to="/home"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-600 transition hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to plants
        </Link>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium">Couldn't load this plant</p>
              <p className="mt-0.5 text-red-600/90">{error}</p>
            </div>
          </div>
        )}

        {!error && (
          <div className="space-y-6">
            <PlantInfoCard plant={loadingPlant ? null : plant} />

            {id && plant && (
              <WaterNowButton plantId={id} onWatered={handleWatered} />
            )}

            <WateringHistory records={records} loading={loadingRecords} />
          </div>
        )}
      </main>
    </div>
  );
}
