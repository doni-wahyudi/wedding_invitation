import { defineConfig } from 'vite';

export default defineConfig({
  base: '/wedding_invitation/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: true,
  },
});
