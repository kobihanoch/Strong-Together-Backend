import "dotenv/config";
import tseslint from "typescript-eslint";
import safeql from "@ts-safeql/eslint-plugin/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for SafeQL.");
}

export default [
  {
    ignores: ["node_modules/**", "dist/**"],
  },
  {
    files: ["src/**/*.{ts,js}", "workers/**/*.{ts,js}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        sourceType: "module",
        ecmaVersion: "latest",
      },
    },
    plugins: {
      ...safeql.configs.connections([
        {
          databaseUrl,
          targets: [{ tag: "sql", skipTypeAnnotations: true }],
        },
      ]).plugins,
    },
    rules: {
      ...safeql.configs.connections([
        {
          databaseUrl,
          targets: [{ tag: "sql", skipTypeAnnotations: true }],
        },
      ]).rules,
    },
  },
];
