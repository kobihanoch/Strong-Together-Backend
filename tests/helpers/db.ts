import sql from '../../src/config/db.ts';

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getExerciseToWorkoutSplitId(userId: string, splitName: string, exerciseId: number) {
  const rows = await sql<{ id: number }[]>`
    SELECT ets.id
    FROM public.exercisetoworkoutsplit ets
    INNER JOIN public.workoutsplits ws ON ws.id = ets.workoutsplit_id
    INNER JOIN public.workoutplans wp ON wp.id = ws.workout_id
    WHERE wp.user_id = ${userId}::uuid
      AND wp.is_active = TRUE
      AND ws.is_active = TRUE
      AND ets.is_active = TRUE
      AND ws.name = ${splitName}
      AND ets.exercise_id = ${exerciseId}
    LIMIT 1
  `;

  return rows[0] ? Number(rows[0].id) : null;
}

export async function getActiveWorkoutSplitNames(userId: string) {
  const rows = await sql<{ name: string | null }[]>`
    SELECT ws.name
    FROM public.workoutsplits ws
    INNER JOIN public.workoutplans wp ON wp.id = ws.workout_id
    WHERE wp.user_id = ${userId}::uuid
      AND wp.is_active = TRUE
      AND ws.is_active = TRUE
    ORDER BY ws.id
  `;

  return rows.map((row) => row.name);
}

export async function getInactiveWorkoutSplitNames(userId: string) {
  const rows = await sql<{ name: string | null }[]>`
    SELECT ws.name
    FROM public.workoutsplits ws
    INNER JOIN public.workoutplans wp ON wp.id = ws.workout_id
    WHERE wp.user_id = ${userId}::uuid
      AND wp.is_active = TRUE
      AND ws.is_active = FALSE
    ORDER BY ws.id
  `;

  return rows.map((row) => row.name);
}

export async function getExercisesForSplit(userId: string, splitName: string) {
  const rows = await sql<{ exercise_id: number | null; sets: number[] | null; order_index: number | null }[]>`
    SELECT ets.exercise_id, ets.sets, ets.order_index
    FROM public.exercisetoworkoutsplit ets
    INNER JOIN public.workoutsplits ws ON ws.id = ets.workoutsplit_id
    INNER JOIN public.workoutplans wp ON wp.id = ws.workout_id
    WHERE wp.user_id = ${userId}::uuid
      AND wp.is_active = TRUE
      AND ws.is_active = TRUE
      AND ets.is_active = TRUE
      AND ws.name = ${splitName}
    ORDER BY ets.order_index
  `;

  return rows.map((row) => ({
    exerciseId: row.exercise_id === null ? null : Number(row.exercise_id),
    sets: row.sets?.map((set) => Number(set)) ?? null,
    orderIndex: row.order_index === null ? null : Number(row.order_index),
  }));
}

export async function getInactiveExercisesForSplit(userId: string, splitName: string) {
  const rows = await sql<{ exercise_id: number | null }[]>`
    SELECT ets.exercise_id
    FROM public.exercisetoworkoutsplit ets
    INNER JOIN public.workoutsplits ws ON ws.id = ets.workoutsplit_id
    INNER JOIN public.workoutplans wp ON wp.id = ws.workout_id
    WHERE wp.user_id = ${userId}::uuid
      AND wp.is_active = TRUE
      AND ws.name = ${splitName}
      AND ets.is_active = FALSE
    ORDER BY ets.id
  `;

  return rows.map((row) => (row.exercise_id === null ? null : Number(row.exercise_id)));
}

export async function getWorkoutSummaryCount(userId: string) {
  const [row] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count
    FROM public.workout_summary
    WHERE user_id = ${userId}::uuid
  `;

  return Number(row?.count ?? '0');
}

export async function getExerciseTrackingCountForUser(userId: string) {
  const [row] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count
    FROM public.exercisetracking et
    INNER JOIN public.workout_summary ws ON ws.id = et.workout_summary_id
    WHERE ws.user_id = ${userId}::uuid
  `;

  return Number(row?.count ?? '0');
}

export async function getUserReminderTimezone(userId: string) {
  const [row] = await sql<{ timezone: string | null }[]>`
    SELECT urs.timezone
    FROM public.user_reminder_settings urs
    WHERE urs.user_id = ${userId}::uuid
    LIMIT 1
  `;

  return row?.timezone ?? null;
}

export async function getMessageReadState(messageId: string) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const [row] = await sql<{ is_read: boolean | null }[]>`
      SELECT m.is_read
      FROM public.messages m
      WHERE m.id = ${messageId}::uuid
      LIMIT 1
    `;

    if (row?.is_read === true) {
      return true;
    }

    if (attempt < 9) {
      await wait(25);
    }
  }

  return false;
}

export async function messageExists(messageId: string) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const [row] = await sql<{ count: string }[]>`
      SELECT COUNT(*)::text AS count
      FROM public.messages m
      WHERE m.id = ${messageId}::uuid
    `;

    if (Number(row?.count ?? '0') === 0) {
      return false;
    }

    if (attempt < 9) {
      await wait(25);
    }
  }

  return true;
}
