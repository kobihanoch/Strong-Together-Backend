import { describe, expect, it } from 'vitest';
import { PostComment } from './post-comment';

describe('PostComment', () => {
  it('normalizes valid comment content', () => {
    expect(PostComment.create('post', 'author', ' Great work! ').content.value).toBe('Great work!');
  });

  it('requires non-empty content of at most two thousand characters', () => {
    expect(() => PostComment.create('post', 'author', ' ')).toThrow('Comment content is required');
    expect(() => PostComment.create('post', 'author', 'a'.repeat(2_001))).toThrow('Comment content must be at most 2000 characters');
  });
});
