import { useState } from "react";
import { AlertCircle, Droplet } from "lucide-react";
import { recordWatering } from "../api/plants";

interface WaterNowButtonProps {
  plantId: string;
  onWatered: () => void;
}

export function WaterNowButton({ plantId, onWatered }: WaterNowButtonProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await recordWatering(plantId);
      onWatered();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't record watering. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={submitting}
        aria-busy={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        <Droplet
          className={`h-4 w-4 ${submitting ? "animate-pulse" : ""}`}
          aria-hidden="true"
        />
        {submitting ? "Watering…" : "Water now"}
      </button>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
