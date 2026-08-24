import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import {
  aerobicTracking,
  exercise,
  exerciseToWorkoutSplit,
  exerciseToWorkoutSplitSetExpandedView,
  exerciseTracking,
  exerciseTrackingSetExpandedView,
  message,
  oauthAccount,
  prsView,
  trackingSet,
  user,
  userReminderSetting,
  userSplitInformation,
  workoutPlan,
  workoutSet,
  workoutSplit,
  workoutSummary,
} from '../../../../src/infrastructure/db/schema/drizzle/index';

export const userDbSchema = createSelectSchema(user);
export const userInsertDbSchema = createInsertSchema(user);
export const userUpdateDbSchema = createUpdateSchema(user);

export const oauthAccountDbSchema = createSelectSchema(oauthAccount);
export const exerciseDbSchema = createSelectSchema(exercise);
export const workoutPlanDbSchema = createSelectSchema(workoutPlan);
export const workoutSplitDbSchema = createSelectSchema(workoutSplit);
export const exerciseToWorkoutSplitDbSchema = createSelectSchema(exerciseToWorkoutSplit);
export const exerciseToWorkoutSplitSetExpandedViewDbSchema = createSelectSchema(exerciseToWorkoutSplitSetExpandedView);
export const workoutSetDbSchema = createSelectSchema(workoutSet);
export const workoutSummaryDbSchema = createSelectSchema(workoutSummary);
export const exerciseTrackingDbSchema = createSelectSchema(exerciseTracking);
export const trackingSetDbSchema = createSelectSchema(trackingSet);
export const aerobicTrackingDbSchema = createSelectSchema(aerobicTracking);
export const messageDbSchema = createSelectSchema(message);
export const userReminderSettingDbSchema = createSelectSchema(userReminderSetting);
export const userSplitInformationDbSchema = createSelectSchema(userSplitInformation);
export const exerciseTrackingSetExpandedViewDbSchema = createSelectSchema(exerciseTrackingSetExpandedView);
export const prsViewDbSchema = createSelectSchema(prsView);

export type UserRow = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;
export type AerobicTrackingRow = typeof aerobicTracking.$inferSelect;
export type MessageRow = typeof message.$inferSelect;
export type ExerciseRow = typeof exercise.$inferSelect;
export type WorkoutPlanRow = typeof workoutPlan.$inferSelect;
export type WorkoutSplitRow = typeof workoutSplit.$inferSelect;
export type ExerciseToWorkoutSplitRow = typeof exerciseToWorkoutSplit.$inferSelect;
export type WorkoutSummaryRow = typeof workoutSummary.$inferSelect;
export type ExerciseTrackingRow = typeof exerciseTracking.$inferSelect;
