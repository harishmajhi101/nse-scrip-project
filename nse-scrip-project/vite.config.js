import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],

    server: {
        proxy: {
            '/api': {
                target: 'https://nse-scrip-master-auto-update-60089696477.development.catalystserverless.in',
                changeOrigin: true,
                secure: true
            }
        }
    }
});