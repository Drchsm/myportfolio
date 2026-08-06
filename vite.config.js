import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    // Honour PORT when a harness assigns one; fall back to Vite's default.
    port: process.env.PORT ? Number(process.env.PORT) : 5173
  }
});
