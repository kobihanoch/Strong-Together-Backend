import { describe, expect, it } from 'vitest';
import { buildOAuthDisplayName, DEFAULT_OAUTH_NAME } from './oauth.utils';

describe('buildOAuthDisplayName', () => {
  it('joins and trims available first and last names', () => {
    expect(buildOAuthDisplayName(' Jane ', ' Doe ')).toBe('Jane Doe');
  });

  it('uses the available name when the other component is null', () => {
    expect(buildOAuthDisplayName('Jane', null)).toBe('Jane');
    expect(buildOAuthDisplayName(null, 'Doe')).toBe('Doe');
  });

  it('returns a safe default when all components are missing or blank', () => {
    expect(buildOAuthDisplayName(null, null)).toBe(DEFAULT_OAUTH_NAME);
    expect(buildOAuthDisplayName(undefined, '   ')).toBe(DEFAULT_OAUTH_NAME);
  });
});
