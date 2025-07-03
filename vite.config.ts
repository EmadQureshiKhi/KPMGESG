import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      input: 'index.html',
      output: {
        // Add timestamp to filenames for cache busting
        entryFileNames: 'assets/[name]-[hash]-[timestamp].js',
        chunkFileNames: 'assets/[name]-[hash]-[timestamp].js',
        assetFileNames: 'assets/[name]-[hash]-[timestamp].[ext]'
      }
    },
    // Generate manifest for cache busting
    manifest: true,
    // Ensure source maps for debugging
    sourcemap: true
  },
  // Add cache busting headers for development
  server: {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  }
});