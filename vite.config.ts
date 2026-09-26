import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Docs site. BASE_PATH is set by the Pages workflow to "/<repo-name>/".
export default defineConfig({
  root: 'site',
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  build: {
    outDir: '../site-dist',
    emptyOutDir: true,
  },
});
