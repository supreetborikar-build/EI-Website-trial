import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/assets': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/assets_events': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },

      '/assets_news': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/assets_committee': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/committee_assets': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
