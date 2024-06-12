import react from "eslint-plugin-react";
import js from "@eslint/js";
import globals from "globals";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

export default [
  js.configs.recommended,
  ...compat.config({
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },

    ignorePatterns: [
      "dist/",
      "*.config.js",
      "*.test.jsx",
      "*.test.js",
      "*.spec.jsx",
      "*.spec.js",
    ],
  }),
  {
    files: ["app/**/*.js", "app/**/*.jsx"],
    ignores: [
      "dist/",
      "*.config.js",
      "*.test.jsx",
      "*.test.js",
      "*.spec.jsx",
      "*.spec.js",
    ],

    plugins: {
      react: react,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      indent: ["error", 4],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "no-unused-vars": "off",
    },
  },
];
