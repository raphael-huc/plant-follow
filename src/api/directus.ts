import {
  createDirectus,
  rest,
  authentication,
  AuthenticationClient,
  RestClient,
  readItems, GraphqlClient,
  AuthenticationData, graphql,
} from "@directus/sdk";


/**
 * Singleton wrapper for Directus SDK
 */
export class DirectusClient {
  private static instance: DirectusClient;

  // We keep REST + Auth, and we add GraphQL
  public sdk: ReturnType<typeof createDirectus<Schema>> &
      AuthenticationClient<Schema> &
      GraphqlClient<Schema>; // .query() is added by graphql()

  private constructor() {
    this.sdk = createDirectus<Schema>('http://localhost:8055')
        // Authentication handles login/logout/refresh + token storage
        .with(authentication('cookie', { credentials: 'include' }))
        // Enable GraphQL queries, making sure cookies are sent
        .with(graphql({ credentials: 'include' }))
        // Keep REST while migrating gradually
        .with(rest({ credentials: 'include' }));
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

  /**
   * Perform user login with email/password
   */
  async login(email: string, password: string): Promise<AuthenticationData> {
    return await this.sdk.login(
      { email, password },
      {
        mode: "cookie",
      },
    );
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    await this.sdk.logout({
      mode: "cookie",
    });
  }

  /**
   * Get current token (if available)
   */
  async getToken(): Promise<string | null> {
    return await this.sdk.getToken();
  }

  async setToken(token: string | null) {
    await this.sdk.setToken(token);
  }

  /**
   * Get all plants
   */
  async getPlants(): Promise<Plant[]> {
    return await this.sdk.request(readItems<Plant>("plant"));
  }
  /**
   * GraphQL equivalent of getPlants (with basic args)
   */
  async getPlantGraphQL(options?: { limit?: number; sort?: string[]; filter?: Record<string, unknown>; fields?: string[]; }): Promise<Plant[]> {
    // NOTE: Keep the query explicit and typed; Directus GraphQL mirrors your collections
    //       Here the collection is `plant` (not `plants`) because your collection name is singular.
    //       If ta collection s'appelle `plants`, remplace par `plants`.
    const query = /* GraphQL */ `
      query GetPlant($limit: Int, $sort: [String!], $filter: plant_filter) {
        plant(limit: $limit, sort: $sort, filter: $filter) {
          id
          name
        }
      }
    `;

    // IMPORTANT: GraphQL variables must match the query signature
    const variables = {
      limit: options?.limit ?? 50,
      sort: options?.sort,
      filter: options?.filter,
      // You can’t pass dynamic "fields" as variables in GraphQL; selection set is static.
      // If you want dynamic fields, compose the `query` string conditionally before calling .query().
    };

    // Call the SDK .query(); it posts to /graphql avec cookies (thanks to graphql({ credentials: 'include' }))
    // The return shape is { data: { plant: Plant[] } }.
    const result = await this.sdk.query<{ plant: Plant[] }>(query, variables);

    // Defensive: some SDK versions return the `data` wrapper, others may unwrap.
    const data = (result as any)?.data ?? result;
    return data?.plant ?? [];
  }
}
