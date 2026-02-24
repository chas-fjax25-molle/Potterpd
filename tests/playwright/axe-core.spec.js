import { test, expect } from "@playwright/test";
import axe from "axe-core";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

test("wcag / axe audit", async ({ page }) => {
    // point to your local dev/preview URL in CI
    await page.goto("http://localhost:4173/");

    // inject axe
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });

    // run only WCAG 2.1 AA checks (adjust tags as needed)
    const results = await page.evaluate(async () => {
        return await axe.run(document, {
            runOnly: { type: "tag", values: ["wcag2aa", "wcag21aa"] },
        });
    });

    // log details for CI output if there are violations
    if (results.violations.length) {
        console.log("AXE violations:", JSON.stringify(results.violations, null, 2));
    }

    expect(results.violations.length).toBe(0);
});
