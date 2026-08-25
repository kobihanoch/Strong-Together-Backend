var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/common/transport.schemas.ts
import { z } from "zod/v4";
var serializedDateSchema = z.string();
var timezoneSchema = z.string();

// src/database/database.schemas.ts
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

// ../../src/infrastructure/db/schema/drizzle/roles.ts
import { pgRole } from "drizzle-orm/pg-core";
var anonRole = pgRole("anon");
var authenticatedRole = pgRole("authenticated");
var guestRole = pgRole("guest");
var serviceRole = pgRole("service_role");
var appUserRole = pgRole("app_user");
var appRuntimeUserRole = pgRole("app_runtime_user", {
  createDb: false,
  createRole: false,
  inherit: false
});

// ../../src/infrastructure/db/schema/drizzle/schemas.ts
import { pgSchema } from "drizzle-orm/pg-core";
var authSchema = pgSchema("auth");
var identitySchema = pgSchema("identity");
var workoutSchema = pgSchema("workout");
var trackingSchema = pgSchema("tracking");
var remindersSchema = pgSchema("reminders");
var analyticsSchema = pgSchema("analytics");
var messagesSchema = pgSchema("messages");
var authProviders = identitySchema.enum("Auth Providers", [
  "apple",
  "google",
  "app"
]);

