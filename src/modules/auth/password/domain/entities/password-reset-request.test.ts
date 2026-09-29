import { describe, expect, it } from 'vitest';
import { PasswordResetRequest } from './password-reset-request';
import { NewPassword } from '../value-objects/new-password';

describe('password recovery values', () => {
  it('normalizes reset identifiers and validates replacement passwords', () => {
    expect(PasswordResetRequest.create(' user@example.com ').identifier).toBe('user@example.com');
    expect(new NewPassword('password123').value).toBe('password123');
  });

  it('rejects invalid values', () => {
    expect(() => PasswordResetRequest.create(' ')).toThrow();
    expect(() => new NewPassword('short')).toThrow();
  });
});
