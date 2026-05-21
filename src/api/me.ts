import { readMe } from "@directus/sdk";
import { DirectusClient } from "./directus";

export interface Me {
  email: string | null;
  first_name: string | null;
  last_name: string | null;
}

export async function getMe(): Promise<Me> {
  return await DirectusClient.getInstance().sdk.request(
    readMe({ fields: ["email", "first_name", "last_name"] }),
  );
}
