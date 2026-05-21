import { readItems } from "@directus/sdk";
import { DirectusClient } from "./directus";
import type { Plant } from "../types/schema";

export async function getPlants(): Promise<Plant[]> {
  return await DirectusClient.getInstance().sdk.request(readItems("plant"));
}
