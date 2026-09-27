import { describe, expect, it } from 'vitest';
import { ReminderSettingsPreference } from './reminder-settings';
import { ReminderTimeZone } from '../value-objects/reminder-time-zone';

describe('ReminderSettingsPreference', () => {
  it('creates settings and normalizes the time zone', () => {
    const settings = new ReminderSettingsPreference({ reminderEnabled: true, timeZone: ' Asia/Jerusalem ' });

    expect(settings.reminderEnabled).toBe(true);
    expect(settings.timeZone.value).toBe('Asia/Jerusalem');
  });

  it('requires a boolean enabled state', () => {
    expect(() => new ReminderSettingsPreference({ reminderEnabled: 'yes' as unknown as boolean, timeZone: 'UTC' })).toThrow(
      'Reminder enabled must be a boolean',
    );
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
