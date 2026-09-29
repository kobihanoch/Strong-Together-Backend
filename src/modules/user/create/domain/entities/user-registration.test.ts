import { describe, expect, it } from 'vitest';
import { UserRegistration } from './user-registration';

const valid = { username: 'runner_1', fullName: 'Jane Doe', email: 'Jane@Example.com', password: 'password123', gender: 'Female' };

describe('UserRegistration', () => {
  it('normalizes valid registration values', () => {
    const registration = UserRegistration.create(valid);
    expect(registration.username.value).toBe('runner_1');
    expect(registration.email.value).toBe('jane@example.com');
  });

  it('enforces username, name, email, password, and gender rules', () => {
    expect(() => UserRegistration.create({ ...valid, username: 'x' })).toThrow();
    expect(() => UserRegistration.create({ ...valid, fullName: 'Jane 1' })).toThrow();
    expect(() => UserRegistration.create({ ...valid, email: 'invalid' })).toThrow();
    expect(() => UserRegistration.create({ ...valid, password: 'short' })).toThrow();
    expect(() => UserRegistration.create({ ...valid, gender: 'invalid' })).toThrow();
  });
});
