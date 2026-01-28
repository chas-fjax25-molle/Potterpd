import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
    test: {
        browser: {
            provider: playwright({
                // custom options
            }),
            instances: [
                { browser: 'chromium'},
            ],
        },
    },
})