// ../../src/infrastructure/db/schema/drizzle/identity/user/table.ts
import { relations as relations14, sql as drizzleSql24 } from "drizzle-orm";
import { bigint as bigint11, boolean as boolean6, primaryKey as primaryKey14, text as text8, timestamp as timestamp10, uniqueIndex as uniqueIndex4, uuid as uuid11 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/messages/messages/table.ts
import { relations, sql as drizzleSql2 } from "drizzle-orm";
import { boolean, foreignKey, index, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/messages/messages/policies.ts
import { sql as drizzleSql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
var uid = drizzleSql`"identity"."current_user_id"()`;
function messagePolicies(t) {
  const participant = drizzleSql`${uid} = ${t.senderId} or ${uid} = ${t.receiverId}`;
  return [
    // Lets authenticated message participants read their sent or received messages.
    pgPolicy("Enable read access for auth users on message", {
      for: "select",
      to: authenticatedRole,
      using: participant
    }),
    // Lets authenticated users send as themselves or as the existing system sender.
    pgPolicy("Enable insert for auth users on message", {
      for: "insert",
      to: authenticatedRole,
      withCheck: drizzleSql`${uid} = ${t.senderId} or ${t.senderId} = '8dedd0e0-8c25-4c84-a05b-4ae5f5c48f3a'::uuid`
    }),
    // Lets authenticated message participants update a message while remaining participants.
    pgPolicy("Enable update for auth users on message", {
      for: "update",
      to: authenticatedRole,
      using: participant,
      withCheck: participant
    }),
    // Lets authenticated message participants delete their sent or received messages.
    pgPolicy("Enable delete for auth users on message", {
      for: "delete",
      to: authenticatedRole,
      using: participant
    })
  ];
}
__name(messagePolicies, "messagePolicies");

// ../../src/infrastructure/db/schema/drizzle/messages/messages/table.ts
var uid2 = drizzleSql2`"identity"."current_user_id"()`;
var message = messagesSchema.table("message", {
  id: uuid("id").defaultRandom().notNull(),
  senderId: uuid("sender_id").default(uid2).notNull(),
  receiverId: uuid("receiver_id").default(uid2).notNull(),
  subject: text("subject").default("Subject").notNull(),
  msg: text("msg").default("Hello World").notNull(),
  sentAt: timestamp("sent_at", {
    withTimezone: true
  }).default(drizzleSql2`(now() AT TIME ZONE 'utc')`).notNull(),
  isRead: boolean("is_read").default(false).notNull()
}, (t) => [
  primaryKey({
    name: "message_pkey",
    columns: [
      t.id
    ]
  }),
  foreignKey({
    name: "message_sender_id_fkey",
    columns: [
      t.senderId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  foreignKey({
    name: "message_receiver_id_fkey",
    columns: [
      t.receiverId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  index("message_receiver_id_idx").on(t.receiverId),
  ...messagePolicies(t)
]);
var messageRelations = relations(message, ({ one }) => ({
  sender: one(user, {
    fields: [
      message.senderId
    ],
    references: [
      user.id
    ],
    relationName: "messageSender"
  }),
  receiver: one(user, {
    fields: [
      message.receiverId
    ],
    references: [
      user.id
    ],
    relationName: "messageReceiver"
  })
}));

// ../../src/infrastructure/db/schema/drizzle/reminders/user_reminder_setting/table.ts
import { relations as relations2, sql as drizzleSql4 } from "drizzle-orm";
import { boolean as boolean2, foreignKey as foreignKey2, integer, primaryKey as primaryKey2, text as text2, timestamp as timestamp2, uuid as uuid2 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/reminders/user_reminder_setting/policies.ts
import { sql as drizzleSql3 } from "drizzle-orm";
import { pgPolicy as pgPolicy2 } from "drizzle-orm/pg-core";
var uid3 = drizzleSql3`"identity"."current_user_id"()`;
function userReminderSettingPolicies(t) {
  return [
    // Lets authenticated users read only their own reminder settings.
    pgPolicy2("auth can SELECT own reminder settings", {
      for: "select",
      to: authenticatedRole,
      using: drizzleSql3`${uid3} = ${t.userId}`
    }),
    // Lets authenticated users insert reminder settings only for themselves.
    pgPolicy2("auth can INSERT own reminder settings", {
      for: "insert",
      to: authenticatedRole,
      withCheck: drizzleSql3`${uid3} = ${t.userId}`
    }),
    // Lets authenticated users update their own reminder settings and preserves ownership.
    pgPolicy2("auth can UPDATE own reminder settings", {
      for: "update",
      to: authenticatedRole,
      using: drizzleSql3`${uid3} = ${t.userId}`,
      withCheck: drizzleSql3`${uid3} = ${t.userId}`
    }),
    // Provides the original additional update policy for settings owned by the user.
    pgPolicy2("Allow authenticated users to update their own reminder settings", {
      for: "update",
      to: authenticatedRole,
      using: drizzleSql3`${uid3} = ${t.userId}`
    })
  ];
}
__name(userReminderSettingPolicies, "userReminderSettingPolicies");

// ../../src/infrastructure/db/schema/drizzle/reminders/user_reminder_setting/table.ts
var userReminderSetting = remindersSchema.table("user_reminder_setting", {
  userId: uuid2("user_id").notNull(),
  workoutRemindersEnabled: boolean2("workout_reminders_enabled").default(true).notNull(),
  reminderOffsetMinutes: integer("reminder_offset_minutes").default(60).notNull(),
  updatedAt: timestamp2("updated_at", {
    withTimezone: true
  }).default(drizzleSql4`timezone('UTC', now())`).notNull(),
  timezone: text2("timezone").default("'UTC'::text")
}, (t) => [
  primaryKey2({
    name: "user_reminder_setting_pkey",
    columns: [
      t.userId
    ]
  }),
  foreignKey2({
    name: "user_reminder_setting_user_id_fkey",
    columns: [
      t.userId
    ],
    foreignColumns: [
      user.id
    ]
  }).onDelete("cascade"),
  ...userReminderSettingPolicies(t)
]);
var userReminderSettingRelations = relations2(userReminderSetting, ({ one }) => ({
  user: one(user, {
    fields: [
      userReminderSetting.userId
    ],
    references: [
      user.id
    ]
  })
}));

// ../../src/infrastructure/db/schema/drizzle/reminders/user_split_information/table.ts
import { relations as relations11, sql as drizzleSql18 } from "drizzle-orm";
import { bigint as bigint9, foreignKey as foreignKey10, index as index8, integer as integer5, numeric, primaryKey as primaryKey11, timestamp as timestamp7, unique as unique4, uuid as uuid8 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/workout/workout_split/table.ts
import { sql as drizzleSql17, relations as relations10 } from "drizzle-orm";
import { bigint as bigint8, boolean as boolean5, foreignKey as foreignKey9, index as index7, integer as integer4, primaryKey as primaryKey10, text as text5, timestamp as timestamp6, uniqueIndex as uniqueIndex3 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/tracking/workout_summary/table.ts
import { relations as relations8, sql as drizzleSql13 } from "drizzle-orm";
import { bigint as bigint6, foreignKey as foreignKey7, index as index6, primaryKey as primaryKey8, timestamp as timestamp4, uuid as uuid6 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/tracking/exercise_tracking/table.ts
import { relations as relations7, sql as drizzleSql11 } from "drizzle-orm";
import { bigint as bigint5, foreignKey as foreignKey6, index as index5, primaryKey as primaryKey7, text as text4, uuid as uuid5 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/workout/exercises/table.ts
import { relations as relations5 } from "drizzle-orm";
import { bigint as bigint3, primaryKey as primaryKey5, text as text3, uniqueIndex } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/workout/exercisetoworkoutsplit/table.ts
import { relations as relations4, sql as drizzleSql7 } from "drizzle-orm";
import { bigint as bigint2, boolean as boolean3, foreignKey as foreignKey4, index as index3, primaryKey as primaryKey4, timestamp as timestamp3, unique as unique2 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/workout/workout_set/table.ts
import { relations as relations3 } from "drizzle-orm";
import { bigint, foreignKey as foreignKey3, index as index2, integer as integer2, primaryKey as primaryKey3, unique, uuid as uuid3 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/workout/workout_set/policies.ts
import { sql as drizzleSql5 } from "drizzle-orm";
import { pgPolicy as pgPolicy3 } from "drizzle-orm/pg-core";
var currentUserId = drizzleSql5`"identity"."current_user_id"()`;
function workoutSetPolicies(table) {
  const ownsWorkoutSet = drizzleSql5`exists (
    select 1
    from "workout"."exercise_to_workout_split" ets
    join "workout"."workout_split" ws on ws."id" = ets."workout_split_id"
    join "workout"."workout_plan" wp on wp."id" = ws."workout_id"
    where ets."id" = ${table.exerciseToSplitId}
      and wp."user_id" = ${currentUserId}
  )`;
  return [
    // Lets authenticated users read planned sets only from workout plans they own.
    pgPolicy3("Enable read access for auth users on workout_set", {
      for: "select",
      to: authenticatedRole,
      using: ownsWorkoutSet
    }),
    // Lets authenticated users add planned sets only to workout plans they own.
    pgPolicy3("Enable insert for auth users on workout_set", {
      for: "insert",
      to: authenticatedRole,
      withCheck: ownsWorkoutSet
    }),
    // Lets authenticated users update planned sets only within workout plans they own.
    pgPolicy3("Enable update for auth users on workout_set", {
      for: "update",
      to: authenticatedRole,
      using: ownsWorkoutSet,
      withCheck: ownsWorkoutSet
    }),
    // Lets authenticated users delete planned sets only from workout plans they own.
    pgPolicy3("Enable delete for auth users on workout_set", {
      for: "delete",
      to: authenticatedRole,
      using: ownsWorkoutSet
    })
  ];
}
__name(workoutSetPolicies, "workoutSetPolicies");

// ../../src/infrastructure/db/schema/drizzle/workout/workout_set/table.ts
var workoutSet = workoutSchema.table("workout_set", {
  id: uuid3("id").defaultRandom().notNull(),
  exerciseToSplitId: bigint("exercise_to_split_id", {
    mode: "number"
  }).notNull(),
  orderIndex: integer2("order_index").notNull(),
  reps: integer2("reps").notNull()
}, (t) => [
  primaryKey3({
    name: "workout_set_pkey",
    columns: [
      t.id
    ]
  }),
  unique("workout_set_exercise_order_unique").on(t.exerciseToSplitId, t.orderIndex),
  foreignKey3({
    name: "workout_set_exercise_to_split_id_fkey",
    columns: [
      t.exerciseToSplitId
    ],
    foreignColumns: [
      exerciseToWorkoutSplit.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  index2("workout_set_exercise_to_split_id_idx").on(t.exerciseToSplitId),
  ...workoutSetPolicies(t)
]);
var workoutSetRelations = relations3(workoutSet, ({ one }) => ({
  exerciseToWorkoutSplit: one(exerciseToWorkoutSplit, {
    fields: [
      workoutSet.exerciseToSplitId
    ],
    references: [
      exerciseToWorkoutSplit.id
    ]
  })
}));

// ../../src/infrastructure/db/schema/drizzle/workout/exercisetoworkoutsplit/policies.ts
import { sql as drizzleSql6 } from "drizzle-orm";
import { pgPolicy as pgPolicy4 } from "drizzle-orm/pg-core";
var uid4 = drizzleSql6`"identity"."current_user_id"()`;
function exerciseToWorkoutSplitPolicies(t) {
  const owns = drizzleSql6`${uid4} = (select wp."user_id" from "workout"."workout_plan" wp join "workout"."workout_split" ws on ws."workout_id" = wp."id" where ws."id" = ${t.workoutSplitId})`;
  const ownsForDelete = drizzleSql6`exists (select 1 from "workout"."workout_split" ws join "workout"."workout_plan" wp on wp."id" = ws."workout_id" where ws."id" = ${t.workoutSplitId} and wp."user_id" = ${uid4})`;
  return [
    // Lets authenticated users read exercise assignments in splits they own.
    pgPolicy4("Enable read access for auth users on exercise_to_workout_split", {
      for: "select",
      to: authenticatedRole,
      using: owns
    }),
    // Lets authenticated users add exercise assignments only to splits they own.
    pgPolicy4("Enable insert for auth users on exercise_to_workout_split", {
      for: "insert",
      to: authenticatedRole,
      withCheck: owns
    }),
    // Lets authenticated users update exercise assignments only in splits they own.
    pgPolicy4("Enable update for auth users on exercise_to_workout_split", {
      for: "update",
      to: authenticatedRole,
      using: owns,
      withCheck: owns
    }),
    // Lets authenticated users delete exercise assignments only from splits they own.
    pgPolicy4("Enable delete for auth users on exercise_to_workout_split", {
      for: "delete",
      to: authenticatedRole,
      using: ownsForDelete
    })
  ];
}
__name(exerciseToWorkoutSplitPolicies, "exerciseToWorkoutSplitPolicies");

// ../../src/infrastructure/db/schema/drizzle/workout/exercisetoworkoutsplit/table.ts
var exerciseToWorkoutSplit = workoutSchema.table("exercise_to_workout_split", {
  id: bigint2("id", {
    mode: "number"
  }).generatedByDefaultAsIdentity({
    name: "exercise_to_workout_split_id_seq"
  }).notNull(),
  workoutSplitId: bigint2("workout_split_id", {
    mode: "number"
  }).notNull(),
  exerciseId: bigint2("exercise_id", {
    mode: "number"
  }).notNull(),
  createdAt: timestamp3("created_at", {
    withTimezone: true
  }).default(drizzleSql7`(now() AT TIME ZONE 'utc')`).notNull(),
  orderIndex: bigint2("order_index", {
    mode: "number"
  }).notNull(),
  isActive: boolean3("is_active").default(true).notNull()
}, (t) => [
  primaryKey4({
    name: "exercise_to_workout_split_pkey",
    columns: [
      t.id
    ]
  }),
  unique2("uq_exercise_to_workout_split_workout_split_exercise").on(t.workoutSplitId, t.exerciseId),
  foreignKey4({
    name: "exercise_to_workout_split_exercise_id_fkey",
    columns: [
      t.exerciseId
    ],
    foreignColumns: [
      exercise.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  foreignKey4({
    name: "exercise_to_workout_split_workout_split_id_fkey",
    columns: [
      t.workoutSplitId
    ],
    foreignColumns: [
      workoutSplit.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  index3("exercise_to_workout_split_active_idx").on(t.workoutSplitId, t.orderIndex).where(drizzleSql7`${t.isActive} = true`),
  index3("exercise_to_workout_split_workout_split_id_order_index_idx").on(t.workoutSplitId, t.orderIndex),
  ...exerciseToWorkoutSplitPolicies(t)
]);
var exerciseToWorkoutSplitRelations = relations4(exerciseToWorkoutSplit, ({ many, one }) => ({
  exercise: one(exercise, {
    fields: [
      exerciseToWorkoutSplit.exerciseId
    ],
    references: [
      exercise.id
    ]
  }),
  workoutSplit: one(workoutSplit, {
    fields: [
      exerciseToWorkoutSplit.workoutSplitId
    ],
    references: [
      workoutSplit.id
    ]
  }),
  exerciseTrackings: many(exerciseTracking),
  workoutSets: many(workoutSet)
}));

// ../../src/infrastructure/db/schema/drizzle/workout/exercises/policies.ts
import { sql as drizzleSql8 } from "drizzle-orm";
import { pgPolicy as pgPolicy5 } from "drizzle-orm/pg-core";
var exercisePolicies = /* @__PURE__ */ __name(() => [
  // Makes the shared exercise catalog readable to every authenticated user.
  pgPolicy5("Allow all authenticated users to read exercise", {
    for: "select",
    to: authenticatedRole,
    using: drizzleSql8`true`
  })
], "exercisePolicies");

// ../../src/infrastructure/db/schema/drizzle/workout/exercises/table.ts
var exercise = workoutSchema.table("exercise", {
  id: bigint3("id", {
    mode: "number"
  }).generatedByDefaultAsIdentity({
    name: "exercise_id_seq"
  }).notNull(),
  name: text3("name").notNull(),
  description: text3("description").notNull(),
  targetMuscle: text3("target_muscle").notNull(),
  specificTargetMuscle: text3("specific_target_muscle").notNull()
}, (t) => [
  primaryKey5({
    name: "exercise_pkey",
    columns: [
      t.id
    ]
  }),
  uniqueIndex("exercise_name_unique").on(t.name),
  ...exercisePolicies()
]);
var exerciseRelations = relations5(exercise, ({ many }) => ({
  workoutSplitAssignments: many(exerciseToWorkoutSplit)
}));

// ../../src/infrastructure/db/schema/drizzle/tracking/tracking_set/table.ts
import { relations as relations6 } from "drizzle-orm";
import { bigint as bigint4, foreignKey as foreignKey5, index as index4, integer as integer3, primaryKey as primaryKey6, real, unique as unique3, uuid as uuid4 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/tracking/tracking_set/policies.ts
import { sql as drizzleSql9 } from "drizzle-orm";
import { pgPolicy as pgPolicy6 } from "drizzle-orm/pg-core";
var currentUserId2 = drizzleSql9`"identity"."current_user_id"()`;
function trackingSetPolicies(table) {
  const ownsExerciseTracking = drizzleSql9`exists (
    select 1
    from "tracking"."exercise_tracking" et
    join "tracking"."workout_summary" ws on ws."id" = et."workout_summary_id"
    where et."id" = ${table.exerciseTrackingId}
      and ws."user_id" = ${currentUserId2}
  )`;
  return [
    // Lets authenticated users read tracked sets only from workout summaries they own.
    pgPolicy6("Enable read access for auth users on tracking_set", {
      for: "select",
      to: authenticatedRole,
      using: ownsExerciseTracking
    }),
    // Lets authenticated users add tracked sets only to their own exercise tracking rows.
    pgPolicy6("Enable insert for auth users on tracking_set", {
      for: "insert",
      to: authenticatedRole,
      withCheck: ownsExerciseTracking
    }),
    // Lets authenticated users update tracked sets without moving them outside their own workout.
    pgPolicy6("Enable update for auth users on tracking_set", {
      for: "update",
      to: authenticatedRole,
      using: ownsExerciseTracking,
      withCheck: ownsExerciseTracking
    }),
    // Lets authenticated users delete tracked sets only from workout summaries they own.
    pgPolicy6("Enable delete for auth users on tracking_set", {
      for: "delete",
      to: authenticatedRole,
      using: ownsExerciseTracking
    })
  ];
}
__name(trackingSetPolicies, "trackingSetPolicies");

// ../../src/infrastructure/db/schema/drizzle/tracking/tracking_set/table.ts
var trackingSet = trackingSchema.table("tracking_set", {
  id: uuid4("id").defaultRandom().notNull(),
  exerciseTrackingId: bigint4("exercise_tracking_id", {
    mode: "number"
  }).notNull(),
  setIndex: integer3("set_index").notNull(),
  reps: integer3("reps").notNull(),
  weight: real("weight").notNull()
}, (t) => [
  primaryKey6({
    name: "tracking_set_pkey",
    columns: [
      t.id
    ]
  }),
  unique3("tracking_set_exercise_index_unique").on(t.exerciseTrackingId, t.setIndex),
  foreignKey5({
    name: "tracking_set_exercise_tracking_id_fkey",
    columns: [
      t.exerciseTrackingId
    ],
    foreignColumns: [
      exerciseTracking.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  index4("tracking_set_exercise_tracking_id_idx").on(t.exerciseTrackingId),
  ...trackingSetPolicies(t)
]);
var trackingSetRelations = relations6(trackingSet, ({ one }) => ({
  exerciseTracking: one(exerciseTracking, {
    fields: [
      trackingSet.exerciseTrackingId
    ],
    references: [
      exerciseTracking.id
    ]
  })
}));

// ../../src/infrastructure/db/schema/drizzle/tracking/exercise_tracking/policies.ts
import { sql as drizzleSql10 } from "drizzle-orm";
import { pgPolicy as pgPolicy7 } from "drizzle-orm/pg-core";
var uid5 = drizzleSql10`"identity"."current_user_id"()`;
function exerciseTrackingPolicies(t) {
  const owns = drizzleSql10`exists (select 1 from "tracking"."workout_summary" ws where ws."id" = ${t.workoutSummaryId} and ws."user_id" = ${uid5})`;
  return [
    // Lets authenticated users read exercise tracking rows through summaries they own.
    pgPolicy7("exercise_tracking_select_by_summary_owner", {
      for: "select",
      to: authenticatedRole,
      using: owns
    }),
    // Lets authenticated users insert exercise tracking rows through summaries they own.
    pgPolicy7("exercise_tracking_insert_by_summary_owner", {
      for: "insert",
      to: authenticatedRole,
      withCheck: owns
    }),
    // Lets authenticated users update exercise tracking rows through summaries they own.
    pgPolicy7("exercise_tracking_update_by_summary_owner", {
      for: "update",
      to: authenticatedRole,
      using: owns,
      withCheck: owns
    }),
    // Lets authenticated users delete exercise tracking rows through summaries they own.
    pgPolicy7("exercise_tracking_delete_by_summary_owner", {
      for: "delete",
      to: authenticatedRole,
      using: owns
    })
  ];
}
__name(exerciseTrackingPolicies, "exerciseTrackingPolicies");

// ../../src/infrastructure/db/schema/drizzle/tracking/exercise_tracking/table.ts
import { check } from "drizzle-orm/pg-core";
var exerciseTracking = trackingSchema.table("exercise_tracking", {
  id: bigint5("id", {
    mode: "number"
  }).generatedByDefaultAsIdentity({
    name: "exercise_tracking_id_seq"
  }).notNull(),
  workoutSummaryId: uuid5("workout_summary_id").notNull(),
  exerciseToSplitId: bigint5("exercise_to_split_id", {
    mode: "number"
  }),
  exerciseId: bigint5("exercise_id", {
    mode: "number"
  }),
  notes: text4("notes")
}, (t) => [
  primaryKey7({
    name: "exercise_tracking_pkey",
    columns: [
      t.id
    ]
  }),
  foreignKey6({
    name: "exercise_tracking_exercise_to_split_id_fkey",
    columns: [
      t.exerciseToSplitId
    ],
    foreignColumns: [
      exerciseToWorkoutSplit.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  foreignKey6({
    name: "exercise_tracking_exercise_id_fkey",
    columns: [
      t.exerciseId
    ],
    foreignColumns: [
      exercise.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  foreignKey6({
    name: "exercise_tracking_workout_summary_id_fkey",
    columns: [
      t.workoutSummaryId
    ],
    foreignColumns: [
      workoutSummary.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  check("exercise_tracking_xor_check", drizzleSql11`num_nonnulls(${t.exerciseToSplitId}, ${t.exerciseId}) = 1`),
  index5("exercise_tracking_workout_summary_id_idx").on(t.workoutSummaryId),
  ...exerciseTrackingPolicies(t)
]);
var exerciseTrackingRelations = relations7(exerciseTracking, ({ many, one }) => ({
  exerciseToWorkoutSplit: one(exerciseToWorkoutSplit, {
    fields: [
      exerciseTracking.exerciseToSplitId
    ],
    references: [
      exerciseToWorkoutSplit.id
    ]
  }),
  workoutSummary: one(workoutSummary, {
    fields: [
      exerciseTracking.workoutSummaryId
    ],
    references: [
      workoutSummary.id
    ]
  }),
  trackingSets: many(trackingSet),
  exercise: one(exercise, {
    fields: [
      exerciseTracking.exerciseId
    ],
    references: [
      exercise.id
    ]
  })
}));

// ../../src/infrastructure/db/schema/drizzle/tracking/workout_summary/policies.ts
import { sql as drizzleSql12 } from "drizzle-orm";
import { pgPolicy as pgPolicy8 } from "drizzle-orm/pg-core";
var uid6 = drizzleSql12`"identity"."current_user_id"()`;
function workoutSummaryPolicies(t) {
  return [
    // Lets authenticated users read only their own completed workout summaries.
    pgPolicy8("users can read their workout summaries", {
      for: "select",
      to: authenticatedRole,
      using: drizzleSql12`${t.userId} = ${uid6}`
    }),
    // Lets authenticated users insert completed workout summaries only for themselves.
    pgPolicy8("users can insert their workout summaries", {
      for: "insert",
      to: authenticatedRole,
      withCheck: drizzleSql12`${t.userId} = ${uid6}`
    }),
    // Lets authenticated users update only their own completed workout summaries.
    pgPolicy8("users can update their workout summaries", {
      for: "update",
      to: authenticatedRole,
      using: drizzleSql12`${t.userId} = ${uid6}`,
      withCheck: drizzleSql12`${t.userId} = ${uid6}`
    }),
    // Lets authenticated users delete only their own completed workout summaries.
    pgPolicy8("users can delete their workout summaries", {
      for: "delete",
      to: authenticatedRole,
      using: drizzleSql12`${t.userId} = ${uid6}`
    })
  ];
}
__name(workoutSummaryPolicies, "workoutSummaryPolicies");

// ../../src/infrastructure/db/schema/drizzle/tracking/workout_summary/table.ts
var workoutSummary = trackingSchema.table("workout_summary", {
  id: uuid6("id").defaultRandom().notNull(),
  userId: uuid6("user_id").notNull(),
  workoutSplitId: bigint6("workout_split_id", {
    mode: "number"
  }).notNull(),
  workoutStartUtc: timestamp4("workout_start_utc", {
    withTimezone: true
  }).notNull(),
  workoutEndUtc: timestamp4("workout_end_utc", {
    withTimezone: true
  }).notNull(),
  createdAt: timestamp4("created_at", {
    withTimezone: true
  }).defaultNow().notNull()
}, (t) => [
  primaryKey8({
    name: "workout_summary_pkey",
    columns: [
      t.id
    ]
  }),
  foreignKey7({
    name: "workout_summary_user_id_fkey",
    columns: [
      t.userId
    ],
    foreignColumns: [
      user.id
    ]
  }).onDelete("cascade"),
  foreignKey7({
    name: "workout_summary_workout_split_id_fkey",
    columns: [
      t.workoutSplitId
    ],
    foreignColumns: [
      workoutSplit.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  index6("workout_summary_start_date_idx").on(drizzleSql13`((${t.workoutStartUtc} at time zone 'UTC')::date)`),
  index6("workout_summary_user_start_utc_idx").on(t.userId, t.workoutStartUtc.desc().nullsFirst()),
  ...workoutSummaryPolicies(t)
]);
var workoutSummaryRelations = relations8(workoutSummary, ({ many, one }) => ({
  user: one(user, {
    fields: [
      workoutSummary.userId
    ],
    references: [
      user.id
    ]
  }),
  workoutSplit: one(workoutSplit, {
    fields: [
      workoutSummary.workoutSplitId
    ],
    references: [
      workoutSplit.id
    ]
  }),
  exerciseTrackings: many(exerciseTracking)
}));

// ../../src/infrastructure/db/schema/drizzle/workout/workout_plan/table.ts
import { relations as relations9, sql as drizzleSql15 } from "drizzle-orm";
import { bigint as bigint7, boolean as boolean4, foreignKey as foreignKey8, primaryKey as primaryKey9, timestamp as timestamp5, uniqueIndex as uniqueIndex2, uuid as uuid7 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/workout/workout_plan/policies.ts
import { sql as drizzleSql14 } from "drizzle-orm";
import { pgPolicy as pgPolicy9 } from "drizzle-orm/pg-core";
var uid7 = drizzleSql14`"identity"."current_user_id"()`;
function workoutPlanPolicies(t) {
  return [
    // Lets authenticated users read only workout plans they own.
    pgPolicy9("Enable read access for auth users on workout_plan", {
      for: "select",
      to: authenticatedRole,
      using: drizzleSql14`${uid7} = ${t.userId}`
    }),
    // Lets authenticated users create workout plans only for themselves.
    pgPolicy9("Enable insert for auth users on workout_plan", {
      for: "insert",
      to: authenticatedRole,
      withCheck: drizzleSql14`${uid7} = ${t.userId}`
    }),
    // Lets authenticated users update only workout plans they own.
    pgPolicy9("Enable update for auth users on workout_plan", {
      for: "update",
      to: authenticatedRole,
      using: drizzleSql14`${uid7} = ${t.userId}`,
      withCheck: drizzleSql14`${uid7} = ${t.userId}`
    }),
    // Lets authenticated users delete only workout plans they own.
    pgPolicy9("Enable delete for auth users on workout_plan", {
      for: "delete",
      to: authenticatedRole,
      using: drizzleSql14`${uid7} = ${t.userId}`
    })
  ];
}
__name(workoutPlanPolicies, "workoutPlanPolicies");

// ../../src/infrastructure/db/schema/drizzle/workout/workout_plan/table.ts
var workoutPlan = workoutSchema.table("workout_plan", {
  id: bigint7("id", {
    mode: "number"
  }).generatedByDefaultAsIdentity({
    name: "workout_plan_id_seq"
  }).notNull(),
  userId: uuid7("user_id").notNull(),
  isActive: boolean4("is_active").default(true).notNull(),
  updatedAt: timestamp5("updated_at", {
    withTimezone: true
  }).default(drizzleSql15`(now() AT TIME ZONE 'utc')`).notNull(),
  createdAt: timestamp5("created_at", {
    withTimezone: true
  }).defaultNow().notNull()
}, (t) => [
  primaryKey9({
    name: "workout_plan_pkey",
    columns: [
      t.id
    ]
  }),
  foreignKey8({
    name: "workout_plan_user_id_fkey",
    columns: [
      t.userId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  uniqueIndex2("uq_workout_plan_active_user").on(t.userId).where(drizzleSql15`${t.isActive}`),
  ...workoutPlanPolicies(t)
]);
var workoutPlanRelations = relations9(workoutPlan, ({ many, one }) => ({
  owner: one(user, {
    fields: [
      workoutPlan.userId
    ],
    references: [
      user.id
    ],
    relationName: "workoutPlanOwner"
  }),
  splits: many(workoutSplit)
}));

// ../../src/infrastructure/db/schema/drizzle/workout/workout_split/policies.ts
import { sql as drizzleSql16 } from "drizzle-orm";
import { pgPolicy as pgPolicy10 } from "drizzle-orm/pg-core";
var uid8 = drizzleSql16`"identity"."current_user_id"()`;
function workoutSplitPolicies(t) {
  const owns = drizzleSql16`${uid8} = (select wp."user_id" from "workout"."workout_plan" wp where wp."id" = ${t.workoutId})`;
  const ownsForDelete = drizzleSql16`exists (select 1 from "workout"."workout_plan" wp where wp."id" = ${t.workoutId} and wp."user_id" = ${uid8})`;
  return [
    // Lets authenticated users read splits belonging to their own plans.
    pgPolicy10("Enable read access for auth users on workout_split", {
      for: "select",
      to: authenticatedRole,
      using: owns
    }),
    // Lets authenticated users add splits only to their own plans.
    pgPolicy10("Enable insert for auth users on workout_split", {
      for: "insert",
      to: authenticatedRole,
      withCheck: owns
    }),
    // Lets authenticated users update splits only within their own plans.
    pgPolicy10("Enable update for auth users on workout_split", {
      for: "update",
      to: authenticatedRole,
      using: owns,
      withCheck: owns
    }),
    // Lets authenticated users delete splits only from their own plans.
    pgPolicy10("Enable delete for auth users on workout_split", {
      for: "delete",
      to: authenticatedRole,
      using: ownsForDelete
    })
  ];
}
__name(workoutSplitPolicies, "workoutSplitPolicies");

// ../../src/infrastructure/db/schema/drizzle/workout/workout_split/table.ts
var workoutSplit = workoutSchema.table("workout_split", {
  id: bigint8("id", {
    mode: "number"
  }).generatedByDefaultAsIdentity({
    name: "workout_split_id_seq"
  }).notNull(),
  workoutId: bigint8("workout_id", {
    mode: "number"
  }).notNull(),
  name: text5("name").notNull(),
  orderIndex: integer4("order_index").notNull(),
  createdAt: timestamp6("created_at", {
    withTimezone: true
  }).default(drizzleSql17`(NOW() AT TIME ZONE 'utc')`).notNull(),
  isActive: boolean5("is_active").default(true).notNull()
}, (t) => [
  primaryKey10({
    name: "workout_split_pkey",
    columns: [
      t.id
    ]
  }),
  uniqueIndex3("uq_active_workout_split_order_index").on(t.workoutId, t.orderIndex).where(drizzleSql17`${t.isActive} = TRUE`),
  foreignKey9({
    name: "workout_split_workout_id_fkey",
    columns: [
      t.workoutId
    ],
    foreignColumns: [
      workoutPlan.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  index7("workout_split_workout_id_idx").on(t.workoutId),
  ...workoutSplitPolicies(t)
]);
var workoutSplitRelations = relations10(workoutSplit, ({ many, one }) => ({
  workoutPlan: one(workoutPlan, {
    fields: [
      workoutSplit.workoutId
    ],
    references: [
      workoutPlan.id
    ]
  }),
  exerciseAssignments: many(exerciseToWorkoutSplit),
  workoutSummaries: many(workoutSummary),
  splitInformation: many(userSplitInformation)
}));

// ../../src/infrastructure/db/schema/drizzle/reminders/user_split_information/table.ts
var userSplitInformation = remindersSchema.table("user_split_information", {
  id: bigint9("id", {
    mode: "number"
  }).generatedByDefaultAsIdentity({
    name: "user_split_information_id_seq"
  }).notNull(),
  userId: uuid8("user_id").notNull(),
  workoutSplitId: bigint9("workout_split_id", {
    mode: "number"
  }).notNull(),
  estimatedTimeUtc: timestamp7("estimated_time_utc", {
    withTimezone: true
  }).notNull(),
  confidence: numeric("confidence", {
    precision: 3,
    scale: 2
  }).default("1.00").notNull(),
  lastComputedAt: timestamp7("last_computed_at", {
    withTimezone: true
  }).default(drizzleSql18`timezone('UTC', now())`).notNull(),
  preferredWeekday: integer5("preferred_weekday")
}, (t) => [
  primaryKey11({
    name: "user_split_information_pkey",
    columns: [
      t.id
    ]
  }),
  unique4("user_split_information_user_id_workout_split_id_key").on(t.userId, t.workoutSplitId),
  foreignKey10({
    name: "user_split_information_user_id_fkey",
    columns: [
      t.userId
    ],
    foreignColumns: [
      user.id
    ]
  }).onDelete("cascade"),
  foreignKey10({
    name: "user_split_information_workout_split_id_fkey",
    columns: [
      t.workoutSplitId
    ],
    foreignColumns: [
      workoutSplit.id
    ]
  }).onDelete("cascade"),
  index8("user_split_information_confidence_idx").on(t.preferredWeekday, t.confidence).where(drizzleSql18`${t.confidence} >= 0.60`),
  index8("user_split_information_user_weekday_idx").on(t.userId, t.preferredWeekday).where(drizzleSql18`${t.preferredWeekday} is not null`)
]).enableRLS();
var userSplitInformationRelations = relations11(userSplitInformation, ({ one }) => ({
  user: one(user, {
    fields: [
      userSplitInformation.userId
    ],
    references: [
      user.id
    ]
  }),
  workoutSplit: one(workoutSplit, {
    fields: [
      userSplitInformation.workoutSplitId
    ],
    references: [
      workoutSplit.id
    ]
  })
}));

// ../../src/infrastructure/db/schema/drizzle/tracking/aerobic_tracking/table.ts
import { relations as relations12, sql as drizzleSql20 } from "drizzle-orm";
import { bigint as bigint10, foreignKey as foreignKey11, index as index9, primaryKey as primaryKey12, text as text6, timestamp as timestamp8, uuid as uuid9 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/tracking/aerobic_tracking/policies.ts
import { sql as drizzleSql19 } from "drizzle-orm";
import { pgPolicy as pgPolicy11 } from "drizzle-orm/pg-core";
var uid9 = drizzleSql19`"identity"."current_user_id"()`;
function aerobicTrackingPolicies(t) {
  return [
    // Lets authenticated users read only their own aerobic tracking rows.
    pgPolicy11("Enable read access for auth users on aerobic_tracking", {
      for: "select",
      to: authenticatedRole,
      using: drizzleSql19`${uid9} = ${t.userId}`
    }),
    // Lets authenticated users insert aerobic tracking rows only for themselves.
    pgPolicy11("Enable insert for auth users on aerobic_tracking", {
      for: "insert",
      to: authenticatedRole,
      withCheck: drizzleSql19`${uid9} = ${t.userId}`
    }),
    // Lets authenticated users update only their own aerobic tracking rows.
    pgPolicy11("Enable update for auth users on aerobic_tracking", {
      for: "update",
      to: authenticatedRole,
      using: drizzleSql19`${uid9} = ${t.userId}`,
      withCheck: drizzleSql19`${uid9} = ${t.userId}`
    }),
    // Lets authenticated users delete only their own aerobic tracking rows.
    pgPolicy11("Enable delete for auth users on aerobic_tracking", {
      for: "delete",
      to: authenticatedRole,
      using: drizzleSql19`${uid9} = ${t.userId}`
    })
  ];
}
__name(aerobicTrackingPolicies, "aerobicTrackingPolicies");

// ../../src/infrastructure/db/schema/drizzle/tracking/aerobic_tracking/table.ts
var aerobicTracking = trackingSchema.table("aerobic_tracking", {
  id: bigint10("id", {
    mode: "number"
  }).generatedByDefaultAsIdentity({
    name: "aerobic_tracking_id_seq"
  }).notNull(),
  userId: uuid9("user_id").notNull(),
  type: text6("type").notNull(),
  durationSec: bigint10("duration_sec", {
    mode: "number"
  }).default(0).notNull(),
  workoutTimeUtc: timestamp8("workout_time_utc", {
    withTimezone: true
  }).default(drizzleSql20`(now() AT TIME ZONE 'utc')`).notNull()
}, (t) => [
  primaryKey12({
    name: "aerobic_tracking_pkey",
    columns: [
      t.id
    ]
  }),
  foreignKey11({
    name: "aerobic_tracking_user_id_fkey",
    columns: [
      t.userId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  index9("aerobic_tracking_user_id_workout_time_utc_idx").on(t.userId, t.workoutTimeUtc.desc().nullsFirst()),
  ...aerobicTrackingPolicies(t)
]);
var aerobicTrackingRelations = relations12(aerobicTracking, ({ one }) => ({
  user: one(user, {
    fields: [
      aerobicTracking.userId
    ],
    references: [
      user.id
    ]
  })
}));

// ../../src/infrastructure/db/schema/drizzle/identity/oauth_account/table.ts
import { relations as relations13, sql as drizzleSql22 } from "drizzle-orm";
import { foreignKey as foreignKey12, primaryKey as primaryKey13, text as text7, timestamp as timestamp9, unique as unique5, uuid as uuid10 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/identity/oauth_account/policies.ts
import { sql as drizzleSql21 } from "drizzle-orm";
import { pgPolicy as pgPolicy12 } from "drizzle-orm/pg-core";
var currentUserId3 = drizzleSql21`"identity"."current_user_id"()`;
function oauthAccountPolicies(table) {
  return [
    // Lets authenticated users read only OAuth accounts linked to themselves.
    pgPolicy12("Enable read access for auth users on oauth_account", {
      for: "select",
      to: authenticatedRole,
      using: drizzleSql21`${currentUserId3} = ${table.userId}`
    }),
    // Lets authenticated users link OAuth accounts only to themselves.
    pgPolicy12("Enable insert for auth users on oauth_account", {
      for: "insert",
      to: authenticatedRole,
      withCheck: drizzleSql21`${currentUserId3} = ${table.userId}`
    }),
    // Lets authenticated users update only OAuth accounts linked to themselves.
    pgPolicy12("Enable update for auth users on oauth_account", {
      for: "update",
      to: authenticatedRole,
      using: drizzleSql21`${currentUserId3} = ${table.userId}`,
      withCheck: drizzleSql21`${currentUserId3} = ${table.userId}`
    }),
    // Lets authenticated users delete only OAuth accounts linked to themselves.
    pgPolicy12("Enable delete for auth users on oauth_account", {
      for: "delete",
      to: authenticatedRole,
      using: drizzleSql21`${currentUserId3} = ${table.userId}`
    })
  ];
}
__name(oauthAccountPolicies, "oauthAccountPolicies");

// ../../src/infrastructure/db/schema/drizzle/identity/oauth_account/table.ts
var oauthAccount = identitySchema.table("oauth_account", {
  id: uuid10("id").defaultRandom().notNull(),
  userId: uuid10("user_id").notNull(),
  provider: text7("provider").notNull(),
  providerUserId: text7("provider_user_id").notNull(),
  providerEmail: text7("provider_email").notNull(),
  linkedAt: timestamp9("linked_at", {
    withTimezone: true
  }).default(drizzleSql22`(now() AT TIME ZONE 'utc')`).notNull(),
  missingFields: text7("missing_fields")
}, (t) => [
  primaryKey13({
    name: "oauth_account_pkey",
    columns: [
      t.id
    ]
  }),
  unique5("oauth_account_provider_user_unique").on(t.provider, t.providerUserId),
  foreignKey12({
    name: "oauth_account_user_id_fkey",
    columns: [
      t.userId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  ...oauthAccountPolicies(t)
]);
var oauthAccountRelations = relations13(oauthAccount, ({ one }) => ({
  user: one(user, {
    fields: [
      oauthAccount.userId
    ],
    references: [
      user.id
    ]
  })
}));

// ../../src/infrastructure/db/schema/drizzle/identity/user/policies.ts
import { sql as drizzleSql23 } from "drizzle-orm";
import { pgPolicy as pgPolicy13 } from "drizzle-orm/pg-core";
var currentUserId4 = drizzleSql23`"identity"."current_user_id"()`;
function userPolicies(table) {
  return [
    // Lets an authenticated user read their own profile.
    pgPolicy13("Enable read access for auth users on own profile", {
      for: "select",
      to: authenticatedRole,
      using: drizzleSql23`${currentUserId4} = ${table.id}`
    }),
    // Lets a message receiver read the profile of a sender in their inbox.
    pgPolicy13("Allow user to view senders in their messages", {
      for: "select",
      to: authenticatedRole,
      using: drizzleSql23`exists (select 1 from "messages"."message" m where m."sender_id" = ${table.id} and m."receiver_id" = ${currentUserId4})`
    }),
    // Lets an authenticated user create only their own profile row.
    pgPolicy13("Enable insert for auth users on own profile", {
      for: "insert",
      to: authenticatedRole,
      withCheck: drizzleSql23`${currentUserId4} = ${table.id}`
    }),
    // Preserves the legacy public self-registration policy for compatibility.
    pgPolicy13("Enable insert for public users on own profile", {
      for: "insert",
      to: "public",
      withCheck: drizzleSql23`${currentUserId4} = ${table.id}`
    }),
    // Lets an authenticated user update only their own profile.
    pgPolicy13("Enable update for auth users on own profile", {
      for: "update",
      to: authenticatedRole,
      using: drizzleSql23`${currentUserId4} = ${table.id}`,
      withCheck: drizzleSql23`${currentUserId4} = ${table.id}`
    }),
    // Lets an authenticated user delete only their own profile.
    pgPolicy13("Enable delete for auth users on own profile", {
      for: "delete",
      to: authenticatedRole,
      using: drizzleSql23`${currentUserId4} = ${table.id}`
    })
  ];
}
__name(userPolicies, "userPolicies");

// ../../src/infrastructure/db/schema/drizzle/identity/user/table.ts
var user = identitySchema.table("user", {
  username: text8("username").notNull(),
  email: text8("email").notNull(),
  name: text8("name").notNull(),
  gender: text8("gender").default("Unknown").notNull(),
  createdAt: timestamp10("created_at", {
    withTimezone: true
  }).default(drizzleSql24`(now() AT TIME ZONE 'utc')`).notNull(),
  updatedAt: timestamp10("updated_at", {
    withTimezone: true
  }).default(drizzleSql24`(now() AT TIME ZONE 'utc')`).notNull(),
  profilePicPath: text8("profile_pic_path"),
  id: uuid11("id").defaultRandom().notNull(),
  pushToken: text8("push_token"),
  passwordHash: text8("password_hash"),
  role: text8("role").default("User").notNull(),
  tokenVersion: bigint11("token_version", {
    mode: "number"
  }).default(0).notNull(),
  isVerified: boolean6("is_verified").default(false).notNull(),
  authProvider: text8("auth_provider").default("app").notNull(),
  lastLogin: timestamp10("last_login", {
    withTimezone: true
  })
}, (t) => [
  primaryKey14({
    name: "user_pkey",
    columns: [
      t.id
    ]
  }),
  uniqueIndex4("user_email_ci_unique").on(drizzleSql24`lower(trim(both from ${t.email}))`),
  uniqueIndex4("user_username_ci_unique").on(drizzleSql24`lower(trim(both from ${t.username}))`),
  ...userPolicies(t)
]);
var userRelations = relations14(user, ({ many, one }) => ({
  oauthAccounts: many(oauthAccount),
  ownedWorkoutPlans: many(workoutPlan, {
    relationName: "workoutPlanOwner"
  }),
  trainedWorkoutPlans: many(workoutPlan, {
    relationName: "workoutPlanTrainer"
  }),
  workoutSummaries: many(workoutSummary),
  aerobicTrackings: many(aerobicTracking),
  reminderSettings: one(userReminderSetting),
  splitInformation: many(userSplitInformation),
  sentMessages: many(message, {
    relationName: "messageSender"
  }),
  receivedMessages: many(message, {
    relationName: "messageReceiver"
  })
}));

// ../../src/infrastructure/db/schema/drizzle/workout/views/exercise-to-workoutsplit-expanded.view.ts
import { bigint as bigint12, boolean as boolean7, text as text9, timestamp as timestamp11 } from "drizzle-orm/pg-core";
import { sql as drizzleSql25 } from "drizzle-orm";
import { integer as integer6 } from "drizzle-orm/pg-core";
var exerciseToWorkoutSplitSetExpandedView = workoutSchema.view("v_exercise_to_workout_split_set_expanded", {
  id: bigint12("id", {
    mode: "number"
  }),
  workoutSplitId: bigint12("workout_split_id", {
    mode: "number"
  }),
  workoutId: bigint12("workout_id", {
    mode: "number"
  }),
  exerciseId: bigint12("exercise_id", {
    mode: "number"
  }),
  exercise: text9("exercise"),
  workoutSplit: text9("workout_split"),
  reps: integer6("reps"),
  orderIndex: bigint12("order_index", {
    mode: "number"
  }),
  setIndex: integer6("set_index"),
  createdAt: timestamp11("created_at", {
    withTimezone: true
  }),
  isActive: boolean7("is_active")
}).with({
  securityInvoker: true
}).as(drizzleSql25`
    SELECT
      ews.id,
      ews.workout_split_id,
      ws.workout_id,
      ews.exercise_id,
      ex.name AS exercise,
      ws.name AS workout_split,
      workout_set.reps AS reps,
      workout_set.order_index AS set_index,
      ews.order_index,
      ews.created_at,
      ews.is_active
    FROM
      workout.exercise_to_workout_split ews
      JOIN workout.workout_split ws ON ws.id = ews.workout_split_id
      JOIN workout.exercise ex ON ex.id = ews.exercise_id
      LEFT JOIN workout.workout_set workout_set ON workout_set.exercise_to_split_id = ews.id
    GROUP BY
      ews.id,
      ews.workout_split_id,
      ws.workout_id,
      ews.exercise_id,
      ex.name,
      ws.name,
      workout_set.reps,
      workout_set.order_index,
      ews.order_index,
      ews.created_at,
      ews.is_active
  `);

// ../../src/infrastructure/db/schema/drizzle/analytics/views/exercise-tracking-expanded.view.ts
import { sql as drizzleSql26 } from "drizzle-orm";
import { bigint as bigint13, boolean as boolean8, real as real2, text as text10, timestamp as timestamp12, uuid as uuid12 } from "drizzle-orm/pg-core";
import { integer as integer7 } from "drizzle-orm/pg-core";
var exerciseTrackingSetExpandedView = analyticsSchema.view("v_exercise_tracking_set_expanded", {
  id: bigint13("id", {
    mode: "number"
  }),
  exerciseToSplitId: bigint13("exercise_to_split_id", {
    mode: "number"
  }),
  weight: real2("weight"),
  reps: bigint13("reps", {
    mode: "number"
  }),
  orderIndex: integer7("order_index"),
  setIndex: integer7("set_index"),
  exerciseId: bigint13("exercise_id", {
    mode: "number"
  }),
  workoutSplitId: bigint13("workout_split_id", {
    mode: "number"
  }),
  splitName: text10("split_name"),
  exercise: text10("exercise"),
  targetMuscle: text10("target_muscle"),
  specificTargetMuscle: text10("specific_target_muscle"),
  notes: text10("notes"),
  workoutSummaryId: uuid12("workout_summary_id"),
  workoutStartUtc: timestamp12("workout_start_utc", {
    withTimezone: true
  }),
  workoutEndUtc: timestamp12("workout_end_utc", {
    withTimezone: true
  }),
  isAssignedToSplit: boolean8("is_assigned_to_split")
}).with({
  securityInvoker: true
}).as(drizzleSql26`
    SELECT
      et.id,
      et.exercise_to_split_id,
      tracking_set.weight AS weight,
      tracking_set.reps AS reps,
      ews.order_index AS order_index,
      tracking_set.set_index AS set_index,
      COALESCE(ews.exercise_id, et.exercise_id) AS exercise_id,
      wsumm.workout_split_id,
      ws.name AS split_name,
      ex.name AS exercise,
      ex.target_muscle AS target_muscle,
      ex.specific_target_muscle AS specific_target_muscle,
      et.notes,
      et.workout_summary_id,
      wsumm.workout_start_utc,
      wsumm.workout_end_utc,
      CASE
        WHEN et.exercise_to_split_id IS NOT NULL THEN TRUE
        WHEN et.exercise_id IS NOT NULL THEN FALSE
      END AS is_assigned_to_split
    FROM
      tracking.exercise_tracking et
      LEFT JOIN tracking.workout_summary wsumm ON wsumm.id = et.workout_summary_id
      LEFT JOIN workout.exercise_to_workout_split ews ON ews.id = et.exercise_to_split_id
      LEFT JOIN workout.workout_split ws ON ws.id = wsumm.workout_split_id
      LEFT JOIN workout.exercise ex ON ex.id = COALESCE(ews.exercise_id, et.exercise_id)
      LEFT JOIN tracking.tracking_set tracking_set ON tracking_set.exercise_tracking_id = et.id
  `);

// ../../src/infrastructure/db/schema/drizzle/analytics/views/prs.view.ts
import { sql as drizzleSql27 } from "drizzle-orm";
import { bigint as bigint14, real as real3, text as text11, timestamp as timestamp13, uuid as uuid13 } from "drizzle-orm/pg-core";
import { integer as integer8 } from "drizzle-orm/pg-core";
var prsView = analyticsSchema.view("v_prs", {
  id: bigint14("id", {
    mode: "number"
  }),
  exerciseToSplitId: bigint14("exercise_to_split_id", {
    mode: "number"
  }),
  exerciseId: bigint14("exercise_id", {
    mode: "number"
  }),
  exercise: text11("exercise"),
  setIndex: integer8("set_index"),
  weight: real3("weight"),
  reps: bigint14("reps", {
    mode: "number"
  }),
  workoutSummaryId: uuid13("workout_summary_id"),
  workoutStartUtc: timestamp13("workout_start_utc", {
    withTimezone: true
  }),
  workoutEndUtc: timestamp13("workout_end_utc", {
    withTimezone: true
  })
}).with({
  securityInvoker: true
}).as(drizzleSql27`
    SELECT DISTINCT
      ON (et.exercise_id) et.id,
      et.exercise_to_split_id,
      et.exercise_id,
      et.exercise,
      et.set_index,
      et.weight,
      et.reps,
      et.workout_summary_id,
      et.workout_start_utc,
      et.workout_end_utc
    FROM
      analytics.v_exercise_tracking_set_expanded et
    ORDER BY
      et.exercise_id,
      et.weight DESC,
      et.reps DESC,
      et.workout_start_utc DESC,
      et.id DESC
  `);

// src/database/database.schemas.ts
var userDbSchema = createSelectSchema(user);
var userInsertDbSchema = createInsertSchema(user);
var userUpdateDbSchema = createUpdateSchema(user);
var oauthAccountDbSchema = createSelectSchema(oauthAccount);
var exerciseDbSchema = createSelectSchema(exercise);
var workoutPlanDbSchema = createSelectSchema(workoutPlan);
var workoutSplitDbSchema = createSelectSchema(workoutSplit);
var exerciseToWorkoutSplitDbSchema = createSelectSchema(exerciseToWorkoutSplit);
var exerciseToWorkoutSplitSetExpandedViewDbSchema = createSelectSchema(exerciseToWorkoutSplitSetExpandedView);
var workoutSetDbSchema = createSelectSchema(workoutSet);
var workoutSummaryDbSchema = createSelectSchema(workoutSummary);
var exerciseTrackingDbSchema = createSelectSchema(exerciseTracking);
var trackingSetDbSchema = createSelectSchema(trackingSet);
var aerobicTrackingDbSchema = createSelectSchema(aerobicTracking);
var messageDbSchema = createSelectSchema(message);
var userReminderSettingDbSchema = createSelectSchema(userReminderSetting);
var userSplitInformationDbSchema = createSelectSchema(userSplitInformation);
var exerciseTrackingSetExpandedViewDbSchema = createSelectSchema(exerciseTrackingSetExpandedView);
var prsViewDbSchema = createSelectSchema(prsView);

// src/modules/aerobics/aerobics.contracts.ts
import { z as z3 } from "zod/v4";

// src/modules/aerobics/aerobics.dtos.ts
import { z as z2 } from "zod/v4";
var addAerobicInputQueryDtoSchema = z2.object({
  durationMins: z2.number(),
  durationSec: aerobicTrackingDbSchema.shape.durationSec,
  type: aerobicTrackingDbSchema.shape.type
});
var aerobicsDailyRecordQueryDtoSchema = z2.object({
  type: aerobicTrackingDbSchema.shape.type,
  durationSec: aerobicTrackingDbSchema.shape.durationSec,
  durationMins: aerobicTrackingDbSchema.shape.durationSec
});
var aerobicsWeeklyRecordQueryDtoSchema = aerobicsDailyRecordQueryDtoSchema.extend({
  workoutTimeUtc: serializedDateSchema
});
var weeklyDataQueryDtoSchema = z2.object({
  records: z2.array(aerobicsWeeklyRecordQueryDtoSchema),
  totalDurationSec: z2.number(),
  totalDurationMins: z2.number()
});
var userAerobicsQueryDtoSchema = z2.object({
  daily: z2.record(z2.string(), z2.array(aerobicsDailyRecordQueryDtoSchema)),
  weekly: z2.record(z2.string(), weeklyDataQueryDtoSchema)
});
var userAerobicsRowQueryDtoSchema = z2.object({
  data: userAerobicsQueryDtoSchema
});

// src/modules/aerobics/aerobics.contracts.ts
var addAerobicsRequestSchema = z3.object({
  body: z3.object({
    tz: z3.string(),
    record: addAerobicInputQueryDtoSchema
  })
});
var addUserAerobicsContract = {
  request: addAerobicsRequestSchema
};
var getAerobicsRequestSchema = z3.object({
  query: z3.object({
    tz: z3.string().optional()
  })
});
var userAerobicsResponseSchema = userAerobicsQueryDtoSchema;
var getUserAerobicsContract = {
  request: getAerobicsRequestSchema,
  response: userAerobicsResponseSchema
};

// src/modules/analytics/analytics.contracts.ts
import { z as z5 } from "zod/v4";

// src/modules/analytics/analytics.dtos.ts
import { z as z4 } from "zod/v4";
var workoutRmRecordQueryDtoSchema = z4.object({
  exercise: exerciseDbSchema.shape.name,
  prWeight: trackingSetDbSchema.shape.weight.nullable(),
  prReps: trackingSetDbSchema.shape.reps.nullable(),
  max1Rm: z4.number()
});
var adherenceExerciseStatsQueryDtoSchema = z4.object({
  planned: z4.number(),
  actual: z4.number(),
  adherencePct: z4.number().nullable()
});
var workoutRmsQueryDtoSchema = z4.record(z4.string(), workoutRmRecordQueryDtoSchema);
var workoutRmsRowQueryDtoSchema = z4.object({
  result: workoutRmsQueryDtoSchema
});
var goalAdherenceQueryDtoSchema = z4.record(z4.string(), z4.record(z4.string(), adherenceExerciseStatsQueryDtoSchema));
var goalAdherenceRowQueryDtoSchema = z4.object({
  result: goalAdherenceQueryDtoSchema
});

// src/modules/analytics/analytics.contracts.ts
var getAnalyticsResponseSchema = z5.object({
  oneRepMaxes: z5.record(z5.string(), workoutRmRecordQueryDtoSchema),
  goals: z5.record(z5.string(), z5.record(z5.string(), adherenceExerciseStatsQueryDtoSchema))
});
var getAnalyticsContract = {
  response: getAnalyticsResponseSchema
};

// src/modules/auth/password/password.contracts.ts
import { z as z6 } from "zod/v4";
var sendChangePassEmailRequestSchema = z6.object({
  body: z6.object({
    identifier: z6.string()
  })
});
var sendChangePassEmailContract = {
  request: sendChangePassEmailRequestSchema
};
var resetPasswordRequestSchema = z6.object({
  body: z6.object({
    newPassword: z6.string().min(8, "Password must be at least 8 characters long")
  }),
  query: z6.object({
    token: z6.string().optional()
  })
});
var resetPasswordResponseSchema = z6.object({
  ok: z6.boolean()
});
var resetPasswordContract = {
  request: resetPasswordRequestSchema,
  response: resetPasswordResponseSchema
};

// src/modules/auth/password/password.dtos.ts
import { z as z7 } from "zod/v4";
var forgotPasswordPayloadDtoSchema = z7.object({
  sub: userDbSchema.shape.id,
  jti: z7.string(),
  exp: z7.number(),
  iss: z7.string(),
  typ: z7.string()
});

// src/modules/auth/session/session.contracts.ts
import { z as z8 } from "zod/v4";
var loginRequestSchema = z8.object({
  body: z8.object({
    identifier: z8.string().min(3).refine((value) => z8.string().email().safeParse(value).success || /^[a-zA-Z0-9_]{3,20}$/.test(value), {
      message: "Must be a valid email or username"
    }),
    password: z8.string().min(1, "Username and password are required")
  })
});
var loginResponseSchema = z8.object({
  message: z8.string(),
  user: userDbSchema.shape.id,
  accessToken: z8.string(),
  refreshToken: z8.string()
});
var loginContract = {
  request: loginRequestSchema,
  response: loginResponseSchema
};
var refreshTokenResponseSchema = z8.object({
  message: z8.string(),
  accessToken: z8.string(),
  refreshToken: z8.string(),
  userId: userDbSchema.shape.id
});
var refreshTokenContract = {
  response: refreshTokenResponseSchema
};
var logoutResponseSchema = z8.object({
  message: z8.string()
});
var logoutContract = {
  response: logoutResponseSchema
};

// src/modules/auth/session/session.dtos.ts
import { z as z10 } from "zod/v4";

// src/modules/user/update/update.dtos.ts
import { z as z9 } from "zod/v4";
var authenticatedUserForUpdateQueryDtoSchema = z9.object({
  username: userDbSchema.shape.username.trim().min(3, "Username must be at least 3 characters").max(15, "Username must be at most 15 characters").regex(/^[a-zA-Z0-9_]+$/, "Username may contain letters, numbers, and underscore only"),
  fullName: userDbSchema.shape.name.trim().min(1, "Full name is required").max(20, "Full name is too long").regex(/^[a-zA-Z\s]+$/, "Full name may contain letters and spaces only"),
  email: userDbSchema.shape.email.trim().toLowerCase().email("Invalid email format")
}).partial();
var userDataQueryDtoSchema = z9.object({
  id: userDbSchema.shape.id,
  username: userDbSchema.shape.username,
  email: userDbSchema.shape.email,
  name: userDbSchema.shape.name,
  gender: userDbSchema.shape.gender,
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  profilePicPath: userDbSchema.shape.profilePicPath,
  pushToken: userDbSchema.shape.pushToken,
  role: userDbSchema.shape.role,
  isFirstLogin: z9.boolean(),
  tokenVersion: userDbSchema.shape.tokenVersion,
  isVerified: userDbSchema.shape.isVerified,
  authProvider: userDbSchema.shape.authProvider,
  lastLogin: serializedDateSchema.nullable()
});
var userDataRowQueryDtoSchema = z9.object({
  userData: userDataQueryDtoSchema
});
var userConflictQueryDtoSchema = z9.object({
  conflict: z9.boolean()
});
var userMessageIdentityQueryDtoSchema = z9.object({
  id: userDbSchema.shape.id,
  username: userDbSchema.shape.username,
  name: userDbSchema.shape.name,
  profilePicPath: userDbSchema.shape.profilePicPath
});
var userProfilePicQueryDtoSchema = z9.object({
  profilePicPath: userDbSchema.shape.profilePicPath
});
var changeEmailTokenPayloadDtoSchema = z9.object({
  jti: z9.string(),
  sub: z9.string(),
  newEmail: z9.string(),
  exp: z9.number(),
  iss: z9.string(),
  typ: z9.string()
});

// src/modules/auth/session/session.dtos.ts
var accessTokenPayloadDtoSchema = z10.object({
  id: userDbSchema.shape.id,
  role: userDbSchema.shape.role,
  tokenVer: userDbSchema.shape.tokenVersion,
  cnf: z10.object({
    jkt: z10.string()
  }).optional(),
  iat: z10.number().optional(),
  exp: z10.number().optional()
});
var userAfterBumpQueryDtoSchema = z10.object({
  tokenVersion: userDbSchema.shape.tokenVersion,
  userData: userDataQueryDtoSchema
});
var tokenVersionQueryDtoSchema = z10.object({
  tokenVersion: userDbSchema.shape.tokenVersion
});
var lastLoginQueryDtoSchema = z10.object({
  lastLogin: z10.date().nullable()
});

// src/modules/auth/verification/verification.contracts.ts
import { z as z11 } from "zod/v4";
var verifyAccountRequestSchema = z11.object({
  query: z11.object({
    token: z11.string().optional()
  })
});
var verifyUserAccountContract = {
  request: verifyAccountRequestSchema
};
var sendVerificationMailRequestSchema = z11.object({
  body: z11.object({
    email: userDbSchema.shape.email.trim().email("Invalid email")
  })
});
var sendVerificationMailContract = {
  request: sendVerificationMailRequestSchema
};
var changeEmailAndVerifyRequestSchema = z11.object({
  body: z11.object({
    username: userDbSchema.shape.username,
    password: z11.string(),
    newEmail: userDbSchema.shape.email.trim().email("Invalid email")
  })
});
var changeEmailAndVerifyContract = {
  request: changeEmailAndVerifyRequestSchema
};
var checkUserVerifyRequestSchema = z11.object({
  query: z11.object({
    username: userDbSchema.shape.username
  })
});
var checkUserVerifyContract = {
  request: checkUserVerifyRequestSchema
};

// src/modules/auth/verification/verification.dtos.ts
import { z as z12 } from "zod/v4";
var emailVerifyPayloadDtoSchema = z12.object({
  sub: userDbSchema.shape.id,
  jti: z12.string(),
  exp: z12.number(),
  iss: z12.string(),
  typ: z12.string()
});

// src/modules/auth/auth.dtos.ts
import { z as z13 } from "zod/v4";
var userByIdentifierQueryDtoSchema = z13.object({
  id: userDbSchema.shape.id,
  name: userDbSchema.shape.name,
  username: userDbSchema.shape.username,
  email: userDbSchema.shape.email.optional(),
  passwordHash: userDbSchema.shape.passwordHash,
  role: userDbSchema.shape.role,
  isVerified: userDbSchema.shape.isVerified,
  lastLogin: serializedDateSchema.nullable().optional()
});
var userByIdentifierRawQueryDtoSchema = userByIdentifierQueryDtoSchema.omit({
  isVerified: true,
  lastLogin: true,
  passwordHash: true
}).extend({
  password_hash: userDbSchema.shape.passwordHash,
  is_verified: z13.boolean(),
  last_login: serializedDateSchema.nullable()
});
var userByIdentifierRowQueryDtoSchema = z13.object({
  userData: userByIdentifierRawQueryDtoSchema.nullable()
});
var userByUsernameRawQueryDtoSchema = userByIdentifierQueryDtoSchema.omit({
  isVerified: true,
  passwordHash: true
}).extend({
  password_hash: userDbSchema.shape.passwordHash,
  is_verified: z13.boolean()
});
var userByUsernameRowQueryDtoSchema = z13.object({
  userData: userByUsernameRawQueryDtoSchema.nullable()
});

// src/modules/bootstrap/bootstrap.contracts.ts
import { z as z19 } from "zod/v4";

// src/modules/messages/messages.contracts.ts
import { z as z15 } from "zod/v4";

// src/modules/messages/messages.dtos.ts
import { z as z14 } from "zod/v4";
var allUserMessageQueryDtoSchema = z14.object({
  id: messageDbSchema.shape.id,
  subject: messageDbSchema.shape.subject,
  msg: messageDbSchema.shape.msg,
  sentAt: serializedDateSchema,
  isRead: messageDbSchema.shape.isRead,
  senderFullName: userDbSchema.shape.name,
  senderProfilePicPath: userDbSchema.shape.profilePicPath
});
var messageAsReadQueryDtoSchema = z14.object({
  id: messageDbSchema.shape.id,
  isRead: messageDbSchema.shape.isRead
});
var deletedMessageQueryDtoSchema = z14.object({
  id: messageDbSchema.shape.id
});
var messageAfterSendQueryDtoSchema = z14.object({
  id: messageDbSchema.shape.id,
  senderId: messageDbSchema.shape.senderId,
  receiverId: messageDbSchema.shape.receiverId,
  subject: messageDbSchema.shape.subject,
  msg: messageDbSchema.shape.msg,
  sentAt: serializedDateSchema,
  isRead: messageDbSchema.shape.isRead,
  senderUsername: userDbSchema.shape.username,
  senderFullName: userDbSchema.shape.name,
  senderProfilePicPath: userDbSchema.shape.profilePicPath,
  senderGender: userDbSchema.shape.gender
});

// src/modules/messages/messages.contracts.ts
var getAllMessagesRequestSchema = z15.object({
  query: z15.object({
    tz: z15.string()
  })
});
var getAllUserMessagesResponseSchema = z15.object({
  messages: z15.array(allUserMessageQueryDtoSchema)
});
var getAllUserMessagesContract = {
  request: getAllMessagesRequestSchema,
  response: getAllUserMessagesResponseSchema
};
var markMessageAsReadRequestSchema = z15.object({
  params: z15.object({
    id: messageDbSchema.shape.id
  })
});
var markMessageAsReadResponseSchema = messageAsReadQueryDtoSchema;
var markMessageAsReadContract = {
  request: markMessageAsReadRequestSchema,
  response: markMessageAsReadResponseSchema
};
var deleteMessageRequestSchema = z15.object({
  params: z15.object({
    id: messageDbSchema.shape.id
  })
});
var deleteMessageResponseSchema = deletedMessageQueryDtoSchema;
var deleteMessageContract = {
  request: deleteMessageRequestSchema,
  response: deleteMessageResponseSchema
};

// src/modules/workout/plan/plan.contracts.ts
import { z as z17 } from "zod/v4";

// src/modules/workout/plan/plan.dtos.ts
import { z as z16 } from "zod/v4";
var workoutExerciseInputQueryDtoSchema = z16.object({
  exerciseId: exerciseDbSchema.shape.id,
  sets: z16.array(workoutSetDbSchema.shape.reps),
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex
});
var workoutSplitInputBaseQueryDtoSchema = z16.object({
  name: workoutSplitDbSchema.shape.name.min(1, "Split name is required"),
  orderIndex: z16.number().int().nonnegative(),
  exercises: z16.array(workoutExerciseInputQueryDtoSchema).min(1, "Each split must include at least one exercise")
});
var saveWorkoutSplitInputQueryDtoSchema = workoutSplitInputBaseQueryDtoSchema.extend({
  id: workoutSplitDbSchema.shape.id.optional()
});
var saveWorkoutSplitPayloadQueryDtoSchema = z16.array(saveWorkoutSplitInputQueryDtoSchema).min(1, "Workout must include at least one split");
var exerciseInPlanQueryDtoSchema = z16.object({
  exerciseToSplitId: exerciseToWorkoutSplitDbSchema.shape.id,
  exerciseId: exerciseDbSchema.shape.id,
  name: exerciseDbSchema.shape.name,
  sets: z16.array(z16.object({
    orderIndex: workoutSetDbSchema.shape.orderIndex,
    reps: workoutSetDbSchema.shape.reps
  })),
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
  isActive: exerciseToWorkoutSplitDbSchema.shape.isActive,
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var workoutSplitQueryDtoSchema = z16.object({
  id: workoutSplitDbSchema.shape.id,
  workoutId: workoutSplitDbSchema.shape.workoutId,
  name: workoutSplitDbSchema.shape.name,
  orderIndex: workoutSplitDbSchema.shape.orderIndex,
  createdAt: serializedDateSchema,
  muscleGroup: z16.string().nullable(),
  isActive: workoutSplitDbSchema.shape.isActive,
  exercises: z16.array(exerciseInPlanQueryDtoSchema)
});
var wholeUserWorkoutPlanQueryDtoSchema = z16.object({
  id: workoutPlanDbSchema.shape.id,
  numberOfSplits: z16.number(),
  createdAt: serializedDateSchema,
  userId: userDbSchema.shape.id,
  isActive: workoutPlanDbSchema.shape.isActive,
  updatedAt: serializedDateSchema,
  workoutSplits: z16.array(workoutSplitQueryDtoSchema).nullable()
});
var workoutPlanIdQueryDtoSchema = z16.object({
  id: workoutPlanDbSchema.shape.id
});
var workoutSplitIdQueryDtoSchema = z16.object({
  id: workoutSplitDbSchema.shape.id
});
var exerciseAssignmentIdQueryDtoSchema = z16.object({
  id: exerciseToWorkoutSplitDbSchema.shape.id
});

// src/modules/workout/plan/plan.contracts.ts
var getWholeWorkoutPlanRequestSchema = z17.object({
  query: z17.object({
    tz: z17.string().optional()
  })
});
var getWholeUserWorkoutPlanResponseSchema = z17.object({
  workoutPlan: wholeUserWorkoutPlanQueryDtoSchema.nullable()
});
var getWholeUserWorkoutPlanContract = {
  request: getWholeWorkoutPlanRequestSchema,
  response: getWholeUserWorkoutPlanResponseSchema
};
var workoutMutationResponseSchema = z17.object({
  message: z17.string(),
  workoutPlan: wholeUserWorkoutPlanQueryDtoSchema
});
var addWorkoutRequestSchema = z17.object({
  body: z17.object({
    workoutData: saveWorkoutSplitPayloadQueryDtoSchema,
    workoutName: z17.string().optional(),
    tz: z17.string()
  })
});
var addWorkoutResponseSchema = workoutMutationResponseSchema;
var addWorkoutContract = {
  request: addWorkoutRequestSchema,
  response: addWorkoutResponseSchema
};

// src/modules/workout/tracking/tracking.dtos.ts
import { z as z18 } from "zod/v4";
var trackedSetQueryDtoSchema = z18.object({
  reps: trackingSetDbSchema.shape.reps,
  weight: trackingSetDbSchema.shape.weight,
  setIndex: trackingSetDbSchema.shape.setIndex
});
var finishedWorkoutEntryBaseQueryDtoSchema = z18.object({
  trackedSets: z18.array(trackedSetQueryDtoSchema),
  notes: exerciseTrackingDbSchema.shape.notes.optional()
});
var finishedWorkoutEntryQueryDtoSchema = finishedWorkoutEntryBaseQueryDtoSchema.extend({
  isExerciseAssignedToSplit: z18.boolean(),
  exerciseToSplitId: exerciseTrackingDbSchema.shape.exerciseToSplitId,
  exerciseId: exerciseTrackingDbSchema.shape.exerciseId
});
var exerciseMetadataQueryDtoSchema = z18.object({
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var exerciseTrackingPrMaxQueryDtoSchema = z18.object({
  exercise: exerciseDbSchema.shape.name,
  weight: trackingSetDbSchema.shape.weight,
  reps: trackingSetDbSchema.shape.reps,
  workoutTimeUtc: serializedDateSchema
});
var exerciseTrackingAnalysisQueryDtoSchema = z18.object({
  uniqueDays: z18.number(),
  mostFrequentSplit: z18.string().nullable(),
  mostFrequentSplitDays: z18.number().nullable(),
  lastWorkoutDate: z18.string().nullable(),
  splitDaysByName: z18.record(z18.string(), z18.number()),
  prs: z18.object({
    prMax: exerciseTrackingPrMaxQueryDtoSchema.nullable()
  })
});
var trackingMapItemQueryDtoSchema = z18.object({
  id: exerciseTrackingDbSchema.shape.id,
  exerciseToSplitId: exerciseToWorkoutSplitDbSchema.shape.id,
  weight: z18.array(trackingSetDbSchema.shape.weight),
  reps: z18.array(trackingSetDbSchema.shape.reps),
  notes: exerciseTrackingDbSchema.shape.notes,
  exerciseId: exerciseDbSchema.shape.id,
  workoutSplitId: workoutSplitDbSchema.shape.id,
  splitName: workoutSplitDbSchema.shape.name,
  exercise: exerciseDbSchema.shape.name,
  workoutDate: serializedDateSchema,
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
  exerciseToWorkoutSplit: z18.object({
    sets: z18.array(workoutSetDbSchema.shape.reps),
    exercises: exerciseMetadataQueryDtoSchema
  })
});
var trackingByDateItemQueryDtoSchema = trackingMapItemQueryDtoSchema.omit({
  workoutDate: true
});
var trackingBySplitNameItemQueryDtoSchema = trackingMapItemQueryDtoSchema.omit({
  splitName: true
});
var groupedTrackingItemQueryDtoSchema = z18.object({
  exerciseTracking: z18.object({
    exerciseTrackingId: exerciseTrackingDbSchema.shape.id,
    sets: z18.array(z18.object({
      setIndex: trackingSetDbSchema.shape.setIndex,
      weight: trackingSetDbSchema.shape.weight,
      reps: trackingSetDbSchema.shape.reps
    })),
    notes: exerciseTrackingDbSchema.shape.notes,
    exerciseAssignment: z18.object({
      exerciseToSplitId: exerciseTrackingDbSchema.shape.exerciseToSplitId,
      orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex.nullable(),
      exerciseId: exerciseDbSchema.shape.id,
      workoutSplitId: workoutSplitDbSchema.shape.id,
      workoutSplitName: workoutSplitDbSchema.shape.name,
      exerciseName: exerciseDbSchema.shape.name,
      targetMuscle: exerciseDbSchema.shape.targetMuscle,
      specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
    })
  })
});
var exerciseTrackingStatsQueryDtoSchema = z18.object({
  workoutCount: z18.coerce.number(),
  hasExerciseTracking: z18.boolean(),
  nextWorkoutSplit: z18.object({
    id: workoutSplitDbSchema.shape.id,
    name: workoutSplitDbSchema.shape.name,
    orderIndex: workoutSplitDbSchema.shape.orderIndex,
    muscleGroup: z18.string().nullable()
  }).nullable(),
  workoutTargets: z18.object({
    workoutCountThisWeek: z18.coerce.number(),
    workoutCountScheduledPerWeek: z18.coerce.number(),
    weekStreak: z18.coerce.number()
  }),
  lastWorkoutStats: z18.object({
    workoutDate: z18.string().nullable(),
    workoutSplitName: workoutSplitDbSchema.shape.name.nullable(),
    exerciseTrackedCount: z18.coerce.number().nullable(),
    setTrackedCount: z18.coerce.number().nullable()
  }),
  prs: z18.array(z18.object({
    exerciseToSplitId: exerciseTrackingDbSchema.shape.exerciseToSplitId,
    exerciseId: exerciseDbSchema.shape.id,
    exerciseName: exerciseDbSchema.shape.name,
    prWeight: trackingSetDbSchema.shape.weight,
    prReps: trackingSetDbSchema.shape.reps,
    prSetIndex: trackingSetDbSchema.shape.setIndex,
    estimatedOneRepMax: z18.number().nullable()
  }))
});
var exerciseTrackingMapsQueryDtoSchema = z18.object({
  byDate: z18.record(z18.string(), z18.array(groupedTrackingItemQueryDtoSchema)),
  byExerciseToSplitId: z18.record(z18.string(), z18.array(groupedTrackingItemQueryDtoSchema)),
  bySplitName: z18.record(z18.string(), z18.array(groupedTrackingItemQueryDtoSchema))
});
var exerciseTrackingAndStatsQueryDtoSchema = z18.object({
  trackingStats: exerciseTrackingStatsQueryDtoSchema,
  trackingMaps: exerciseTrackingMapsQueryDtoSchema
});
var exerciseTrackingAndStatsRowQueryDtoSchema = z18.object({
  data: exerciseTrackingAndStatsQueryDtoSchema
});
var exerciseTrackingStatsRowQueryDtoSchema = z18.object({
  data: exerciseTrackingStatsQueryDtoSchema
});
var exerciseTrackingMapsRowQueryDtoSchema = z18.object({
  data: exerciseTrackingMapsQueryDtoSchema
});
var workoutSplitLookupQueryDtoSchema = z18.object({
  workoutSplitId: workoutSplitDbSchema.shape.id
});
var workoutSummaryIdQueryDtoSchema = z18.object({
  id: z18.string().uuid()
});
var exerciseTrackingIdQueryDtoSchema = z18.object({
  id: exerciseTrackingDbSchema.shape.id
});

// src/modules/bootstrap/bootstrap.contracts.ts
var bootstrapRequestSchema = z19.object({
  query: z19.object({
    tz: z19.string().optional()
  })
});
var bootstrapResponseSchema = z19.object({
  user: userDataQueryDtoSchema,
  workout: getWholeUserWorkoutPlanResponseSchema,
  tracking: exerciseTrackingAndStatsQueryDtoSchema,
  messages: getAllUserMessagesResponseSchema,
  aerobics: userAerobicsResponseSchema
});
var bootstrapContract = {
  request: bootstrapRequestSchema,
  response: bootstrapResponseSchema
};

// src/modules/exercises/exercises.dtos.ts
import { z as z20 } from "zod/v4";
var getAllExercisesExerciseQueryDtoSchema = z20.object({
  id: exerciseDbSchema.shape.id,
  name: exerciseDbSchema.shape.name,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var exercisesMapByMuscleQueryDtoSchema = z20.record(z20.string(), z20.array(getAllExercisesExerciseQueryDtoSchema));
var exerciseMapByMuscleRowQueryDtoSchema = z20.object({
  result: z20.object({
    map: exercisesMapByMuscleQueryDtoSchema.nullable()
  }).nullable()
});

// src/modules/exercises/exercises.contracts.ts
var getAllExercisesResponseSchema = exercisesMapByMuscleQueryDtoSchema;
var getAllExercisesContract = {
  response: getAllExercisesResponseSchema
};

// src/modules/oauth/apple/apple.contracts.ts
import { z as z21 } from "zod/v4";
var appleNameInputSchema = z21.object({
  givenName: z21.string().nullable(),
  familyName: z21.string().nullable()
});
var appleOAuthRequestSchema = z21.object({
  body: z21.object({
    idToken: z21.string({
      error: "Missing or invalid Apple identityToken"
    }),
    rawNonce: z21.string(),
    name: appleNameInputSchema.optional(),
    email: userDbSchema.shape.email.email().nullable()
  })
});
var appleOAuthContract = {
  request: appleOAuthRequestSchema
};

// src/modules/oauth/apple/apple.dtos.ts
import { z as z22 } from "zod/v4";
var appleTokenVerificationResultDtoSchema = z22.object({
  appleSub: z22.string(),
  email: userDbSchema.shape.email.nullable(),
  emailVerified: z22.boolean(),
  fullName: userDbSchema.shape.name
});

// src/modules/oauth/google/google.contracts.ts
import { z as z23 } from "zod/v4";
var googleOAuthRequestSchema = z23.object({
  body: z23.object({
    idToken: z23.string().optional()
  })
});
var googleOAuthContract = {
  request: googleOAuthRequestSchema
};

// src/modules/oauth/google/google.dtos.ts
import { z as z24 } from "zod/v4";
var googleTokenVerificationResultDtoSchema = z24.object({
  googleSub: z24.string(),
  email: userDbSchema.shape.email.nullable(),
  emailVerified: z24.boolean(),
  fullName: userDbSchema.shape.name
});

// src/modules/oauth/oauth.contracts.ts
import { z as z25 } from "zod/v4";
var oAuthLoginResponseSchema = z25.object({
  message: z25.string(),
  user: userDbSchema.shape.id,
  accessToken: z25.string(),
  refreshToken: z25.string(),
  missingFields: z25.array(z25.string()).nullable()
});
var proceedLoginResponseSchema = loginResponseSchema;
var oAuthLoginContract = {
  response: oAuthLoginResponseSchema
};

// src/modules/oauth/oauth.dtos.ts
import { z as z26 } from "zod/v4";
var oAuthLookupQueryDtoSchema = z26.object({
  userId: userDbSchema.shape.id.nullable(),
  missingFields: z26.string().nullable()
});
var oAuthLookupRawQueryDtoSchema = z26.object({
  user_id: userDbSchema.shape.id,
  missing_fields: z26.string().nullable()
});
var oAuthLookupRowQueryDtoSchema = z26.object({
  oauth_data: oAuthLookupRawQueryDtoSchema.nullable()
});
var oAuthLinkQueryDtoSchema = z26.object({
  userId: userDbSchema.shape.id.nullable()
});
var oAuthLinkRowQueryDtoSchema = z26.object({
  user_id: userDbSchema.shape.id.nullable()
});
var oAuthCreatedUserRowQueryDtoSchema = z26.object({
  user_id: userDbSchema.shape.id
});

// src/modules/push/push.dtos.ts
import { z as z27 } from "zod/v4";
var userWithNotificationsEnabledQueryDtoSchema = z27.object({
  pushToken: userDbSchema.shape.pushToken,
  name: userDbSchema.shape.name
});
var userToHourlyReminderQueryDtoSchema = z27.object({
  userId: userDbSchema.shape.id,
  name: userDbSchema.shape.name,
  pushToken: userDbSchema.shape.pushToken,
  reminderOffsetMinutes: z27.number(),
  splitId: workoutSplitDbSchema.shape.id,
  splitName: workoutSplitDbSchema.shape.name.nullable(),
  estimatedTimeUtc: z27.string()
});

// src/modules/user/create/create.contracts.ts
import { z as z29 } from "zod/v4";

// src/modules/user/create/create.dtos.ts
import { z as z28 } from "zod/v4";
var createdUserQueryDtoSchema = z28.object({
  id: userDbSchema.shape.id,
  username: userDbSchema.shape.username,
  name: userDbSchema.shape.name,
  email: userDbSchema.shape.email,
  gender: userDbSchema.shape.gender,
  role: userDbSchema.shape.role,
  createdAt: serializedDateSchema
});
var createdUserRawQueryDtoSchema = createdUserQueryDtoSchema.omit({
  createdAt: true
}).extend({
  created_at: serializedDateSchema
});
var createdUserRowQueryDtoSchema = z28.object({
  userData: createdUserRawQueryDtoSchema
});
var userExistsQueryDtoSchema = z28.object({
  id: userDbSchema.shape.id.nullable()
});

// src/modules/user/create/create.contracts.ts
var usernameSchema = userDbSchema.shape.username.trim().min(3, "Username must be at least 3 characters").max(15, "Username must be at most 15 characters").regex(/^[a-zA-Z0-9_]+$/, "Username may contain letters, numbers, and underscore only");
var fullNameSchema = userDbSchema.shape.name.trim().max(20, "Full name is too long").regex(/^[a-zA-Z\s]+$/, "Full name may contain letters and spaces only");
var createUserRequestSchema = z29.object({
  body: z29.object({
    username: usernameSchema,
    fullName: z29.preprocess((value) => value == null || typeof value === "string" && value.trim() === "" ? "User" : value, fullNameSchema),
    email: userDbSchema.shape.email.trim().toLowerCase().email("Invalid email format"),
    password: z29.string().min(8, "Password must be at least 8 characters long"),
    gender: z29.preprocess((value) => value === "" || value == null ? "Unknown" : value, z29.enum([
      "Male",
      "Female",
      "Other",
      "Unknown"
    ]))
  })
});
var createUserUserSchema = createdUserQueryDtoSchema;
var createUserResponseSchema = z29.object({
  message: z29.string(),
  user: createdUserQueryDtoSchema
});
var createUserContract = {
  request: createUserRequestSchema,
  response: createUserResponseSchema
};

// src/modules/user/push-tokens/push-tokens.contracts.ts
import { z as z30 } from "zod/v4";
var saveUserPushTokenRequestSchema = z30.object({
  body: z30.object({
    token: userDbSchema.shape.pushToken.unwrap()
  })
});
var saveUserPushTokenContract = {
  request: saveUserPushTokenRequestSchema
};

// src/modules/user/update/update.contracts.ts
import { z as z31 } from "zod/v4";
var updateUserRequestSchema = z31.object({
  body: authenticatedUserForUpdateQueryDtoSchema
});
var updateAuthenticatedUserResponseSchema = z31.object({
  message: z31.string(),
  emailChanged: z31.boolean(),
  user: userDataQueryDtoSchema
});
var updateAuthenticatedUserContract = {
  request: updateUserRequestSchema,
  response: updateAuthenticatedUserResponseSchema
};
var userDataResponseSchema = z31.object({
  userData: userDataQueryDtoSchema
});
var userDataContract = {
  response: userDataResponseSchema
};
var getAuthenticatedUserByIdResponseSchema = userDataQueryDtoSchema;
var getAuthenticatedUserByIdContract = {
  response: getAuthenticatedUserByIdResponseSchema
};
var deleteProfilePicRequestSchema = z31.object({
  body: z31.object({
    profilePicPath: z31.string()
  })
});
var deleteUserProfilePicContract = {
  request: deleteProfilePicRequestSchema
};
var setProfilePicAndUpdateDBResponseSchema = z31.object({
  profilePicPath: z31.string(),
  url: z31.string(),
  message: z31.string()
});
var setProfilePicAndUpdateDBContract = {
  response: setProfilePicAndUpdateDBResponseSchema
};

// src/modules/video-analysis/video-analysis.contracts.ts
import { z as z32 } from "zod/v4";
var getPresignedUrlFromS3RequestSchema = z32.object({
  body: z32.object({
    exercise: exerciseDbSchema.shape.name,
    fileType: z32.string(),
    jobId: z32.string()
  })
});
var getPresignedUrlFromS3ResponseSchema = z32.object({
  uploadUrl: z32.string(),
  fileKey: z32.string(),
  requestId: z32.string()
});
var getPresignedUrlFromS3Contract = {
  request: getPresignedUrlFromS3RequestSchema,
  response: getPresignedUrlFromS3ResponseSchema
};

// src/modules/video-analysis/video-analysis.dtos.ts
import { z as z33 } from "zod/v4";
var enqueueAnalyzeVideoParamsDtoSchema = z33.object({
  fileKey: z33.string(),
  exercise: z33.string(),
  userId: userDbSchema.shape.id,
  requestId: z33.string(),
  sentryTrace: z33.string().optional(),
  baggage: z33.string().optional()
});
var analyzeVideoPayloadDtoSchema = enqueueAnalyzeVideoParamsDtoSchema.extend({
  expiresAt: z33.number()
});
var squatRepetitionDtoSchema = z33.object({
  depth: z33.object({
    value: z33.number(),
    status: z33.string(),
    confidence: z33.number()
  }),
  backLean: z33.object({
    value: z33.number(),
    excessive: z33.boolean(),
    confidence: z33.number()
  }),
  audit: z33.object({
    framesAnalyzed: z33.number(),
    validFrames: z33.number(),
    cameraAngle: z33.string(),
    rawBottomAngle: z33.number(),
    samplingRate: z33.string()
  })
});
var analyzeVideoResultPayloadDtoSchema = /* @__PURE__ */ __name((resultSchema) => z33.intersection(z33.object({
  jobId: z33.string(),
  userId: userDbSchema.shape.id,
  exercise: z33.string(),
  requestId: z33.string().optional()
}), z33.discriminatedUnion("status", [
  z33.object({
    status: z33.literal("completed"),
    result: z33.array(resultSchema),
    error: z33.null()
  }),
  z33.object({
    status: z33.literal("failed"),
    result: z33.null(),
    error: z33.string()
  })
])), "analyzeVideoResultPayloadDtoSchema");

// src/modules/web-sockets/web-sockets.contracts.ts
import { z as z34 } from "zod/v4";
var generateTicketRequestSchema = z34.object({
  body: z34.object({
    username: userDbSchema.shape.username
  })
});
var generateTicketResponseSchema = z34.object({
  ticket: z34.string()
});
var generateTicketContract = {
  request: generateTicketRequestSchema,
  response: generateTicketResponseSchema
};

// src/modules/workout/tracking/tracking.contracts.ts
import { z as z35 } from "zod/v4";
var getExerciseTrackingRequestSchema = z35.object({
  query: z35.object({
    tz: z35.string().optional()
  })
});
var getExerciseTrackingResponseSchema = exerciseTrackingMapsQueryDtoSchema;
var getExerciseTrackingContract = {
  request: getExerciseTrackingRequestSchema,
  response: getExerciseTrackingResponseSchema
};
var getExerciseTrackingStatsResponseSchema = exerciseTrackingStatsQueryDtoSchema;
var getExerciseTrackingStatsContract = {
  request: getExerciseTrackingRequestSchema,
  response: getExerciseTrackingStatsResponseSchema
};
var finishWorkoutRequestSchema = z35.object({
  body: z35.object({
    workout: z35.array(finishedWorkoutEntryQueryDtoSchema),
    tz: z35.string().optional(),
    workoutStartUtc: z35.string().datetime("workoutStartUtc must be a valid ISO datetime"),
    workoutEndUtc: z35.string().datetime("workoutEndUtc must be a valid ISO datetime").optional().nullable()
  })
});
var finishUserWorkoutResponseSchema = exerciseTrackingAndStatsQueryDtoSchema;
var finishUserWorkoutContract = {
  request: finishWorkoutRequestSchema,
  response: finishUserWorkoutResponseSchema
};
export {
  accessTokenPayloadDtoSchema,
  addAerobicInputQueryDtoSchema,
  addAerobicsRequestSchema,
  addUserAerobicsContract,
  addWorkoutContract,
  addWorkoutRequestSchema,
  addWorkoutResponseSchema,
  adherenceExerciseStatsQueryDtoSchema,
  aerobicTrackingDbSchema,
  aerobicsDailyRecordQueryDtoSchema,
  aerobicsWeeklyRecordQueryDtoSchema,
  allUserMessageQueryDtoSchema,
  analyzeVideoPayloadDtoSchema,
  analyzeVideoResultPayloadDtoSchema,
  appleOAuthContract,
  appleOAuthRequestSchema,
  appleTokenVerificationResultDtoSchema,
  authenticatedUserForUpdateQueryDtoSchema,
  bootstrapContract,
  bootstrapRequestSchema,
  bootstrapResponseSchema,
  changeEmailAndVerifyContract,
  changeEmailAndVerifyRequestSchema,
  changeEmailTokenPayloadDtoSchema,
  checkUserVerifyContract,
  checkUserVerifyRequestSchema,
  createUserContract,
  createUserRequestSchema,
  createUserResponseSchema,
  createUserUserSchema,
  createdUserQueryDtoSchema,
  createdUserRawQueryDtoSchema,
  createdUserRowQueryDtoSchema,
  deleteMessageContract,
  deleteMessageRequestSchema,
  deleteMessageResponseSchema,
  deleteProfilePicRequestSchema,
  deleteUserProfilePicContract,
  deletedMessageQueryDtoSchema,
  emailVerifyPayloadDtoSchema,
  enqueueAnalyzeVideoParamsDtoSchema,
  exerciseAssignmentIdQueryDtoSchema,
  exerciseDbSchema,
  exerciseInPlanQueryDtoSchema,
  exerciseMapByMuscleRowQueryDtoSchema,
  exerciseMetadataQueryDtoSchema,
  exerciseToWorkoutSplitDbSchema,
  exerciseToWorkoutSplitSetExpandedViewDbSchema,
  exerciseTrackingAnalysisQueryDtoSchema,
  exerciseTrackingAndStatsQueryDtoSchema,
  exerciseTrackingAndStatsRowQueryDtoSchema,
  exerciseTrackingDbSchema,
  exerciseTrackingIdQueryDtoSchema,
  exerciseTrackingMapsQueryDtoSchema,
  exerciseTrackingMapsRowQueryDtoSchema,
  exerciseTrackingPrMaxQueryDtoSchema,
  exerciseTrackingSetExpandedViewDbSchema,
  exerciseTrackingStatsQueryDtoSchema,
  exerciseTrackingStatsRowQueryDtoSchema,
  exercisesMapByMuscleQueryDtoSchema,
  finishUserWorkoutContract,
  finishUserWorkoutResponseSchema,
  finishWorkoutRequestSchema,
  finishedWorkoutEntryQueryDtoSchema,
  forgotPasswordPayloadDtoSchema,
  generateTicketContract,
  generateTicketRequestSchema,
  generateTicketResponseSchema,
  getAerobicsRequestSchema,
  getAllExercisesContract,
  getAllExercisesExerciseQueryDtoSchema,
  getAllExercisesResponseSchema,
  getAllMessagesRequestSchema,
  getAllUserMessagesContract,
  getAllUserMessagesResponseSchema,
  getAnalyticsContract,
  getAnalyticsResponseSchema,
  getAuthenticatedUserByIdContract,
  getAuthenticatedUserByIdResponseSchema,
  getExerciseTrackingContract,
  getExerciseTrackingRequestSchema,
  getExerciseTrackingResponseSchema,
  getExerciseTrackingStatsContract,
  getExerciseTrackingStatsResponseSchema,
  getPresignedUrlFromS3Contract,
  getPresignedUrlFromS3RequestSchema,
  getPresignedUrlFromS3ResponseSchema,
  getUserAerobicsContract,
  getWholeUserWorkoutPlanContract,
  getWholeUserWorkoutPlanResponseSchema,
  getWholeWorkoutPlanRequestSchema,
  goalAdherenceQueryDtoSchema,
  goalAdherenceRowQueryDtoSchema,
  googleOAuthContract,
  googleOAuthRequestSchema,
  googleTokenVerificationResultDtoSchema,
  lastLoginQueryDtoSchema,
  loginContract,
  loginRequestSchema,
  loginResponseSchema,
  logoutContract,
  logoutResponseSchema,
  markMessageAsReadContract,
  markMessageAsReadRequestSchema,
  markMessageAsReadResponseSchema,
  messageAfterSendQueryDtoSchema,
  messageAsReadQueryDtoSchema,
  messageDbSchema,
  oAuthCreatedUserRowQueryDtoSchema,
  oAuthLinkQueryDtoSchema,
  oAuthLinkRowQueryDtoSchema,
  oAuthLoginContract,
  oAuthLoginResponseSchema,
  oAuthLookupQueryDtoSchema,
  oAuthLookupRawQueryDtoSchema,
  oAuthLookupRowQueryDtoSchema,
  oauthAccountDbSchema,
  proceedLoginResponseSchema,
  prsViewDbSchema,
  refreshTokenContract,
  refreshTokenResponseSchema,
  resetPasswordContract,
  resetPasswordRequestSchema,
  resetPasswordResponseSchema,
  saveUserPushTokenContract,
  saveUserPushTokenRequestSchema,
  saveWorkoutSplitInputQueryDtoSchema,
  saveWorkoutSplitPayloadQueryDtoSchema,
  sendChangePassEmailContract,
  sendChangePassEmailRequestSchema,
  sendVerificationMailContract,
  sendVerificationMailRequestSchema,
  serializedDateSchema,
  setProfilePicAndUpdateDBContract,
  setProfilePicAndUpdateDBResponseSchema,
  squatRepetitionDtoSchema,
  timezoneSchema,
  tokenVersionQueryDtoSchema,
  trackingByDateItemQueryDtoSchema,
  trackingBySplitNameItemQueryDtoSchema,
  trackingMapItemQueryDtoSchema,
  trackingSetDbSchema,
  updateAuthenticatedUserContract,
  updateAuthenticatedUserResponseSchema,
  updateUserRequestSchema,
  userAerobicsQueryDtoSchema,
  userAerobicsResponseSchema,
  userAerobicsRowQueryDtoSchema,
  userAfterBumpQueryDtoSchema,
  userByIdentifierQueryDtoSchema,
  userByIdentifierRawQueryDtoSchema,
  userByIdentifierRowQueryDtoSchema,
  userByUsernameRawQueryDtoSchema,
  userByUsernameRowQueryDtoSchema,
  userConflictQueryDtoSchema,
  userDataContract,
  userDataQueryDtoSchema,
  userDataResponseSchema,
  userDataRowQueryDtoSchema,
  userDbSchema,
  userExistsQueryDtoSchema,
  userInsertDbSchema,
  userMessageIdentityQueryDtoSchema,
  userProfilePicQueryDtoSchema,
  userReminderSettingDbSchema,
  userSplitInformationDbSchema,
  userToHourlyReminderQueryDtoSchema,
  userUpdateDbSchema,
  userWithNotificationsEnabledQueryDtoSchema,
  verifyAccountRequestSchema,
  verifyUserAccountContract,
  weeklyDataQueryDtoSchema,
  wholeUserWorkoutPlanQueryDtoSchema,
  workoutExerciseInputQueryDtoSchema,
  workoutPlanDbSchema,
  workoutPlanIdQueryDtoSchema,
  workoutRmRecordQueryDtoSchema,
  workoutRmsQueryDtoSchema,
  workoutRmsRowQueryDtoSchema,
  workoutSetDbSchema,
  workoutSplitDbSchema,
  workoutSplitIdQueryDtoSchema,
  workoutSplitLookupQueryDtoSchema,
  workoutSplitQueryDtoSchema,
  workoutSummaryDbSchema,
  workoutSummaryIdQueryDtoSchema
};
