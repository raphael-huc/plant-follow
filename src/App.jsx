import "./App.css";
import { Home } from "./pages/home.tsx";
import Login from "./pages/login.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute.js";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "http://localhost:8055/graphql",
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RouterProvider router={router} />
      </div>
    </ApolloProvider>
  );
}

export default App;
