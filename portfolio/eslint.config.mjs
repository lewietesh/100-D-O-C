import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ✅ Custom rules and settings
  {
    plugins: {
      import: require("eslint-plugin-import"),
    },
    rules: {
      // Optional: Enforce order or prevent unresolved imports
      "import/no-unresolved": "error",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal"],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
    settings: {
      // ✅ Tell ESLint how to resolve @/* using tsconfig
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
];

export default eslintConfig;
