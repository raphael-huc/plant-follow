import { Clock, Droplet } from "lucide-react";
import type { WateringRecord } from "../types/schema";

interface WateringHistoryProps {
  records: WateringRecord[] | null;
  loading: boolean;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatRecordDate(iso: string | null): string {
  if (!iso) return "Unknown date";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "Unknown date";
  return dateFormatter.format(parsed);
}

export function WateringHistory({ records, loading }: WateringHistoryProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white">
      <header className="flex items-center gap-2 border-b border-stone-200 px-5 py-3">
        <Clock className="h-4 w-4 text-stone-500" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-stone-700">
          Watering history
        </h2>
      </header>

      {loading && !records && (
        <ul className="divide-y divide-stone-200">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 px-5 py-3">
              <div className="h-4 w-4 animate-pulse rounded-full bg-stone-200" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" />
            </li>
          ))}
        </ul>
      )}

      {records && records.length === 0 && (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-stone-500">No watering recorded yet.</p>
          <p className="mt-1 text-xs text-stone-400">
            Use the button above to log the first one.
          </p>
        </div>
      )}

      {records && records.length > 0 && (
        <ul className="divide-y divide-stone-200">
          {records.map((record) => (
            <li
              key={record.id}
              className="flex items-center gap-3 px-5 py-3 text-sm"
            >
              <Droplet
                className="h-4 w-4 text-emerald-600"
                aria-hidden="true"
              />
              <span className="text-stone-800">
                {formatRecordDate(record.date_created)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
