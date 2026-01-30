import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";
import { VitePWA } from "vite-plugin-pwa";


export default defineConfig(() => ({
    plugins: [
        eslint(),
        VitePWA({
            registerType: "autoUpdate",
            devOptions: { enabled: true },
            manifest: {
                name: "Potterpd",
                short_name: "Potterpd",
                start_url: "/",
                display: "standalone",
                theme_color: "#ffffff",
                background_color: "#ffffff",
                icons: [
                    { src: "./public/vite.svg", sizes: "192x192", type: "image/png" },
                    { src: "./public/vite.svg", sizes: "512x512", type: "image/png" }
                ],
            }
        })
    ],
    build: {
        rollupOptions: {
            input: {
                main: "index.html"
            }
        }
    }
}));
