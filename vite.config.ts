import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Change to '/repo-name/' if deploying to GitHub Pages subdirectory
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
