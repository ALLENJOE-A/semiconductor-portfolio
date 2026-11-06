import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap')) return 'gsap';
          if (id.includes('node_modules/lenis')) return 'lenis';
        },
      },
    },
  },
  plugins: [
    {
      name: 'copy-404-html',
      closeBundle() {
        const dir = import.meta.dirname || process.cwd();
        const indexPath = path.resolve(dir, 'dist', 'index.html');
        const notFoundPath = path.resolve(dir, 'dist', '404.html');
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, notFoundPath);
        }
      },
    },
  ],
});
