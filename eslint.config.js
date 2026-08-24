import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "build"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      prettierConfig,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      "react-refresh": reactRefresh,
    },
    settings: {
      "import/resolver": {
        typescript: true,
      },
    },
    rules: {
      // styled-components exports both a default and a named `styled` binding;
      // every file that imports it as default trips this rule.
      "import/no-named-as-default": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "comma-dangle": ["warn", "always-multiline"],
      quotes: ["error", "double", { allowTemplateLiterals: true }],
      semi: ["error", "always"],
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);
