import { z } from 'zod/v4';
import { AddUserAerobicsBody } from './aerobics.contracts';
import { aerobicsDailyRecordSchema, aerobicsWeeklyRecordSchema, weeklyDataSchema } from './aerobics.schemas';

export type AddAerobicInput = AddUserAerobicsBody['record'];

export type AerobicsDailyRecord = z.infer<typeof aerobicsDailyRecordSchema>;
export type AerobicsWeeklyRecord = z.infer<typeof aerobicsWeeklyRecordSchema>;
export type WeeklyData = z.infer<typeof weeklyDataSchema>;
