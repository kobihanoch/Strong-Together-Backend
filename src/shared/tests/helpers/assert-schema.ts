import { expect } from 'vitest';

type CompatibleSchema = {
  safeParse(input: unknown):
    | { success: true; data: unknown }
    | { success: false; error: { flatten(): unknown } };
};

export function expectSchema(schema: CompatibleSchema, data: unknown): void {
  const parsed = schema.safeParse(data);
  expect(
    parsed.success,
    parsed.success ? undefined : JSON.stringify(parsed.error.flatten(), null, 2),
  ).toBe(true);
}
