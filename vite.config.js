import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],

    server: {
        host: '0.0.0.0',
        port: 5173,

        proxy: {
            '/api': {
                target:
                    'https://nse-scrip-master-auto-update-60089696477.development.catalystserverless.in',
                changeOrigin: true,
                secure: true
            }
        }
    }
});