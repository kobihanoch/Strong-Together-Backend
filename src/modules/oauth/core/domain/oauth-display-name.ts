export const DEFAULT_OAUTH_NAME = 'New User';

/** Builds a non-empty display name from optional provider name components. */
export function buildOAuthDisplayName(...parts: Array<string | null | undefined>): string {
  const displayName = parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(' ');

  return displayName || DEFAULT_OAUTH_NAME;
}
