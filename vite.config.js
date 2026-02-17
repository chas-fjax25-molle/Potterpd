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
                    character: resolve(rootDir, "pages/character/index.html"),
                    spell: resolve(rootDir, "pages/spell/index.html"),
                    potion: resolve(rootDir, "pages/potion/index.html"),
                    book: resolve(rootDir, "pages/book/index.html"),
                    movie: resolve(rootDir, "pages/movie/index.html"),
                    favourites: resolve(rootDir, "pages/favourites/index.html"),
                    "favourites/characters": resolve(
                        rootDir,
                        "pages/favourites/characters/index.html"
                    ),
                    "favourites/spells": resolve(rootDir, "pages/favourites/spells/index.html"),
                    "favourites/potions": resolve(rootDir, "pages/favourites/potions/index.html"),
                    "favourites/books": resolve(rootDir, "pages/favourites/books/index.html"),
                    "favourites/movies": resolve(rootDir, "pages/favourites/movies/index.html"),
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
