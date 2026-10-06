import { describe, expect, it } from 'vitest';
import { LoginCredentials } from './login-credentials';

describe('LoginCredentials', () => {
  it('accepts email and username identifiers', () => {
    expect(LoginCredentials.create(' user@example.com ', 'secret').identifier.value).toBe('user@example.com');
    expect(LoginCredentials.create('runner_1', 'secret').identifier.value).toBe('runner_1');
  });

  it('rejects invalid identifiers and empty passwords', () => {
    expect(() => LoginCredentials.create('invalid value', 'secret')).toThrow('Must be a valid email or username');
    expect(() => LoginCredentials.create('runner', '')).toThrow('Username and password are required');
  });
});
