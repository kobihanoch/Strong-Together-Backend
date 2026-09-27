import { describe, expect, it } from 'vitest';
import { SocialPostDraft } from './social-post-draft';

describe('SocialPostDraft', () => {
  it('normalizes valid content and preserves its audience', () => {
    const draft = new SocialPostDraft({ content: ' New PR! ', visibility: 'crews_only', crewIds: ['crew-1'] });
    expect(draft.content.value).toBe('New PR!');
    expect(draft.visibility.value).toBe('crews_only');
    expect(draft.crewIds).toEqual(['crew-1']);
  });

  it('enforces content rules', () => {
    expect(() => new SocialPostDraft({ content: ' ', visibility: 'public', crewIds: [] })).toThrow('Post content is required');
    expect(() => new SocialPostDraft({ content: 'a'.repeat(5_001), visibility: 'public', crewIds: [] })).toThrow(
      'Post content must be at most 5000 characters',
    );
  });

  it('requires crew targets for crew-only posts', () => {
    expect(() => new SocialPostDraft({ content: 'Post', visibility: 'crews_only', crewIds: [] })).toThrow(
      'Crew-only posts require at least one crew',
    );
  });

  it('limits crew targets and rejects duplicates', () => {
    expect(() => new SocialPostDraft({ content: 'Post', visibility: 'public', crewIds: ['crew-1', 'crew-1'] })).toThrow(
      'Crew IDs must be unique',
    );
    expect(() =>
      new SocialPostDraft({ content: 'Post', visibility: 'public', crewIds: Array.from({ length: 101 }, (_, index) => `crew-${index}`) }),
    ).toThrow('A post cannot target more than 100 crews');
  });
});
