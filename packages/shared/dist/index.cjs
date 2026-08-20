"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  accessTokenPayloadSchema: () => accessTokenPayloadSchema,
  addAerobicsRequest: () => addAerobicsRequest,
  addWorkoutRequest: () => addWorkoutRequest,
  addWorkoutResponseSchema: () => addWorkoutResponseSchema,
  adherenceExerciseStatsSchema: () => adherenceExerciseStatsSchema,
  aerobicTrackingDbSchema: () => aerobicTrackingDbSchema,
  aerobicsDailyRecordSchema: () => aerobicsDailyRecordSchema,
  aerobicsWeeklyRecordSchema: () => aerobicsWeeklyRecordSchema,
  allUserMessageSchema: () => allUserMessageSchema,
  analyzeVideoPayloadSchema: () => analyzeVideoPayloadSchema,
  analyzeVideoResultPayloadSchema: () => analyzeVideoResultPayloadSchema,
  appleOAuthRequest: () => appleOAuthRequest,
  appleTokenVerificationResultSchema: () => appleTokenVerificationResultSchema,
  bootstrapRequest: () => bootstrapRequest,
  bootstrapResponseSchema: () => bootstrapResponseSchema,
  changeEmailAndVerifyRequest: () => changeEmailAndVerifyRequest,
  changeEmailTokenPayloadSchema: () => changeEmailTokenPayloadSchema,
  checkUserVerifyRequest: () => checkUserVerifyRequest,
  createUserRequest: () => createUserRequest,
  createUserResponseSchema: () => createUserResponseSchema,
  createUserUserSchema: () => createUserUserSchema,
  deleteMessageRequest: () => deleteMessageRequest,
  deleteMessageResponseSchema: () => deleteMessageResponseSchema,
  deleteProfilePicRequest: () => deleteProfilePicRequest,
  deletedMessageSchema: () => deletedMessageSchema,
  emailVerifyPayloadSchema: () => emailVerifyPayloadSchema,
  enqueueAanalyzeVideoParamsSchema: () => enqueueAanalyzeVideoParamsSchema,
  exerciseDbSchema: () => exerciseDbSchema,
  exerciseInPlanSchema: () => exerciseInPlanSchema,
  exerciseMetadataSchema: () => exerciseMetadataSchema,
  exerciseToWorkoutSplitDbSchema: () => exerciseToWorkoutSplitDbSchema,
  exerciseToWorkoutSplitExpandedViewDbSchema: () => exerciseToWorkoutSplitExpandedViewDbSchema,
  exerciseTrackingAnalysisSchema: () => exerciseTrackingAnalysisSchema,
  exerciseTrackingAndStatsSchema: () => exerciseTrackingAndStatsSchema,
  exerciseTrackingDbSchema: () => exerciseTrackingDbSchema,
  exerciseTrackingExpandedViewDbSchema: () => exerciseTrackingExpandedViewDbSchema,
  exerciseTrackingPrMaxSchema: () => exerciseTrackingPrMaxSchema,
  finishUserWorkoutResponseSchema: () => finishUserWorkoutResponseSchema,
  finishWorkoutRequest: () => finishWorkoutRequest,
  forgotPasswordPayloadSchema: () => forgotPasswordPayloadSchema,
  generateTicketRequest: () => generateTicketRequest,
  generateTicketResponseSchema: () => generateTicketResponseSchema,
  getAerobicsRequest: () => getAerobicsRequest,
  getAllExercisesExerciseSchema: () => getAllExercisesExerciseSchema,
  getAllExercisesResponseSchema: () => getAllExercisesResponseSchema,
  getAllMessagesRequest: () => getAllMessagesRequest,
  getAllUserMessagesResponseSchema: () => getAllUserMessagesResponseSchema,
  getAnalyticsResponseSchema: () => getAnalyticsResponseSchema,
  getAuthenticatedUserByIdResponseSchema: () => getAuthenticatedUserByIdResponseSchema,
  getExerciseTrackingRequest: () => getExerciseTrackingRequest,
  getExerciseTrackingResponseSchema: () => getExerciseTrackingResponseSchema,
  getPresignedUrlFromS3ResponseSchema: () => getPresignedUrlFromS3ResponseSchema,
  getPresignedUrlS3Request: () => getPresignedUrlS3Request,
  getWholeUserWorkoutPlanResponseSchema: () => getWholeUserWorkoutPlanResponseSchema,
  getWholeWorkoutPlanRequest: () => getWholeWorkoutPlanRequest,
  googleOAuthRequest: () => googleOAuthRequest,
  googleTokenVerificationResultSchema: () => googleTokenVerificationResultSchema,
  loginRequest: () => loginRequest,
  loginResponseSchema: () => loginResponseSchema,
  logoutResponseSchema: () => logoutResponseSchema,
  markMessageAsReadRequest: () => markMessageAsReadRequest,
  markMessageAsReadResponseSchema: () => markMessageAsReadResponseSchema,
  messageAfterSendResponseSchema: () => messageAfterSendResponseSchema,
  messageAsReadSchema: () => messageAsReadSchema,
  messageDbSchema: () => messageDbSchema,
  oAuthLoginResponseSchema: () => oAuthLoginResponseSchema,
  oauthAccountDbSchema: () => oauthAccountDbSchema,
  proceedLoginResponseSchema: () => proceedLoginResponseSchema,
  prsViewDbSchema: () => prsViewDbSchema,
  queryGetExerciseMapByMuscleRowSchema: () => queryGetExerciseMapByMuscleRowSchema,
  refreshTokenResponseSchema: () => refreshTokenResponseSchema,
  resetPasswordRequest: () => resetPasswordRequest,
  resetPasswordResponseSchema: () => resetPasswordResponseSchema,
  saveUserPushTokenRequest: () => saveUserPushTokenRequest,
  sendChangePassEmailRequest: () => sendChangePassEmailRequest,
  sendVerificationMailRequest: () => sendVerificationMailRequest,
  serializedDateSchema: () => serializedDateSchema,
  setProfilePicAndUpdateDBResponseSchema: () => setProfilePicAndUpdateDBResponseSchema,
  squatRepetitionSchema: () => squatRepetitionSchema,
  timezoneSchema: () => timezoneSchema,
  tokenVersionResultSchema: () => tokenVersionResultSchema,
  trackingByDateItemSchema: () => trackingByDateItemSchema,
  trackingBySplitNameItemSchema: () => trackingBySplitNameItemSchema,
  trackingMapItemSchema: () => trackingMapItemSchema,
  trackingSetDbSchema: () => trackingSetDbSchema,
  updateAuthenticatedUserResponseSchema: () => updateAuthenticatedUserResponseSchema,
  updateUserRequest: () => updateUserRequest,
  userAerobicsResponseSchema: () => userAerobicsResponseSchema,
  userAfterBumpSchema: () => userAfterBumpSchema,
  userByIndetifierSchema: () => userByIndetifierSchema,
  userDataResponseSchema: () => userDataResponseSchema,
  userDataSchema: () => userDataSchema,
  userDbSchema: () => userDbSchema,
  userInsertDbSchema: () => userInsertDbSchema,
  userReminderSettingDbSchema: () => userReminderSettingDbSchema,
  userSplitInformationDbSchema: () => userSplitInformationDbSchema,
  userUpdateDbSchema: () => userUpdateDbSchema,
  verifyAccountRequest: () => verifyAccountRequest,
  weeklyDataSchema: () => weeklyDataSchema,
  wholeUserWorkoutPlanSchema: () => wholeUserWorkoutPlanSchema,
  workoutPlanDbSchema: () => workoutPlanDbSchema,
  workoutRmRecordSchema: () => workoutRmRecordSchema,
  workoutSetDbSchema: () => workoutSetDbSchema,
  workoutSplitDbSchema: () => workoutSplitDbSchema,
  workoutSplitSchema: () => workoutSplitSchema,
  workoutSplitsMapItemSchema: () => workoutSplitsMapItemSchema,
  workoutSplitsMapSchema: () => workoutSplitsMapSchema,
  workoutSummaryDbSchema: () => workoutSummaryDbSchema
});
module.exports = __toCommonJS(index_exports);

// src/common/transport.schemas.ts
var import_v4 = require("zod/v4");
var serializedDateSchema = import_v4.z.string();
var timezoneSchema = import_v4.z.string();

// src/database/database.schemas.ts
var import_drizzle_zod = require("drizzle-zod");

// ../../src/infrastructure/db/schema/drizzle/roles.ts
var import_pg_core = require("drizzle-orm/pg-core");
var anonRole = (0, import_pg_core.pgRole)("anon");
var authenticatedRole = (0, import_pg_core.pgRole)("authenticated");
var guestRole = (0, import_pg_core.pgRole)("guest");
var serviceRole = (0, import_pg_core.pgRole)("service_role");
var appUserRole = (0, import_pg_core.pgRole)("app_user");
var appRuntimeUserRole = (0, import_pg_core.pgRole)("app_runtime_user", {
  createDb: false,
  createRole: false,
  inherit: false
});

// ../../src/infrastructure/db/schema/drizzle/schemas.ts
var import_pg_core2 = require("drizzle-orm/pg-core");
var authSchema = (0, import_pg_core2.pgSchema)("auth");
var identitySchema = (0, import_pg_core2.pgSchema)("identity");
var workoutSchema = (0, import_pg_core2.pgSchema)("workout");
var trackingSchema = (0, import_pg_core2.pgSchema)("tracking");
var remindersSchema = (0, import_pg_core2.pgSchema)("reminders");
var analyticsSchema = (0, import_pg_core2.pgSchema)("analytics");
var messagesSchema = (0, import_pg_core2.pgSchema)("messages");
var authProviders = identitySchema.enum("Auth Providers", [
  "apple",
  "google",
  "app"
]);

// ../../src/infrastructure/db/schema/drizzle/identity/user/table.ts
var import_drizzle_orm27 = require("drizzle-orm");
var import_pg_core30 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/messages/messages/table.ts
var import_drizzle_orm2 = require("drizzle-orm");
var import_pg_core4 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/messages/messages/policies.ts
var import_drizzle_orm = require("drizzle-orm");
var import_pg_core3 = require("drizzle-orm/pg-core");
var uid = import_drizzle_orm.sql`"identity"."current_user_id"()`;
function messagePolicies(t) {
  const participant = import_drizzle_orm.sql`${uid} = ${t.senderId} or ${uid} = ${t.receiverId}`;
  return [
    // Lets authenticated message participants read their sent or received messages.
    (0, import_pg_core3.pgPolicy)("Enable read access for auth users on message", {
      for: "select",
      to: authenticatedRole,
      using: participant
    }),
    // Lets authenticated users send as themselves or as the existing system sender.
    (0, import_pg_core3.pgPolicy)("Enable insert for auth users on message", {
      for: "insert",
      to: authenticatedRole,
      withCheck: import_drizzle_orm.sql`${uid} = ${t.senderId} or ${t.senderId} = '8dedd0e0-8c25-4c84-a05b-4ae5f5c48f3a'::uuid`
    }),
    // Lets authenticated message participants update a message while remaining participants.
    (0, import_pg_core3.pgPolicy)("Enable update for auth users on message", {
      for: "update",
      to: authenticatedRole,
      using: participant,
      withCheck: participant
    }),
    // Lets authenticated message participants delete their sent or received messages.
    (0, import_pg_core3.pgPolicy)("Enable delete for auth users on message", {
      for: "delete",
      to: authenticatedRole,
      using: participant
    })
  ];
}
__name(messagePolicies, "messagePolicies");

