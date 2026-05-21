import { Leaf, MapPin } from "lucide-react";
import type { Family, Plant, Room, Species } from "../types/schema";

interface PlantInfoCardProps {
  plant: Plant | null;
}

function resolveSpecies(plant: Plant): Species | null {
  if (!plant.species || typeof plant.species === "string") return null;
  return plant.species;
}

function resolveFamily(species: Species | null): Family | null {
  if (!species || !species.family) return null;
  return typeof species.family === "string" ? null : species.family;
}

function resolveLocation(plant: Plant): Room | null {
  if (!plant.location) return null;
  return typeof plant.location === "string" ? null : plant.location;
}

export function PlantInfoCard({ plant }: PlantInfoCardProps) {
  if (!plant) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-6">
        <div className="h-7 w-1/2 animate-pulse rounded bg-stone-200" />
        <div className="mt-4 space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-stone-200" />
        </div>
      </section>
    );
  }

  const species = resolveSpecies(plant);
  const family = resolveFamily(species);
  const location = resolveLocation(plant);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-6">
      <div className="flex items-start gap-3">
        <Leaf
          className="mt-1 h-5 w-5 shrink-0 text-emerald-600"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-stone-900">
            {plant.name ?? "Unnamed plant"}
          </h1>
          {species && (
            <p className="mt-1 text-sm text-stone-600">
              {species.name}
              {species.latin_name && (
                <span className="italic text-stone-500">
                  {" — "}
                  {species.latin_name}
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Family
          </dt>
          <dd className="mt-1 text-sm text-stone-800">{family?.name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Location
          </dt>
          <dd className="mt-1 flex items-center gap-1.5 text-sm text-stone-800">
            {location ? (
              <>
                <MapPin
                  className="h-3.5 w-3.5 text-stone-400"
                  aria-hidden="true"
                />
                {location.name}
              </>
            ) : (
              "—"
            )}
          </dd>
        </div>
      </dl>
    </section>
  );
}
