import { pgSchema } from 'drizzle-orm/pg-core';

export const authSchema = pgSchema('auth');
export const identitySchema = pgSchema('identity');
export const workoutSchema = pgSchema('workout');
export const trackingSchema = pgSchema('tracking');
export const remindersSchema = pgSchema('reminders');
export const schedulesSchema = pgSchema('schedules');
export const messagesSchema = pgSchema('messages');
export const socialSchema = pgSchema('social');

export const authProviders = identitySchema.enum('Auth Providers', ['apple', 'google', 'app']);