// ../../src/infrastructure/db/schema/drizzle/messages/messages/table.ts
var uid2 = import_drizzle_orm2.sql`"identity"."current_user_id"()`;
var message = messagesSchema.table("message", {
  id: (0, import_pg_core4.uuid)("id").defaultRandom().notNull(),
  senderId: (0, import_pg_core4.uuid)("sender_id").default(uid2).notNull(),
  receiverId: (0, import_pg_core4.uuid)("receiver_id").default(uid2).notNull(),
  subject: (0, import_pg_core4.text)("subject").default("Subject").notNull(),
  msg: (0, import_pg_core4.text)("msg").default("Hello World").notNull(),
  sentAt: (0, import_pg_core4.timestamp)("sent_at", {
    withTimezone: true
  }).default(import_drizzle_orm2.sql`(now() AT TIME ZONE 'utc')`).notNull(),
  isRead: (0, import_pg_core4.boolean)("is_read").default(false).notNull()
}, (t) => [
  (0, import_pg_core4.primaryKey)({
    name: "message_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core4.foreignKey)({
    name: "message_sender_id_fkey",
    columns: [
      t.senderId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core4.foreignKey)({
    name: "message_receiver_id_fkey",
    columns: [
      t.receiverId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core4.index)("message_receiver_id_idx").on(t.receiverId),
  ...messagePolicies(t)
]);
var messageRelations = (0, import_drizzle_orm2.relations)(message, ({ one }) => ({
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
var import_drizzle_orm4 = require("drizzle-orm");
var import_pg_core6 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/reminders/user_reminder_setting/policies.ts
var import_drizzle_orm3 = require("drizzle-orm");
var import_pg_core5 = require("drizzle-orm/pg-core");
var uid3 = import_drizzle_orm3.sql`"identity"."current_user_id"()`;
function userReminderSettingPolicies(t) {
  return [
    // Lets authenticated users read only their own reminder settings.
    (0, import_pg_core5.pgPolicy)("auth can SELECT own reminder settings", {
      for: "select",
      to: authenticatedRole,
      using: import_drizzle_orm3.sql`${uid3} = ${t.userId}`
    }),
    // Lets authenticated users insert reminder settings only for themselves.
    (0, import_pg_core5.pgPolicy)("auth can INSERT own reminder settings", {
      for: "insert",
      to: authenticatedRole,
      withCheck: import_drizzle_orm3.sql`${uid3} = ${t.userId}`
    }),
    // Lets authenticated users update their own reminder settings and preserves ownership.
    (0, import_pg_core5.pgPolicy)("auth can UPDATE own reminder settings", {
      for: "update",
      to: authenticatedRole,
      using: import_drizzle_orm3.sql`${uid3} = ${t.userId}`,
      withCheck: import_drizzle_orm3.sql`${uid3} = ${t.userId}`
    }),
    // Provides the original additional update policy for settings owned by the user.
    (0, import_pg_core5.pgPolicy)("Allow authenticated users to update their own reminder settings", {
      for: "update",
      to: authenticatedRole,
      using: import_drizzle_orm3.sql`${uid3} = ${t.userId}`
    })
  ];
}
__name(userReminderSettingPolicies, "userReminderSettingPolicies");

// ../../src/infrastructure/db/schema/drizzle/reminders/user_reminder_setting/table.ts
var userReminderSetting = remindersSchema.table("user_reminder_setting", {
  userId: (0, import_pg_core6.uuid)("user_id").notNull(),
  workoutRemindersEnabled: (0, import_pg_core6.boolean)("workout_reminders_enabled").default(true).notNull(),
  reminderOffsetMinutes: (0, import_pg_core6.integer)("reminder_offset_minutes").default(60).notNull(),
  updatedAt: (0, import_pg_core6.timestamp)("updated_at", {
    withTimezone: true
  }).default(import_drizzle_orm4.sql`timezone('UTC', now())`).notNull(),
  timezone: (0, import_pg_core6.text)("timezone").default("'UTC'::text")
}, (t) => [
  (0, import_pg_core6.primaryKey)({
    name: "user_reminder_setting_pkey",
    columns: [
      t.userId
    ]
  }),
  (0, import_pg_core6.foreignKey)({
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
var userReminderSettingRelations = (0, import_drizzle_orm4.relations)(userReminderSetting, ({ one }) => ({
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
var import_drizzle_orm21 = require("drizzle-orm");
var import_pg_core24 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/workout/workout_split/table.ts
var import_drizzle_orm20 = require("drizzle-orm");
var import_pg_core23 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/tracking/workout_summary/table.ts
var import_drizzle_orm16 = require("drizzle-orm");
var import_pg_core19 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/tracking/exercise_tracking/table.ts
var import_drizzle_orm14 = require("drizzle-orm");
var import_pg_core16 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/workout/exercises/table.ts
var import_drizzle_orm10 = require("drizzle-orm");
var import_pg_core12 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/workout/exercisetoworkoutsplit/table.ts
var import_drizzle_orm8 = require("drizzle-orm");
var import_pg_core10 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/workout/workout_set/table.ts
var import_drizzle_orm6 = require("drizzle-orm");
var import_pg_core8 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/workout/workout_set/policies.ts
var import_drizzle_orm5 = require("drizzle-orm");
var import_pg_core7 = require("drizzle-orm/pg-core");
var currentUserId = import_drizzle_orm5.sql`"identity"."current_user_id"()`;
function workoutSetPolicies(table) {
  const ownsWorkoutSet = import_drizzle_orm5.sql`exists (
    select 1
    from "workout"."exercise_to_workout_split" ets
    join "workout"."workout_split" ws on ws."id" = ets."workout_split_id"
    join "workout"."workout_plan" wp on wp."id" = ws."workout_id"
    where ets."id" = ${table.exerciseToSplitId}
      and wp."user_id" = ${currentUserId}
  )`;
  return [
    // Lets authenticated users read planned sets only from workout plans they own.
    (0, import_pg_core7.pgPolicy)("Enable read access for auth users on workout_set", {
      for: "select",
      to: authenticatedRole,
      using: ownsWorkoutSet
    }),
    // Lets authenticated users add planned sets only to workout plans they own.
    (0, import_pg_core7.pgPolicy)("Enable insert for auth users on workout_set", {
      for: "insert",
      to: authenticatedRole,
      withCheck: ownsWorkoutSet
    }),
    // Lets authenticated users update planned sets only within workout plans they own.
    (0, import_pg_core7.pgPolicy)("Enable update for auth users on workout_set", {
      for: "update",
      to: authenticatedRole,
      using: ownsWorkoutSet,
      withCheck: ownsWorkoutSet
    }),
    // Lets authenticated users delete planned sets only from workout plans they own.
    (0, import_pg_core7.pgPolicy)("Enable delete for auth users on workout_set", {
      for: "delete",
      to: authenticatedRole,
      using: ownsWorkoutSet
    })
  ];
}
__name(workoutSetPolicies, "workoutSetPolicies");

// ../../src/infrastructure/db/schema/drizzle/workout/workout_set/table.ts
var workoutSet = workoutSchema.table("workout_set", {
  id: (0, import_pg_core8.uuid)("id").defaultRandom().notNull(),
  exerciseToSplitId: (0, import_pg_core8.bigint)("exercise_to_split_id", {
    mode: "number"
  }).notNull(),
  orderIndex: (0, import_pg_core8.integer)("order_index").notNull(),
  reps: (0, import_pg_core8.integer)("reps").notNull()
}, (t) => [
  (0, import_pg_core8.primaryKey)({
    name: "workout_set_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core8.unique)("workout_set_exercise_order_unique").on(t.exerciseToSplitId, t.orderIndex),
  (0, import_pg_core8.foreignKey)({
    name: "workout_set_exercise_to_split_id_fkey",
    columns: [
      t.exerciseToSplitId
    ],
    foreignColumns: [
      exerciseToWorkoutSplit.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core8.index)("workout_set_exercise_to_split_id_idx").on(t.exerciseToSplitId),
  ...workoutSetPolicies(t)
]);
var workoutSetRelations = (0, import_drizzle_orm6.relations)(workoutSet, ({ one }) => ({
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
var import_drizzle_orm7 = require("drizzle-orm");
var import_pg_core9 = require("drizzle-orm/pg-core");
var uid4 = import_drizzle_orm7.sql`"identity"."current_user_id"()`;
function exerciseToWorkoutSplitPolicies(t) {
  const owns = import_drizzle_orm7.sql`${uid4} = (select wp."user_id" from "workout"."workout_plan" wp join "workout"."workout_split" ws on ws."workout_id" = wp."id" where ws."id" = ${t.workoutSplitId})`;
  const ownsForDelete = import_drizzle_orm7.sql`exists (select 1 from "workout"."workout_split" ws join "workout"."workout_plan" wp on wp."id" = ws."workout_id" where ws."id" = ${t.workoutSplitId} and wp."user_id" = ${uid4})`;
  return [
    // Lets authenticated users read exercise assignments in splits they own.
    (0, import_pg_core9.pgPolicy)("Enable read access for auth users on exercise_to_workout_split", {
      for: "select",
      to: authenticatedRole,
      using: owns
    }),
    // Lets authenticated users add exercise assignments only to splits they own.
    (0, import_pg_core9.pgPolicy)("Enable insert for auth users on exercise_to_workout_split", {
      for: "insert",
      to: authenticatedRole,
      withCheck: owns
    }),
    // Lets authenticated users update exercise assignments only in splits they own.
    (0, import_pg_core9.pgPolicy)("Enable update for auth users on exercise_to_workout_split", {
      for: "update",
      to: authenticatedRole,
      using: owns,
      withCheck: owns
    }),
    // Lets authenticated users delete exercise assignments only from splits they own.
    (0, import_pg_core9.pgPolicy)("Enable delete for auth users on exercise_to_workout_split", {
      for: "delete",
      to: authenticatedRole,
      using: ownsForDelete
    })
  ];
}
__name(exerciseToWorkoutSplitPolicies, "exerciseToWorkoutSplitPolicies");

// ../../src/infrastructure/db/schema/drizzle/workout/exercisetoworkoutsplit/table.ts
var exerciseToWorkoutSplit = workoutSchema.table("exercise_to_workout_split", {
  id: (0, import_pg_core10.bigint)("id", {
    mode: "number"
  }).generatedByDefaultAsIdentity({
    name: "exercise_to_workout_split_id_seq"
  }).notNull(),
  workoutSplitId: (0, import_pg_core10.bigint)("workout_split_id", {
    mode: "number"
  }).notNull(),
  exerciseId: (0, import_pg_core10.bigint)("exercise_id", {
    mode: "number"
  }).notNull(),
  createdAt: (0, import_pg_core10.timestamp)("created_at", {
    withTimezone: true
  }).default(import_drizzle_orm8.sql`(now() AT TIME ZONE 'utc')`).notNull(),
  orderIndex: (0, import_pg_core10.bigint)("order_index", {
    mode: "number"
  }).notNull(),
  isActive: (0, import_pg_core10.boolean)("is_active").default(true).notNull()
}, (t) => [
  (0, import_pg_core10.primaryKey)({
    name: "exercise_to_workout_split_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core10.unique)("uq_exercise_to_workout_split_workout_split_exercise").on(t.workoutSplitId, t.exerciseId),
  (0, import_pg_core10.foreignKey)({
    name: "exercise_to_workout_split_exercise_id_fkey",
    columns: [
      t.exerciseId
    ],
    foreignColumns: [
      exercise.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core10.foreignKey)({
    name: "exercise_to_workout_split_workout_split_id_fkey",
    columns: [
      t.workoutSplitId
    ],
    foreignColumns: [
      workoutSplit.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core10.index)("exercise_to_workout_split_active_idx").on(t.workoutSplitId, t.orderIndex).where(import_drizzle_orm8.sql`${t.isActive} = true`),
  (0, import_pg_core10.index)("exercise_to_workout_split_workout_split_id_order_index_idx").on(t.workoutSplitId, t.orderIndex),
  ...exerciseToWorkoutSplitPolicies(t)
]);
var exerciseToWorkoutSplitRelations = (0, import_drizzle_orm8.relations)(exerciseToWorkoutSplit, ({ many, one }) => ({
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
var import_drizzle_orm9 = require("drizzle-orm");
var import_pg_core11 = require("drizzle-orm/pg-core");
var exercisePolicies = /* @__PURE__ */ __name(() => [
  // Makes the shared exercise catalog readable to every authenticated user.
  (0, import_pg_core11.pgPolicy)("Allow all authenticated users to read exercise", {
    for: "select",
    to: authenticatedRole,
    using: import_drizzle_orm9.sql`true`
  })
], "exercisePolicies");

// ../../src/infrastructure/db/schema/drizzle/workout/exercises/table.ts
var exercise = workoutSchema.table("exercise", {
  id: (0, import_pg_core12.bigint)("id", {
    mode: "number"
  }).generatedByDefaultAsIdentity({
    name: "exercise_id_seq"
  }).notNull(),
  name: (0, import_pg_core12.text)("name").notNull(),
  description: (0, import_pg_core12.text)("description").notNull(),
  targetMuscle: (0, import_pg_core12.text)("target_muscle").notNull(),
  specificTargetMuscle: (0, import_pg_core12.text)("specific_target_muscle").notNull()
}, (t) => [
  (0, import_pg_core12.primaryKey)({
    name: "exercise_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core12.uniqueIndex)("exercise_name_unique").on(t.name),
  ...exercisePolicies()
]);
var exerciseRelations = (0, import_drizzle_orm10.relations)(exercise, ({ many }) => ({
  workoutSplitAssignments: many(exerciseToWorkoutSplit)
}));

// ../../src/infrastructure/db/schema/drizzle/tracking/tracking_set/table.ts
var import_drizzle_orm12 = require("drizzle-orm");
var import_pg_core14 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/tracking/tracking_set/policies.ts
var import_drizzle_orm11 = require("drizzle-orm");
var import_pg_core13 = require("drizzle-orm/pg-core");
var currentUserId2 = import_drizzle_orm11.sql`"identity"."current_user_id"()`;
function trackingSetPolicies(table) {
  const ownsExerciseTracking = import_drizzle_orm11.sql`exists (
    select 1
    from "tracking"."exercise_tracking" et
    join "tracking"."workout_summary" ws on ws."id" = et."workout_summary_id"
    where et."id" = ${table.exerciseTrackingId}
      and ws."user_id" = ${currentUserId2}
  )`;
  return [
    // Lets authenticated users read tracked sets only from workout summaries they own.
    (0, import_pg_core13.pgPolicy)("Enable read access for auth users on tracking_set", {
      for: "select",
      to: authenticatedRole,
      using: ownsExerciseTracking
    }),
    // Lets authenticated users add tracked sets only to their own exercise tracking rows.
    (0, import_pg_core13.pgPolicy)("Enable insert for auth users on tracking_set", {
      for: "insert",
      to: authenticatedRole,
      withCheck: ownsExerciseTracking
    }),
    // Lets authenticated users update tracked sets without moving them outside their own workout.
    (0, import_pg_core13.pgPolicy)("Enable update for auth users on tracking_set", {
      for: "update",
      to: authenticatedRole,
      using: ownsExerciseTracking,
      withCheck: ownsExerciseTracking
    }),
    // Lets authenticated users delete tracked sets only from workout summaries they own.
    (0, import_pg_core13.pgPolicy)("Enable delete for auth users on tracking_set", {
      for: "delete",
      to: authenticatedRole,
      using: ownsExerciseTracking
    })
  ];
}
__name(trackingSetPolicies, "trackingSetPolicies");

// ../../src/infrastructure/db/schema/drizzle/tracking/tracking_set/table.ts
var trackingSet = trackingSchema.table("tracking_set", {
  id: (0, import_pg_core14.uuid)("id").defaultRandom().notNull(),
  exerciseTrackingId: (0, import_pg_core14.bigint)("exercise_tracking_id", {
    mode: "number"
  }).notNull(),
  setIndex: (0, import_pg_core14.integer)("set_index").notNull(),
  reps: (0, import_pg_core14.integer)("reps").notNull(),
  weight: (0, import_pg_core14.real)("weight").notNull()
}, (t) => [
  (0, import_pg_core14.primaryKey)({
    name: "tracking_set_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core14.unique)("tracking_set_exercise_index_unique").on(t.exerciseTrackingId, t.setIndex),
  (0, import_pg_core14.foreignKey)({
    name: "tracking_set_exercise_tracking_id_fkey",
    columns: [
      t.exerciseTrackingId
    ],
    foreignColumns: [
      exerciseTracking.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core14.index)("tracking_set_exercise_tracking_id_idx").on(t.exerciseTrackingId),
  ...trackingSetPolicies(t)
]);
var trackingSetRelations = (0, import_drizzle_orm12.relations)(trackingSet, ({ one }) => ({
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
var import_drizzle_orm13 = require("drizzle-orm");
var import_pg_core15 = require("drizzle-orm/pg-core");
var uid5 = import_drizzle_orm13.sql`"identity"."current_user_id"()`;
function exerciseTrackingPolicies(t) {
  const owns = import_drizzle_orm13.sql`exists (select 1 from "tracking"."workout_summary" ws where ws."id" = ${t.workoutSummaryId} and ws."user_id" = ${uid5})`;
  return [
    // Lets authenticated users read exercise tracking rows through summaries they own.
    (0, import_pg_core15.pgPolicy)("exercise_tracking_select_by_summary_owner", {
      for: "select",
      to: authenticatedRole,
      using: owns
    }),
    // Lets authenticated users insert exercise tracking rows through summaries they own.
    (0, import_pg_core15.pgPolicy)("exercise_tracking_insert_by_summary_owner", {
      for: "insert",
      to: authenticatedRole,
      withCheck: owns
    }),
    // Lets authenticated users update exercise tracking rows through summaries they own.
    (0, import_pg_core15.pgPolicy)("exercise_tracking_update_by_summary_owner", {
      for: "update",
      to: authenticatedRole,
      using: owns,
      withCheck: owns
    }),
    // Lets authenticated users delete exercise tracking rows through summaries they own.
    (0, import_pg_core15.pgPolicy)("exercise_tracking_delete_by_summary_owner", {
      for: "delete",
      to: authenticatedRole,
      using: owns
    })
  ];
}
__name(exerciseTrackingPolicies, "exerciseTrackingPolicies");

// ../../src/infrastructure/db/schema/drizzle/tracking/exercise_tracking/table.ts
var import_pg_core17 = require("drizzle-orm/pg-core");
var exerciseTracking = trackingSchema.table("exercise_tracking", {
  id: (0, import_pg_core16.bigint)("id", {
    mode: "number"
  }).generatedByDefaultAsIdentity({
    name: "exercise_tracking_id_seq"
  }).notNull(),
  workoutSummaryId: (0, import_pg_core16.uuid)("workout_summary_id").notNull(),
  exerciseToSplitId: (0, import_pg_core16.bigint)("exercise_to_split_id", {
    mode: "number"
  }),
  exerciseId: (0, import_pg_core16.bigint)("exercise_id", {
    mode: "number"
  }),
  notes: (0, import_pg_core16.text)("notes")
}, (t) => [
  (0, import_pg_core16.primaryKey)({
    name: "exercise_tracking_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core16.foreignKey)({
    name: "exercise_tracking_exercise_to_split_id_fkey",
    columns: [
      t.exerciseToSplitId
    ],
    foreignColumns: [
      exerciseToWorkoutSplit.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core16.foreignKey)({
    name: "exercise_tracking_exercise_id_fkey",
    columns: [
      t.exerciseId
    ],
    foreignColumns: [
      exercise.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core16.foreignKey)({
    name: "exercise_tracking_workout_summary_id_fkey",
    columns: [
      t.workoutSummaryId
    ],
    foreignColumns: [
      workoutSummary.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core17.check)("exercise_tracking_xor_check", import_drizzle_orm14.sql`num_nonnulls(${t.exerciseToSplitId}, ${t.exerciseId}) = 1`),
  (0, import_pg_core16.index)("exercise_tracking_workout_summary_id_idx").on(t.workoutSummaryId),
  ...exerciseTrackingPolicies(t)
]);
var exerciseTrackingRelations = (0, import_drizzle_orm14.relations)(exerciseTracking, ({ many, one }) => ({
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
var import_drizzle_orm15 = require("drizzle-orm");
var import_pg_core18 = require("drizzle-orm/pg-core");
var uid6 = import_drizzle_orm15.sql`"identity"."current_user_id"()`;
function workoutSummaryPolicies(t) {
  return [
    // Lets authenticated users read only their own completed workout summaries.
    (0, import_pg_core18.pgPolicy)("users can read their workout summaries", {
      for: "select",
      to: authenticatedRole,
      using: import_drizzle_orm15.sql`${t.userId} = ${uid6}`
    }),
    // Lets authenticated users insert completed workout summaries only for themselves.
    (0, import_pg_core18.pgPolicy)("users can insert their workout summaries", {
      for: "insert",
      to: authenticatedRole,
      withCheck: import_drizzle_orm15.sql`${t.userId} = ${uid6}`
    }),
    // Lets authenticated users update only their own completed workout summaries.
    (0, import_pg_core18.pgPolicy)("users can update their workout summaries", {
      for: "update",
      to: authenticatedRole,
      using: import_drizzle_orm15.sql`${t.userId} = ${uid6}`,
      withCheck: import_drizzle_orm15.sql`${t.userId} = ${uid6}`
    }),
    // Lets authenticated users delete only their own completed workout summaries.
    (0, import_pg_core18.pgPolicy)("users can delete their workout summaries", {
      for: "delete",
      to: authenticatedRole,
      using: import_drizzle_orm15.sql`${t.userId} = ${uid6}`
    })
  ];
}
__name(workoutSummaryPolicies, "workoutSummaryPolicies");

// ../../src/infrastructure/db/schema/drizzle/tracking/workout_summary/table.ts
var workoutSummary = trackingSchema.table("workout_summary", {
  id: (0, import_pg_core19.uuid)("id").defaultRandom().notNull(),
  userId: (0, import_pg_core19.uuid)("user_id").notNull(),
  workoutSplitId: (0, import_pg_core19.bigint)("workout_split_id", {
    mode: "number"
  }).notNull(),
  workoutStartUtc: (0, import_pg_core19.timestamp)("workout_start_utc", {
    withTimezone: true
  }).notNull(),
  workoutEndUtc: (0, import_pg_core19.timestamp)("workout_end_utc", {
    withTimezone: true
  }).notNull(),
  createdAt: (0, import_pg_core19.timestamp)("created_at", {
    withTimezone: true
  }).defaultNow().notNull()
}, (t) => [
  (0, import_pg_core19.primaryKey)({
    name: "workout_summary_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core19.foreignKey)({
    name: "workout_summary_user_id_fkey",
    columns: [
      t.userId
    ],
    foreignColumns: [
      user.id
    ]
  }).onDelete("cascade"),
  (0, import_pg_core19.foreignKey)({
    name: "workout_summary_workout_split_id_fkey",
    columns: [
      t.workoutSplitId
    ],
    foreignColumns: [
      workoutSplit.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core19.index)("workout_summary_start_date_idx").on(import_drizzle_orm16.sql`((${t.workoutStartUtc} at time zone 'UTC')::date)`),
  (0, import_pg_core19.index)("workout_summary_user_start_utc_idx").on(t.userId, t.workoutStartUtc.desc().nullsFirst()),
  ...workoutSummaryPolicies(t)
]);
var workoutSummaryRelations = (0, import_drizzle_orm16.relations)(workoutSummary, ({ many, one }) => ({
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
var import_drizzle_orm18 = require("drizzle-orm");
var import_pg_core21 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/workout/workout_plan/policies.ts
var import_drizzle_orm17 = require("drizzle-orm");
var import_pg_core20 = require("drizzle-orm/pg-core");
var uid7 = import_drizzle_orm17.sql`"identity"."current_user_id"()`;
function workoutPlanPolicies(t) {
  return [
    // Lets authenticated users read only workout plans they own.
    (0, import_pg_core20.pgPolicy)("Enable read access for auth users on workout_plan", {
      for: "select",
      to: authenticatedRole,
      using: import_drizzle_orm17.sql`${uid7} = ${t.userId}`
    }),
    // Lets authenticated users create workout plans only for themselves.
    (0, import_pg_core20.pgPolicy)("Enable insert for auth users on workout_plan", {
      for: "insert",
      to: authenticatedRole,
      withCheck: import_drizzle_orm17.sql`${uid7} = ${t.userId}`
    }),
    // Lets authenticated users update only workout plans they own.
    (0, import_pg_core20.pgPolicy)("Enable update for auth users on workout_plan", {
      for: "update",
      to: authenticatedRole,
      using: import_drizzle_orm17.sql`${uid7} = ${t.userId}`,
      withCheck: import_drizzle_orm17.sql`${uid7} = ${t.userId}`
    }),
    // Lets authenticated users delete only workout plans they own.
    (0, import_pg_core20.pgPolicy)("Enable delete for auth users on workout_plan", {
      for: "delete",
      to: authenticatedRole,
      using: import_drizzle_orm17.sql`${uid7} = ${t.userId}`
    })
  ];
}
__name(workoutPlanPolicies, "workoutPlanPolicies");

// ../../src/infrastructure/db/schema/drizzle/workout/workout_plan/table.ts
var workoutPlan = workoutSchema.table("workout_plan", {
  id: (0, import_pg_core21.bigint)("id", {
    mode: "number"
  }).generatedByDefaultAsIdentity({
    name: "workout_plan_id_seq"
  }).notNull(),
  userId: (0, import_pg_core21.uuid)("user_id").notNull(),
  isActive: (0, import_pg_core21.boolean)("is_active").default(true).notNull(),
  updatedAt: (0, import_pg_core21.timestamp)("updated_at", {
    withTimezone: true
  }).default(import_drizzle_orm18.sql`(now() AT TIME ZONE 'utc')`).notNull(),
  createdAt: (0, import_pg_core21.timestamp)("created_at", {
    withTimezone: true
  }).defaultNow().notNull()
}, (t) => [
  (0, import_pg_core21.primaryKey)({
    name: "workout_plan_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core21.foreignKey)({
    name: "workout_plan_user_id_fkey",
    columns: [
      t.userId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core21.uniqueIndex)("uq_workout_plan_active_user").on(t.userId).where(import_drizzle_orm18.sql`${t.isActive}`),
  ...workoutPlanPolicies(t)
]);
var workoutPlanRelations = (0, import_drizzle_orm18.relations)(workoutPlan, ({ many, one }) => ({
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
var import_drizzle_orm19 = require("drizzle-orm");
var import_pg_core22 = require("drizzle-orm/pg-core");
var uid8 = import_drizzle_orm19.sql`"identity"."current_user_id"()`;
function workoutSplitPolicies(t) {
  const owns = import_drizzle_orm19.sql`${uid8} = (select wp."user_id" from "workout"."workout_plan" wp where wp."id" = ${t.workoutId})`;
  const ownsForDelete = import_drizzle_orm19.sql`exists (select 1 from "workout"."workout_plan" wp where wp."id" = ${t.workoutId} and wp."user_id" = ${uid8})`;
  return [
    // Lets authenticated users read splits belonging to their own plans.
    (0, import_pg_core22.pgPolicy)("Enable read access for auth users on workout_split", {
      for: "select",
      to: authenticatedRole,
      using: owns
    }),
    // Lets authenticated users add splits only to their own plans.
    (0, import_pg_core22.pgPolicy)("Enable insert for auth users on workout_split", {
      for: "insert",
      to: authenticatedRole,
      withCheck: owns
    }),
    // Lets authenticated users update splits only within their own plans.
    (0, import_pg_core22.pgPolicy)("Enable update for auth users on workout_split", {
      for: "update",
      to: authenticatedRole,
      using: owns,
      withCheck: owns
    }),
    // Lets authenticated users delete splits only from their own plans.
    (0, import_pg_core22.pgPolicy)("Enable delete for auth users on workout_split", {
      for: "delete",
      to: authenticatedRole,
      using: ownsForDelete
    })
  ];
}
__name(workoutSplitPolicies, "workoutSplitPolicies");

// ../../src/infrastructure/db/schema/drizzle/workout/workout_split/table.ts
var workoutSplit = workoutSchema.table("workout_split", {
  id: (0, import_pg_core23.bigint)("id", {
    mode: "number"
  }).generatedByDefaultAsIdentity({
    name: "workout_split_id_seq"
  }).notNull(),
  workoutId: (0, import_pg_core23.bigint)("workout_id", {
    mode: "number"
  }).notNull(),
  name: (0, import_pg_core23.text)("name").notNull(),
  createdAt: (0, import_pg_core23.timestamp)("created_at", {
    withTimezone: true
  }).default(import_drizzle_orm20.sql`(now() AT TIME ZONE 'utc')`).notNull(),
  isActive: (0, import_pg_core23.boolean)("is_active").default(true).notNull()
}, (t) => [
  (0, import_pg_core23.primaryKey)({
    name: "workout_split_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core23.unique)("uq_workout_split_plan_name").on(t.workoutId, t.name),
  (0, import_pg_core23.foreignKey)({
    name: "workout_split_workout_id_fkey",
    columns: [
      t.workoutId
    ],
    foreignColumns: [
      workoutPlan.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core23.index)("workout_split_workout_id_idx").on(t.workoutId),
  ...workoutSplitPolicies(t)
]);
var workoutSplitRelations = (0, import_drizzle_orm20.relations)(workoutSplit, ({ many, one }) => ({
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
  id: (0, import_pg_core24.bigint)("id", {
    mode: "number"
  }).generatedByDefaultAsIdentity({
    name: "user_split_information_id_seq"
  }).notNull(),
  userId: (0, import_pg_core24.uuid)("user_id").notNull(),
  workoutSplitId: (0, import_pg_core24.bigint)("workout_split_id", {
    mode: "number"
  }).notNull(),
  estimatedTimeUtc: (0, import_pg_core24.timestamp)("estimated_time_utc", {
    withTimezone: true
  }).notNull(),
  confidence: (0, import_pg_core24.numeric)("confidence", {
    precision: 3,
    scale: 2
  }).default("1.00").notNull(),
  lastComputedAt: (0, import_pg_core24.timestamp)("last_computed_at", {
    withTimezone: true
  }).default(import_drizzle_orm21.sql`timezone('UTC', now())`).notNull(),
  preferredWeekday: (0, import_pg_core24.integer)("preferred_weekday")
}, (t) => [
  (0, import_pg_core24.primaryKey)({
    name: "user_split_information_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core24.unique)("user_split_information_user_id_workout_split_id_key").on(t.userId, t.workoutSplitId),
  (0, import_pg_core24.foreignKey)({
    name: "user_split_information_user_id_fkey",
    columns: [
      t.userId
    ],
    foreignColumns: [
      user.id
    ]
  }).onDelete("cascade"),
  (0, import_pg_core24.foreignKey)({
    name: "user_split_information_workout_split_id_fkey",
    columns: [
      t.workoutSplitId
    ],
    foreignColumns: [
      workoutSplit.id
    ]
  }).onDelete("cascade"),
  (0, import_pg_core24.index)("user_split_information_confidence_idx").on(t.preferredWeekday, t.confidence).where(import_drizzle_orm21.sql`${t.confidence} >= 0.60`),
  (0, import_pg_core24.index)("user_split_information_user_weekday_idx").on(t.userId, t.preferredWeekday).where(import_drizzle_orm21.sql`${t.preferredWeekday} is not null`)
]).enableRLS();
var userSplitInformationRelations = (0, import_drizzle_orm21.relations)(userSplitInformation, ({ one }) => ({
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
var import_drizzle_orm23 = require("drizzle-orm");
var import_pg_core26 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/tracking/aerobic_tracking/policies.ts
var import_drizzle_orm22 = require("drizzle-orm");
var import_pg_core25 = require("drizzle-orm/pg-core");
var uid9 = import_drizzle_orm22.sql`"identity"."current_user_id"()`;
function aerobicTrackingPolicies(t) {
  return [
    // Lets authenticated users read only their own aerobic tracking rows.
    (0, import_pg_core25.pgPolicy)("Enable read access for auth users on aerobic_tracking", {
      for: "select",
      to: authenticatedRole,
      using: import_drizzle_orm22.sql`${uid9} = ${t.userId}`
    }),
    // Lets authenticated users insert aerobic tracking rows only for themselves.
    (0, import_pg_core25.pgPolicy)("Enable insert for auth users on aerobic_tracking", {
      for: "insert",
      to: authenticatedRole,
      withCheck: import_drizzle_orm22.sql`${uid9} = ${t.userId}`
    }),
    // Lets authenticated users update only their own aerobic tracking rows.
    (0, import_pg_core25.pgPolicy)("Enable update for auth users on aerobic_tracking", {
      for: "update",
      to: authenticatedRole,
      using: import_drizzle_orm22.sql`${uid9} = ${t.userId}`,
      withCheck: import_drizzle_orm22.sql`${uid9} = ${t.userId}`
    }),
    // Lets authenticated users delete only their own aerobic tracking rows.
    (0, import_pg_core25.pgPolicy)("Enable delete for auth users on aerobic_tracking", {
      for: "delete",
      to: authenticatedRole,
      using: import_drizzle_orm22.sql`${uid9} = ${t.userId}`
    })
  ];
}
__name(aerobicTrackingPolicies, "aerobicTrackingPolicies");

// ../../src/infrastructure/db/schema/drizzle/tracking/aerobic_tracking/table.ts
var aerobicTracking = trackingSchema.table("aerobic_tracking", {
  id: (0, import_pg_core26.bigint)("id", {
    mode: "number"
  }).generatedByDefaultAsIdentity({
    name: "aerobic_tracking_id_seq"
  }).notNull(),
  userId: (0, import_pg_core26.uuid)("user_id").notNull(),
  type: (0, import_pg_core26.text)("type").notNull(),
  durationSec: (0, import_pg_core26.bigint)("duration_sec", {
    mode: "number"
  }).default(0).notNull(),
  workoutTimeUtc: (0, import_pg_core26.timestamp)("workout_time_utc", {
    withTimezone: true
  }).default(import_drizzle_orm23.sql`(now() AT TIME ZONE 'utc')`).notNull()
}, (t) => [
  (0, import_pg_core26.primaryKey)({
    name: "aerobic_tracking_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core26.foreignKey)({
    name: "aerobic_tracking_user_id_fkey",
    columns: [
      t.userId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core26.index)("aerobic_tracking_user_id_workout_time_utc_idx").on(t.userId, t.workoutTimeUtc.desc().nullsFirst()),
  ...aerobicTrackingPolicies(t)
]);
var aerobicTrackingRelations = (0, import_drizzle_orm23.relations)(aerobicTracking, ({ one }) => ({
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
var import_drizzle_orm25 = require("drizzle-orm");
var import_pg_core28 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/identity/oauth_account/policies.ts
var import_drizzle_orm24 = require("drizzle-orm");
var import_pg_core27 = require("drizzle-orm/pg-core");
var currentUserId3 = import_drizzle_orm24.sql`"identity"."current_user_id"()`;
function oauthAccountPolicies(table) {
  return [
    // Lets authenticated users read only OAuth accounts linked to themselves.
    (0, import_pg_core27.pgPolicy)("Enable read access for auth users on oauth_account", {
      for: "select",
      to: authenticatedRole,
      using: import_drizzle_orm24.sql`${currentUserId3} = ${table.userId}`
    }),
    // Lets authenticated users link OAuth accounts only to themselves.
    (0, import_pg_core27.pgPolicy)("Enable insert for auth users on oauth_account", {
      for: "insert",
      to: authenticatedRole,
      withCheck: import_drizzle_orm24.sql`${currentUserId3} = ${table.userId}`
    }),
    // Lets authenticated users update only OAuth accounts linked to themselves.
    (0, import_pg_core27.pgPolicy)("Enable update for auth users on oauth_account", {
      for: "update",
      to: authenticatedRole,
      using: import_drizzle_orm24.sql`${currentUserId3} = ${table.userId}`,
      withCheck: import_drizzle_orm24.sql`${currentUserId3} = ${table.userId}`
    }),
    // Lets authenticated users delete only OAuth accounts linked to themselves.
    (0, import_pg_core27.pgPolicy)("Enable delete for auth users on oauth_account", {
      for: "delete",
      to: authenticatedRole,
      using: import_drizzle_orm24.sql`${currentUserId3} = ${table.userId}`
    })
  ];
}
__name(oauthAccountPolicies, "oauthAccountPolicies");

// ../../src/infrastructure/db/schema/drizzle/identity/oauth_account/table.ts
var oauthAccount = identitySchema.table("oauth_account", {
  id: (0, import_pg_core28.uuid)("id").defaultRandom().notNull(),
  userId: (0, import_pg_core28.uuid)("user_id").notNull(),
  provider: (0, import_pg_core28.text)("provider").notNull(),
  providerUserId: (0, import_pg_core28.text)("provider_user_id").notNull(),
  providerEmail: (0, import_pg_core28.text)("provider_email").notNull(),
  linkedAt: (0, import_pg_core28.timestamp)("linked_at", {
    withTimezone: true
  }).default(import_drizzle_orm25.sql`(now() AT TIME ZONE 'utc')`).notNull(),
  missingFields: (0, import_pg_core28.text)("missing_fields")
}, (t) => [
  (0, import_pg_core28.primaryKey)({
    name: "oauth_account_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core28.unique)("oauth_account_provider_user_unique").on(t.provider, t.providerUserId),
  (0, import_pg_core28.foreignKey)({
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
var oauthAccountRelations = (0, import_drizzle_orm25.relations)(oauthAccount, ({ one }) => ({
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
var import_drizzle_orm26 = require("drizzle-orm");
var import_pg_core29 = require("drizzle-orm/pg-core");
var currentUserId4 = import_drizzle_orm26.sql`"identity"."current_user_id"()`;
function userPolicies(table) {
  return [
    // Lets an authenticated user read their own profile.
    (0, import_pg_core29.pgPolicy)("Enable read access for auth users on own profile", {
      for: "select",
      to: authenticatedRole,
      using: import_drizzle_orm26.sql`${currentUserId4} = ${table.id}`
    }),
    // Lets a message receiver read the profile of a sender in their inbox.
    (0, import_pg_core29.pgPolicy)("Allow user to view senders in their messages", {
      for: "select",
      to: authenticatedRole,
      using: import_drizzle_orm26.sql`exists (select 1 from "messages"."message" m where m."sender_id" = ${table.id} and m."receiver_id" = ${currentUserId4})`
    }),
    // Lets an authenticated user create only their own profile row.
    (0, import_pg_core29.pgPolicy)("Enable insert for auth users on own profile", {
      for: "insert",
      to: authenticatedRole,
      withCheck: import_drizzle_orm26.sql`${currentUserId4} = ${table.id}`
    }),
    // Preserves the legacy public self-registration policy for compatibility.
    (0, import_pg_core29.pgPolicy)("Enable insert for public users on own profile", {
      for: "insert",
      to: "public",
      withCheck: import_drizzle_orm26.sql`${currentUserId4} = ${table.id}`
    }),
    // Lets an authenticated user update only their own profile.
    (0, import_pg_core29.pgPolicy)("Enable update for auth users on own profile", {
      for: "update",
      to: authenticatedRole,
      using: import_drizzle_orm26.sql`${currentUserId4} = ${table.id}`,
      withCheck: import_drizzle_orm26.sql`${currentUserId4} = ${table.id}`
    }),
    // Lets an authenticated user delete only their own profile.
    (0, import_pg_core29.pgPolicy)("Enable delete for auth users on own profile", {
      for: "delete",
      to: authenticatedRole,
      using: import_drizzle_orm26.sql`${currentUserId4} = ${table.id}`
    })
  ];
}
__name(userPolicies, "userPolicies");

// ../../src/infrastructure/db/schema/drizzle/identity/user/table.ts
var user = identitySchema.table("user", {
  username: (0, import_pg_core30.text)("username").notNull(),
  email: (0, import_pg_core30.text)("email").notNull(),
  name: (0, import_pg_core30.text)("name").notNull(),
  gender: (0, import_pg_core30.text)("gender").default("Unknown").notNull(),
  createdAt: (0, import_pg_core30.timestamp)("created_at", {
    withTimezone: true
  }).default(import_drizzle_orm27.sql`(now() AT TIME ZONE 'utc')`).notNull(),
  updatedAt: (0, import_pg_core30.timestamp)("updated_at", {
    withTimezone: true
  }).default(import_drizzle_orm27.sql`(now() AT TIME ZONE 'utc')`).notNull(),
  profilePicPath: (0, import_pg_core30.text)("profile_pic_path"),
  id: (0, import_pg_core30.uuid)("id").defaultRandom().notNull(),
  pushToken: (0, import_pg_core30.text)("push_token"),
  passwordHash: (0, import_pg_core30.text)("password_hash"),
  role: (0, import_pg_core30.text)("role").default("User").notNull(),
  tokenVersion: (0, import_pg_core30.bigint)("token_version", {
    mode: "number"
  }).default(0).notNull(),
  isVerified: (0, import_pg_core30.boolean)("is_verified").default(false).notNull(),
  authProvider: (0, import_pg_core30.text)("auth_provider").default("app").notNull(),
  lastLogin: (0, import_pg_core30.timestamp)("last_login", {
    withTimezone: true
  })
}, (t) => [
  (0, import_pg_core30.primaryKey)({
    name: "user_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core30.uniqueIndex)("user_email_ci_unique").on(import_drizzle_orm27.sql`lower(trim(both from ${t.email}))`),
  (0, import_pg_core30.uniqueIndex)("user_username_ci_unique").on(import_drizzle_orm27.sql`lower(trim(both from ${t.username}))`),
  ...userPolicies(t)
]);
var userRelations = (0, import_drizzle_orm27.relations)(user, ({ many, one }) => ({
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
var import_pg_core31 = require("drizzle-orm/pg-core");
var import_drizzle_orm28 = require("drizzle-orm");
var import_pg_core32 = require("drizzle-orm/pg-core");
var exerciseToWorkoutSplitExpandedView = workoutSchema.view("v_exercise_to_workout_split_expanded", {
  id: (0, import_pg_core31.bigint)("id", {
    mode: "number"
  }),
  workoutSplitId: (0, import_pg_core31.bigint)("workout_split_id", {
    mode: "number"
  }),
  workoutId: (0, import_pg_core31.bigint)("workout_id", {
    mode: "number"
  }),
  exerciseId: (0, import_pg_core31.bigint)("exercise_id", {
    mode: "number"
  }),
  exercise: (0, import_pg_core31.text)("exercise"),
  workoutSplit: (0, import_pg_core31.text)("workout_split"),
  reps: (0, import_pg_core32.integer)("reps"),
  orderIndex: (0, import_pg_core31.bigint)("order_index", {
    mode: "number"
  }),
  setOrderIndex: (0, import_pg_core32.integer)("set_order_index"),
  createdAt: (0, import_pg_core31.timestamp)("created_at", {
    withTimezone: true
  }),
  isActive: (0, import_pg_core31.boolean)("is_active")
}).with({
  securityInvoker: true
}).as(import_drizzle_orm28.sql`
    SELECT
      ews.id,
      ews.workout_split_id,
      ws.workout_id,
      ews.exercise_id,
      ex.name AS exercise,
      ws.name AS workout_split,
      workout_set.reps AS reps,
      workout_set.order_index AS set_order_index,
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
var import_drizzle_orm29 = require("drizzle-orm");
var import_pg_core33 = require("drizzle-orm/pg-core");
var import_pg_core34 = require("drizzle-orm/pg-core");
var exerciseTrackingExpandedView = analyticsSchema.view("v_exercise_tracking_expanded", {
  id: (0, import_pg_core33.bigint)("id", {
    mode: "number"
  }),
  exerciseToSplitId: (0, import_pg_core33.bigint)("exercise_to_split_id", {
    mode: "number"
  }),
  weight: (0, import_pg_core33.real)("weight"),
  reps: (0, import_pg_core33.bigint)("reps", {
    mode: "number"
  }),
  setIndex: (0, import_pg_core34.integer)("set_index"),
  exerciseId: (0, import_pg_core33.bigint)("exercise_id", {
    mode: "number"
  }),
  workoutSplitId: (0, import_pg_core33.bigint)("workout_split_id", {
    mode: "number"
  }),
  splitName: (0, import_pg_core33.text)("split_name"),
  exercise: (0, import_pg_core33.text)("exercise"),
  notes: (0, import_pg_core33.text)("notes"),
  workoutSummaryId: (0, import_pg_core33.uuid)("workout_summary_id"),
  workoutStartUtc: (0, import_pg_core33.timestamp)("workout_start_utc", {
    withTimezone: true
  }),
  workoutEndUtc: (0, import_pg_core33.timestamp)("workout_end_utc", {
    withTimezone: true
  })
}).with({
  securityInvoker: true
}).as(import_drizzle_orm29.sql`
    SELECT
      et.id,
      et.exercise_to_split_id,
      tracking_set.weight AS weight,
      tracking_set.reps AS reps,
      tracking_set.set_index AS set_index,
      COALESCE(ews.exercise_id, et.exercise_id) AS exercise_id,
      wsumm.workout_split_id,
      ws.name AS split_name,
      ex.name AS exercise,
      et.notes,
      et.workout_summary_id,
      wsumm.workout_start_utc,
      wsumm.workout_end_utc
    FROM
      tracking.exercise_tracking et
      LEFT JOIN tracking.workout_summary wsumm ON wsumm.id = et.workout_summary_id
      LEFT JOIN workout.exercise_to_workout_split ews ON ews.id = et.exercise_to_split_id
      LEFT JOIN workout.workout_split ws ON ws.id = wsumm.workout_split_id
      LEFT JOIN workout.exercise ex ON ex.id = COALESCE(ews.exercise_id, et.exercise_id)
      LEFT JOIN tracking.tracking_set tracking_set ON tracking_set.exercise_tracking_id = et.id
  `);

// ../../src/infrastructure/db/schema/drizzle/analytics/views/prs.view.ts
var import_drizzle_orm30 = require("drizzle-orm");
var import_pg_core35 = require("drizzle-orm/pg-core");
var prsView = analyticsSchema.view("v_prs", {
  id: (0, import_pg_core35.bigint)("id", {
    mode: "number"
  }),
  exerciseToSplitId: (0, import_pg_core35.bigint)("exercise_to_split_id", {
    mode: "number"
  }),
  exerciseId: (0, import_pg_core35.bigint)("exercise_id", {
    mode: "number"
  }),
  exercise: (0, import_pg_core35.text)("exercise"),
  weight: (0, import_pg_core35.real)("weight"),
  reps: (0, import_pg_core35.bigint)("reps", {
    mode: "number"
  }),
  workoutSummaryId: (0, import_pg_core35.uuid)("workout_summary_id"),
  workoutStartUtc: (0, import_pg_core35.timestamp)("workout_start_utc", {
    withTimezone: true
  }),
  workoutEndUtc: (0, import_pg_core35.timestamp)("workout_end_utc", {
    withTimezone: true
  })
}).with({
  securityInvoker: true
}).as(import_drizzle_orm30.sql`
    SELECT DISTINCT
      ON (et.exercise_id) et.id,
      et.exercise_to_split_id,
      et.exercise_id,
      et.exercise,
      et.weight,
      et.reps,
      et.workout_summary_id,
      et.workout_start_utc,
      et.workout_end_utc
    FROM
      analytics.v_exercise_tracking_expanded et
    ORDER BY
      et.exercise_id,
      et.weight DESC,
      et.reps DESC,
      et.workout_start_utc DESC,
      et.id DESC
  `);

// src/database/database.schemas.ts
var userDbSchema = (0, import_drizzle_zod.createSelectSchema)(user);
var userInsertDbSchema = (0, import_drizzle_zod.createInsertSchema)(user);
var userUpdateDbSchema = (0, import_drizzle_zod.createUpdateSchema)(user);
var oauthAccountDbSchema = (0, import_drizzle_zod.createSelectSchema)(oauthAccount);
var exerciseDbSchema = (0, import_drizzle_zod.createSelectSchema)(exercise);
var workoutPlanDbSchema = (0, import_drizzle_zod.createSelectSchema)(workoutPlan);
var workoutSplitDbSchema = (0, import_drizzle_zod.createSelectSchema)(workoutSplit);
var exerciseToWorkoutSplitDbSchema = (0, import_drizzle_zod.createSelectSchema)(exerciseToWorkoutSplit);
var exerciseToWorkoutSplitExpandedViewDbSchema = (0, import_drizzle_zod.createSelectSchema)(exerciseToWorkoutSplitExpandedView);
var workoutSetDbSchema = (0, import_drizzle_zod.createSelectSchema)(workoutSet);
var workoutSummaryDbSchema = (0, import_drizzle_zod.createSelectSchema)(workoutSummary);
var exerciseTrackingDbSchema = (0, import_drizzle_zod.createSelectSchema)(exerciseTracking);
var trackingSetDbSchema = (0, import_drizzle_zod.createSelectSchema)(trackingSet);
var aerobicTrackingDbSchema = (0, import_drizzle_zod.createSelectSchema)(aerobicTracking);
var messageDbSchema = (0, import_drizzle_zod.createSelectSchema)(message);
var userReminderSettingDbSchema = (0, import_drizzle_zod.createSelectSchema)(userReminderSetting);
var userSplitInformationDbSchema = (0, import_drizzle_zod.createSelectSchema)(userSplitInformation);
var exerciseTrackingExpandedViewDbSchema = (0, import_drizzle_zod.createSelectSchema)(exerciseTrackingExpandedView);
var prsViewDbSchema = (0, import_drizzle_zod.createSelectSchema)(prsView);

// src/modules/aerobics/aerobics.schemas.ts
var import_v42 = __toESM(require("zod/v4"), 1);
var addAerobicInput = import_v42.default.object({
  durationMins: import_v42.default.number(),
  durationSec: aerobicTrackingDbSchema.shape.durationSec,
  type: aerobicTrackingDbSchema.shape.type
});
var addAerobicsRequest = import_v42.default.object({
  body: import_v42.default.object({
    tz: import_v42.default.string(),
    record: addAerobicInput
  })
});
var getAerobicsRequest = import_v42.default.object({
  query: import_v42.default.object({
    tz: import_v42.default.string().optional()
  })
});
var aerobicsDailyRecordSchema = import_v42.default.object({
  type: aerobicTrackingDbSchema.shape.type,
  durationSec: aerobicTrackingDbSchema.shape.durationSec,
  durationMins: aerobicTrackingDbSchema.shape.durationSec
});
var aerobicsWeeklyRecordSchema = aerobicsDailyRecordSchema.extend({
  workoutTimeUtc: serializedDateSchema
});
var weeklyDataSchema = import_v42.default.object({
  records: import_v42.default.array(aerobicsWeeklyRecordSchema),
  totalDurationSec: import_v42.default.number(),
  totalDurationMins: import_v42.default.number()
});
var userAerobicsResponseSchema = import_v42.default.object({
  daily: import_v42.default.record(import_v42.default.string(), import_v42.default.array(aerobicsDailyRecordSchema)),
  weekly: import_v42.default.record(import_v42.default.string(), weeklyDataSchema)
});

// src/modules/analytics/analytics.schemas.ts
var import_v43 = require("zod/v4");
var workoutRmRecordSchema = import_v43.z.object({
  exercise: exerciseDbSchema.shape.name,
  prWeight: trackingSetDbSchema.shape.weight.nullable(),
  prReps: trackingSetDbSchema.shape.reps.nullable(),
  max1Rm: import_v43.z.number()
});
var adherenceExerciseStatsSchema = import_v43.z.object({
  planned: import_v43.z.number(),
  actual: import_v43.z.number(),
  adherencePct: import_v43.z.number().nullable()
});
var getAnalyticsResponseSchema = import_v43.z.object({
  oneRepMaxes: import_v43.z.record(import_v43.z.string(), workoutRmRecordSchema),
  goals: import_v43.z.record(import_v43.z.string(), import_v43.z.record(import_v43.z.string(), adherenceExerciseStatsSchema))
});

// src/modules/auth/password/password.dtos.ts
var import_v44 = require("zod/v4");
var forgotPasswordPayloadSchema = import_v44.z.object({
  sub: userDbSchema.shape.id,
  jti: import_v44.z.string(),
  exp: import_v44.z.number(),
  iss: import_v44.z.string(),
  typ: import_v44.z.string()
});

// src/modules/auth/password/password.schemas.ts
var import_v45 = require("zod/v4");
var sendChangePassEmailRequest = import_v45.z.object({
  body: import_v45.z.object({
    identifier: import_v45.z.string()
  })
});
var resetPasswordRequest = import_v45.z.object({
  body: import_v45.z.object({
    newPassword: import_v45.z.string().min(8, "Password must be at least 8 characters long")
  }),
  query: import_v45.z.object({
    token: import_v45.z.string().optional()
  })
});
var resetPasswordResponseSchema = import_v45.z.object({
  ok: import_v45.z.boolean()
});

// src/modules/auth/session/session.dtos.ts
var import_v47 = require("zod/v4");

// src/modules/user/update/update.schemas.ts
var import_v46 = require("zod/v4");
var updateUserRequest = import_v46.z.object({
  body: import_v46.z.object({
    username: userDbSchema.shape.username.trim().min(3, "Username must be at least 3 characters").max(15, "Username must be at most 15 characters").regex(/^[a-zA-Z0-9_]+$/, "Username may contain letters, numbers, and underscore only"),
    fullName: userDbSchema.shape.name.trim().min(1, "Full name is required").max(20, "Full name is too long").regex(/^[a-zA-Z\s]+$/, "Full name may contain letters and spaces only"),
    email: userDbSchema.shape.email.trim().toLowerCase().email("Invalid email format")
  }).partial()
});
var deleteProfilePicRequest = import_v46.z.object({
  body: import_v46.z.object({
    profilePicPath: import_v46.z.string()
  })
});
var userDataSchema = import_v46.z.object({
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
  isFirstLogin: import_v46.z.boolean(),
  tokenVersion: userDbSchema.shape.tokenVersion,
  isVerified: userDbSchema.shape.isVerified,
  authProvider: userDbSchema.shape.authProvider,
  lastLogin: serializedDateSchema.nullable()
});
var userDataResponseSchema = import_v46.z.object({
  userData: userDataSchema
});
var getAuthenticatedUserByIdResponseSchema = userDataSchema;
var updateAuthenticatedUserResponseSchema = import_v46.z.object({
  message: import_v46.z.string(),
  emailChanged: import_v46.z.boolean(),
  user: userDataSchema
});
var setProfilePicAndUpdateDBResponseSchema = import_v46.z.object({
  profilePicPath: import_v46.z.string(),
  url: import_v46.z.string(),
  message: import_v46.z.string()
});

// src/modules/auth/session/session.dtos.ts
var accessTokenPayloadSchema = import_v47.z.object({
  id: userDbSchema.shape.id,
  role: userDbSchema.shape.role,
  tokenVer: userDbSchema.shape.tokenVersion,
  cnf: import_v47.z.object({
    jkt: import_v47.z.string()
  }).optional(),
  iat: import_v47.z.number().optional(),
  exp: import_v47.z.number().optional()
});
var userAfterBumpSchema = import_v47.z.object({
  tokenVersion: userDbSchema.shape.tokenVersion,
  userData: userDataSchema
});
var tokenVersionResultSchema = import_v47.z.object({
  tokenVersion: userDbSchema.shape.tokenVersion
});

// src/modules/auth/session/session.schemas.ts
var import_v48 = require("zod/v4");
var loginRequest = import_v48.z.object({
  body: import_v48.z.object({
    identifier: import_v48.z.string().min(3).refine((val) => {
      const isEmail = import_v48.z.string().email().safeParse(val).success;
      const isUsername = /^[a-zA-Z0-9_]{3,20}$/.test(val);
      return isEmail || isUsername;
    }, {
      message: "Must be a valid email or username"
    }),
    password: import_v48.z.string().min(1, "Username and password are required")
  })
});
var loginResponseSchema = import_v48.z.object({
  message: import_v48.z.string(),
  user: userDbSchema.shape.id,
  accessToken: import_v48.z.string(),
  refreshToken: import_v48.z.string()
});
var logoutResponseSchema = import_v48.z.object({
  message: import_v48.z.string()
});
var refreshTokenResponseSchema = import_v48.z.object({
  message: import_v48.z.string(),
  accessToken: import_v48.z.string(),
  refreshToken: import_v48.z.string(),
  userId: userDbSchema.shape.id
});

// src/modules/auth/verification/verification.dtos.ts
var import_v49 = require("zod/v4");
var emailVerifyPayloadSchema = import_v49.z.object({
  sub: userDbSchema.shape.id,
  jti: import_v49.z.string(),
  exp: import_v49.z.number(),
  iss: import_v49.z.string(),
  typ: import_v49.z.string()
});

// src/modules/auth/verification/verification.schemas.ts
var import_v410 = __toESM(require("zod/v4"), 1);
var verifyAccountRequest = import_v410.default.object({
  query: import_v410.default.object({
    token: import_v410.default.string().optional()
  })
});
var sendVerificationMailRequest = import_v410.default.object({
  body: import_v410.default.object({
    email: userDbSchema.shape.email.trim().email("Invalid email")
  })
});
var changeEmailAndVerifyRequest = import_v410.default.object({
  body: import_v410.default.object({
    username: userDbSchema.shape.username,
    password: import_v410.default.string(),
    newEmail: userDbSchema.shape.email.trim().email("Invalid email")
  })
});
var checkUserVerifyRequest = import_v410.default.object({
  query: import_v410.default.object({
    username: userDbSchema.shape.username
  })
});

// src/modules/auth/auth.dtos.ts
var import_v411 = require("zod/v4");
var userByIndetifierSchema = import_v411.z.object({
  id: userDbSchema.shape.id,
  name: userDbSchema.shape.name,
  username: userDbSchema.shape.username,
  email: userDbSchema.shape.email.optional(),
  password: userDbSchema.shape.passwordHash,
  role: userDbSchema.shape.role,
  isVerified: userDbSchema.shape.isVerified,
  lastLogin: serializedDateSchema.nullable().optional()
});

// src/modules/bootstrap/bootstrap.schemas.ts
var import_v415 = require("zod/v4");

// src/modules/messages/messages.schemas.ts
var import_v412 = require("zod/v4");
var getAllMessagesRequest = import_v412.z.object({
  query: import_v412.z.object({
    tz: import_v412.z.string()
  })
});
var allUserMessageSchema = import_v412.z.object({
  id: messageDbSchema.shape.id,
  subject: messageDbSchema.shape.subject,
  msg: messageDbSchema.shape.msg,
  sentAt: serializedDateSchema,
  isRead: messageDbSchema.shape.isRead,
  senderFullName: userDbSchema.shape.name,
  senderProfilePicPath: userDbSchema.shape.profilePicPath
});
var getAllUserMessagesResponseSchema = import_v412.z.object({
  messages: import_v412.z.array(allUserMessageSchema)
});
var markMessageAsReadRequest = import_v412.z.object({
  params: import_v412.z.object({
    id: messageDbSchema.shape.id
  })
});
var messageAsReadSchema = import_v412.z.object({
  id: messageDbSchema.shape.id,
  isRead: messageDbSchema.shape.isRead
});
var markMessageAsReadResponseSchema = messageAsReadSchema;
var deleteMessageRequest = import_v412.z.object({
  params: import_v412.z.object({
    id: messageDbSchema.shape.id
  })
});
var deletedMessageSchema = import_v412.z.object({
  id: messageDbSchema.shape.id
});
var messageAfterSendResponseSchema = import_v412.z.object({
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
var deleteMessageResponseSchema = deletedMessageSchema;

// src/modules/workout/plan/plan.schemas.ts
var import_v413 = require("zod/v4");
var workoutExerciseSchema = import_v413.z.object({
  id: exerciseDbSchema.shape.id,
  sets: import_v413.z.array(workoutSetDbSchema.shape.reps),
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex
});
var exerciseInPlanSchema = import_v413.z.object({
  id: exerciseToWorkoutSplitDbSchema.shape.id,
  sets: import_v413.z.array(workoutSetDbSchema.shape.reps),
  isActive: exerciseToWorkoutSplitDbSchema.shape.isActive,
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle,
  exercise: exerciseDbSchema.shape.name,
  workoutSplit: workoutSplitDbSchema.shape.name
});
var workoutSplitSchema = import_v413.z.object({
  id: workoutSplitDbSchema.shape.id,
  workoutId: workoutSplitDbSchema.shape.workoutId,
  name: workoutSplitDbSchema.shape.name,
  createdAt: serializedDateSchema,
  muscleGroup: import_v413.z.string().nullable(),
  isActive: workoutSplitDbSchema.shape.isActive,
  exerciseToWorkoutSplit: import_v413.z.array(exerciseInPlanSchema)
});
var wholeUserWorkoutPlanSchema = import_v413.z.object({
  id: workoutPlanDbSchema.shape.id,
  numberOfSplits: import_v413.z.number(),
  createdAt: serializedDateSchema,
  userId: userDbSchema.shape.id,
  isActive: workoutPlanDbSchema.shape.isActive,
  updatedAt: serializedDateSchema,
  workoutSplits: import_v413.z.array(workoutSplitSchema).nullable()
});
var workoutSplitsMapItemSchema = import_v413.z.object({
  id: exerciseDbSchema.shape.id,
  name: exerciseDbSchema.shape.name,
  sets: import_v413.z.array(workoutSetDbSchema.shape.reps),
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var workoutSplitsMapSchema = import_v413.z.record(import_v413.z.string(), import_v413.z.array(workoutSplitsMapItemSchema));
var addWorkoutSplitPayloadSchema = import_v413.z.record(import_v413.z.string(), import_v413.z.array(workoutExerciseSchema).min(1, "Each split must include at least one exercise"));
var addWorkoutRequest = import_v413.z.object({
  body: import_v413.z.object({
    workoutData: addWorkoutSplitPayloadSchema,
    workoutName: import_v413.z.string().optional(),
    tz: import_v413.z.string()
  })
});
var addWorkoutResponseSchema = import_v413.z.object({
  message: import_v413.z.string(),
  workoutPlan: wholeUserWorkoutPlanSchema,
  workoutPlanForEditWorkout: workoutSplitsMapSchema
});
var getWholeWorkoutPlanRequest = import_v413.z.object({
  query: import_v413.z.object({
    tz: import_v413.z.string().optional()
  })
});
var getWholeUserWorkoutPlanResponseSchema = import_v413.z.object({
  workoutPlan: wholeUserWorkoutPlanSchema.nullable(),
  workoutPlanForEditWorkout: workoutSplitsMapSchema.nullable()
});

// src/modules/workout/tracking/tracking.schemas.ts
var import_v414 = require("zod/v4");
var finishedExerciseEntry = import_v414.z.object({
  exerciseToSplitId: exerciseToWorkoutSplitDbSchema.shape.id,
  weight: import_v414.z.array(trackingSetDbSchema.shape.weight),
  reps: import_v414.z.array(trackingSetDbSchema.shape.reps),
  notes: exerciseTrackingDbSchema.shape.notes.optional()
});
var exerciseMetadataSchema = import_v414.z.object({
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var exerciseTrackingPrMaxSchema = import_v414.z.object({
  exercise: exerciseDbSchema.shape.name,
  weight: trackingSetDbSchema.shape.weight,
  reps: trackingSetDbSchema.shape.reps,
  workoutTimeUtc: serializedDateSchema
});
var exerciseTrackingAnalysisSchema = import_v414.z.object({
  uniqueDays: import_v414.z.number(),
  mostFrequentSplit: import_v414.z.string().nullable(),
  mostFrequentSplitDays: import_v414.z.number().nullable(),
  lastWorkoutDate: import_v414.z.string().nullable(),
  splitDaysByName: import_v414.z.record(import_v414.z.string(), import_v414.z.number()),
  prs: import_v414.z.object({
    prMax: exerciseTrackingPrMaxSchema.nullable()
  })
});
var trackingMapItemSchema = import_v414.z.object({
  id: exerciseTrackingDbSchema.shape.id,
  exerciseToSplitId: exerciseToWorkoutSplitDbSchema.shape.id,
  weight: import_v414.z.array(trackingSetDbSchema.shape.weight),
  reps: import_v414.z.array(trackingSetDbSchema.shape.reps),
  notes: exerciseTrackingDbSchema.shape.notes,
  exerciseId: exerciseDbSchema.shape.id,
  workoutSplitId: workoutSplitDbSchema.shape.id,
  splitName: workoutSplitDbSchema.shape.name,
  exercise: exerciseDbSchema.shape.name,
  workoutDate: serializedDateSchema,
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
  exerciseToWorkoutSplit: import_v414.z.object({
    sets: import_v414.z.array(workoutSetDbSchema.shape.reps),
    exercises: exerciseMetadataSchema
  })
});
var trackingByDateItemSchema = trackingMapItemSchema.omit({
  workoutDate: true
});
var trackingBySplitNameItemSchema = trackingMapItemSchema.omit({
  splitName: true
});
var exerciseTrackingAndStatsSchema = import_v414.z.object({
  exerciseTrackingAnalysis: exerciseTrackingAnalysisSchema,
  exerciseTrackingMaps: import_v414.z.object({
    byDate: import_v414.z.record(import_v414.z.string(), import_v414.z.array(trackingByDateItemSchema)),
    byExerciseToSplitId: import_v414.z.record(import_v414.z.string(), import_v414.z.array(trackingMapItemSchema)),
    bySplitName: import_v414.z.record(import_v414.z.string(), import_v414.z.array(trackingBySplitNameItemSchema))
  })
});
var finishWorkoutRequest = import_v414.z.object({
  body: import_v414.z.object({
    workout: import_v414.z.array(finishedExerciseEntry),
    tz: import_v414.z.string().optional(),
    workoutStartUtc: import_v414.z.string().datetime("workoutStartUtc must be a valid ISO datetime"),
    workoutEndUtc: import_v414.z.string().datetime("workoutEndUtc must be a valid ISO datetime").optional().nullable()
  })
});
var finishUserWorkoutResponseSchema = exerciseTrackingAndStatsSchema;
var getExerciseTrackingRequest = import_v414.z.object({
  query: import_v414.z.object({
    tz: import_v414.z.string().optional()
  })
});
var getExerciseTrackingResponseSchema = exerciseTrackingAndStatsSchema;

// src/modules/bootstrap/bootstrap.schemas.ts
var bootstrapRequest = import_v415.z.object({
  query: import_v415.z.object({
    tz: import_v415.z.string().optional()
  })
});
var bootstrapResponseSchema = import_v415.z.object({
  user: userDataSchema,
  workout: getWholeUserWorkoutPlanResponseSchema,
  tracking: exerciseTrackingAndStatsSchema,
  messages: getAllUserMessagesResponseSchema,
  aerobics: userAerobicsResponseSchema
});

// src/modules/exercises/exercises.schemas.ts
var import_v416 = require("zod/v4");
var getAllExercisesExerciseSchema = import_v416.z.object({
  id: exerciseDbSchema.shape.id,
  name: exerciseDbSchema.shape.name,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var getAllExercisesResponseSchema = import_v416.z.record(import_v416.z.string(), import_v416.z.array(getAllExercisesExerciseSchema));
var queryGetExerciseMapByMuscleRowSchema = import_v416.z.object({
  result: import_v416.z.object({
    map: getAllExercisesResponseSchema.nullable()
  }).nullable()
});

// src/modules/oauth/apple/apple.dtos.ts
var import_v417 = require("zod/v4");
var appleTokenVerificationResultSchema = import_v417.z.object({
  appleSub: import_v417.z.string(),
  email: userDbSchema.shape.email.nullable(),
  emailVerified: import_v417.z.boolean(),
  fullName: userDbSchema.shape.name
});

// src/modules/oauth/apple/apple.schemas.ts
var import_v418 = require("zod/v4");
var appleNameInput = import_v418.z.object({
  givenName: import_v418.z.string().nullable(),
  familyName: import_v418.z.string().nullable()
});
var appleOAuthRequest = import_v418.z.object({
  body: import_v418.z.object({
    idToken: import_v418.z.string({
      error: "Missing or invalid Apple identityToken"
    }),
    rawNonce: import_v418.z.string(),
    name: appleNameInput.optional(),
    email: userDbSchema.shape.email.email().nullable()
  })
});

// src/modules/oauth/google/google.dtos.ts
var import_v419 = require("zod/v4");
var googleTokenVerificationResultSchema = import_v419.z.object({
  googleSub: import_v419.z.string(),
  email: userDbSchema.shape.email.nullable(),
  emailVerified: import_v419.z.boolean(),
  fullName: userDbSchema.shape.name
});

// src/modules/oauth/google/google.schemas.ts
var import_v420 = require("zod/v4");
var googleOAuthRequest = import_v420.z.object({
  body: import_v420.z.object({
    idToken: import_v420.z.string().optional()
  })
});

// src/modules/oauth/oauth.schemas.ts
var import_v421 = require("zod/v4");
var oAuthLoginResponseSchema = import_v421.z.object({
  message: import_v421.z.string(),
  user: userDbSchema.shape.id,
  accessToken: import_v421.z.string(),
  refreshToken: import_v421.z.string(),
  missingFields: import_v421.z.array(import_v421.z.string()).nullable()
});
var proceedLoginResponseSchema = loginResponseSchema;

// src/modules/user/create/create.schemas.ts
var import_v422 = require("zod/v4");
var usernameSchema = userDbSchema.shape.username.trim().min(3, "Username must be at least 3 characters").max(15, "Username must be at most 15 characters").regex(/^[a-zA-Z0-9_]+$/, "Username may contain letters, numbers, and underscore only");
var fullNameSchema = userDbSchema.shape.name.trim().max(20, "Full name is too long").regex(/^[a-zA-Z\s]+$/, "Full name may contain letters and spaces only");
var createUserRequest = import_v422.z.object({
  body: import_v422.z.object({
    username: usernameSchema,
    fullName: import_v422.z.preprocess(
      // Map "", null, undefined -> "User"
      (val) => {
        if (val == null) return "User";
        if (typeof val === "string" && val.trim() === "") return "User";
        return val;
      },
      fullNameSchema
    ),
    email: userDbSchema.shape.email.trim().toLowerCase().email("Invalid email format"),
    password: import_v422.z.string().min(8, "Password must be at least 8 characters long"),
    gender: import_v422.z.preprocess((val) => val === "" || val == null ? "Unknown" : val, import_v422.z.enum([
      "Male",
      "Female",
      "Other",
      "Unknown"
    ]))
  })
});
var createUserUserSchema = import_v422.z.object({
  id: userDbSchema.shape.id,
  username: userDbSchema.shape.username,
  name: userDbSchema.shape.name,
  email: userDbSchema.shape.email,
  gender: userDbSchema.shape.gender,
  role: userDbSchema.shape.role,
  createdAt: serializedDateSchema
});
var createUserResponseSchema = import_v422.z.object({
  message: import_v422.z.string(),
  user: createUserUserSchema
});

// src/modules/user/push-tokens/push-tokens.schemas.ts
var import_v423 = require("zod/v4");
var saveUserPushTokenRequest = import_v423.z.object({
  body: import_v423.z.object({
    token: userDbSchema.shape.pushToken.unwrap()
  })
});

// src/modules/user/update/update.dtos.ts
var import_v424 = require("zod/v4");
var changeEmailTokenPayloadSchema = import_v424.z.object({
  jti: import_v424.z.string(),
  sub: import_v424.z.string(),
  newEmail: import_v424.z.string(),
  exp: import_v424.z.number(),
  iss: import_v424.z.string(),
  typ: import_v424.z.string()
});

// src/modules/video-analysis/video-analysis.dtos.ts
var import_v425 = require("zod/v4");
var enqueueAanalyzeVideoParamsSchema = import_v425.z.object({
  fileKey: import_v425.z.string(),
  exercise: import_v425.z.string(),
  userId: userDbSchema.shape.id,
  requestId: import_v425.z.string(),
  sentryTrace: import_v425.z.string().optional(),
  baggage: import_v425.z.string().optional()
});
var analyzeVideoPayloadSchema = enqueueAanalyzeVideoParamsSchema.extend({
  expiresAt: import_v425.z.number()
});
var squatRepetitionSchema = import_v425.z.object({
  depth: import_v425.z.object({
    value: import_v425.z.number(),
    status: import_v425.z.string(),
    confidence: import_v425.z.number()
  }),
  backLean: import_v425.z.object({
    value: import_v425.z.number(),
    excessive: import_v425.z.boolean(),
    confidence: import_v425.z.number()
  }),
  audit: import_v425.z.object({
    framesAnalyzed: import_v425.z.number(),
    validFrames: import_v425.z.number(),
    cameraAngle: import_v425.z.string(),
    rawBottomAngle: import_v425.z.number(),
    samplingRate: import_v425.z.string()
  })
});
var analyzeVideoResultPayloadSchema = /* @__PURE__ */ __name((resultSchema) => import_v425.z.intersection(import_v425.z.object({
  jobId: import_v425.z.string(),
  userId: userDbSchema.shape.id,
  exercise: import_v425.z.string(),
  requestId: import_v425.z.string().optional()
}), import_v425.z.discriminatedUnion("status", [
  import_v425.z.object({
    status: import_v425.z.literal("completed"),
    result: import_v425.z.array(resultSchema),
    error: import_v425.z.null()
  }),
  import_v425.z.object({
    status: import_v425.z.literal("failed"),
    result: import_v425.z.null(),
    error: import_v425.z.string()
  })
])), "analyzeVideoResultPayloadSchema");

// src/modules/video-analysis/video-analysis.schemas.ts
var import_v426 = require("zod/v4");
var getPresignedUrlS3Request = import_v426.z.object({
  body: import_v426.z.object({
    exercise: exerciseDbSchema.shape.name,
    fileType: import_v426.z.string(),
    jobId: import_v426.z.string()
  })
});
var getPresignedUrlFromS3ResponseSchema = import_v426.z.object({
  uploadUrl: import_v426.z.string(),
  fileKey: import_v426.z.string(),
  requestId: import_v426.z.string()
});

// src/modules/web-sockets/web-sockets.schemas.ts
var import_v427 = require("zod/v4");
var generateTicketRequest = import_v427.z.object({
  body: import_v427.z.object({
    username: userDbSchema.shape.username
  })
});
var generateTicketResponseSchema = import_v427.z.object({
  ticket: import_v427.z.string()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  accessTokenPayloadSchema,
  addAerobicsRequest,
  addWorkoutRequest,
  addWorkoutResponseSchema,
  adherenceExerciseStatsSchema,
  aerobicTrackingDbSchema,
  aerobicsDailyRecordSchema,
  aerobicsWeeklyRecordSchema,
  allUserMessageSchema,
  analyzeVideoPayloadSchema,
  analyzeVideoResultPayloadSchema,
  appleOAuthRequest,
  appleTokenVerificationResultSchema,
  bootstrapRequest,
  bootstrapResponseSchema,
  changeEmailAndVerifyRequest,
  changeEmailTokenPayloadSchema,
  checkUserVerifyRequest,
  createUserRequest,
  createUserResponseSchema,
  createUserUserSchema,
  deleteMessageRequest,
  deleteMessageResponseSchema,
  deleteProfilePicRequest,
  deletedMessageSchema,
  emailVerifyPayloadSchema,
  enqueueAanalyzeVideoParamsSchema,
  exerciseDbSchema,
  exerciseInPlanSchema,
  exerciseMetadataSchema,
  exerciseToWorkoutSplitDbSchema,
  exerciseToWorkoutSplitExpandedViewDbSchema,
  exerciseTrackingAnalysisSchema,
  exerciseTrackingAndStatsSchema,
  exerciseTrackingDbSchema,
  exerciseTrackingExpandedViewDbSchema,
  exerciseTrackingPrMaxSchema,
  finishUserWorkoutResponseSchema,
  finishWorkoutRequest,
  forgotPasswordPayloadSchema,
  generateTicketRequest,
  generateTicketResponseSchema,
  getAerobicsRequest,
  getAllExercisesExerciseSchema,
  getAllExercisesResponseSchema,
  getAllMessagesRequest,
  getAllUserMessagesResponseSchema,
  getAnalyticsResponseSchema,
  getAuthenticatedUserByIdResponseSchema,
  getExerciseTrackingRequest,
  getExerciseTrackingResponseSchema,
  getPresignedUrlFromS3ResponseSchema,
  getPresignedUrlS3Request,
  getWholeUserWorkoutPlanResponseSchema,
  getWholeWorkoutPlanRequest,
  googleOAuthRequest,
  googleTokenVerificationResultSchema,
  loginRequest,
  loginResponseSchema,
  logoutResponseSchema,
  markMessageAsReadRequest,
  markMessageAsReadResponseSchema,
  messageAfterSendResponseSchema,
  messageAsReadSchema,
  messageDbSchema,
  oAuthLoginResponseSchema,
  oauthAccountDbSchema,
  proceedLoginResponseSchema,
  prsViewDbSchema,
  queryGetExerciseMapByMuscleRowSchema,
  refreshTokenResponseSchema,
  resetPasswordRequest,
  resetPasswordResponseSchema,
  saveUserPushTokenRequest,
  sendChangePassEmailRequest,
  sendVerificationMailRequest,
  serializedDateSchema,
  setProfilePicAndUpdateDBResponseSchema,
  squatRepetitionSchema,
  timezoneSchema,
  tokenVersionResultSchema,
  trackingByDateItemSchema,
  trackingBySplitNameItemSchema,
  trackingMapItemSchema,
  trackingSetDbSchema,
  updateAuthenticatedUserResponseSchema,
  updateUserRequest,
  userAerobicsResponseSchema,
  userAfterBumpSchema,
  userByIndetifierSchema,
  userDataResponseSchema,
  userDataSchema,
  userDbSchema,
  userInsertDbSchema,
  userReminderSettingDbSchema,
  userSplitInformationDbSchema,
  userUpdateDbSchema,
  verifyAccountRequest,
  weeklyDataSchema,
  wholeUserWorkoutPlanSchema,
  workoutPlanDbSchema,
  workoutRmRecordSchema,
  workoutSetDbSchema,
  workoutSplitDbSchema,
  workoutSplitSchema,
  workoutSplitsMapItemSchema,
  workoutSplitsMapSchema,
  workoutSummaryDbSchema
});
