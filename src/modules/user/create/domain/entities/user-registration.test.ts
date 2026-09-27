import { describe, expect, it } from 'vitest';
import { UserRegistration } from './user-registration';

const valid = { username: 'runner_1', fullName: 'Jane Doe', email: 'Jane@Example.com', password: 'password123', gender: 'Female' };

describe('UserRegistration', () => {
  it('normalizes valid registration values', () => {
    const registration = new UserRegistration(valid);
    expect(registration.username.value).toBe('runner_1');
    expect(registration.email.value).toBe('jane@example.com');
  });

  it('enforces username, name, email, password, and gender rules', () => {
    expect(() => new UserRegistration({ ...valid, username: 'x' })).toThrow();
    expect(() => new UserRegistration({ ...valid, fullName: 'Jane 1' })).toThrow();
    expect(() => new UserRegistration({ ...valid, email: 'invalid' })).toThrow();
    expect(() => new UserRegistration({ ...valid, password: 'short' })).toThrow();
    expect(() => new UserRegistration({ ...valid, gender: 'invalid' })).toThrow();
  });
});
