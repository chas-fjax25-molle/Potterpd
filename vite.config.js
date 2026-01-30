import { defineConfig, loadEnv } from "vite";
import eslint from "vite-plugin-eslint";
import { VitePWA } from "vite-plugin-pwa";
import process from "process";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    const base = env.VITE_BASE_PATH || "/";

    return {
        base,

        plugins: [
            eslint(),
            VitePWA({
                registerType: "autoUpdate",
                devOptions: { enabled: true },

                manifest: {
                    name: "Potterpd",
                    short_name: "Potterpd",

                    start_url: base,
                    scope: base,

                    display: "standalone",
                    theme_color: "#ffffff",
                    background_color: "#ffffff",

                    icons: [
                        {
                            src: "vite.svg",
                            sizes: "192x192",
                            type: "image/png",
                        },
                        {
                            src: "vite.svg",
                            sizes: "512x512",
                            type: "image/png",
                        },
                    ],
                },
            }),
        ],

        build: {
            rollupOptions: {
                input: {
                    main: "index.html",
                },
            },
        },
    };
});
