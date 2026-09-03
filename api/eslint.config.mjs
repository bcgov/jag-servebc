import config from "eslint-config-xo";
import { defineConfig } from "eslint/config";

export default defineConfig([
    // 1. Global ignores
    {
        ignores: ["package-lock.json"],
    },

    // 2. Your XO configuration (This already includes plugin-n)
    ...config(),

    // 3. Custom Overrides
    {
        // REMOVED the plugins block from here
        rules: {
            "unicorn/prefer-module": "off",
            "unicorn/prefer-top-level-await": "off",
            "no-unused-vars": "warn",
            "no-undef": "warn",
        },
    },
]);