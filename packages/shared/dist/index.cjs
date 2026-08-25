"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  accessTokenPayloadDtoSchema: () => accessTokenPayloadDtoSchema,
  addAerobicInputQueryDtoSchema: () => addAerobicInputQueryDtoSchema,
  addAerobicsRequestSchema: () => addAerobicsRequestSchema,
  addUserAerobicsContract: () => addUserAerobicsContract,
  addWorkoutContract: () => addWorkoutContract,
  addWorkoutRequestSchema: () => addWorkoutRequestSchema,
  addWorkoutResponseSchema: () => addWorkoutResponseSchema,
  addWorkoutSplitPayloadQueryDtoSchema: () => addWorkoutSplitPayloadQueryDtoSchema,
  adherenceExerciseStatsQueryDtoSchema: () => adherenceExerciseStatsQueryDtoSchema,
  aerobicTrackingDbSchema: () => aerobicTrackingDbSchema,
  aerobicsDailyRecordQueryDtoSchema: () => aerobicsDailyRecordQueryDtoSchema,
  aerobicsWeeklyRecordQueryDtoSchema: () => aerobicsWeeklyRecordQueryDtoSchema,
  allUserMessageQueryDtoSchema: () => allUserMessageQueryDtoSchema,
  analyzeVideoPayloadDtoSchema: () => analyzeVideoPayloadDtoSchema,
  analyzeVideoResultPayloadDtoSchema: () => analyzeVideoResultPayloadDtoSchema,
  appleOAuthContract: () => appleOAuthContract,
  appleOAuthRequestSchema: () => appleOAuthRequestSchema,
  appleTokenVerificationResultDtoSchema: () => appleTokenVerificationResultDtoSchema,
  authenticatedUserForUpdateQueryDtoSchema: () => authenticatedUserForUpdateQueryDtoSchema,
  bootstrapContract: () => bootstrapContract,
  bootstrapRequestSchema: () => bootstrapRequestSchema,
  bootstrapResponseSchema: () => bootstrapResponseSchema,
  changeEmailAndVerifyContract: () => changeEmailAndVerifyContract,
  changeEmailAndVerifyRequestSchema: () => changeEmailAndVerifyRequestSchema,
  changeEmailTokenPayloadDtoSchema: () => changeEmailTokenPayloadDtoSchema,
  checkUserVerifyContract: () => checkUserVerifyContract,
  checkUserVerifyRequestSchema: () => checkUserVerifyRequestSchema,
  createUserContract: () => createUserContract,
  createUserRequestSchema: () => createUserRequestSchema,
  createUserResponseSchema: () => createUserResponseSchema,
  createUserUserSchema: () => createUserUserSchema,
  createdUserQueryDtoSchema: () => createdUserQueryDtoSchema,
  createdUserRawQueryDtoSchema: () => createdUserRawQueryDtoSchema,
  createdUserRowQueryDtoSchema: () => createdUserRowQueryDtoSchema,
  deleteMessageContract: () => deleteMessageContract,
  deleteMessageRequestSchema: () => deleteMessageRequestSchema,
  deleteMessageResponseSchema: () => deleteMessageResponseSchema,
  deleteProfilePicRequestSchema: () => deleteProfilePicRequestSchema,
  deleteUserProfilePicContract: () => deleteUserProfilePicContract,
  deletedMessageQueryDtoSchema: () => deletedMessageQueryDtoSchema,
  emailVerifyPayloadDtoSchema: () => emailVerifyPayloadDtoSchema,
  enqueueAnalyzeVideoParamsDtoSchema: () => enqueueAnalyzeVideoParamsDtoSchema,
  exerciseAssignmentIdQueryDtoSchema: () => exerciseAssignmentIdQueryDtoSchema,
  exerciseDbSchema: () => exerciseDbSchema,
  exerciseInPlanQueryDtoSchema: () => exerciseInPlanQueryDtoSchema,
  exerciseMapByMuscleRowQueryDtoSchema: () => exerciseMapByMuscleRowQueryDtoSchema,
  exerciseMetadataQueryDtoSchema: () => exerciseMetadataQueryDtoSchema,
  exerciseToWorkoutSplitDbSchema: () => exerciseToWorkoutSplitDbSchema,
  exerciseToWorkoutSplitSetExpandedViewDbSchema: () => exerciseToWorkoutSplitSetExpandedViewDbSchema,
  exerciseTrackingAnalysisQueryDtoSchema: () => exerciseTrackingAnalysisQueryDtoSchema,
  exerciseTrackingAndStatsQueryDtoSchema: () => exerciseTrackingAndStatsQueryDtoSchema,
  exerciseTrackingAndStatsRowQueryDtoSchema: () => exerciseTrackingAndStatsRowQueryDtoSchema,
  exerciseTrackingDbSchema: () => exerciseTrackingDbSchema,
  exerciseTrackingIdQueryDtoSchema: () => exerciseTrackingIdQueryDtoSchema,
  exerciseTrackingMapsQueryDtoSchema: () => exerciseTrackingMapsQueryDtoSchema,
  exerciseTrackingMapsRowQueryDtoSchema: () => exerciseTrackingMapsRowQueryDtoSchema,
  exerciseTrackingPrMaxQueryDtoSchema: () => exerciseTrackingPrMaxQueryDtoSchema,
  exerciseTrackingSetExpandedViewDbSchema: () => exerciseTrackingSetExpandedViewDbSchema,
  exerciseTrackingStatsQueryDtoSchema: () => exerciseTrackingStatsQueryDtoSchema,
  exerciseTrackingStatsRowQueryDtoSchema: () => exerciseTrackingStatsRowQueryDtoSchema,
  exercisesMapByMuscleQueryDtoSchema: () => exercisesMapByMuscleQueryDtoSchema,
  finishUserWorkoutContract: () => finishUserWorkoutContract,
  finishUserWorkoutResponseSchema: () => finishUserWorkoutResponseSchema,
  finishWorkoutRequestSchema: () => finishWorkoutRequestSchema,
  finishedWorkoutEntryQueryDtoSchema: () => finishedWorkoutEntryQueryDtoSchema,
  forgotPasswordPayloadDtoSchema: () => forgotPasswordPayloadDtoSchema,
  generateTicketContract: () => generateTicketContract,
  generateTicketRequestSchema: () => generateTicketRequestSchema,
  generateTicketResponseSchema: () => generateTicketResponseSchema,
  getAerobicsRequestSchema: () => getAerobicsRequestSchema,
  getAllExercisesContract: () => getAllExercisesContract,
  getAllExercisesExerciseQueryDtoSchema: () => getAllExercisesExerciseQueryDtoSchema,
  getAllExercisesResponseSchema: () => getAllExercisesResponseSchema,
  getAllMessagesRequestSchema: () => getAllMessagesRequestSchema,
  getAllUserMessagesContract: () => getAllUserMessagesContract,
  getAllUserMessagesResponseSchema: () => getAllUserMessagesResponseSchema,
  getAnalyticsContract: () => getAnalyticsContract,
  getAnalyticsResponseSchema: () => getAnalyticsResponseSchema,
  getAuthenticatedUserByIdContract: () => getAuthenticatedUserByIdContract,
  getAuthenticatedUserByIdResponseSchema: () => getAuthenticatedUserByIdResponseSchema,
  getExerciseTrackingContract: () => getExerciseTrackingContract,
  getExerciseTrackingRequestSchema: () => getExerciseTrackingRequestSchema,
  getExerciseTrackingResponseSchema: () => getExerciseTrackingResponseSchema,
  getExerciseTrackingStatsContract: () => getExerciseTrackingStatsContract,
  getExerciseTrackingStatsResponseSchema: () => getExerciseTrackingStatsResponseSchema,
  getPresignedUrlFromS3Contract: () => getPresignedUrlFromS3Contract,
  getPresignedUrlFromS3RequestSchema: () => getPresignedUrlFromS3RequestSchema,
  getPresignedUrlFromS3ResponseSchema: () => getPresignedUrlFromS3ResponseSchema,
  getUserAerobicsContract: () => getUserAerobicsContract,
  getWholeUserWorkoutPlanContract: () => getWholeUserWorkoutPlanContract,
  getWholeUserWorkoutPlanResponseSchema: () => getWholeUserWorkoutPlanResponseSchema,
  getWholeWorkoutPlanRequestSchema: () => getWholeWorkoutPlanRequestSchema,
  goalAdherenceQueryDtoSchema: () => goalAdherenceQueryDtoSchema,
  goalAdherenceRowQueryDtoSchema: () => goalAdherenceRowQueryDtoSchema,
  googleOAuthContract: () => googleOAuthContract,
  googleOAuthRequestSchema: () => googleOAuthRequestSchema,
  googleTokenVerificationResultDtoSchema: () => googleTokenVerificationResultDtoSchema,
  lastLoginQueryDtoSchema: () => lastLoginQueryDtoSchema,
  loginContract: () => loginContract,
  loginRequestSchema: () => loginRequestSchema,
  loginResponseSchema: () => loginResponseSchema,
  logoutContract: () => logoutContract,
  logoutResponseSchema: () => logoutResponseSchema,
  markMessageAsReadContract: () => markMessageAsReadContract,
  markMessageAsReadRequestSchema: () => markMessageAsReadRequestSchema,
  markMessageAsReadResponseSchema: () => markMessageAsReadResponseSchema,
  messageAfterSendQueryDtoSchema: () => messageAfterSendQueryDtoSchema,
  messageAsReadQueryDtoSchema: () => messageAsReadQueryDtoSchema,
  messageDbSchema: () => messageDbSchema,
  oAuthCreatedUserRowQueryDtoSchema: () => oAuthCreatedUserRowQueryDtoSchema,
  oAuthLinkQueryDtoSchema: () => oAuthLinkQueryDtoSchema,
  oAuthLinkRowQueryDtoSchema: () => oAuthLinkRowQueryDtoSchema,
  oAuthLoginContract: () => oAuthLoginContract,
  oAuthLoginResponseSchema: () => oAuthLoginResponseSchema,
  oAuthLookupQueryDtoSchema: () => oAuthLookupQueryDtoSchema,
  oAuthLookupRawQueryDtoSchema: () => oAuthLookupRawQueryDtoSchema,
  oAuthLookupRowQueryDtoSchema: () => oAuthLookupRowQueryDtoSchema,
  oauthAccountDbSchema: () => oauthAccountDbSchema,
  proceedLoginResponseSchema: () => proceedLoginResponseSchema,
  prsViewDbSchema: () => prsViewDbSchema,
  refreshTokenContract: () => refreshTokenContract,
  refreshTokenResponseSchema: () => refreshTokenResponseSchema,
  resetPasswordContract: () => resetPasswordContract,
  resetPasswordRequestSchema: () => resetPasswordRequestSchema,
  resetPasswordResponseSchema: () => resetPasswordResponseSchema,
  saveUserPushTokenContract: () => saveUserPushTokenContract,
  saveUserPushTokenRequestSchema: () => saveUserPushTokenRequestSchema,
  sendChangePassEmailContract: () => sendChangePassEmailContract,
  sendChangePassEmailRequestSchema: () => sendChangePassEmailRequestSchema,
  sendVerificationMailContract: () => sendVerificationMailContract,
  sendVerificationMailRequestSchema: () => sendVerificationMailRequestSchema,
  serializedDateSchema: () => serializedDateSchema,
  setProfilePicAndUpdateDBContract: () => setProfilePicAndUpdateDBContract,
  setProfilePicAndUpdateDBResponseSchema: () => setProfilePicAndUpdateDBResponseSchema,
  squatRepetitionDtoSchema: () => squatRepetitionDtoSchema,
  timezoneSchema: () => timezoneSchema,
  tokenVersionQueryDtoSchema: () => tokenVersionQueryDtoSchema,
  trackingByDateItemQueryDtoSchema: () => trackingByDateItemQueryDtoSchema,
  trackingBySplitNameItemQueryDtoSchema: () => trackingBySplitNameItemQueryDtoSchema,
  trackingMapItemQueryDtoSchema: () => trackingMapItemQueryDtoSchema,
  trackingSetDbSchema: () => trackingSetDbSchema,
  updateAuthenticatedUserContract: () => updateAuthenticatedUserContract,
  updateAuthenticatedUserResponseSchema: () => updateAuthenticatedUserResponseSchema,
  updateUserRequestSchema: () => updateUserRequestSchema,
  userAerobicsQueryDtoSchema: () => userAerobicsQueryDtoSchema,
  userAerobicsResponseSchema: () => userAerobicsResponseSchema,
  userAerobicsRowQueryDtoSchema: () => userAerobicsRowQueryDtoSchema,
  userAfterBumpQueryDtoSchema: () => userAfterBumpQueryDtoSchema,
  userByIdentifierQueryDtoSchema: () => userByIdentifierQueryDtoSchema,
  userByIdentifierRawQueryDtoSchema: () => userByIdentifierRawQueryDtoSchema,
  userByIdentifierRowQueryDtoSchema: () => userByIdentifierRowQueryDtoSchema,
  userByUsernameRawQueryDtoSchema: () => userByUsernameRawQueryDtoSchema,
  userByUsernameRowQueryDtoSchema: () => userByUsernameRowQueryDtoSchema,
  userConflictQueryDtoSchema: () => userConflictQueryDtoSchema,
  userDataContract: () => userDataContract,
  userDataQueryDtoSchema: () => userDataQueryDtoSchema,
  userDataResponseSchema: () => userDataResponseSchema,
  userDataRowQueryDtoSchema: () => userDataRowQueryDtoSchema,
  userDbSchema: () => userDbSchema,
  userExistsQueryDtoSchema: () => userExistsQueryDtoSchema,
  userInsertDbSchema: () => userInsertDbSchema,
  userMessageIdentityQueryDtoSchema: () => userMessageIdentityQueryDtoSchema,
  userProfilePicQueryDtoSchema: () => userProfilePicQueryDtoSchema,
  userReminderSettingDbSchema: () => userReminderSettingDbSchema,
  userSplitInformationDbSchema: () => userSplitInformationDbSchema,
  userToHourlyReminderQueryDtoSchema: () => userToHourlyReminderQueryDtoSchema,
  userUpdateDbSchema: () => userUpdateDbSchema,
  userWithNotificationsEnabledQueryDtoSchema: () => userWithNotificationsEnabledQueryDtoSchema,
  verifyAccountRequestSchema: () => verifyAccountRequestSchema,
  verifyUserAccountContract: () => verifyUserAccountContract,
  weeklyDataQueryDtoSchema: () => weeklyDataQueryDtoSchema,
  wholeUserWorkoutPlanQueryDtoSchema: () => wholeUserWorkoutPlanQueryDtoSchema,
  workoutExerciseInputQueryDtoSchema: () => workoutExerciseInputQueryDtoSchema,
  workoutExerciseMetadataQueryDtoSchema: () => workoutExerciseMetadataQueryDtoSchema,
  workoutPlanDbSchema: () => workoutPlanDbSchema,
  workoutPlanIdQueryDtoSchema: () => workoutPlanIdQueryDtoSchema,
  workoutRmRecordQueryDtoSchema: () => workoutRmRecordQueryDtoSchema,
  workoutRmsQueryDtoSchema: () => workoutRmsQueryDtoSchema,
  workoutRmsRowQueryDtoSchema: () => workoutRmsRowQueryDtoSchema,
  workoutSetDbSchema: () => workoutSetDbSchema,
  workoutSplitDbSchema: () => workoutSplitDbSchema,
  workoutSplitIdQueryDtoSchema: () => workoutSplitIdQueryDtoSchema,
  workoutSplitLookupQueryDtoSchema: () => workoutSplitLookupQueryDtoSchema,
  workoutSplitQueryDtoSchema: () => workoutSplitQueryDtoSchema,
  workoutSplitsMapItemQueryDtoSchema: () => workoutSplitsMapItemQueryDtoSchema,
  workoutSplitsMapQueryDtoSchema: () => workoutSplitsMapQueryDtoSchema,
  workoutSplitsRowQueryDtoSchema: () => workoutSplitsRowQueryDtoSchema,
  workoutSummaryDbSchema: () => workoutSummaryDbSchema,
  workoutSummaryIdQueryDtoSchema: () => workoutSummaryIdQueryDtoSchema
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
var exerciseToWorkoutSplitSetExpandedView = workoutSchema.view("v_exercise_to_workout_split_set_expanded", {
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
  setIndex: (0, import_pg_core32.integer)("set_index"),
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
var import_drizzle_orm29 = require("drizzle-orm");
var import_pg_core33 = require("drizzle-orm/pg-core");
var import_pg_core34 = require("drizzle-orm/pg-core");
var exerciseTrackingSetExpandedView = analyticsSchema.view("v_exercise_tracking_set_expanded", {
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
  orderIndex: (0, import_pg_core34.integer)("order_index"),
  setIndex: (0, import_pg_core34.integer)("set_index"),
  exerciseId: (0, import_pg_core33.bigint)("exercise_id", {
    mode: "number"
  }),
  workoutSplitId: (0, import_pg_core33.bigint)("workout_split_id", {
    mode: "number"
  }),
  splitName: (0, import_pg_core33.text)("split_name"),
  exercise: (0, import_pg_core33.text)("exercise"),
  targetMuscle: (0, import_pg_core33.text)("target_muscle"),
  specificTargetMuscle: (0, import_pg_core33.text)("specific_target_muscle"),
  notes: (0, import_pg_core33.text)("notes"),
  workoutSummaryId: (0, import_pg_core33.uuid)("workout_summary_id"),
  workoutStartUtc: (0, import_pg_core33.timestamp)("workout_start_utc", {
    withTimezone: true
  }),
  workoutEndUtc: (0, import_pg_core33.timestamp)("workout_end_utc", {
    withTimezone: true
  }),
  isAssignedToSplit: (0, import_pg_core33.boolean)("is_assigned_to_split")
}).with({
  securityInvoker: true
}).as(import_drizzle_orm29.sql`
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
var import_drizzle_orm30 = require("drizzle-orm");
var import_pg_core35 = require("drizzle-orm/pg-core");
var import_pg_core36 = require("drizzle-orm/pg-core");
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
  setIndex: (0, import_pg_core36.integer)("set_index"),
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
var userDbSchema = (0, import_drizzle_zod.createSelectSchema)(user);
var userInsertDbSchema = (0, import_drizzle_zod.createInsertSchema)(user);
var userUpdateDbSchema = (0, import_drizzle_zod.createUpdateSchema)(user);
var oauthAccountDbSchema = (0, import_drizzle_zod.createSelectSchema)(oauthAccount);
var exerciseDbSchema = (0, import_drizzle_zod.createSelectSchema)(exercise);
var workoutPlanDbSchema = (0, import_drizzle_zod.createSelectSchema)(workoutPlan);
var workoutSplitDbSchema = (0, import_drizzle_zod.createSelectSchema)(workoutSplit);
var exerciseToWorkoutSplitDbSchema = (0, import_drizzle_zod.createSelectSchema)(exerciseToWorkoutSplit);
var exerciseToWorkoutSplitSetExpandedViewDbSchema = (0, import_drizzle_zod.createSelectSchema)(exerciseToWorkoutSplitSetExpandedView);
var workoutSetDbSchema = (0, import_drizzle_zod.createSelectSchema)(workoutSet);
var workoutSummaryDbSchema = (0, import_drizzle_zod.createSelectSchema)(workoutSummary);
var exerciseTrackingDbSchema = (0, import_drizzle_zod.createSelectSchema)(exerciseTracking);
var trackingSetDbSchema = (0, import_drizzle_zod.createSelectSchema)(trackingSet);
var aerobicTrackingDbSchema = (0, import_drizzle_zod.createSelectSchema)(aerobicTracking);
var messageDbSchema = (0, import_drizzle_zod.createSelectSchema)(message);
var userReminderSettingDbSchema = (0, import_drizzle_zod.createSelectSchema)(userReminderSetting);
var userSplitInformationDbSchema = (0, import_drizzle_zod.createSelectSchema)(userSplitInformation);
var exerciseTrackingSetExpandedViewDbSchema = (0, import_drizzle_zod.createSelectSchema)(exerciseTrackingSetExpandedView);
var prsViewDbSchema = (0, import_drizzle_zod.createSelectSchema)(prsView);

// src/modules/aerobics/aerobics.contracts.ts
var import_v43 = require("zod/v4");

// src/modules/aerobics/aerobics.dtos.ts
var import_v42 = require("zod/v4");
var addAerobicInputQueryDtoSchema = import_v42.z.object({
  durationMins: import_v42.z.number(),
  durationSec: aerobicTrackingDbSchema.shape.durationSec,
  type: aerobicTrackingDbSchema.shape.type
});
var aerobicsDailyRecordQueryDtoSchema = import_v42.z.object({
  type: aerobicTrackingDbSchema.shape.type,
  durationSec: aerobicTrackingDbSchema.shape.durationSec,
  durationMins: aerobicTrackingDbSchema.shape.durationSec
});
var aerobicsWeeklyRecordQueryDtoSchema = aerobicsDailyRecordQueryDtoSchema.extend({
  workoutTimeUtc: serializedDateSchema
});
var weeklyDataQueryDtoSchema = import_v42.z.object({
  records: import_v42.z.array(aerobicsWeeklyRecordQueryDtoSchema),
  totalDurationSec: import_v42.z.number(),
  totalDurationMins: import_v42.z.number()
});
var userAerobicsQueryDtoSchema = import_v42.z.object({
  daily: import_v42.z.record(import_v42.z.string(), import_v42.z.array(aerobicsDailyRecordQueryDtoSchema)),
  weekly: import_v42.z.record(import_v42.z.string(), weeklyDataQueryDtoSchema)
});
var userAerobicsRowQueryDtoSchema = import_v42.z.object({
  data: userAerobicsQueryDtoSchema
});

// src/modules/aerobics/aerobics.contracts.ts
var addAerobicsRequestSchema = import_v43.z.object({
  body: import_v43.z.object({
    tz: import_v43.z.string(),
    record: addAerobicInputQueryDtoSchema
  })
});
var addUserAerobicsContract = {
  request: addAerobicsRequestSchema
};
var getAerobicsRequestSchema = import_v43.z.object({
  query: import_v43.z.object({
    tz: import_v43.z.string().optional()
  })
});
var userAerobicsResponseSchema = userAerobicsQueryDtoSchema;
var getUserAerobicsContract = {
  request: getAerobicsRequestSchema,
  response: userAerobicsResponseSchema
};

// src/modules/analytics/analytics.contracts.ts
var import_v45 = require("zod/v4");

// src/modules/analytics/analytics.dtos.ts
var import_v44 = require("zod/v4");
var workoutRmRecordQueryDtoSchema = import_v44.z.object({
  exercise: exerciseDbSchema.shape.name,
  prWeight: trackingSetDbSchema.shape.weight.nullable(),
  prReps: trackingSetDbSchema.shape.reps.nullable(),
  max1Rm: import_v44.z.number()
});
var adherenceExerciseStatsQueryDtoSchema = import_v44.z.object({
  planned: import_v44.z.number(),
  actual: import_v44.z.number(),
  adherencePct: import_v44.z.number().nullable()
});
var workoutRmsQueryDtoSchema = import_v44.z.record(import_v44.z.string(), workoutRmRecordQueryDtoSchema);
var workoutRmsRowQueryDtoSchema = import_v44.z.object({
  result: workoutRmsQueryDtoSchema
});
var goalAdherenceQueryDtoSchema = import_v44.z.record(import_v44.z.string(), import_v44.z.record(import_v44.z.string(), adherenceExerciseStatsQueryDtoSchema));
var goalAdherenceRowQueryDtoSchema = import_v44.z.object({
  result: goalAdherenceQueryDtoSchema
});

// src/modules/analytics/analytics.contracts.ts
var getAnalyticsResponseSchema = import_v45.z.object({
  oneRepMaxes: import_v45.z.record(import_v45.z.string(), workoutRmRecordQueryDtoSchema),
  goals: import_v45.z.record(import_v45.z.string(), import_v45.z.record(import_v45.z.string(), adherenceExerciseStatsQueryDtoSchema))
});
var getAnalyticsContract = {
  response: getAnalyticsResponseSchema
};

// src/modules/auth/password/password.contracts.ts
var import_v46 = require("zod/v4");
var sendChangePassEmailRequestSchema = import_v46.z.object({
  body: import_v46.z.object({
    identifier: import_v46.z.string()
  })
});
var sendChangePassEmailContract = {
  request: sendChangePassEmailRequestSchema
};
var resetPasswordRequestSchema = import_v46.z.object({
  body: import_v46.z.object({
    newPassword: import_v46.z.string().min(8, "Password must be at least 8 characters long")
  }),
  query: import_v46.z.object({
    token: import_v46.z.string().optional()
  })
});
var resetPasswordResponseSchema = import_v46.z.object({
  ok: import_v46.z.boolean()
});
var resetPasswordContract = {
  request: resetPasswordRequestSchema,
  response: resetPasswordResponseSchema
};

// src/modules/auth/password/password.dtos.ts
var import_v47 = require("zod/v4");
var forgotPasswordPayloadDtoSchema = import_v47.z.object({
  sub: userDbSchema.shape.id,
  jti: import_v47.z.string(),
  exp: import_v47.z.number(),
  iss: import_v47.z.string(),
  typ: import_v47.z.string()
});

// src/modules/auth/session/session.contracts.ts
var import_v48 = require("zod/v4");
var loginRequestSchema = import_v48.z.object({
  body: import_v48.z.object({
    identifier: import_v48.z.string().min(3).refine((value) => import_v48.z.string().email().safeParse(value).success || /^[a-zA-Z0-9_]{3,20}$/.test(value), {
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
var loginContract = {
  request: loginRequestSchema,
  response: loginResponseSchema
};
var refreshTokenResponseSchema = import_v48.z.object({
  message: import_v48.z.string(),
  accessToken: import_v48.z.string(),
  refreshToken: import_v48.z.string(),
  userId: userDbSchema.shape.id
});
var refreshTokenContract = {
  response: refreshTokenResponseSchema
};
var logoutResponseSchema = import_v48.z.object({
  message: import_v48.z.string()
});
var logoutContract = {
  response: logoutResponseSchema
};

// src/modules/auth/session/session.dtos.ts
var import_v410 = require("zod/v4");

// src/modules/user/update/update.dtos.ts
var import_v49 = require("zod/v4");
var authenticatedUserForUpdateQueryDtoSchema = import_v49.z.object({
  username: userDbSchema.shape.username.trim().min(3, "Username must be at least 3 characters").max(15, "Username must be at most 15 characters").regex(/^[a-zA-Z0-9_]+$/, "Username may contain letters, numbers, and underscore only"),
  fullName: userDbSchema.shape.name.trim().min(1, "Full name is required").max(20, "Full name is too long").regex(/^[a-zA-Z\s]+$/, "Full name may contain letters and spaces only"),
  email: userDbSchema.shape.email.trim().toLowerCase().email("Invalid email format")
}).partial();
var userDataQueryDtoSchema = import_v49.z.object({
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
  isFirstLogin: import_v49.z.boolean(),
  tokenVersion: userDbSchema.shape.tokenVersion,
  isVerified: userDbSchema.shape.isVerified,
  authProvider: userDbSchema.shape.authProvider,
  lastLogin: serializedDateSchema.nullable()
});
var userDataRowQueryDtoSchema = import_v49.z.object({
  userData: userDataQueryDtoSchema
});
var userConflictQueryDtoSchema = import_v49.z.object({
  conflict: import_v49.z.boolean()
});
var userMessageIdentityQueryDtoSchema = import_v49.z.object({
  id: userDbSchema.shape.id,
  username: userDbSchema.shape.username,
  name: userDbSchema.shape.name,
  profilePicPath: userDbSchema.shape.profilePicPath
});
var userProfilePicQueryDtoSchema = import_v49.z.object({
  profilePicPath: userDbSchema.shape.profilePicPath
});
var changeEmailTokenPayloadDtoSchema = import_v49.z.object({
  jti: import_v49.z.string(),
  sub: import_v49.z.string(),
  newEmail: import_v49.z.string(),
  exp: import_v49.z.number(),
  iss: import_v49.z.string(),
  typ: import_v49.z.string()
});

// src/modules/auth/session/session.dtos.ts
var accessTokenPayloadDtoSchema = import_v410.z.object({
  id: userDbSchema.shape.id,
  role: userDbSchema.shape.role,
  tokenVer: userDbSchema.shape.tokenVersion,
  cnf: import_v410.z.object({
    jkt: import_v410.z.string()
  }).optional(),
  iat: import_v410.z.number().optional(),
  exp: import_v410.z.number().optional()
});
var userAfterBumpQueryDtoSchema = import_v410.z.object({
  tokenVersion: userDbSchema.shape.tokenVersion,
  userData: userDataQueryDtoSchema
});
var tokenVersionQueryDtoSchema = import_v410.z.object({
  tokenVersion: userDbSchema.shape.tokenVersion
});
var lastLoginQueryDtoSchema = import_v410.z.object({
  lastLogin: import_v410.z.date().nullable()
});

// src/modules/auth/verification/verification.contracts.ts
var import_v411 = require("zod/v4");
var verifyAccountRequestSchema = import_v411.z.object({
  query: import_v411.z.object({
    token: import_v411.z.string().optional()
  })
});
var verifyUserAccountContract = {
  request: verifyAccountRequestSchema
};
var sendVerificationMailRequestSchema = import_v411.z.object({
  body: import_v411.z.object({
    email: userDbSchema.shape.email.trim().email("Invalid email")
  })
});
var sendVerificationMailContract = {
  request: sendVerificationMailRequestSchema
};
var changeEmailAndVerifyRequestSchema = import_v411.z.object({
  body: import_v411.z.object({
    username: userDbSchema.shape.username,
    password: import_v411.z.string(),
    newEmail: userDbSchema.shape.email.trim().email("Invalid email")
  })
});
var changeEmailAndVerifyContract = {
  request: changeEmailAndVerifyRequestSchema
};
var checkUserVerifyRequestSchema = import_v411.z.object({
  query: import_v411.z.object({
    username: userDbSchema.shape.username
  })
});
var checkUserVerifyContract = {
  request: checkUserVerifyRequestSchema
};

// src/modules/auth/verification/verification.dtos.ts
var import_v412 = require("zod/v4");
var emailVerifyPayloadDtoSchema = import_v412.z.object({
  sub: userDbSchema.shape.id,
  jti: import_v412.z.string(),
  exp: import_v412.z.number(),
  iss: import_v412.z.string(),
  typ: import_v412.z.string()
});

// src/modules/auth/auth.dtos.ts
var import_v413 = require("zod/v4");
var userByIdentifierQueryDtoSchema = import_v413.z.object({
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
  is_verified: import_v413.z.boolean(),
  last_login: serializedDateSchema.nullable()
});
var userByIdentifierRowQueryDtoSchema = import_v413.z.object({
  userData: userByIdentifierRawQueryDtoSchema.nullable()
});
var userByUsernameRawQueryDtoSchema = userByIdentifierQueryDtoSchema.omit({
  isVerified: true,
  passwordHash: true
}).extend({
  password_hash: userDbSchema.shape.passwordHash,
  is_verified: import_v413.z.boolean()
});
var userByUsernameRowQueryDtoSchema = import_v413.z.object({
  userData: userByUsernameRawQueryDtoSchema.nullable()
});

// src/modules/bootstrap/bootstrap.contracts.ts
var import_v419 = require("zod/v4");

// src/modules/messages/messages.contracts.ts
var import_v415 = require("zod/v4");

// src/modules/messages/messages.dtos.ts
var import_v414 = require("zod/v4");
var allUserMessageQueryDtoSchema = import_v414.z.object({
  id: messageDbSchema.shape.id,
  subject: messageDbSchema.shape.subject,
  msg: messageDbSchema.shape.msg,
  sentAt: serializedDateSchema,
  isRead: messageDbSchema.shape.isRead,
  senderFullName: userDbSchema.shape.name,
  senderProfilePicPath: userDbSchema.shape.profilePicPath
});
var messageAsReadQueryDtoSchema = import_v414.z.object({
  id: messageDbSchema.shape.id,
  isRead: messageDbSchema.shape.isRead
});
var deletedMessageQueryDtoSchema = import_v414.z.object({
  id: messageDbSchema.shape.id
});
var messageAfterSendQueryDtoSchema = import_v414.z.object({
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
var getAllMessagesRequestSchema = import_v415.z.object({
  query: import_v415.z.object({
    tz: import_v415.z.string()
  })
});
var getAllUserMessagesResponseSchema = import_v415.z.object({
  messages: import_v415.z.array(allUserMessageQueryDtoSchema)
});
var getAllUserMessagesContract = {
  request: getAllMessagesRequestSchema,
  response: getAllUserMessagesResponseSchema
};
var markMessageAsReadRequestSchema = import_v415.z.object({
  params: import_v415.z.object({
    id: messageDbSchema.shape.id
  })
});
var markMessageAsReadResponseSchema = messageAsReadQueryDtoSchema;
var markMessageAsReadContract = {
  request: markMessageAsReadRequestSchema,
  response: markMessageAsReadResponseSchema
};
var deleteMessageRequestSchema = import_v415.z.object({
  params: import_v415.z.object({
    id: messageDbSchema.shape.id
  })
});
var deleteMessageResponseSchema = deletedMessageQueryDtoSchema;
var deleteMessageContract = {
  request: deleteMessageRequestSchema,
  response: deleteMessageResponseSchema
};

// src/modules/workout/plan/plan.contracts.ts
var import_v417 = require("zod/v4");

// src/modules/workout/plan/plan.dtos.ts
var import_v416 = require("zod/v4");
var workoutExerciseInputQueryDtoSchema = import_v416.z.object({
  id: exerciseDbSchema.shape.id,
  sets: import_v416.z.array(workoutSetDbSchema.shape.reps),
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex
});
var addWorkoutSplitPayloadQueryDtoSchema = import_v416.z.record(import_v416.z.string(), import_v416.z.array(workoutExerciseInputQueryDtoSchema).min(1, "Each split must include at least one exercise"));
var exerciseInPlanQueryDtoSchema = import_v416.z.object({
  id: exerciseToWorkoutSplitDbSchema.shape.id,
  sets: import_v416.z.array(workoutSetDbSchema.shape.reps),
  isActive: exerciseToWorkoutSplitDbSchema.shape.isActive,
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle,
  exercise: exerciseDbSchema.shape.name,
  workoutSplit: workoutSplitDbSchema.shape.name
});
var workoutSplitQueryDtoSchema = import_v416.z.object({
  id: workoutSplitDbSchema.shape.id,
  workoutId: workoutSplitDbSchema.shape.workoutId,
  name: workoutSplitDbSchema.shape.name,
  createdAt: serializedDateSchema,
  muscleGroup: import_v416.z.string().nullable(),
  isActive: workoutSplitDbSchema.shape.isActive,
  exerciseToWorkoutSplit: import_v416.z.array(exerciseInPlanQueryDtoSchema)
});
var wholeUserWorkoutPlanQueryDtoSchema = import_v416.z.object({
  id: workoutPlanDbSchema.shape.id,
  numberOfSplits: import_v416.z.number(),
  createdAt: serializedDateSchema,
  userId: userDbSchema.shape.id,
  isActive: workoutPlanDbSchema.shape.isActive,
  updatedAt: serializedDateSchema,
  workoutSplits: import_v416.z.array(workoutSplitQueryDtoSchema).nullable()
});
var workoutSplitsMapItemQueryDtoSchema = import_v416.z.object({
  id: exerciseDbSchema.shape.id,
  name: exerciseDbSchema.shape.name,
  sets: import_v416.z.array(workoutSetDbSchema.shape.reps),
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var workoutExerciseMetadataQueryDtoSchema = workoutSplitsMapItemQueryDtoSchema.pick({
  targetMuscle: true,
  specificTargetMuscle: true
});
var workoutSplitsMapQueryDtoSchema = import_v416.z.record(import_v416.z.string(), import_v416.z.array(workoutSplitsMapItemQueryDtoSchema));
var workoutSplitsRowQueryDtoSchema = import_v416.z.object({
  splits: workoutSplitsMapQueryDtoSchema
});
var workoutPlanIdQueryDtoSchema = import_v416.z.object({
  id: workoutPlanDbSchema.shape.id
});
var workoutSplitIdQueryDtoSchema = import_v416.z.object({
  id: workoutSplitDbSchema.shape.id
});
var exerciseAssignmentIdQueryDtoSchema = import_v416.z.object({
  id: exerciseToWorkoutSplitDbSchema.shape.id
});

// src/modules/workout/plan/plan.contracts.ts
var getWholeWorkoutPlanRequestSchema = import_v417.z.object({
  query: import_v417.z.object({
    tz: import_v417.z.string().optional()
  })
});
var getWholeUserWorkoutPlanResponseSchema = import_v417.z.object({
  workoutPlan: wholeUserWorkoutPlanQueryDtoSchema.nullable(),
  workoutPlanForEditWorkout: workoutSplitsMapQueryDtoSchema.nullable()
});
var getWholeUserWorkoutPlanContract = {
  request: getWholeWorkoutPlanRequestSchema,
  response: getWholeUserWorkoutPlanResponseSchema
};
var addWorkoutRequestSchema = import_v417.z.object({
  body: import_v417.z.object({
    workoutData: addWorkoutSplitPayloadQueryDtoSchema,
    workoutName: import_v417.z.string().optional(),
    tz: import_v417.z.string()
  })
});
var addWorkoutResponseSchema = import_v417.z.object({
  message: import_v417.z.string(),
  workoutPlan: wholeUserWorkoutPlanQueryDtoSchema,
  workoutPlanForEditWorkout: workoutSplitsMapQueryDtoSchema
});
var addWorkoutContract = {
  request: addWorkoutRequestSchema,
  response: addWorkoutResponseSchema
};

// src/modules/workout/tracking/tracking.dtos.ts
var import_v418 = require("zod/v4");
var trackedSetQueryDtoSchema = import_v418.z.object({
  reps: trackingSetDbSchema.shape.reps,
  weight: trackingSetDbSchema.shape.weight,
  setIndex: trackingSetDbSchema.shape.setIndex
});
var finishedWorkoutEntryBaseQueryDtoSchema = import_v418.z.object({
  trackedSets: import_v418.z.array(trackedSetQueryDtoSchema),
  notes: exerciseTrackingDbSchema.shape.notes.optional()
});
var finishedWorkoutEntryQueryDtoSchema = finishedWorkoutEntryBaseQueryDtoSchema.extend({
  isExerciseAssignedToSplit: import_v418.z.boolean(),
  exerciseToSplitId: exerciseTrackingDbSchema.shape.exerciseToSplitId,
  exerciseId: exerciseTrackingDbSchema.shape.exerciseId
});
var exerciseMetadataQueryDtoSchema = import_v418.z.object({
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var exerciseTrackingPrMaxQueryDtoSchema = import_v418.z.object({
  exercise: exerciseDbSchema.shape.name,
  weight: trackingSetDbSchema.shape.weight,
  reps: trackingSetDbSchema.shape.reps,
  workoutTimeUtc: serializedDateSchema
});
var exerciseTrackingAnalysisQueryDtoSchema = import_v418.z.object({
  uniqueDays: import_v418.z.number(),
  mostFrequentSplit: import_v418.z.string().nullable(),
  mostFrequentSplitDays: import_v418.z.number().nullable(),
  lastWorkoutDate: import_v418.z.string().nullable(),
  splitDaysByName: import_v418.z.record(import_v418.z.string(), import_v418.z.number()),
  prs: import_v418.z.object({
    prMax: exerciseTrackingPrMaxQueryDtoSchema.nullable()
  })
});
var trackingMapItemQueryDtoSchema = import_v418.z.object({
  id: exerciseTrackingDbSchema.shape.id,
  exerciseToSplitId: exerciseToWorkoutSplitDbSchema.shape.id,
  weight: import_v418.z.array(trackingSetDbSchema.shape.weight),
  reps: import_v418.z.array(trackingSetDbSchema.shape.reps),
  notes: exerciseTrackingDbSchema.shape.notes,
  exerciseId: exerciseDbSchema.shape.id,
  workoutSplitId: workoutSplitDbSchema.shape.id,
  splitName: workoutSplitDbSchema.shape.name,
  exercise: exerciseDbSchema.shape.name,
  workoutDate: serializedDateSchema,
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
  exerciseToWorkoutSplit: import_v418.z.object({
    sets: import_v418.z.array(workoutSetDbSchema.shape.reps),
    exercises: exerciseMetadataQueryDtoSchema
  })
});
var trackingByDateItemQueryDtoSchema = trackingMapItemQueryDtoSchema.omit({
  workoutDate: true
});
var trackingBySplitNameItemQueryDtoSchema = trackingMapItemQueryDtoSchema.omit({
  splitName: true
});
var groupedTrackingItemQueryDtoSchema = import_v418.z.object({
  exerciseTracking: import_v418.z.object({
    exerciseTrackingId: exerciseTrackingDbSchema.shape.id,
    sets: import_v418.z.array(import_v418.z.object({
      setIndex: trackingSetDbSchema.shape.setIndex,
      weight: trackingSetDbSchema.shape.weight,
      reps: trackingSetDbSchema.shape.reps
    })),
    notes: exerciseTrackingDbSchema.shape.notes,
    exerciseAssignment: import_v418.z.object({
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
var exerciseTrackingStatsQueryDtoSchema = import_v418.z.object({
  workoutCount: import_v418.z.coerce.number(),
  hasExerciseTracking: import_v418.z.boolean(),
  workoutTargets: import_v418.z.object({
    workoutCountThisWeek: import_v418.z.coerce.number(),
    workoutCountScheduledPerWeek: import_v418.z.coerce.number(),
    weekStreak: import_v418.z.coerce.number()
  }),
  lastWorkoutStats: import_v418.z.object({
    workoutDate: import_v418.z.string().nullable(),
    workoutSplitName: workoutSplitDbSchema.shape.name.nullable(),
    exerciseTrackedCount: import_v418.z.coerce.number().nullable(),
    setTrackedCount: import_v418.z.coerce.number().nullable()
  }),
  prs: import_v418.z.array(import_v418.z.object({
    exerciseToSplitId: exerciseTrackingDbSchema.shape.exerciseToSplitId,
    exerciseId: exerciseDbSchema.shape.id,
    exerciseName: exerciseDbSchema.shape.name,
    prWeight: trackingSetDbSchema.shape.weight,
    prReps: trackingSetDbSchema.shape.reps,
    prSetIndex: trackingSetDbSchema.shape.setIndex
  }))
});
var exerciseTrackingMapsQueryDtoSchema = import_v418.z.object({
  byDate: import_v418.z.record(import_v418.z.string(), import_v418.z.array(groupedTrackingItemQueryDtoSchema)),
  byExerciseToSplitId: import_v418.z.record(import_v418.z.string(), import_v418.z.array(groupedTrackingItemQueryDtoSchema)),
  bySplitName: import_v418.z.record(import_v418.z.string(), import_v418.z.array(groupedTrackingItemQueryDtoSchema))
});
var exerciseTrackingAndStatsQueryDtoSchema = import_v418.z.object({
  trackingStats: exerciseTrackingStatsQueryDtoSchema,
  trackingMaps: exerciseTrackingMapsQueryDtoSchema
});
var exerciseTrackingAndStatsRowQueryDtoSchema = import_v418.z.object({
  data: exerciseTrackingAndStatsQueryDtoSchema
});
var exerciseTrackingStatsRowQueryDtoSchema = import_v418.z.object({
  data: exerciseTrackingStatsQueryDtoSchema
});
var exerciseTrackingMapsRowQueryDtoSchema = import_v418.z.object({
  data: exerciseTrackingMapsQueryDtoSchema
});
var workoutSplitLookupQueryDtoSchema = import_v418.z.object({
  workoutSplitId: workoutSplitDbSchema.shape.id
});
var workoutSummaryIdQueryDtoSchema = import_v418.z.object({
  id: import_v418.z.string().uuid()
});
var exerciseTrackingIdQueryDtoSchema = import_v418.z.object({
  id: exerciseTrackingDbSchema.shape.id
});

// src/modules/bootstrap/bootstrap.contracts.ts
var bootstrapRequestSchema = import_v419.z.object({
  query: import_v419.z.object({
    tz: import_v419.z.string().optional()
  })
});
var bootstrapResponseSchema = import_v419.z.object({
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
var import_v420 = require("zod/v4");
var getAllExercisesExerciseQueryDtoSchema = import_v420.z.object({
  id: exerciseDbSchema.shape.id,
  name: exerciseDbSchema.shape.name,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var exercisesMapByMuscleQueryDtoSchema = import_v420.z.record(import_v420.z.string(), import_v420.z.array(getAllExercisesExerciseQueryDtoSchema));
var exerciseMapByMuscleRowQueryDtoSchema = import_v420.z.object({
  result: import_v420.z.object({
    map: exercisesMapByMuscleQueryDtoSchema.nullable()
  }).nullable()
});

// src/modules/exercises/exercises.contracts.ts
var getAllExercisesResponseSchema = exercisesMapByMuscleQueryDtoSchema;
var getAllExercisesContract = {
  response: getAllExercisesResponseSchema
};

// src/modules/oauth/apple/apple.contracts.ts
var import_v421 = require("zod/v4");
var appleNameInputSchema = import_v421.z.object({
  givenName: import_v421.z.string().nullable(),
  familyName: import_v421.z.string().nullable()
});
var appleOAuthRequestSchema = import_v421.z.object({
  body: import_v421.z.object({
    idToken: import_v421.z.string({
      error: "Missing or invalid Apple identityToken"
    }),
    rawNonce: import_v421.z.string(),
    name: appleNameInputSchema.optional(),
    email: userDbSchema.shape.email.email().nullable()
  })
});
var appleOAuthContract = {
  request: appleOAuthRequestSchema
};

// src/modules/oauth/apple/apple.dtos.ts
var import_v422 = require("zod/v4");
var appleTokenVerificationResultDtoSchema = import_v422.z.object({
  appleSub: import_v422.z.string(),
  email: userDbSchema.shape.email.nullable(),
  emailVerified: import_v422.z.boolean(),
  fullName: userDbSchema.shape.name
});

// src/modules/oauth/google/google.contracts.ts
var import_v423 = require("zod/v4");
var googleOAuthRequestSchema = import_v423.z.object({
  body: import_v423.z.object({
    idToken: import_v423.z.string().optional()
  })
});
var googleOAuthContract = {
  request: googleOAuthRequestSchema
};

// src/modules/oauth/google/google.dtos.ts
var import_v424 = require("zod/v4");
var googleTokenVerificationResultDtoSchema = import_v424.z.object({
  googleSub: import_v424.z.string(),
  email: userDbSchema.shape.email.nullable(),
  emailVerified: import_v424.z.boolean(),
  fullName: userDbSchema.shape.name
});

// src/modules/oauth/oauth.contracts.ts
var import_v425 = require("zod/v4");
var oAuthLoginResponseSchema = import_v425.z.object({
  message: import_v425.z.string(),
  user: userDbSchema.shape.id,
  accessToken: import_v425.z.string(),
  refreshToken: import_v425.z.string(),
  missingFields: import_v425.z.array(import_v425.z.string()).nullable()
});
var proceedLoginResponseSchema = loginResponseSchema;
var oAuthLoginContract = {
  response: oAuthLoginResponseSchema
};

// src/modules/oauth/oauth.dtos.ts
var import_v426 = require("zod/v4");
var oAuthLookupQueryDtoSchema = import_v426.z.object({
  userId: userDbSchema.shape.id.nullable(),
  missingFields: import_v426.z.string().nullable()
});
var oAuthLookupRawQueryDtoSchema = import_v426.z.object({
  user_id: userDbSchema.shape.id,
  missing_fields: import_v426.z.string().nullable()
});
var oAuthLookupRowQueryDtoSchema = import_v426.z.object({
  oauth_data: oAuthLookupRawQueryDtoSchema.nullable()
});
var oAuthLinkQueryDtoSchema = import_v426.z.object({
  userId: userDbSchema.shape.id.nullable()
});
var oAuthLinkRowQueryDtoSchema = import_v426.z.object({
  user_id: userDbSchema.shape.id.nullable()
});
var oAuthCreatedUserRowQueryDtoSchema = import_v426.z.object({
  user_id: userDbSchema.shape.id
});

// src/modules/push/push.dtos.ts
var import_v427 = require("zod/v4");
var userWithNotificationsEnabledQueryDtoSchema = import_v427.z.object({
  pushToken: userDbSchema.shape.pushToken,
  name: userDbSchema.shape.name
});
var userToHourlyReminderQueryDtoSchema = import_v427.z.object({
  userId: userDbSchema.shape.id,
  name: userDbSchema.shape.name,
  pushToken: userDbSchema.shape.pushToken,
  reminderOffsetMinutes: import_v427.z.number(),
  splitId: workoutSplitDbSchema.shape.id,
  splitName: workoutSplitDbSchema.shape.name.nullable(),
  estimatedTimeUtc: import_v427.z.string()
});

// src/modules/user/create/create.contracts.ts
var import_v429 = require("zod/v4");

// src/modules/user/create/create.dtos.ts
var import_v428 = require("zod/v4");
var createdUserQueryDtoSchema = import_v428.z.object({
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
var createdUserRowQueryDtoSchema = import_v428.z.object({
  userData: createdUserRawQueryDtoSchema
});
var userExistsQueryDtoSchema = import_v428.z.object({
  id: userDbSchema.shape.id.nullable()
});

// src/modules/user/create/create.contracts.ts
var usernameSchema = userDbSchema.shape.username.trim().min(3, "Username must be at least 3 characters").max(15, "Username must be at most 15 characters").regex(/^[a-zA-Z0-9_]+$/, "Username may contain letters, numbers, and underscore only");
var fullNameSchema = userDbSchema.shape.name.trim().max(20, "Full name is too long").regex(/^[a-zA-Z\s]+$/, "Full name may contain letters and spaces only");
var createUserRequestSchema = import_v429.z.object({
  body: import_v429.z.object({
    username: usernameSchema,
    fullName: import_v429.z.preprocess((value) => value == null || typeof value === "string" && value.trim() === "" ? "User" : value, fullNameSchema),
    email: userDbSchema.shape.email.trim().toLowerCase().email("Invalid email format"),
    password: import_v429.z.string().min(8, "Password must be at least 8 characters long"),
    gender: import_v429.z.preprocess((value) => value === "" || value == null ? "Unknown" : value, import_v429.z.enum([
      "Male",
      "Female",
      "Other",
      "Unknown"
    ]))
  })
});
var createUserUserSchema = createdUserQueryDtoSchema;
var createUserResponseSchema = import_v429.z.object({
  message: import_v429.z.string(),
  user: createdUserQueryDtoSchema
});
var createUserContract = {
  request: createUserRequestSchema,
  response: createUserResponseSchema
};

// src/modules/user/push-tokens/push-tokens.contracts.ts
var import_v430 = require("zod/v4");
var saveUserPushTokenRequestSchema = import_v430.z.object({
  body: import_v430.z.object({
    token: userDbSchema.shape.pushToken.unwrap()
  })
});
var saveUserPushTokenContract = {
  request: saveUserPushTokenRequestSchema
};

// src/modules/user/update/update.contracts.ts
var import_v431 = require("zod/v4");
var updateUserRequestSchema = import_v431.z.object({
  body: authenticatedUserForUpdateQueryDtoSchema
});
var updateAuthenticatedUserResponseSchema = import_v431.z.object({
  message: import_v431.z.string(),
  emailChanged: import_v431.z.boolean(),
  user: userDataQueryDtoSchema
});
var updateAuthenticatedUserContract = {
  request: updateUserRequestSchema,
  response: updateAuthenticatedUserResponseSchema
};
var userDataResponseSchema = import_v431.z.object({
  userData: userDataQueryDtoSchema
});
var userDataContract = {
  response: userDataResponseSchema
};
var getAuthenticatedUserByIdResponseSchema = userDataQueryDtoSchema;
var getAuthenticatedUserByIdContract = {
  response: getAuthenticatedUserByIdResponseSchema
};
var deleteProfilePicRequestSchema = import_v431.z.object({
  body: import_v431.z.object({
    profilePicPath: import_v431.z.string()
  })
});
var deleteUserProfilePicContract = {
  request: deleteProfilePicRequestSchema
};
var setProfilePicAndUpdateDBResponseSchema = import_v431.z.object({
  profilePicPath: import_v431.z.string(),
  url: import_v431.z.string(),
  message: import_v431.z.string()
});
var setProfilePicAndUpdateDBContract = {
  response: setProfilePicAndUpdateDBResponseSchema
};

// src/modules/video-analysis/video-analysis.contracts.ts
var import_v432 = require("zod/v4");
var getPresignedUrlFromS3RequestSchema = import_v432.z.object({
  body: import_v432.z.object({
    exercise: exerciseDbSchema.shape.name,
    fileType: import_v432.z.string(),
    jobId: import_v432.z.string()
  })
});
var getPresignedUrlFromS3ResponseSchema = import_v432.z.object({
  uploadUrl: import_v432.z.string(),
  fileKey: import_v432.z.string(),
  requestId: import_v432.z.string()
});
var getPresignedUrlFromS3Contract = {
  request: getPresignedUrlFromS3RequestSchema,
  response: getPresignedUrlFromS3ResponseSchema
};

// src/modules/video-analysis/video-analysis.dtos.ts
var import_v433 = require("zod/v4");
var enqueueAnalyzeVideoParamsDtoSchema = import_v433.z.object({
  fileKey: import_v433.z.string(),
  exercise: import_v433.z.string(),
  userId: userDbSchema.shape.id,
  requestId: import_v433.z.string(),
  sentryTrace: import_v433.z.string().optional(),
  baggage: import_v433.z.string().optional()
});
var analyzeVideoPayloadDtoSchema = enqueueAnalyzeVideoParamsDtoSchema.extend({
  expiresAt: import_v433.z.number()
});
var squatRepetitionDtoSchema = import_v433.z.object({
  depth: import_v433.z.object({
    value: import_v433.z.number(),
    status: import_v433.z.string(),
    confidence: import_v433.z.number()
  }),
  backLean: import_v433.z.object({
    value: import_v433.z.number(),
    excessive: import_v433.z.boolean(),
    confidence: import_v433.z.number()
  }),
  audit: import_v433.z.object({
    framesAnalyzed: import_v433.z.number(),
    validFrames: import_v433.z.number(),
    cameraAngle: import_v433.z.string(),
    rawBottomAngle: import_v433.z.number(),
    samplingRate: import_v433.z.string()
  })
});
var analyzeVideoResultPayloadDtoSchema = /* @__PURE__ */ __name((resultSchema) => import_v433.z.intersection(import_v433.z.object({
  jobId: import_v433.z.string(),
  userId: userDbSchema.shape.id,
  exercise: import_v433.z.string(),
  requestId: import_v433.z.string().optional()
}), import_v433.z.discriminatedUnion("status", [
  import_v433.z.object({
    status: import_v433.z.literal("completed"),
    result: import_v433.z.array(resultSchema),
    error: import_v433.z.null()
  }),
  import_v433.z.object({
    status: import_v433.z.literal("failed"),
    result: import_v433.z.null(),
    error: import_v433.z.string()
  })
])), "analyzeVideoResultPayloadDtoSchema");

// src/modules/web-sockets/web-sockets.contracts.ts
var import_v434 = require("zod/v4");
var generateTicketRequestSchema = import_v434.z.object({
  body: import_v434.z.object({
    username: userDbSchema.shape.username
  })
});
var generateTicketResponseSchema = import_v434.z.object({
  ticket: import_v434.z.string()
});
var generateTicketContract = {
  request: generateTicketRequestSchema,
  response: generateTicketResponseSchema
};

// src/modules/workout/tracking/tracking.contracts.ts
var import_v435 = require("zod/v4");
var getExerciseTrackingRequestSchema = import_v435.z.object({
  query: import_v435.z.object({
    tz: import_v435.z.string().optional()
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
var finishWorkoutRequestSchema = import_v435.z.object({
  body: import_v435.z.object({
    workout: import_v435.z.array(finishedWorkoutEntryQueryDtoSchema),
    tz: import_v435.z.string().optional(),
    workoutStartUtc: import_v435.z.string().datetime("workoutStartUtc must be a valid ISO datetime"),
    workoutEndUtc: import_v435.z.string().datetime("workoutEndUtc must be a valid ISO datetime").optional().nullable()
  })
});
var finishUserWorkoutResponseSchema = exerciseTrackingAndStatsQueryDtoSchema;
var finishUserWorkoutContract = {
  request: finishWorkoutRequestSchema,
  response: finishUserWorkoutResponseSchema
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  accessTokenPayloadDtoSchema,
  addAerobicInputQueryDtoSchema,
  addAerobicsRequestSchema,
  addUserAerobicsContract,
  addWorkoutContract,
  addWorkoutRequestSchema,
  addWorkoutResponseSchema,
  addWorkoutSplitPayloadQueryDtoSchema,
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
  workoutExerciseMetadataQueryDtoSchema,
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
  workoutSplitsMapItemQueryDtoSchema,
  workoutSplitsMapQueryDtoSchema,
  workoutSplitsRowQueryDtoSchema,
  workoutSummaryDbSchema,
  workoutSummaryIdQueryDtoSchema
});
