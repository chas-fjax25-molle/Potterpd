import { defineConfig, loadEnv } from "vite";
import eslint from "vite-plugin-eslint";
import { VitePWA } from "vite-plugin-pwa";
import process from "process";
import { resolve } from "path";
import path from "path";
import fs from "fs";

// Custom plugin to handle HTML partials
// Usage in HTML: <!--include(relative/path/to/partial.html) --> This will be replaced with the content of the specified HTML file relative to the current HTML file being processed.
// Usage for base path: ${basepath} (preferred) this will be replaced with the value of `base` provided in the plugin options or default to "/"
/**
 * @param {{ base?: string }} [options] - Plugin options
 */
function htmlPartials(options = {}) {
    return {
        name: "html-partials",
        /**
         * Transform index HTML to include partials and process simple tokens
         * @param {string} html - The original HTML content
         * @param {{ filename?: string }} ctx - The context object containing the filename
         * @returns {string} - The transformed HTML content
         */
        transformIndexHtml(html, ctx) {
            let transformed = html.replace(/<!--\s*include\(([^)]+)\)\s*-->/g, (_, file) => {
                // If ctx.filename is undefined, use the current working directory as base
                const base = ctx.filename ? path.dirname(ctx.filename) : process.cwd();

                // Load the partial html file
                const filePath = path.resolve(base, file.trim());
                return fs.readFileSync(filePath, "utf-8");
            });

            // Replace basepath tokens with the provided base path or default to "/"
            let basePath = options.base || "/";
            transformed = transformed.replace(/\$\{basepath\}/g, basePath);

            return transformed;
        },
    };
}

export default defineConfig(({ mode }) => {
    const rootDir = process.cwd();
    const env = loadEnv(mode, rootDir);

    const base = env.VITE_BASE_PATH || "/";

    return {
        base,
        plugins: [
            // Provide the resolved `base` to the HTML transformation plugin so
            // templates like ${basepath} can be replaced during build.
            htmlPartials({ base }),
            eslint(),
            VitePWA({
                registerType: "autoUpdate",
                devOptions: { enabled: true },

                manifest: {
                    name: "Potter Pedia",
                    short_name: "Potter Pedia",
                    description: "A PWA front end for harry potter API",
                    start_url: base,
                    display: "standalone",
                    background_color: "#ffffff",
                    theme_color: "#ffffffff",
                    icons: [
                        {
                            src: "icons/icon-48x48.png",
                            sizes: "48x48",
                            type: "image/png",
                        },
                        {
                            src: "icons/icon-72x72.png",
                            sizes: "72x72",
                            type: "image/png",
                        },
                        {
                            src: "icons/icon-96x96.png",
                            sizes: "96x96",
                            type: "image/png",
                        },
                        {
                            src: "icons/icon-144x144.png",
                            sizes: "144x144",
                            type: "image/png",
                        },
                        {
                            src: "icons/icon-192x192.png",
                            sizes: "192x192",
                            type: "image/png",
                        },
                        {
                            src: "icons/icon-512x512.png",
                            sizes: "512x512",
                            type: "image/png",
                        },
                        {
                            src: "icons/icon-180x180.png",
                            sizes: "180x180",
                            type: "image/png",
                        },
                        {
                            src: "icons/icon-167x167.png",
                            sizes: "167x167",
                            type: "image/png",
                        },
                        {
                            src: "icons/icon-152x152.png",
                            sizes: "152x152",
                            type: "image/png",
                        },
                        {
                            src: "icons/icon-120x120.png",
                            sizes: "120x120",
                            type: "image/png",
                        },
                        {
                            src: "icons/icon-76x76.png",
                            sizes: "76x76",
                            type: "image/png",
                        },
                        {
                            src: "icons/icon-70x70.png",
                            sizes: "70x70",
                            type: "image/png",
                        },
                        {
                            src: "icons/icon-150x150.png",
                            sizes: "150x150",
                            type: "image/png",
                        },
                        {
                            src: "icons/icon-310x310.png",
                            sizes: "310x310",
                            type: "image/png",
                        },
                    ],
                    splash_screens: [
                        {
                            src: "splash/splash-1125x2436.png",
                            sizes: "1125x2436",
                            type: "image/png",
                        },
                        {
                            src: "splash/splash-750x1334.png",
                            sizes: "750x1334",
                            type: "image/png",
                        },
                        {
                            src: "splash/splash-1242x2208.png",
                            sizes: "1242x2208",
                            type: "image/png",
                        },
                        {
                            src: "splash/splash-1668x2224.png",
                            sizes: "1668x2224",
                            type: "image/png",
                        },
                        {
                            src: "splash/splash-2048x2732.png",
                            sizes: "2048x2732",
                            type: "image/png",
                        },
                        {
                            src: "splash/splash-1536x2048.png",
                            sizes: "1536x2048",
                            type: "image/png",
                        },
                        {
                            src: "splash/splash-320x426.png",
                            sizes: "320x426",
                            type: "image/png",
                        },
                        {
                            src: "splash/splash-320x470.png",
                            sizes: "320x470",
                            type: "image/png",
                        },
                        {
                            src: "splash/splash-480x640.png",
                            sizes: "480x640",
                            type: "image/png",
                        },
                        {
                            src: "splash/splash-720x960.png",
                            sizes: "720x960",
                            type: "image/png",
                        },
                        {
                            src: "splash/splash-960x1280.png",
                            sizes: "960x1280",
                            type: "image/png",
                        },
                        {
                            src: "splash/splash-1280x1920.png",
                            sizes: "1280x1920",
                            type: "image/png",
                        },
                    ],
                    screenshots: [
                        {
                            src: "splash/screenshot-full-size.png",
                            sizes: "2940x1594",
                            form_factor: "wide",
                            type: "image/png",
                            label: "Full size screenshot",
                        },
                        {
                            src: "splash/splash-1280x1920.png",
                            sizes: "1280x1920",
                            type: "image/png",
                        },
                    ],
                    orientation: "portrait",
                    scope: base,
                    lang: "en",
                },
            }),
        ],
        // Change the root folder to 'pages' directory so we can have multiple HTML entry points in a nice place
        root: resolve(rootDir, "pages"),
        // Redirect the public directory to the correct location
        publicDir: resolve(rootDir, "public"),
        build: {
            target: "es2015",
            // Set the output directory to 'dist' in the project root
            outDir: resolve(rootDir, "dist"),
            emptyOutDir: true,
            rollupOptions: {
                // Define all the HTML entry points
                input: {
                    main: resolve(rootDir, "pages/index.html"),
                    characters: resolve(rootDir, "pages/characters/index.html"),
                    potions: resolve(rootDir, "pages/potions/index.html"),
                    books: resolve(rootDir, "pages/books/index.html"),
                    spells: resolve(rootDir, "pages/spells/index.html"),
                    movies: resolve(rootDir, "pages/movies/index.html"),
                    favourites: resolve(rootDir, "pages/favourites/index.html"),
                },
            },
        },
        resolve: {
            // Alias '/src' to the actual 'src' folder so we can use absolute imports
            alias: {
                "/src": resolve(rootDir, "src"),
            },
        },
        server: {
            // Allow serving files from one level up to the project root
            fs: {
                allow: [rootDir],
            },
        },
    };
});
