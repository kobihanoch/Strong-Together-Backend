import { describe, expect, it } from 'vitest';
import { WorkoutReminderNotification } from './workout-reminder-notification';

const reminder = {
  userId: 'user-id',
  workoutScheduleId: 'schedule-id',
  occurrenceDate: '2026-09-28',
  reminderAt: new Date('2026-09-28T10:00:00Z'),
  firstName: 'Jane',
  splitName: 'Push',
};

describe('WorkoutReminderNotification', () => {
  it('builds the existing message and delay for a future reminder', () => {
    const notification = new WorkoutReminderNotification(reminder, Date.parse('2026-09-28T09:55:00Z'), 'request-id');
    expect(notification.message.title).toBe('Hello, Jane!');
    expect(notification.message.body).toBe('Your Push workout starts soon.');
    expect(notification.delay).toBe(300_000);
    expect(notification.requestId).toBe('request-id');
  });

  it('uses zero delay when the reminder time has passed', () => {
    expect(new WorkoutReminderNotification(reminder, Date.parse('2026-09-28T10:01:00Z')).delay).toBe(0);
  });
});
