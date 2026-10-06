import { describe, expect, it } from 'vitest';
import { ReminderSettings } from './reminder-settings';
import { ReminderTimeZone } from '../value-objects/reminder-time-zone';

describe('ReminderSettings', () => {
  it('creates settings and normalizes the time zone', () => {
    const settings = ReminderSettings.create('user-id', { reminderEnabled: true, timeZone: ' Asia/Jerusalem ' });

    expect(settings.reminderEnabled).toBe(true);
    expect(settings.timeZone.value).toBe('Asia/Jerusalem');
  });

  it('requires a boolean enabled state', () => {
    expect(() => ReminderSettings.create('user-id', { reminderEnabled: 'yes' as unknown as boolean, timeZone: 'UTC' })).toThrow(
      'Reminder enabled must be a boolean',
    );
  });

  it('replaces settings and changes only the time zone when requested', () => {
    const settings = ReminderSettings.restore('user-id', { reminderEnabled: false, timeZone: 'UTC' });
    settings.replace({ reminderEnabled: true, timeZone: 'Asia/Jerusalem' });
    settings.changeTimeZone('America/New_York');
    expect(settings.reminderEnabled).toBe(true);
    expect(settings.timeZone.value).toBe('America/New_York');
  });
});

describe('ReminderTimeZone', () => {
  it('accepts supported IANA time zones', () => {
    expect(new ReminderTimeZone('UTC').value).toBe('UTC');
    expect(new ReminderTimeZone('America/New_York').value).toBe('America/New_York');
  });

  it('rejects empty, unsupported, and excessively long values', () => {
    expect(() => new ReminderTimeZone(' ')).toThrow('Time zone must be a valid IANA time zone');
    expect(() => new ReminderTimeZone('Not/A_Time_Zone')).toThrow('Time zone must be a valid IANA time zone');
    expect(() => new ReminderTimeZone('a'.repeat(101))).toThrow('Time zone must be a valid IANA time zone');
  });
});
