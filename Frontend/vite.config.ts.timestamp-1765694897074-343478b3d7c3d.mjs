// vite.config.ts
import { defineConfig } from "file:///D:/all%20files/Documents/MY%20PROJECTS/NewsSure-main/NewsSure-backup/Frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/all%20files/Documents/MY%20PROJECTS/NewsSure-main/NewsSure-backup/Frontend/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///D:/all%20files/Documents/MY%20PROJECTS/NewsSure-main/NewsSure-backup/Frontend/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "D:\\all files\\Documents\\MY PROJECTS\\NewsSure-main\\NewsSure-backup\\Frontend";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    // 1. Remove 'host: "::"' for better local laptop compatibility
    // 2. Change port to 5173 (Standard) or keep 8080 if you really prefer it
    port: 5173,
    // 3. Add Proxy: This tricks your frontend into thinking the backend is local
    proxy: {
      "/api": {
        target: "https://8000-01kc8n9ewxaeqxywk9cf7c23nm.cloudspaces.litng.ai",
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhbGwgZmlsZXNcXFxcRG9jdW1lbnRzXFxcXE1ZIFBST0pFQ1RTXFxcXE5ld3NTdXJlLW1haW5cXFxcTmV3c1N1cmUtYmFja3VwXFxcXEZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxhbGwgZmlsZXNcXFxcRG9jdW1lbnRzXFxcXE1ZIFBST0pFQ1RTXFxcXE5ld3NTdXJlLW1haW5cXFxcTmV3c1N1cmUtYmFja3VwXFxcXEZyb250ZW5kXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9hbGwlMjBmaWxlcy9Eb2N1bWVudHMvTVklMjBQUk9KRUNUUy9OZXdzU3VyZS1tYWluL05ld3NTdXJlLWJhY2t1cC9Gcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcclxuICBzZXJ2ZXI6IHtcclxuICAgIC8vIDEuIFJlbW92ZSAnaG9zdDogXCI6OlwiJyBmb3IgYmV0dGVyIGxvY2FsIGxhcHRvcCBjb21wYXRpYmlsaXR5XHJcbiAgICAvLyAyLiBDaGFuZ2UgcG9ydCB0byA1MTczIChTdGFuZGFyZCkgb3Iga2VlcCA4MDgwIGlmIHlvdSByZWFsbHkgcHJlZmVyIGl0XHJcbiAgICBwb3J0OiA1MTczLCBcclxuICAgIFxyXG4gICAgLy8gMy4gQWRkIFByb3h5OiBUaGlzIHRyaWNrcyB5b3VyIGZyb250ZW5kIGludG8gdGhpbmtpbmcgdGhlIGJhY2tlbmQgaXMgbG9jYWxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvYXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHBzOi8vODAwMC0wMWtjOG45ZXd4YWVxeHl3azljZjdjMjNubS5jbG91ZHNwYWNlcy5saXRuZy5haScsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBtb2RlID09PSBcImRldmVsb3BtZW50XCIgJiYgY29tcG9uZW50VGFnZ2VyKCldLmZpbHRlcihCb29sZWFuKSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxufSkpOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1osU0FBUyxvQkFBb0I7QUFDNWIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUhoQyxJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQTtBQUFBO0FBQUEsSUFHTixNQUFNO0FBQUE7QUFBQSxJQUdOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxpQkFBaUIsZ0JBQWdCLENBQUMsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUM5RSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
