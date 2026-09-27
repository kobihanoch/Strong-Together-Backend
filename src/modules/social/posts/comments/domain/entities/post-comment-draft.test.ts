import { describe, expect, it } from 'vitest';
import { PostCommentDraft } from './post-comment-draft';

describe('PostCommentDraft', () => {
  it('normalizes valid comment content', () => {
    expect(new PostCommentDraft(' Great work! ').content.value).toBe('Great work!');
  });

  it('requires non-empty content of at most two thousand characters', () => {
    expect(() => new PostCommentDraft(' ')).toThrow('Comment content is required');
    expect(() => new PostCommentDraft('a'.repeat(2_001))).toThrow('Comment content must be at most 2000 characters');
  });
});
