import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // the public/ asset pack is thousands of files and trips the FS watcher on Windows
    watch: {
      ignored: ['**/public/**', '**/shots/**', '**/dist/**', '**/node_modules/**'],
    },
  },
  build: {
    target: 'es2022',
  },
});