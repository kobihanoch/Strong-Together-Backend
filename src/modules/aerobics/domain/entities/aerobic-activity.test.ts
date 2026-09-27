import { describe, expect, it } from 'vitest';
import { AerobicActivity } from './aerobic-activity';

describe('AerobicActivity', () => {
  it('creates an entry and normalizes its activity type', () => {
    const entry = AerobicActivity.create({ durationMins: 30, durationSec: 15, type: ' Running ' });

    expect(entry.duration.minutes).toBe(30);
    expect(entry.duration.seconds).toBe(15);
    expect(entry.type.value).toBe('Running');
  });

  it('requires a positive duration', () => {
    expect(() => AerobicActivity.create({ durationMins: 0, durationSec: 0, type: 'Running' })).toThrow('Aerobic duration must be greater than zero');
  });

  it('enforces minute and second ranges', () => {
    expect(() => AerobicActivity.create({ durationMins: 10_081, durationSec: 0, type: 'Running' })).toThrow(
      'Aerobic duration minutes must be an integer between 0 and 10080',
    );
    expect(() => AerobicActivity.create({ durationMins: 0, durationSec: 60, type: 'Running' })).toThrow(
      'Aerobic duration seconds must be an integer between 0 and 59',
    );
  });

  it('requires a non-empty activity type of at most fifty characters', () => {
    expect(() => AerobicActivity.create({ durationMins: 1, durationSec: 0, type: ' ' })).toThrow('Aerobic activity type is required');
    expect(() => AerobicActivity.create({ durationMins: 1, durationSec: 0, type: 'a'.repeat(51) })).toThrow(
      'Aerobic activity type must be at most 50 characters',
    );
  });
});
