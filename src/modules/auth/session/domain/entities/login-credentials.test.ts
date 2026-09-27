import { describe, expect, it } from 'vitest';
import { LoginCredentials } from './login-credentials';

describe('LoginCredentials', () => {
  it('accepts email and username identifiers', () => {
    expect(new LoginCredentials(' user@example.com ', 'secret').identifier.value).toBe('user@example.com');
    expect(new LoginCredentials('runner_1', 'secret').identifier.value).toBe('runner_1');
  });

  it('rejects invalid identifiers and empty passwords', () => {
    expect(() => new LoginCredentials('invalid value', 'secret')).toThrow('Must be a valid email or username');
    expect(() => new LoginCredentials('runner', '')).toThrow('Username and password are required');
  });
});
