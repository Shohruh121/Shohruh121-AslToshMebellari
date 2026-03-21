import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': { target: 'https://interstone.uz', changeOrigin: true },
      '/media': { target: 'https://interstone.uz', changeOrigin: true },
      '/storage': { target: 'https://interstone.uz', changeOrigin: true },
      '/front': { target: 'https://interstone.uz', changeOrigin: true },
      '/visualizer': { target: 'https://interstone.uz', changeOrigin: true }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        catalog: resolve(__dirname, 'catalog.html'),
        admin: resolve(__dirname, 'admin.html'),
        kitchen3d: resolve(__dirname, '3d-kitchen.html'),
      },
    },
  }
});
