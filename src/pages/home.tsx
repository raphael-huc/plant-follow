"use client";
import { useState } from "react";
import { DirectusClient, Plant } from "../api/directus";
import { useNavigate } from "react-router-dom";

export function Home() {
  const [plants, setPlants] = useState<Plant[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // ⬅️ si tu es dans un projet Vite

  /**
   * Handle the user-triggered fetch from Directus
   */
  const handleFetch = async () => {
    setIsLoading(true);
    setError(null);

    const client = DirectusClient.getInstance();

    try {
      console.log("Token reçu:", client.getToken());

      // Lecture des données de la collection "plant"
      const response = await client.getPlants();
      console.log(`Plante reçu: ${JSON.stringify(response, null, 2)}`);
      setPlants(response ?? []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error while fetching data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  async function logout() {
    const client = DirectusClient.getInstance();
    await client.logout();
    navigate("/");
    await client.sdk.setToken(null);
  }

  return (
    <div className="p-4 max-w-md mx-auto border rounded shadow-sm bg-white">
      <button
        onClick={handleFetch}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Loading..." : "Fetch plants Data"}
      </button>
      <button
        onClick={logout}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Loading..." : "Log out"}
      </button>

      {error && (
        <div className="mt-4 text-red-600">
          <strong>Error:</strong> {error}
        </div>
      )}

      {plants && (
        <ul className="mt-4 space-y-2">
          {plants.map((plant) => (
            <li key={plant.id} className="p-2 border rounded bg-gray-100">
              <strong>{plant.name}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
