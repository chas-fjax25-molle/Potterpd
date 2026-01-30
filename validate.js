#!/usr/bin/env node

import { execSync } from "child_process";
import { platform } from "os";
import process from "process";

/**
 * @typedef {Object} ValidationCheck
 * @property {string} command The shell command to run
 * @property {string} description Description of the command
 */

/**
 * List of validation checks to run.
 * These mirror the checks in .github/workflows/test.yml
 *
 * Note: npm ci is omitted here since local development assumes dependencies
 * are already installed. If commands fail due to missing dependencies,
 * run 'npm install' manually.
 *
 * @type {ValidationCheck[]}
 */
const checks = [
    {
        command:
            "npx prettier --list-different --no-error-on-unmatched-pattern 'src/**/*.{js,json,css,md,html}' 'public/**/*.{js,json,css,md,html}' 'tests/**/*.{js,json,css,md,html}' '*.{js,json,css,md,html}'",
        description: "Checking Prettier formatting",
    },
    {
        command: "npx eslint src/",
        description: "Running ESLint",
    },
    {
        command: "npm run test",
        description: "Running unit tests",
    },
    {
        command: "npm run build",
        description: "Building with Vite",
    },
];

const isWindows = platform() === "win32";

/**
 * @typedef {'reset' | 'red' | 'green' | 'yellow' | 'blue' | 'cyan'} Color
 */

/**
 * @type {Record<Color, string>}
 */
const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
};

/**
 * Logs a message with the specified color.
 * @param {string} message The message to log
 * @param {typeof colors[Color]} color The color to use
 */
function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

/**
 * Runs a shell command and logs the result.
 * @param {ValidationCheck} check The validation check to run
 * @returns {boolean} True if the command succeeded, false otherwise
 */
function runCommand(check) {
    const { command, description } = check;
    log(`\n${"=".repeat(60)}`, colors.cyan);
    log(`▶ ${description}`, colors.cyan);
    log("=".repeat(60), colors.cyan);

    try {
        execSync(command, {
            stdio: "inherit",
            shell: isWindows ? "cmd.exe" : "/bin/sh",
        });
        log(`✓ ${description} passed`, colors.green);
        return true;
    } catch {
        log(`✗ ${description} failed`, colors.red);
        return false;
    }
}

/**
 * Runs the full validation process.
 */
function runValidation() {
    log("\nStarting validation checks...", colors.blue);
    log("This runs the same checks as the GitHub Actions workflow\n", colors.yellow);

    for (const check of checks) {
        const passed = runCommand(check);

        if (!passed) {
            log(`\n❌ Validation failed at: ${check.description}`, colors.red);
            if (check.description === "Checking Prettier formatting") {
                log("To fix: npx prettier --write '**/*.{js,json,css,md,html}'", colors.yellow);
            }
            log("\nFix the errors above and try again.\n", colors.yellow);
            process.exit(1);
        }
    }

    log("\n" + "=".repeat(60), colors.green);
    log("✓ All validation checks passed!", colors.green);
    log("=".repeat(60), colors.green);
    log("Your code is ready for pull request.\n", colors.cyan);
}

runValidation();
