// src/graphql/client.ts
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createClient as createWSClient } from 'graphql-ws'; // if subscriptions
// import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

const GRAPHQL_HTTP_URL = __DEV__
  ? "http://localhost:8055/graphql" // ex: Directus local
  : "https://api.example.com/graphql";

// Optional: websocket endpoint for subscriptions
// const GRAPHQL_WS_URL = GRAPHQL_HTTP_URL.replace('http', 'ws');

/** Build an auth link that injects the bearer token from storage into each request */
const authLink = new ApolloLink((operation, forward) => {
  return new Promise(async (resolve) => {
    const token = await AsyncStorage.getItem("auth_token");
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        // Add your auth header only if a token is present
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }));
    resolve(forward(operation));
  });
});

/** Centralized error handling: log, tag, or route to Sentry */
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  // Always keep logs during development; hook to Sentry if needed
  if (graphQLErrors) {
    graphQLErrors.forEach((e) => {
      console.warn(`[GraphQL error] op=${operation.operationName}`, e);
    });
  }
  if (networkError) {
    console.warn("[Network error]", networkError);
  }
});

/** HTTP transport */
const httpLink = new HttpLink({
  uri: GRAPHQL_HTTP_URL,
  // You can pass credentials if your server needs cookies
  // credentials: 'include',
});

// Optional: subscriptions over WebSocket
// const wsClient = createWSClient({
//   url: GRAPHQL_WS_URL,
//   connectionParams: async () => {
//     const token = await AsyncStorage.getItem('auth_token');
//     return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
//   },
// });
// const wsLink = new GraphQLWsLink(wsClient);

/** Merge links (HTTP only or split for ws) */
// import { split } from '@apollo/client';
// import { getMainDefinition } from '@apollo/client/utilities';
// const splitLink = split(
//   ({ query }) => {
//     const def = getMainDefinition(query);
//     return def.kind === 'OperationDefinition' && def.operation === 'subscription';
//   },
//   wsLink,
//   httpLink
// );

export const apolloClient = new ApolloClient({
  // link: from([errorLink, authLink, splitLink]), // if subscriptions
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    // Type policies help Apollo normalize and paginate data efficiently
    typePolicies: {
      Query: {
        fields: {
          // Example cursor-based pagination helper
          items: {
            keyArgs: ["filter", "search", "orderBy"],
            merge(existing = [], incoming: any[]) {
              // Merge incoming page with existing cache for infinite scroll
              return [...(existing || []), ...incoming];
            },
          },
        },
      },
    },
  }),
  // Reasonable defaults for mobile to reduce stale UIs and network churn
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network", errorPolicy: "all" },
    query: { fetchPolicy: "cache-first", errorPolicy: "all" },
    mutate: { errorPolicy: "all" },
  },
});
