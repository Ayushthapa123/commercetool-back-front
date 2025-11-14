import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      "next",
      "next/core-web-vitals",
      "next/typescript",
      "plugin:prettier/recommended",
    ],
    plugins: ["no-relative-import-paths", "prettier"],
    rules: {
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        { allowSameFolder: false, rootDir: "src", prefix: "@" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "prettier/prettier": [
        "error",
        {
          plugins: ["@ianvs/prettier-plugin-sort-imports"],
        },
      ],
    },
  }),
    {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "no-relative-import-paths/no-relative-import-paths": "off",
    },
  },
];

export default eslintConfig;
