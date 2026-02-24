import { test, expect } from "@playwright/test";
import axe from "axe-core";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pages = [
    { name: "Home", path: "/" },
    { name: "Spells", path: "/spells" },
    { name: "Characters", path: "/characters" },
    { name: "Potions", path: "/potions" },
];

for (const p of pages) {
    test(`WCAG audit — ${p.name} (${p.path})`, async ({ page }) => {
        // NOTE: Must match the URL where the app is running
        await page.goto(`http://localhost:4173${p.path}`);

        // inject axe
        await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });

        // run only WCAG 2.1 AA checks (adjust tags as needed)
        const results = await page.evaluate(async () => {
            return await axe.run(document, {
                runOnly: { type: "tag", values: ["wcag2aa", "wcag21aa"] },
            });
        });

        // If there are violations, format each affected node as its own message
        if (results.violations.length) {
            const errors = [];
            for (const violation of results.violations) {
                for (const node of violation.nodes) {
                    const target =
                        node.target && node.target.length ? node.target.join(" | ") : "<unknown>";
                    const message = `Error: ${target} : ${violation.id} - ${violation.help}`;
                    // Log each violation line for CI readability
                    console.error(message);
                    errors.push(message);
                }
            }
            // Include full JSON for richer debugging
            console.log("AXE violations:", JSON.stringify(results.violations, null, 2));

            // Throw aggregated error where each line represents a violated node.
            throw new Error(errors.join("\n"));
        }

        expect(results.violations.length).toBe(0);
    });
}
