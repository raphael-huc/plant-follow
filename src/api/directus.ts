import {
  createDirectus,
  rest,
  authentication,
  AuthenticationClient,
  RestClient,
  AuthenticationData,
} from "@directus/sdk";
import type { Schema } from "../types/schema";

/**
 * Singleton wrapper for Directus SDK
 */
export class DirectusClient {
  private static instance: DirectusClient;

  public sdk: ReturnType<typeof createDirectus<Schema>> &
    AuthenticationClient<Schema> &
    RestClient<Schema>;

  // Coalesces concurrent refresh() calls so we only consume one refresh token
  // per round-trip — Directus rotates tokens, so parallel refreshes race and
  // the loser gets 401.
  private refreshPromise: Promise<AuthenticationData> | null = null;

  private constructor() {
    const url = import.meta.env.VITE_DIRECTUS_URL;
    if (!url) {
      throw new Error(
        "VITE_DIRECTUS_URL is not set. Copy .env.example to .env and restart the dev server.",
      );
    }
    this.sdk = createDirectus<Schema>(url)
      .with(authentication("cookie", { credentials: "include" }))
      .with(rest({ credentials: "include" }));
  }

  /**
   * Get singleton instance of DirectusClient
   */
  public static getInstance(): DirectusClient {
    if (!DirectusClient.instance) {
      DirectusClient.instance = new DirectusClient();
    }
    return DirectusClient.instance;
  }

  async login(email: string, password: string): Promise<AuthenticationData> {
    return await this.sdk.login(
      { email, password },
      {
        mode: "cookie",
      },
    );
  }

  async logout(): Promise<void> {
    await this.sdk.logout({
      mode: "cookie",
    });
  }

  async refresh(): Promise<AuthenticationData> {
    if (this.refreshPromise) return this.refreshPromise;
    this.refreshPromise = this.sdk.refresh({ mode: "cookie" });
    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  async getToken(): Promise<string | null> {
    return await this.sdk.getToken();
  }

  async setToken(token: string | null) {
    await this.sdk.setToken(token);
  }
}
