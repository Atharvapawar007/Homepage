import eslint from "@eslint/js";
import globals from "globals";

export default [
    eslint.configs.recommended,

    {
        files: ["**/*.js"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
            },
        },
    },
];
