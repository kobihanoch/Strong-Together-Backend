import { expect } from 'vitest';
import type { ZodTypeAny } from 'zod';

export function expectSchema<TSchema extends ZodTypeAny>(schema: TSchema, data: unknown): void {
  const parsed = schema.safeParse(data);
  expect(
    parsed.success,
    parsed.success ? undefined : JSON.stringify(parsed.error.flatten(), null, 2),
  ).toBe(true);
}
