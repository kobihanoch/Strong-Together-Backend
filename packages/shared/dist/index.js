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
import { relations as relations14, sql as drizzleSql21 } from "drizzle-orm";
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
  }).defaultNow().notNull(),
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
import { relations as relations2 } from "drizzle-orm";
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
  }).defaultNow().notNull(),
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
import { relations as relations11, sql as drizzleSql17 } from "drizzle-orm";
import { bigint as bigint9, foreignKey as foreignKey10, index as index8, integer as integer5, numeric, primaryKey as primaryKey11, timestamp as timestamp7, unique as unique4, uuid as uuid8 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/workout/workout_split/table.ts
import { sql as drizzleSql16, relations as relations10 } from "drizzle-orm";
import { bigint as bigint8, boolean as boolean5, foreignKey as foreignKey9, index as index7, integer as integer4, primaryKey as primaryKey10, text as text5, timestamp as timestamp6, uniqueIndex as uniqueIndex3 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/tracking/workout_summary/table.ts
import { relations as relations8, sql as drizzleSql12 } from "drizzle-orm";
import { bigint as bigint6, foreignKey as foreignKey7, index as index6, primaryKey as primaryKey8, timestamp as timestamp4, uuid as uuid6 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/tracking/exercise_tracking/table.ts
import { relations as relations7, sql as drizzleSql10 } from "drizzle-orm";
import { bigint as bigint5, foreignKey as foreignKey6, index as index5, primaryKey as primaryKey7, text as text4, uuid as uuid5 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/workout/exercises/table.ts
import { relations as relations5 } from "drizzle-orm";
import { bigint as bigint3, primaryKey as primaryKey5, text as text3, uniqueIndex } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/workout/exercisetoworkoutsplit/table.ts
import { relations as relations4, sql as drizzleSql6 } from "drizzle-orm";
import { bigint as bigint2, boolean as boolean3, foreignKey as foreignKey4, index as index3, primaryKey as primaryKey4, timestamp as timestamp3, unique as unique2 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/workout/workout_set/table.ts
import { relations as relations3 } from "drizzle-orm";
import { bigint, foreignKey as foreignKey3, index as index2, integer as integer2, primaryKey as primaryKey3, unique, uuid as uuid3 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/workout/workout_set/policies.ts
import { sql as drizzleSql4 } from "drizzle-orm";
import { pgPolicy as pgPolicy3 } from "drizzle-orm/pg-core";
var currentUserId = drizzleSql4`"identity"."current_user_id"()`;
function workoutSetPolicies(table) {
  const ownsWorkoutSet = drizzleSql4`exists (
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
import { sql as drizzleSql5 } from "drizzle-orm";
import { pgPolicy as pgPolicy4 } from "drizzle-orm/pg-core";
var uid4 = drizzleSql5`"identity"."current_user_id"()`;
function exerciseToWorkoutSplitPolicies(t) {
  const owns = drizzleSql5`${uid4} = (select wp."user_id" from "workout"."workout_plan" wp join "workout"."workout_split" ws on ws."workout_id" = wp."id" where ws."id" = ${t.workoutSplitId})`;
  const ownsForDelete = drizzleSql5`exists (select 1 from "workout"."workout_split" ws join "workout"."workout_plan" wp on wp."id" = ws."workout_id" where ws."id" = ${t.workoutSplitId} and wp."user_id" = ${uid4})`;
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
  }).defaultNow().notNull(),
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
  index3("exercise_to_workout_split_active_idx").on(t.workoutSplitId, t.orderIndex).where(drizzleSql6`${t.isActive} = true`),
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
import { sql as drizzleSql7 } from "drizzle-orm";
import { pgPolicy as pgPolicy5 } from "drizzle-orm/pg-core";
var exercisePolicies = /* @__PURE__ */ __name(() => [
  // Makes the shared exercise catalog readable to every authenticated user.
  pgPolicy5("Allow all authenticated users to read exercise", {
    for: "select",
    to: authenticatedRole,
    using: drizzleSql7`true`
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
import { sql as drizzleSql8 } from "drizzle-orm";
import { pgPolicy as pgPolicy6 } from "drizzle-orm/pg-core";
var currentUserId2 = drizzleSql8`"identity"."current_user_id"()`;
function trackingSetPolicies(table) {
  const ownsExerciseTracking = drizzleSql8`exists (
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
import { sql as drizzleSql9 } from "drizzle-orm";
import { pgPolicy as pgPolicy7 } from "drizzle-orm/pg-core";
var uid5 = drizzleSql9`"identity"."current_user_id"()`;
function exerciseTrackingPolicies(t) {
  const owns = drizzleSql9`exists (select 1 from "tracking"."workout_summary" ws where ws."id" = ${t.workoutSummaryId} and ws."user_id" = ${uid5})`;
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
  check("exercise_tracking_xor_check", drizzleSql10`num_nonnulls(${t.exerciseToSplitId}, ${t.exerciseId}) = 1`),
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
import { sql as drizzleSql11 } from "drizzle-orm";
import { pgPolicy as pgPolicy8 } from "drizzle-orm/pg-core";
var uid6 = drizzleSql11`"identity"."current_user_id"()`;
function workoutSummaryPolicies(t) {
  return [
    // Lets authenticated users read only their own completed workout summaries.
    pgPolicy8("users can read their workout summaries", {
      for: "select",
      to: authenticatedRole,
      using: drizzleSql11`${t.userId} = ${uid6}`
    }),
    // Lets authenticated users insert completed workout summaries only for themselves.
    pgPolicy8("users can insert their workout summaries", {
      for: "insert",
      to: authenticatedRole,
      withCheck: drizzleSql11`${t.userId} = ${uid6}`
    }),
    // Lets authenticated users update only their own completed workout summaries.
    pgPolicy8("users can update their workout summaries", {
      for: "update",
      to: authenticatedRole,
      using: drizzleSql11`${t.userId} = ${uid6}`,
      withCheck: drizzleSql11`${t.userId} = ${uid6}`
    }),
    // Lets authenticated users delete only their own completed workout summaries.
    pgPolicy8("users can delete their workout summaries", {
      for: "delete",
      to: authenticatedRole,
      using: drizzleSql11`${t.userId} = ${uid6}`
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
  index6("workout_summary_start_date_idx").on(drizzleSql12`((${t.workoutStartUtc} at time zone 'UTC')::date)`),
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
import { relations as relations9, sql as drizzleSql14 } from "drizzle-orm";
import { bigint as bigint7, boolean as boolean4, foreignKey as foreignKey8, primaryKey as primaryKey9, timestamp as timestamp5, uniqueIndex as uniqueIndex2, uuid as uuid7 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/workout/workout_plan/policies.ts
import { sql as drizzleSql13 } from "drizzle-orm";
import { pgPolicy as pgPolicy9 } from "drizzle-orm/pg-core";
var uid7 = drizzleSql13`"identity"."current_user_id"()`;
function workoutPlanPolicies(t) {
  return [
    // Lets authenticated users read only workout plans they own.
    pgPolicy9("Enable read access for auth users on workout_plan", {
      for: "select",
      to: authenticatedRole,
      using: drizzleSql13`${uid7} = ${t.userId}`
    }),
    // Lets authenticated users create workout plans only for themselves.
    pgPolicy9("Enable insert for auth users on workout_plan", {
      for: "insert",
      to: authenticatedRole,
      withCheck: drizzleSql13`${uid7} = ${t.userId}`
    }),
    // Lets authenticated users update only workout plans they own.
    pgPolicy9("Enable update for auth users on workout_plan", {
      for: "update",
      to: authenticatedRole,
      using: drizzleSql13`${uid7} = ${t.userId}`,
      withCheck: drizzleSql13`${uid7} = ${t.userId}`
    }),
    // Lets authenticated users delete only workout plans they own.
    pgPolicy9("Enable delete for auth users on workout_plan", {
      for: "delete",
      to: authenticatedRole,
      using: drizzleSql13`${uid7} = ${t.userId}`
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
  }).defaultNow().notNull(),
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
  uniqueIndex2("uq_workout_plan_active_user").on(t.userId).where(drizzleSql14`${t.isActive}`),
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
import { sql as drizzleSql15 } from "drizzle-orm";
import { pgPolicy as pgPolicy10 } from "drizzle-orm/pg-core";
var uid8 = drizzleSql15`"identity"."current_user_id"()`;
function workoutSplitPolicies(t) {
  const owns = drizzleSql15`${uid8} = (select wp."user_id" from "workout"."workout_plan" wp where wp."id" = ${t.workoutId})`;
  const ownsForDelete = drizzleSql15`exists (select 1 from "workout"."workout_plan" wp where wp."id" = ${t.workoutId} and wp."user_id" = ${uid8})`;
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
  }).defaultNow().notNull(),
  isActive: boolean5("is_active").default(true).notNull()
}, (t) => [
  primaryKey10({
    name: "workout_split_pkey",
    columns: [
      t.id
    ]
  }),
  uniqueIndex3("uq_active_workout_split_order_index").on(t.workoutId, t.orderIndex).where(drizzleSql16`${t.isActive} = TRUE`),
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
  }).defaultNow().notNull(),
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
  index8("user_split_information_confidence_idx").on(t.preferredWeekday, t.confidence).where(drizzleSql17`${t.confidence} >= 0.60`),
  index8("user_split_information_user_weekday_idx").on(t.userId, t.preferredWeekday).where(drizzleSql17`${t.preferredWeekday} is not null`)
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
import { relations as relations12 } from "drizzle-orm";
import { bigint as bigint10, foreignKey as foreignKey11, index as index9, primaryKey as primaryKey12, text as text6, timestamp as timestamp8, uuid as uuid9 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/tracking/aerobic_tracking/policies.ts
import { sql as drizzleSql18 } from "drizzle-orm";
import { pgPolicy as pgPolicy11 } from "drizzle-orm/pg-core";
var uid9 = drizzleSql18`"identity"."current_user_id"()`;
function aerobicTrackingPolicies(t) {
  return [
    // Lets authenticated users read only their own aerobic tracking rows.
    pgPolicy11("Enable read access for auth users on aerobic_tracking", {
      for: "select",
      to: authenticatedRole,
      using: drizzleSql18`${uid9} = ${t.userId}`
    }),
    // Lets authenticated users insert aerobic tracking rows only for themselves.
    pgPolicy11("Enable insert for auth users on aerobic_tracking", {
      for: "insert",
      to: authenticatedRole,
      withCheck: drizzleSql18`${uid9} = ${t.userId}`
    }),
    // Lets authenticated users update only their own aerobic tracking rows.
    pgPolicy11("Enable update for auth users on aerobic_tracking", {
      for: "update",
      to: authenticatedRole,
      using: drizzleSql18`${uid9} = ${t.userId}`,
      withCheck: drizzleSql18`${uid9} = ${t.userId}`
    }),
    // Lets authenticated users delete only their own aerobic tracking rows.
    pgPolicy11("Enable delete for auth users on aerobic_tracking", {
      for: "delete",
      to: authenticatedRole,
      using: drizzleSql18`${uid9} = ${t.userId}`
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
  }).defaultNow().notNull()
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
import { relations as relations13 } from "drizzle-orm";
import { foreignKey as foreignKey12, primaryKey as primaryKey13, text as text7, timestamp as timestamp9, unique as unique5, uuid as uuid10 } from "drizzle-orm/pg-core";

// ../../src/infrastructure/db/schema/drizzle/identity/oauth_account/policies.ts
import { sql as drizzleSql19 } from "drizzle-orm";
import { pgPolicy as pgPolicy12 } from "drizzle-orm/pg-core";
var currentUserId3 = drizzleSql19`"identity"."current_user_id"()`;
function oauthAccountPolicies(table) {
  return [
    // Lets authenticated users read only OAuth accounts linked to themselves.
    pgPolicy12("Enable read access for auth users on oauth_account", {
      for: "select",
      to: authenticatedRole,
      using: drizzleSql19`${currentUserId3} = ${table.userId}`
    }),
    // Lets authenticated users link OAuth accounts only to themselves.
    pgPolicy12("Enable insert for auth users on oauth_account", {
      for: "insert",
      to: authenticatedRole,
      withCheck: drizzleSql19`${currentUserId3} = ${table.userId}`
    }),
    // Lets authenticated users update only OAuth accounts linked to themselves.
    pgPolicy12("Enable update for auth users on oauth_account", {
      for: "update",
      to: authenticatedRole,
      using: drizzleSql19`${currentUserId3} = ${table.userId}`,
      withCheck: drizzleSql19`${currentUserId3} = ${table.userId}`
    }),
    // Lets authenticated users delete only OAuth accounts linked to themselves.
    pgPolicy12("Enable delete for auth users on oauth_account", {
      for: "delete",
      to: authenticatedRole,
      using: drizzleSql19`${currentUserId3} = ${table.userId}`
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
  }).defaultNow().notNull()
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
import { sql as drizzleSql20 } from "drizzle-orm";
import { pgPolicy as pgPolicy13 } from "drizzle-orm/pg-core";
var currentUserId4 = drizzleSql20`"identity"."current_user_id"()`;
function userPolicies(table) {
  return [
    // Lets an authenticated user read their own profile.
    pgPolicy13("Enable read access for auth users on own profile", {
      for: "select",
      to: authenticatedRole,
      using: drizzleSql20`${currentUserId4} = ${table.id}`
    }),
    // Lets a message receiver read the profile of a sender in their inbox.
    pgPolicy13("Allow user to view senders in their messages", {
      for: "select",
      to: authenticatedRole,
      using: drizzleSql20`exists (select 1 from "messages"."message" m where m."sender_id" = ${table.id} and m."receiver_id" = ${currentUserId4})`
    }),
    // Lets an authenticated user create only their own profile row.
    pgPolicy13("Enable insert for auth users on own profile", {
      for: "insert",
      to: authenticatedRole,
      withCheck: drizzleSql20`${currentUserId4} = ${table.id}`
    }),
    // Preserves the legacy public self-registration policy for compatibility.
    pgPolicy13("Enable insert for public users on own profile", {
      for: "insert",
      to: "public",
      withCheck: drizzleSql20`${currentUserId4} = ${table.id}`
    }),
    // Lets an authenticated user update only their own profile.
    pgPolicy13("Enable update for auth users on own profile", {
      for: "update",
      to: authenticatedRole,
      using: drizzleSql20`${currentUserId4} = ${table.id}`,
      withCheck: drizzleSql20`${currentUserId4} = ${table.id}`
    }),
    // Lets an authenticated user delete only their own profile.
    pgPolicy13("Enable delete for auth users on own profile", {
      for: "delete",
      to: authenticatedRole,
      using: drizzleSql20`${currentUserId4} = ${table.id}`
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
  }).defaultNow().notNull(),
  updatedAt: timestamp10("updated_at", {
    withTimezone: true
  }).defaultNow().notNull(),
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
  uniqueIndex4("user_email_ci_unique").on(drizzleSql21`lower(trim(both from ${t.email}))`),
  uniqueIndex4("user_username_ci_unique").on(drizzleSql21`lower(trim(both from ${t.username}))`),
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

// ../../src/infrastructure/db/schema/drizzle/tracking/views/prs.view.ts
import { sql as drizzleSql22 } from "drizzle-orm";
import { bigint as bigint12, integer as integer6, real as real2, text as text9, timestamp as timestamp11, uuid as uuid12 } from "drizzle-orm/pg-core";
var prsView = trackingSchema.view("v_prs", {
  id: bigint12("id", {
    mode: "number"
  }),
  exerciseToSplitId: bigint12("exercise_to_split_id", {
    mode: "number"
  }),
  exerciseId: bigint12("exercise_id", {
    mode: "number"
  }),
  exercise: text9("exercise"),
  setIndex: integer6("set_index"),
  weight: real2("weight"),
  reps: bigint12("reps", {
    mode: "number"
  }),
  workoutSummaryId: uuid12("workout_summary_id"),
  workoutStartUtc: timestamp11("workout_start_utc", {
    withTimezone: true
  }),
  workoutEndUtc: timestamp11("workout_end_utc", {
    withTimezone: true
  })
}).with({
  securityInvoker: true
}).as(drizzleSql22`
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

// ../../src/infrastructure/db/schema/drizzle/workout/views/exercise-to-workoutsplit-expanded.view.ts
import { bigint as bigint13, boolean as boolean7, text as text10, timestamp as timestamp12 } from "drizzle-orm/pg-core";
import { sql as drizzleSql23 } from "drizzle-orm";
import { integer as integer7 } from "drizzle-orm/pg-core";
var exerciseToWorkoutSplitSetExpandedView = workoutSchema.view("v_exercise_to_workout_split_set_expanded", {
  id: bigint13("id", {
    mode: "number"
  }),
  workoutSplitId: bigint13("workout_split_id", {
    mode: "number"
  }),
  workoutId: bigint13("workout_id", {
    mode: "number"
  }),
  exerciseId: bigint13("exercise_id", {
    mode: "number"
  }),
  exercise: text10("exercise"),
  workoutSplit: text10("workout_split"),
  reps: integer7("reps"),
  orderIndex: bigint13("order_index", {
    mode: "number"
  }),
  setIndex: integer7("set_index"),
  createdAt: timestamp12("created_at", {
    withTimezone: true
  }),
  isActive: boolean7("is_active")
}).with({
  securityInvoker: true
}).as(drizzleSql23`
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
import { sql as drizzleSql24 } from "drizzle-orm";
import { bigint as bigint14, boolean as boolean8, real as real3, text as text11, timestamp as timestamp13, uuid as uuid13 } from "drizzle-orm/pg-core";
import { integer as integer8 } from "drizzle-orm/pg-core";
var exerciseTrackingSetExpandedView = analyticsSchema.view("v_exercise_tracking_set_expanded", {
  id: bigint14("id", {
    mode: "number"
  }),
  exerciseToSplitId: bigint14("exercise_to_split_id", {
    mode: "number"
  }),
  weight: real3("weight"),
  reps: bigint14("reps", {
    mode: "number"
  }),
  orderIndex: integer8("order_index"),
  setIndex: integer8("set_index"),
  exerciseId: bigint14("exercise_id", {
    mode: "number"
  }),
  workoutSplitId: bigint14("workout_split_id", {
    mode: "number"
  }),
  splitName: text11("split_name"),
  exercise: text11("exercise"),
  targetMuscle: text11("target_muscle"),
  specificTargetMuscle: text11("specific_target_muscle"),
  notes: text11("notes"),
  workoutSummaryId: uuid13("workout_summary_id"),
  workoutStartUtc: timestamp13("workout_start_utc", {
    withTimezone: true
  }),
  workoutEndUtc: timestamp13("workout_end_utc", {
    withTimezone: true
  }),
  isAssignedToSplit: boolean8("is_assigned_to_split")
}).with({
  securityInvoker: true
}).as(drizzleSql24`
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
  id: aerobicTrackingDbSchema.shape.id,
  type: aerobicTrackingDbSchema.shape.type,
  durationSec: aerobicTrackingDbSchema.shape.durationSec,
  durationMins: aerobicTrackingDbSchema.shape.durationSec
});
var aerobicsWeeklyRecordQueryDtoSchema = aerobicsDailyRecordQueryDtoSchema.extend({
  workoutTimeLocal: serializedDateSchema
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
var aerobicMutationRowQueryDtoSchema = z2.object({
  id: aerobicTrackingDbSchema.shape.id
});

// src/modules/aerobics/aerobics.contracts.ts
var createAerobicEntryRequestSchema = z3.object({
  query: z3.object({
    tz: z3.string().optional()
  }),
  body: z3.object({
    record: addAerobicInputQueryDtoSchema
  })
});
var createAerobicEntryResponseSchema = z3.void();
var createAerobicEntryContract = {
  request: createAerobicEntryRequestSchema,
  response: createAerobicEntryResponseSchema
};
var getAerobicHistoryRequestSchema = z3.object({
  query: z3.object({
    tz: z3.string().optional()
  })
});
var getAerobicHistoryResponseSchema = userAerobicsQueryDtoSchema;
var getAerobicHistoryContract = {
  request: getAerobicHistoryRequestSchema,
  response: getAerobicHistoryResponseSchema
};
var aerobicEntryIdParamsSchema = z3.object({
  id: z3.coerce.number().int().positive()
});
var updateAerobicEntryRequestSchema = z3.object({
  params: aerobicEntryIdParamsSchema,
  query: z3.object({
    tz: z3.string().optional()
  }),
  body: z3.object({
    record: addAerobicInputQueryDtoSchema
  })
});
var updateAerobicEntryContract = {
  request: updateAerobicEntryRequestSchema,
  response: z3.void()
};
var deleteAerobicEntryRequestSchema = z3.object({
  params: aerobicEntryIdParamsSchema,
  query: z3.object({
    tz: z3.string().optional()
  })
});
var deleteAerobicEntryContract = {
  request: deleteAerobicEntryRequestSchema,
  response: z3.void()
};

// src/modules/auth/password/password.contracts.ts
import { z as z4 } from "zod/v4";
var createPasswordResetRequestSchema = z4.object({
  body: z4.object({
    identifier: z4.string()
  })
});
var createPasswordResetRequestContract = {
  request: createPasswordResetRequestSchema
};
var resetPasswordRequestSchema = z4.object({
  body: z4.object({
    newPassword: z4.string().min(8, "Password must be at least 8 characters long")
  }),
  query: z4.object({
    token: z4.string().optional()
  })
});
var resetPasswordResponseSchema = z4.void();
var resetPasswordContract = {
  request: resetPasswordRequestSchema,
  response: resetPasswordResponseSchema
};

// src/modules/auth/password/password.dtos.ts
import { z as z5 } from "zod/v4";
var forgotPasswordPayloadDtoSchema = z5.object({
  sub: userDbSchema.shape.id,
  jti: z5.string(),
  exp: z5.number(),
  iss: z5.string(),
  typ: z5.string()
});

// src/modules/auth/session/session.contracts.ts
import { z as z6 } from "zod/v4";
var loginRequestSchema = z6.object({
  body: z6.object({
    identifier: z6.string().min(3).refine((value) => z6.string().email().safeParse(value).success || /^[a-zA-Z0-9_]{3,20}$/.test(value), {
      message: "Must be a valid email or username"
    }),
    password: z6.string().min(1, "Username and password are required")
  })
});
var loginResponseSchema = z6.object({
  message: z6.string(),
  user: userDbSchema.shape.id,
  accessToken: z6.string(),
  refreshToken: z6.string()
});
var loginContract = {
  request: loginRequestSchema,
  response: loginResponseSchema
};
var refreshTokenResponseSchema = z6.object({
  message: z6.string(),
  accessToken: z6.string(),
  refreshToken: z6.string(),
  userId: userDbSchema.shape.id
});
var refreshTokenContract = {
  response: refreshTokenResponseSchema
};
var logoutResponseSchema = z6.object({
  message: z6.string()
});
var logoutContract = {
  response: logoutResponseSchema
};

// src/modules/auth/session/session.dtos.ts
import { z as z8 } from "zod/v4";

// src/modules/user/update/update.dtos.ts
import { z as z7 } from "zod/v4";
var authenticatedUserForUpdateQueryDtoSchema = z7.object({
  username: userDbSchema.shape.username.trim().min(3, "Username must be at least 3 characters").max(15, "Username must be at most 15 characters").regex(/^[a-zA-Z0-9_]+$/, "Username may contain letters, numbers, and underscore only"),
  fullName: userDbSchema.shape.name.trim().min(1, "Full name is required").max(20, "Full name is too long").regex(/^[a-zA-Z\s]+$/, "Full name may contain letters and spaces only"),
  email: userDbSchema.shape.email.trim().toLowerCase().email("Invalid email format")
}).partial();
var userDataQueryDtoSchema = z7.object({
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
  isFirstLogin: z7.boolean(),
  tokenVersion: userDbSchema.shape.tokenVersion,
  isVerified: userDbSchema.shape.isVerified,
  authProvider: userDbSchema.shape.authProvider,
  lastLogin: serializedDateSchema.nullable()
});
var userDataRowQueryDtoSchema = z7.object({
  userData: userDataQueryDtoSchema
});
var userConflictQueryDtoSchema = z7.object({
  conflict: z7.boolean()
});
var userMessageIdentityQueryDtoSchema = z7.object({
  id: userDbSchema.shape.id,
  username: userDbSchema.shape.username,
  name: userDbSchema.shape.name,
  profilePicPath: userDbSchema.shape.profilePicPath
});
var userProfilePicQueryDtoSchema = z7.object({
  profilePicPath: userDbSchema.shape.profilePicPath
});
var changeEmailTokenPayloadDtoSchema = z7.object({
  jti: z7.string(),
  sub: z7.string(),
  newEmail: z7.string(),
  exp: z7.number(),
  iss: z7.string(),
  typ: z7.string()
});

// src/modules/auth/session/session.dtos.ts
var accessTokenPayloadDtoSchema = z8.object({
  id: userDbSchema.shape.id,
  role: userDbSchema.shape.role,
  tokenVer: userDbSchema.shape.tokenVersion,
  cnf: z8.object({
    jkt: z8.string()
  }).optional(),
  iat: z8.number().optional(),
  exp: z8.number().optional()
});
var userAfterBumpQueryDtoSchema = z8.object({
  tokenVersion: userDbSchema.shape.tokenVersion,
  userData: userDataQueryDtoSchema
});
var tokenVersionQueryDtoSchema = z8.object({
  tokenVersion: userDbSchema.shape.tokenVersion
});
var lastLoginQueryDtoSchema = z8.object({
  lastLogin: z8.date().nullable()
});

// src/modules/auth/verification/verification.contracts.ts
import { z as z9 } from "zod/v4";
var verifyEmailRequestSchema = z9.object({
  query: z9.object({
    token: z9.string().optional()
  })
});
var verifyEmailContract = {
  request: verifyEmailRequestSchema
};
var createVerificationEmailRequestSchema = z9.object({
  body: z9.object({
    email: userDbSchema.shape.email.trim().email("Invalid email")
  })
});
var createVerificationEmailContract = {
  request: createVerificationEmailRequestSchema
};
var updateUnverifiedAccountEmailRequestSchema = z9.object({
  body: z9.object({
    username: userDbSchema.shape.username,
    password: z9.string(),
    newEmail: userDbSchema.shape.email.trim().email("Invalid email")
  })
});
var updateUnverifiedAccountEmailContract = {
  request: updateUnverifiedAccountEmailRequestSchema
};
var getVerificationStatusRequestSchema = z9.object({
  query: z9.object({
    username: userDbSchema.shape.username
  })
});
var getVerificationStatusContract = {
  request: getVerificationStatusRequestSchema
};

// src/modules/auth/verification/verification.dtos.ts
import { z as z10 } from "zod/v4";
var emailVerifyPayloadDtoSchema = z10.object({
  sub: userDbSchema.shape.id,
  jti: z10.string(),
  exp: z10.number(),
  iss: z10.string(),
  typ: z10.string()
});

// src/modules/auth/auth.dtos.ts
import { z as z11 } from "zod/v4";
var userByIdentifierQueryDtoSchema = z11.object({
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
  is_verified: z11.boolean(),
  last_login: serializedDateSchema.nullable()
});
var userByIdentifierRowQueryDtoSchema = z11.object({
  userData: userByIdentifierRawQueryDtoSchema.nullable()
});
var userByUsernameRawQueryDtoSchema = userByIdentifierQueryDtoSchema.omit({
  isVerified: true,
  passwordHash: true
}).extend({
  password_hash: userDbSchema.shape.passwordHash,
  is_verified: z11.boolean()
});
var userByUsernameRowQueryDtoSchema = z11.object({
  userData: userByUsernameRawQueryDtoSchema.nullable()
});

// src/modules/exercises/exercises.dtos.ts
import { z as z12 } from "zod/v4";
var getAllExercisesExerciseQueryDtoSchema = z12.object({
  id: exerciseDbSchema.shape.id,
  name: exerciseDbSchema.shape.name,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var exercisesMapByMuscleQueryDtoSchema = z12.record(z12.string(), z12.array(getAllExercisesExerciseQueryDtoSchema));
var exerciseMapByMuscleRowQueryDtoSchema = z12.object({
  result: z12.object({
    map: exercisesMapByMuscleQueryDtoSchema.nullable()
  }).nullable()
});

// src/modules/exercises/exercises.contracts.ts
var listExercisesResponseSchema = exercisesMapByMuscleQueryDtoSchema;
var listExercisesContract = {
  response: listExercisesResponseSchema
};

// src/modules/messages/messages.contracts.ts
import { z as z14 } from "zod/v4";

// src/modules/messages/messages.dtos.ts
import { z as z13 } from "zod/v4";
var allUserMessageQueryDtoSchema = z13.object({
  id: messageDbSchema.shape.id,
  subject: messageDbSchema.shape.subject,
  msg: messageDbSchema.shape.msg,
  sentAt: serializedDateSchema,
  isRead: messageDbSchema.shape.isRead,
  senderFullName: userDbSchema.shape.name,
  senderProfilePicPath: userDbSchema.shape.profilePicPath
});
var messageAsReadQueryDtoSchema = z13.object({
  id: messageDbSchema.shape.id,
  isRead: messageDbSchema.shape.isRead
});
var deletedMessageQueryDtoSchema = z13.object({
  id: messageDbSchema.shape.id
});
var messageAfterSendQueryDtoSchema = z13.object({
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
var listMessagesRequestSchema = z14.object({
  query: z14.object({
    tz: z14.string()
  })
});
var listMessagesResponseSchema = z14.object({
  messages: z14.array(allUserMessageQueryDtoSchema)
});
var listMessagesContract = {
  request: listMessagesRequestSchema,
  response: listMessagesResponseSchema
};
var markMessageAsReadRequestSchema = z14.object({
  params: z14.object({
    id: messageDbSchema.shape.id
  })
});
var markMessageAsReadResponseSchema = z14.void();
var markMessageAsReadContract = {
  request: markMessageAsReadRequestSchema,
  response: markMessageAsReadResponseSchema
};
var deleteMessageRequestSchema = z14.object({
  params: z14.object({
    id: messageDbSchema.shape.id
  })
});
var deleteMessageResponseSchema = z14.void();
var deleteMessageContract = {
  request: deleteMessageRequestSchema,
  response: deleteMessageResponseSchema
};

// src/modules/oauth/apple/apple.contracts.ts
import { z as z15 } from "zod/v4";
var appleNameInputSchema = z15.object({
  givenName: z15.string().nullable(),
  familyName: z15.string().nullable()
});
var appleOAuthRequestSchema = z15.object({
  body: z15.object({
    idToken: z15.string({
      error: "Missing or invalid Apple identityToken"
    }),
    rawNonce: z15.string(),
    name: appleNameInputSchema.optional(),
    email: userDbSchema.shape.email.email().nullable()
  })
});
var appleOAuthContract = {
  request: appleOAuthRequestSchema
};

// src/modules/oauth/apple/apple.dtos.ts
import { z as z16 } from "zod/v4";
var appleTokenVerificationResultDtoSchema = z16.object({
  appleSub: z16.string(),
  email: userDbSchema.shape.email.nullable(),
  emailVerified: z16.boolean(),
  fullName: userDbSchema.shape.name
});

// src/modules/oauth/google/google.contracts.ts
import { z as z17 } from "zod/v4";
var googleOAuthRequestSchema = z17.object({
  body: z17.object({
    idToken: z17.string().optional()
  })
});
var googleOAuthContract = {
  request: googleOAuthRequestSchema
};

// src/modules/oauth/google/google.dtos.ts
import { z as z18 } from "zod/v4";
var googleTokenVerificationResultDtoSchema = z18.object({
  googleSub: z18.string(),
  email: userDbSchema.shape.email.nullable(),
  emailVerified: z18.boolean(),
  fullName: userDbSchema.shape.name
});

// src/modules/oauth/oauth.contracts.ts
import { z as z19 } from "zod/v4";
var oAuthLoginResponseSchema = z19.object({
  message: z19.string(),
  user: userDbSchema.shape.id,
  accessToken: z19.string(),
  refreshToken: z19.string()
});
var proceedLoginResponseSchema = loginResponseSchema;
var oAuthLoginContract = {
  response: oAuthLoginResponseSchema
};

// src/modules/oauth/oauth.dtos.ts
import { z as z20 } from "zod/v4";
var oAuthLookupQueryDtoSchema = z20.object({
  userId: userDbSchema.shape.id.nullable()
});
var oAuthLookupRawQueryDtoSchema = z20.object({
  user_id: userDbSchema.shape.id
});
var oAuthLookupRowQueryDtoSchema = z20.object({
  oauth_data: oAuthLookupRawQueryDtoSchema.nullable()
});
var oAuthLinkQueryDtoSchema = z20.object({
  userId: userDbSchema.shape.id.nullable()
});
var oAuthLinkRowQueryDtoSchema = z20.object({
  user_id: userDbSchema.shape.id.nullable()
});
var oAuthCreatedUserRowQueryDtoSchema = z20.object({
  user_id: userDbSchema.shape.id
});

// src/modules/push/push.dtos.ts
import { z as z21 } from "zod/v4";
var userWithNotificationsEnabledQueryDtoSchema = z21.object({
  pushToken: userDbSchema.shape.pushToken,
  name: userDbSchema.shape.name
});
var userToHourlyReminderQueryDtoSchema = z21.object({
  userId: userDbSchema.shape.id,
  name: userDbSchema.shape.name,
  pushToken: userDbSchema.shape.pushToken,
  reminderOffsetMinutes: z21.number(),
  splitId: workoutSplitDbSchema.shape.id,
  splitName: workoutSplitDbSchema.shape.name.nullable(),
  estimatedTimeUtc: z21.string()
});

// src/modules/user/create/create.contracts.ts
import { z as z23 } from "zod/v4";

// src/modules/user/create/create.dtos.ts
import { z as z22 } from "zod/v4";
var createdUserQueryDtoSchema = z22.object({
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
var createdUserRowQueryDtoSchema = z22.object({
  userData: createdUserRawQueryDtoSchema
});
var userExistsQueryDtoSchema = z22.object({
  id: userDbSchema.shape.id.nullable()
});

// src/modules/user/create/create.contracts.ts
var usernameSchema = userDbSchema.shape.username.trim().min(3, "Username must be at least 3 characters").max(15, "Username must be at most 15 characters").regex(/^[a-zA-Z0-9_]+$/, "Username may contain letters, numbers, and underscore only");
var fullNameSchema = userDbSchema.shape.name.trim().max(20, "Full name is too long").regex(/^[a-zA-Z\s]+$/, "Full name may contain letters and spaces only");
var createUserRequestSchema = z23.object({
  body: z23.object({
    username: usernameSchema,
    fullName: z23.preprocess((value) => value == null || typeof value === "string" && value.trim() === "" ? "User" : value, fullNameSchema),
    email: userDbSchema.shape.email.trim().toLowerCase().email("Invalid email format"),
    password: z23.string().min(8, "Password must be at least 8 characters long"),
    gender: z23.preprocess((value) => value === "" || value == null ? "Unknown" : value, z23.enum([
      "Male",
      "Female",
      "Other",
      "Unknown"
    ]))
  })
});
var createUserUserSchema = createdUserQueryDtoSchema;
var createUserResponseSchema = z23.void();
var createUserContract = {
  request: createUserRequestSchema,
  response: createUserResponseSchema
};

// src/modules/user/push-tokens/push-tokens.contracts.ts
import { z as z24 } from "zod/v4";
var replacePushTokenRequestSchema = z24.object({
  body: z24.object({
    token: userDbSchema.shape.pushToken.unwrap()
  })
});
var replacePushTokenContract = {
  request: replacePushTokenRequestSchema
};

// src/modules/user/update/update.contracts.ts
import { z as z25 } from "zod/v4";
var updateCurrentUserRequestSchema = z25.object({
  body: authenticatedUserForUpdateQueryDtoSchema
});
var updateCurrentUserResponseSchema = z25.void();
var updateCurrentUserContract = {
  request: updateCurrentUserRequestSchema,
  response: updateCurrentUserResponseSchema
};
var userDataResponseSchema = z25.object({
  userData: userDataQueryDtoSchema
});
var userDataContract = {
  response: userDataResponseSchema
};
var getCurrentUserResponseSchema = userDataQueryDtoSchema;
var getCurrentUserContract = {
  response: getCurrentUserResponseSchema
};
var deleteProfilePictureRequestSchema = z25.object({
  body: z25.object({
    profilePicPath: z25.string()
  })
});
var deleteProfilePictureContract = {
  request: deleteProfilePictureRequestSchema
};
var replaceProfilePictureResponseSchema = z25.object({
  profilePicPath: z25.string(),
  url: z25.string(),
  message: z25.string()
});
var replaceProfilePictureContract = {
  response: replaceProfilePictureResponseSchema
};

// src/modules/video-analysis/video-analysis.contracts.ts
import { z as z26 } from "zod/v4";
var createVideoUploadUrlRequestSchema = z26.object({
  body: z26.object({
    exercise: exerciseDbSchema.shape.name,
    fileType: z26.string(),
    jobId: z26.string()
  })
});
var createVideoUploadUrlResponseSchema = z26.object({
  uploadUrl: z26.string(),
  fileKey: z26.string(),
  requestId: z26.string()
});
var createVideoUploadUrlContract = {
  request: createVideoUploadUrlRequestSchema,
  response: createVideoUploadUrlResponseSchema
};

// src/modules/video-analysis/video-analysis.dtos.ts
import { z as z27 } from "zod/v4";
var enqueueAnalyzeVideoParamsDtoSchema = z27.object({
  fileKey: z27.string(),
  exercise: z27.string(),
  userId: userDbSchema.shape.id,
  requestId: z27.string(),
  sentryTrace: z27.string().optional(),
  baggage: z27.string().optional()
});
var analyzeVideoPayloadDtoSchema = enqueueAnalyzeVideoParamsDtoSchema.extend({
  expiresAt: z27.number()
});
var squatRepetitionDtoSchema = z27.object({
  depth: z27.object({
    value: z27.number(),
    status: z27.string(),
    confidence: z27.number()
  }),
  backLean: z27.object({
    value: z27.number(),
    excessive: z27.boolean(),
    confidence: z27.number()
  }),
  audit: z27.object({
    framesAnalyzed: z27.number(),
    validFrames: z27.number(),
    cameraAngle: z27.string(),
    rawBottomAngle: z27.number(),
    samplingRate: z27.string()
  })
});
var analyzeVideoResultPayloadDtoSchema = /* @__PURE__ */ __name((resultSchema) => z27.intersection(z27.object({
  jobId: z27.string(),
  userId: userDbSchema.shape.id,
  exercise: z27.string(),
  requestId: z27.string().optional()
}), z27.discriminatedUnion("status", [
  z27.object({
    status: z27.literal("completed"),
    result: z27.array(resultSchema),
    error: z27.null()
  }),
  z27.object({
    status: z27.literal("failed"),
    result: z27.null(),
    error: z27.string()
  })
])), "analyzeVideoResultPayloadDtoSchema");

// src/modules/web-sockets/web-sockets.contracts.ts
import { z as z28 } from "zod/v4";
var createWebSocketTicketRequestSchema = z28.object({
  body: z28.object({
    username: userDbSchema.shape.username
  })
});
var createWebSocketTicketResponseSchema = z28.object({
  ticket: z28.string()
});
var createWebSocketTicketContract = {
  request: createWebSocketTicketRequestSchema,
  response: createWebSocketTicketResponseSchema
};

// src/modules/workout/plan/plan.contracts.ts
import { z as z30 } from "zod/v4";

// src/modules/workout/plan/plan.dtos.ts
import { z as z29 } from "zod/v4";
var workoutExerciseInputQueryDtoSchema = z29.object({
  exerciseId: exerciseDbSchema.shape.id,
  sets: z29.array(workoutSetDbSchema.shape.reps),
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex
});
var workoutSplitInputBaseQueryDtoSchema = z29.object({
  name: workoutSplitDbSchema.shape.name.min(1, "Split name is required"),
  orderIndex: z29.number().int().nonnegative(),
  exercises: z29.array(workoutExerciseInputQueryDtoSchema).min(1, "Each split must include at least one exercise")
});
var saveWorkoutSplitInputQueryDtoSchema = workoutSplitInputBaseQueryDtoSchema.extend({
  id: workoutSplitDbSchema.shape.id.optional()
});
var saveWorkoutSplitPayloadQueryDtoSchema = z29.array(saveWorkoutSplitInputQueryDtoSchema).min(1, "Workout must include at least one split");
var exerciseInPlanQueryDtoSchema = z29.object({
  exerciseToSplitId: exerciseToWorkoutSplitDbSchema.shape.id,
  exerciseId: exerciseDbSchema.shape.id,
  name: exerciseDbSchema.shape.name,
  sets: z29.array(z29.object({
    orderIndex: workoutSetDbSchema.shape.orderIndex,
    reps: workoutSetDbSchema.shape.reps
  })),
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
  isActive: exerciseToWorkoutSplitDbSchema.shape.isActive,
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var workoutSplitQueryDtoSchema = z29.object({
  id: workoutSplitDbSchema.shape.id,
  workoutId: workoutSplitDbSchema.shape.workoutId,
  name: workoutSplitDbSchema.shape.name,
  orderIndex: workoutSplitDbSchema.shape.orderIndex,
  createdAt: serializedDateSchema,
  muscleGroup: z29.string().nullable(),
  estimatedDurationMinutes: z29.number().nullable(),
  isActive: workoutSplitDbSchema.shape.isActive,
  exercises: z29.array(exerciseInPlanQueryDtoSchema)
});
var wholeUserWorkoutPlanQueryDtoSchema = z29.object({
  id: workoutPlanDbSchema.shape.id,
  numberOfSplits: z29.number(),
  createdAt: serializedDateSchema,
  userId: userDbSchema.shape.id,
  isActive: workoutPlanDbSchema.shape.isActive,
  updatedAt: serializedDateSchema,
  workoutSplits: z29.array(workoutSplitQueryDtoSchema).nullable()
});
var workoutPlanIdQueryDtoSchema = z29.object({
  id: workoutPlanDbSchema.shape.id
});
var workoutSplitIdQueryDtoSchema = z29.object({
  id: workoutSplitDbSchema.shape.id
});
var exerciseAssignmentIdQueryDtoSchema = z29.object({
  id: exerciseToWorkoutSplitDbSchema.shape.id
});

// src/modules/workout/plan/plan.contracts.ts
var getWorkoutPlanRequestSchema = z30.object({
  query: z30.object({
    tz: z30.string().optional()
  })
});
var getWorkoutPlanResponseSchema = z30.object({
  workoutPlan: wholeUserWorkoutPlanQueryDtoSchema.nullable()
});
var getWorkoutPlanContract = {
  request: getWorkoutPlanRequestSchema,
  response: getWorkoutPlanResponseSchema
};
var replaceWorkoutPlanRequestSchema = z30.object({
  body: z30.object({
    workoutData: saveWorkoutSplitPayloadQueryDtoSchema,
    workoutName: z30.string().optional(),
    tz: z30.string()
  })
});
var replaceWorkoutPlanResponseSchema = z30.void();
var replaceWorkoutPlanContract = {
  request: replaceWorkoutPlanRequestSchema,
  response: replaceWorkoutPlanResponseSchema
};

// src/modules/workout/tracking/tracking.contracts.ts
import { z as z32 } from "zod/v4";

// src/modules/workout/tracking/tracking.dtos.ts
import { z as z31 } from "zod/v4";
var trackedSetQueryDtoSchema = z31.object({
  reps: trackingSetDbSchema.shape.reps,
  weight: trackingSetDbSchema.shape.weight,
  setIndex: trackingSetDbSchema.shape.setIndex
});
var finishedWorkoutEntryBaseQueryDtoSchema = z31.object({
  trackedSets: z31.array(trackedSetQueryDtoSchema),
  notes: exerciseTrackingDbSchema.shape.notes.optional()
});
var finishedWorkoutEntryQueryDtoSchema = finishedWorkoutEntryBaseQueryDtoSchema.extend({
  isExerciseAssignedToSplit: z31.boolean(),
  exerciseToSplitId: exerciseTrackingDbSchema.shape.exerciseToSplitId,
  exerciseId: exerciseTrackingDbSchema.shape.exerciseId
});
var exerciseMetadataQueryDtoSchema = z31.object({
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var exerciseTrackingPrMaxQueryDtoSchema = z31.object({
  exercise: exerciseDbSchema.shape.name,
  weight: trackingSetDbSchema.shape.weight,
  reps: trackingSetDbSchema.shape.reps,
  workoutTimeUtc: serializedDateSchema
});
var exerciseTrackingAnalysisQueryDtoSchema = z31.object({
  uniqueDays: z31.number(),
  mostFrequentSplit: z31.string().nullable(),
  mostFrequentSplitDays: z31.number().nullable(),
  lastWorkoutDate: z31.string().nullable(),
  splitDaysByName: z31.record(z31.string(), z31.number()),
  prs: z31.object({
    prMax: exerciseTrackingPrMaxQueryDtoSchema.nullable()
  })
});
var trackingMapItemQueryDtoSchema = z31.object({
  id: exerciseTrackingDbSchema.shape.id,
  exerciseToSplitId: exerciseToWorkoutSplitDbSchema.shape.id,
  weight: z31.array(trackingSetDbSchema.shape.weight),
  reps: z31.array(trackingSetDbSchema.shape.reps),
  notes: exerciseTrackingDbSchema.shape.notes,
  exerciseId: exerciseDbSchema.shape.id,
  workoutSplitId: workoutSplitDbSchema.shape.id,
  splitName: workoutSplitDbSchema.shape.name,
  exercise: exerciseDbSchema.shape.name,
  workoutDate: serializedDateSchema,
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
  exerciseToWorkoutSplit: z31.object({
    sets: z31.array(workoutSetDbSchema.shape.reps),
    exercises: exerciseMetadataQueryDtoSchema
  })
});
var trackingByDateItemQueryDtoSchema = trackingMapItemQueryDtoSchema.omit({
  workoutDate: true
});
var trackingBySplitNameItemQueryDtoSchema = trackingMapItemQueryDtoSchema.omit({
  splitName: true
});
var groupedTrackingItemQueryDtoSchema = z31.object({
  exerciseTracking: z31.object({
    exerciseTrackingId: exerciseTrackingDbSchema.shape.id,
    sets: z31.array(z31.object({
      setIndex: trackingSetDbSchema.shape.setIndex,
      weight: trackingSetDbSchema.shape.weight,
      reps: trackingSetDbSchema.shape.reps
    })),
    notes: exerciseTrackingDbSchema.shape.notes,
    exerciseAssignment: z31.object({
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
var trackingByExerciseToSplitIdItemQueryDtoSchema = groupedTrackingItemQueryDtoSchema.shape.exerciseTracking.omit({
  notes: true
}).extend({
  workoutStartLocal: serializedDateSchema
});
var personalRecordQueryDtoSchema = z31.object({
  exerciseToSplitId: exerciseTrackingDbSchema.shape.exerciseToSplitId,
  exerciseId: exerciseDbSchema.shape.id,
  exerciseName: exerciseDbSchema.shape.name,
  prWeight: trackingSetDbSchema.shape.weight,
  prReps: trackingSetDbSchema.shape.reps,
  prSetIndex: trackingSetDbSchema.shape.setIndex,
  estimatedOneRepMax: z31.number().nullable(),
  workoutStartLocal: serializedDateSchema
});
var personalRecordsQueryDtoSchema = z31.object({
  prs: z31.record(z31.string(), personalRecordQueryDtoSchema.omit({
    exerciseId: true
  }))
});
var exerciseTrackingStatsQueryDtoSchema = z31.object({
  workoutCount: z31.coerce.number(),
  hasExerciseTracking: z31.boolean(),
  nextWorkoutSplit: z31.object({
    id: workoutSplitDbSchema.shape.id,
    name: workoutSplitDbSchema.shape.name,
    orderIndex: workoutSplitDbSchema.shape.orderIndex,
    muscleGroup: z31.string().nullable()
  }).nullable(),
  workoutTargets: z31.object({
    workoutCountThisWeek: z31.coerce.number(),
    workoutCountScheduledPerWeek: z31.coerce.number(),
    weekStreak: z31.coerce.number()
  }),
  lastWorkoutStats: z31.object({
    workoutDate: z31.string().nullable(),
    workoutSplitName: workoutSplitDbSchema.shape.name.nullable(),
    exerciseTrackedCount: z31.coerce.number().nullable(),
    setTrackedCount: z31.coerce.number().nullable()
  }),
  latestPr: z31.array(personalRecordQueryDtoSchema).max(1)
});
var exerciseTrackingMapsQueryDtoSchema = z31.object({
  byDate: z31.record(z31.string(), z31.object({
    durationMins: z31.number(),
    exerciseTracked: z31.array(groupedTrackingItemQueryDtoSchema)
  }))
});
var exerciseHistoryQueryDtoSchema = z31.object({
  byExerciseToSplitId: z31.record(z31.string(), z31.object({
    exerciseTracked: z31.array(trackingByExerciseToSplitIdItemQueryDtoSchema)
  }))
});
var exerciseTrackingAndStatsQueryDtoSchema = z31.object({
  trackingStats: exerciseTrackingStatsQueryDtoSchema,
  trackingMaps: exerciseTrackingMapsQueryDtoSchema
});
var exerciseTrackingAndStatsRowQueryDtoSchema = z31.object({
  data: exerciseTrackingAndStatsQueryDtoSchema
});
var exerciseTrackingStatsRowQueryDtoSchema = z31.object({
  data: exerciseTrackingStatsQueryDtoSchema
});
var exerciseTrackingMapsRowQueryDtoSchema = z31.object({
  data: exerciseTrackingMapsQueryDtoSchema
});
var exerciseHistoryRowQueryDtoSchema = z31.object({
  data: exerciseHistoryQueryDtoSchema
});
var personalRecordsRowQueryDtoSchema = z31.object({
  data: personalRecordsQueryDtoSchema
});
var workoutSplitLookupQueryDtoSchema = z31.object({
  workoutSplitId: workoutSplitDbSchema.shape.id
});
var workoutSummaryIdQueryDtoSchema = z31.object({
  id: z31.string().uuid()
});
var exerciseTrackingIdQueryDtoSchema = z31.object({
  id: exerciseTrackingDbSchema.shape.id
});

// src/modules/workout/tracking/tracking.contracts.ts
var getWorkoutHistoryRequestSchema = z32.object({
  query: z32.object({
    tz: z32.string().optional()
  })
});
var getWorkoutHistoryResponseSchema = exerciseTrackingMapsQueryDtoSchema;
var getWorkoutHistoryContract = {
  request: getWorkoutHistoryRequestSchema,
  response: getWorkoutHistoryResponseSchema
};
var getExerciseHistoryRequestSchema = z32.object({
  query: z32.object({
    tz: z32.string().optional()
  })
});
var getExerciseHistoryResponseSchema = exerciseHistoryQueryDtoSchema;
var getExerciseHistoryContract = {
  request: getExerciseHistoryRequestSchema,
  response: getExerciseHistoryResponseSchema
};
var getWorkoutStatisticsResponseSchema = exerciseTrackingStatsQueryDtoSchema;
var getWorkoutStatisticsContract = {
  request: getWorkoutHistoryRequestSchema,
  response: getWorkoutStatisticsResponseSchema
};
var createWorkoutSessionRequestSchema = z32.object({
  body: z32.object({
    workout: z32.array(finishedWorkoutEntryQueryDtoSchema),
    tz: z32.string().optional(),
    workoutStartUtc: z32.string().datetime("workoutStartUtc must be a valid ISO datetime"),
    workoutEndUtc: z32.string().datetime("workoutEndUtc must be a valid ISO datetime").optional().nullable()
  })
});
var createWorkoutSessionResponseSchema = z32.void();
var createWorkoutSessionContract = {
  request: createWorkoutSessionRequestSchema,
  response: createWorkoutSessionResponseSchema
};
var getPersonalRecordsResponseSchema = personalRecordsQueryDtoSchema;
var getPersonalRecordsRequestSchema = z32.object({
  query: z32.object({
    tz: z32.string().optional()
  })
});
var getPersonalRecordsContract = {
  request: getPersonalRecordsRequestSchema,
  response: getPersonalRecordsResponseSchema
};
export {
  accessTokenPayloadDtoSchema,
  addAerobicInputQueryDtoSchema,
  aerobicMutationRowQueryDtoSchema,
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
  changeEmailTokenPayloadDtoSchema,
  createAerobicEntryContract,
  createAerobicEntryRequestSchema,
  createAerobicEntryResponseSchema,
  createPasswordResetRequestContract,
  createPasswordResetRequestSchema,
  createUserContract,
  createUserRequestSchema,
  createUserResponseSchema,
  createUserUserSchema,
  createVerificationEmailContract,
  createVerificationEmailRequestSchema,
  createVideoUploadUrlContract,
  createVideoUploadUrlRequestSchema,
  createVideoUploadUrlResponseSchema,
  createWebSocketTicketContract,
  createWebSocketTicketRequestSchema,
  createWebSocketTicketResponseSchema,
  createWorkoutSessionContract,
  createWorkoutSessionRequestSchema,
  createWorkoutSessionResponseSchema,
  createdUserQueryDtoSchema,
  createdUserRawQueryDtoSchema,
  createdUserRowQueryDtoSchema,
  deleteAerobicEntryContract,
  deleteAerobicEntryRequestSchema,
  deleteMessageContract,
  deleteMessageRequestSchema,
  deleteMessageResponseSchema,
  deleteProfilePictureContract,
  deleteProfilePictureRequestSchema,
  deletedMessageQueryDtoSchema,
  emailVerifyPayloadDtoSchema,
  enqueueAnalyzeVideoParamsDtoSchema,
  exerciseAssignmentIdQueryDtoSchema,
  exerciseDbSchema,
  exerciseHistoryQueryDtoSchema,
  exerciseHistoryRowQueryDtoSchema,
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
  finishedWorkoutEntryQueryDtoSchema,
  forgotPasswordPayloadDtoSchema,
  getAerobicHistoryContract,
  getAerobicHistoryRequestSchema,
  getAerobicHistoryResponseSchema,
  getAllExercisesExerciseQueryDtoSchema,
  getCurrentUserContract,
  getCurrentUserResponseSchema,
  getExerciseHistoryContract,
  getExerciseHistoryRequestSchema,
  getExerciseHistoryResponseSchema,
  getPersonalRecordsContract,
  getPersonalRecordsRequestSchema,
  getPersonalRecordsResponseSchema,
  getVerificationStatusContract,
  getVerificationStatusRequestSchema,
  getWorkoutHistoryContract,
  getWorkoutHistoryRequestSchema,
  getWorkoutHistoryResponseSchema,
  getWorkoutPlanContract,
  getWorkoutPlanRequestSchema,
  getWorkoutPlanResponseSchema,
  getWorkoutStatisticsContract,
  getWorkoutStatisticsResponseSchema,
  googleOAuthContract,
  googleOAuthRequestSchema,
  googleTokenVerificationResultDtoSchema,
  lastLoginQueryDtoSchema,
  listExercisesContract,
  listExercisesResponseSchema,
  listMessagesContract,
  listMessagesRequestSchema,
  listMessagesResponseSchema,
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
  personalRecordQueryDtoSchema,
  personalRecordsQueryDtoSchema,
  personalRecordsRowQueryDtoSchema,
  proceedLoginResponseSchema,
  prsViewDbSchema,
  refreshTokenContract,
  refreshTokenResponseSchema,
  replaceProfilePictureContract,
  replaceProfilePictureResponseSchema,
  replacePushTokenContract,
  replacePushTokenRequestSchema,
  replaceWorkoutPlanContract,
  replaceWorkoutPlanRequestSchema,
  replaceWorkoutPlanResponseSchema,
  resetPasswordContract,
  resetPasswordRequestSchema,
  resetPasswordResponseSchema,
  saveWorkoutSplitInputQueryDtoSchema,
  saveWorkoutSplitPayloadQueryDtoSchema,
  serializedDateSchema,
  squatRepetitionDtoSchema,
  timezoneSchema,
  tokenVersionQueryDtoSchema,
  trackingByDateItemQueryDtoSchema,
  trackingBySplitNameItemQueryDtoSchema,
  trackingMapItemQueryDtoSchema,
  trackingSetDbSchema,
  updateAerobicEntryContract,
  updateAerobicEntryRequestSchema,
  updateCurrentUserContract,
  updateCurrentUserRequestSchema,
  updateCurrentUserResponseSchema,
  updateUnverifiedAccountEmailContract,
  updateUnverifiedAccountEmailRequestSchema,
  userAerobicsQueryDtoSchema,
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
  verifyEmailContract,
  verifyEmailRequestSchema,
  weeklyDataQueryDtoSchema,
  wholeUserWorkoutPlanQueryDtoSchema,
  workoutExerciseInputQueryDtoSchema,
  workoutPlanDbSchema,
  workoutPlanIdQueryDtoSchema,
  workoutSetDbSchema,
  workoutSplitDbSchema,
  workoutSplitIdQueryDtoSchema,
  workoutSplitLookupQueryDtoSchema,
  workoutSplitQueryDtoSchema,
  workoutSummaryDbSchema,
  workoutSummaryIdQueryDtoSchema
};
