import { UserEntity } from '../entities/user.entity.ts';
import { UserReminderSettingsEntity } from '../entities/userReminderSettings.entity.ts';
import { UserSplitInformationEntity } from '../entities/userSplitInformation.entity.ts';
import { WorkoutSplitEntity } from '../entities/workoutSplit.entity.ts';

export type NotificationPayload = {
  token: string;
  title: string;
  body: string;
  delay: number;
};

export type UserToHourlyReminder = {
  user_id: UserEntity['id'];
  name: UserEntity['name'];
  push_token: UserEntity['push_token'];
  reminder_offset_minutes: UserReminderSettingsEntity['reminder_offset_minutes'];
  split_id: UserSplitInformationEntity['split_id'];
  split_name: WorkoutSplitEntity['name'];
  estimated_time_utc: UserSplitInformationEntity['estimated_time_utc'];
};

export type UserWithNotificationsEnabled = Pick<UserEntity, 'push_token' | 'name'>;
