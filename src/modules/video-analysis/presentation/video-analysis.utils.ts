/** Normalizes a possibly repeated HTTP header into one metadata string. */
export const normalizeHeaderValue = (value: string | string[] | undefined): string => (Array.isArray(value) ? value.join(',') : value || '');
