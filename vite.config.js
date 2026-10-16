import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'watch-rst-content',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.rst')) {
          console.log(`\n[RST Watcher] Content changed: ${path.basename(file)}, recompiling...`);
          try {
            execSync('node scripts/compile-content.js', { stdio: 'inherit' });
            server.ws.send({ type: 'full-reload' });
          } catch (e) {
            console.error('[RST Watcher] Compilation error:', e.message);
          }
        }
      },
    },
  ],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
