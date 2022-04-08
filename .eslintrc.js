module.exports = {
    env: {
        browser: true,
        es6: true
    },
    extends: [
        "react-app",
        "plugin:@typescript-eslint/eslint-recommended"
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 9,
        sourceType: "module",
        project: "./tsconfig.json",
    },
    plugins: ["@typescript-eslint"],
    rules: {
        "comma-dangle": ["warn", "always-multiline"],
        "quotes": ["error", "double", { allowTemplateLiterals: true }],
        "semi": ["error", "always"],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
