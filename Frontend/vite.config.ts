import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // 1. Remove 'host: "::"' for better local laptop compatibility
    // 2. Change port to 5173 (Standard) or keep 8080 if you really prefer it
    port: 5173, 
    
    // 3. Add Proxy: This tricks your frontend into thinking the backend is local
    proxy: {
      '/api': {
        target: 'https://8000-01kc8n9ewxaeqxywk9cf7c23nm.cloudspaces.litng.ai',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));