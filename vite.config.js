import { defineConfig, loadEnv } from "vite";
import eslint from "vite-plugin-eslint";
import { VitePWA } from "vite-plugin-pwa";
import process from "process";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
    const rootDir = process.cwd();
    const env = loadEnv(mode, rootDir);

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
        // Change the root folder to 'pages' directory so we can have multiple HTML entry points in a nice place
        root: resolve(rootDir, "pages"),
        // Redirect the public directory to the correct location
        publicDir: resolve(rootDir, "public"),
        build: {
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
