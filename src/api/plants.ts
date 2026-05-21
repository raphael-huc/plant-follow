import { createItem, readItem, readItems } from "@directus/sdk";
import { DirectusClient } from "./directus";
import type { Plant, WateringRecord } from "../types/schema";

export async function getPlants(): Promise<Plant[]> {
  return await DirectusClient.getInstance().sdk.request(readItems("plant"));
}

export async function getPlant(id: string): Promise<Plant> {
  return await DirectusClient.getInstance().sdk.request(
    readItem("plant", id, {
      fields: [
        "id",
        "name",
        "status",
        {
          species: ["id", "name", "latin_name", { family: ["id", "name"] }],
          location: ["id", "name"],
        },
      ],
    }),
  );
}

export async function getWateringRecords(
  plantId: string,
): Promise<WateringRecord[]> {
  return await DirectusClient.getInstance().sdk.request(
    readItems("watering_record", {
      filter: { plant: { _eq: plantId } },
      sort: ["-date_created"],
      fields: ["id", "plant", "date_created", "user_created"],
      limit: -1,
    }),
  );
}

export async function recordWatering(plantId: string): Promise<WateringRecord> {
  return await DirectusClient.getInstance().sdk.request(
    createItem("watering_record", { plant: plantId }),
  );
}
