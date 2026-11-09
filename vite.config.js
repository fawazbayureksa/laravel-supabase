import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { resolve } from "path";
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "resources/js"),
        },
    },
    server: {
        // Vite 5.4+ only allows localhost origins by default, which blocks
        // module requests coming from Herd's *.test domains.
        cors: {
            origin: [
                /^https?:\/\/localhost(?::\d+)?$/,
                /^https?:\/\/[^/]+\.test(?::\d+)?$/,
            ],
        },
    },
});
