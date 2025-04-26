import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import eslintConfigPrettier from "eslint-config-prettier"
import eslintPluginPrettier from "eslint-plugin-prettier"

// Base configuration
const baseConfig = {
  ignores: ["dist", "node_modules", "src-tauri"],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
}

// TypeScript configuration
const typescriptConfig = {
  files: ["src/**/*.{ts,tsx}"],
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  rules: {
    "no-extra-boolean-cast": "error",
    "no-implicit-coercion": ["error", { boolean: true }],
  },
}

// React configuration
const reactConfig = {
  files: ["src/**/*.{ts,tsx}"],
  plugins: {
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
}

// Prettier configuration
const prettierConfig = {
  files: ["src/**/*.{ts,tsx}"],
  extends: [eslintConfigPrettier],
  plugins: {
    prettier: eslintPluginPrettier,
  },
  rules: {
    "prettier/prettier": "error",
  },
}

// Combine all configurations
export default tseslint.config(
  baseConfig,
  typescriptConfig,
  reactConfig,
  prettierConfig,
)
