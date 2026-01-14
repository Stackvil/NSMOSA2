import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        adminLogin: 'admin-login.html',
        adminDashboard: 'admin-dashboard.html',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});

