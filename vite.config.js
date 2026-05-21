import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {graphql} from "@directus/sdk";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), graphql()],
});
