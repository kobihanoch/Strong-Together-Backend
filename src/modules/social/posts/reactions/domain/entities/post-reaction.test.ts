import { describe, expect, it } from 'vitest';
import { PostReaction } from './post-reaction';

describe('PostReaction', () => {
  it.each(['like', 'fire up', 'muscle'] as const)('accepts the %s reaction', (type) => {
    expect(PostReaction.create('post', 'user', type).type.value).toBe(type);
  });

  it('rejects unsupported reactions', () => {
    expect(() => PostReaction.create('post', 'user', 'dislike')).toThrow('Reaction type is not supported');
  });
});
