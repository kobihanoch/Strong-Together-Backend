/** A weekly workout slot submitted for persistence. */
export type WorkoutScheduleInput = {
  workoutSplitId: number;
  dayOfWeek: number;
  startTime: string;
};

/** A persisted weekly workout slot returned to the application. */
export type WorkoutSchedule = WorkoutScheduleInput & {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

/** The active weekly schedule belonging to one user. */
export type WorkoutSchedules = {
  schedules: WorkoutSchedule[];
};

/** Outcome of atomically replacing a user's weekly schedule. */
export type ReplaceWorkoutSchedulesOutcome = { kind: 'replaced' } | { kind: 'invalid-splits' };
