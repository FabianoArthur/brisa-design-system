import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Library build: ESM bundle + one CSS file. React stays a peer dependency.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'brisa.js',
      cssFileName: 'brisa',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
