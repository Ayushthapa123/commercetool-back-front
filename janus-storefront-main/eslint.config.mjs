import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
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
      "prettier/prettier": [
        "error",
        {
          plugins: [
            "@ianvs/prettier-plugin-sort-imports",
            "prettier-plugin-tailwindcss", // MUST come last
          ],
        },
      ],
    },
    ignorePatterns: ["src/lib/graphql/generated/*.ts"],
  }),
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    rules: {
      "no-relative-import-paths/no-relative-import-paths": "off",
    },
  },
];

export default eslintConfig;
