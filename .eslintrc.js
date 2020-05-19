module.exports = {
    env: {
        browser: true,
        es6: true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
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
        ecmaVersion: 2018,
        sourceType: "module"
    },
    plugins: [
        "react",
        "@typescript-eslint"
    ],
    rules: {
        "comma-dangle": ["warn", "always-multiline"],
        "quotes": ["error", "double", { allowTemplateLiterals: true }],
        "semi": ["error", "always"],
    },
};
