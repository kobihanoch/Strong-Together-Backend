import { describe, expect, it } from 'vitest';
import { CrewDetails } from './crew-details';

describe('CrewDetails', () => {
  it('normalizes valid crew properties', () => {
    const details = new CrewDetails({ name: ' Running Club ', privacy: 'private' });
    expect(details.name.value).toBe('Running Club');
    expect(details.privacy.value).toBe('private');
  });

  it('enforces crew name and privacy rules', () => {
    expect(() => new CrewDetails({ name: ' ', privacy: 'public' })).toThrow('Crew name is required');
    expect(() => new CrewDetails({ name: 'a'.repeat(101), privacy: 'public' })).toThrow('Crew name must be at most 100 characters');
    expect(() => new CrewDetails({ name: 'Crew', privacy: 'hidden' as 'public' })).toThrow('Crew privacy must be public or private');
  });
});
