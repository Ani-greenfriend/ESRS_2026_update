import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Only these prefixes reach the browser bundle. No Supabase variable is read by browser code.
  envPrefix: "PUBLIC_",
});
