import path from 'node:path';
import safeql from '@ts-safeql/eslint-plugin/config';
import type { Linter, Rule } from 'eslint';
import tseslint from 'typescript-eslint';

const databaseUrl = process.env.DATABASE_URL;
const skipSafeql = process.env.SKIP_SAFEQL === 'true';
const projectRoot = process.cwd();
const normalize = (value: string): string => value.replaceAll('\\', '/');

if (!databaseUrl && !skipSafeql) {
  throw new Error('DATABASE_URL is required for SafeQL.');
}

const safeqlConfig = databaseUrl
  ? safeql.configs.connections([
      {
        databaseUrl,
        targets: [
          { tag: 'sql', skipTypeAnnotations: true },
          { tag: 'trx', skipTypeAnnotations: true },
        ],
      },
    ])
  : { plugins: {}, rules: {} };

type ImportNode = Rule.Node & { source?: { value?: unknown } | null };

const noCrossFeatureInfrastructure: Rule.RuleModule = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      forbidden: "Feature code must not import another feature's infrastructure implementation.",
    },
  },
  create(context) {
    const sourceFile = normalize(path.relative(projectRoot, context.filename));
    const sourceBoundary =
      sourceFile.match(/^(src\/modules\/.+?)\/(?:application|domain|presentation|infrastructure)\//)?.[1] ??
      sourceFile.match(/^(src\/modules\/.+)\/[^/]+[.]module[.]ts$/)?.[1];

    const checkImport = (node: ImportNode): void => {
      const importPath = node.source?.value;
      if (!sourceBoundary || typeof importPath !== 'string' || !importPath.startsWith('.')) return;

      const target = normalize(path.relative(projectRoot, path.resolve(path.dirname(context.filename), importPath)));
      const targetBoundary = target.match(/^(src\/modules\/.+?)\/infrastructure\//)?.[1];

      if (targetBoundary && targetBoundary !== sourceBoundary) {
        context.report({ node, messageId: 'forbidden' });
      }
    };

    return {
      ImportDeclaration: checkImport,
      ExportAllDeclaration: checkImport,
      ExportNamedDeclaration: checkImport,
    };
  },
};

const restrictedImports = (...patterns: Array<{ group: string[]; message: string }>): Linter.RuleEntry => ['error', { patterns }];

export default [
  { ignores: ['node_modules/**', 'dist/**'] },
  {
    files: ['src/**/*.{ts,js}', 'workers/**/*.{ts,js}', 'packages/shared/src/**/*.{ts,js}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json', './packages/shared/tsconfig.json'],
        tsconfigRootDir: projectRoot,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      ...safeqlConfig.plugins,
      architecture: { rules: { 'no-cross-feature-infrastructure': noCrossFeatureInfrastructure } },
    },
    rules: {
      ...safeqlConfig.rules,
      'architecture/no-cross-feature-infrastructure': 'error',
    },
  },
  {
    files: ['src/**/application/**/*.{ts,js}'],
    rules: {
      'no-restricted-imports': restrictedImports(
        { group: ['**/presentation/**'], message: 'Application code must not import presentation code.' },
        {
          group: ['**/infrastructure/**'],
          message: 'Application code must depend on ports, not infrastructure implementations.',
        },
      ),
    },
  },
  {
    files: ['src/**/domain/**/*.{ts,js}'],
    rules: {
      'no-restricted-imports': restrictedImports(
        { group: ['@nestjs/**'], message: 'Domain code must not depend on NestJS.' },
        { group: ['**/application/**'], message: 'Domain code must not import application code.' },
        { group: ['**/presentation/**'], message: 'Domain code must not import presentation code.' },
        { group: ['**/infrastructure/**'], message: 'Domain code must not import infrastructure code.' },
      ),
    },
  },
  {
    files: ['packages/shared/src/**/*.{ts,js}'],
    rules: {
      'no-restricted-imports': restrictedImports(
        { group: ['drizzle-orm', 'drizzle-orm/**'], message: 'The shared package must not depend on Drizzle.' },
        { group: ['@nestjs/**'], message: 'The shared package must not depend on backend frameworks.' },
        { group: ['**/src/**'], message: 'The shared package must not import backend source code.' },
      ),
    },
  },
] satisfies Linter.Config[];
