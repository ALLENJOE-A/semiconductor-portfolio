import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404-html',
      closeBundle() {
        // Creates a 404.html copy of index.html for static hosting platforms like GitHub Pages
        const dir = import.meta.dirname || process.cwd();
        const indexPath = path.resolve(dir, 'dist', 'index.html');
        const notFoundPath = path.resolve(dir, 'dist', '404.html');
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, notFoundPath);
        }
      },
    },
  ],
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three'))            return 'three';
          if (id.includes('@react-three'))                  return 'react-three';
          if (id.includes('node_modules/gsap'))             return 'gsap';
          if (id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router'))     return 'vendor';
        },
      },
    },
  },
})
