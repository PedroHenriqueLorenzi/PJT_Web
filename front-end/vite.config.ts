import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig({
    optimizeDeps: {
        include: ['vue-moveable'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    plugins: [
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        tailwindcss(),
    ],
    server: {
        port: 5000,
        proxy: {
            '/api': {
                target: 'http://localhost:3000', // backend
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        }
    }

})
