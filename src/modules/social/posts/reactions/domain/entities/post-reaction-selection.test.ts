import { describe, expect, it } from 'vitest';
import { PostReactionSelection } from './post-reaction-selection';

describe('PostReactionSelection', () => {
  it.each(['like', 'fire up', 'muscle'] as const)('accepts the %s reaction', (type) => {
    expect(new PostReactionSelection(type).type.value).toBe(type);
  });

  it('rejects unsupported reactions', () => {
    expect(() => new PostReactionSelection('dislike')).toThrow('Reaction type is not supported');
  });
});
