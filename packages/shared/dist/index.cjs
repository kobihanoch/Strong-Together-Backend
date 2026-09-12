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
  addCommentContract: () => addCommentContract,
  addCommentRequestSchema: () => addCommentRequestSchema,
  addCommentResponseSchema: () => addCommentResponseSchema,
  aerobicMutationRowQueryDtoSchema: () => aerobicMutationRowQueryDtoSchema,
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
  changeEmailTokenPayloadDtoSchema: () => changeEmailTokenPayloadDtoSchema,
  commentDbSchema: () => commentDbSchema,
  commentQueryDtoSchema: () => commentQueryDtoSchema,
  commentWriteResultQueryDtoSchema: () => commentWriteResultQueryDtoSchema,
  createAerobicEntryContract: () => createAerobicEntryContract,
  createAerobicEntryRequestSchema: () => createAerobicEntryRequestSchema,
  createAerobicEntryResponseSchema: () => createAerobicEntryResponseSchema,
  createCrewContract: () => createCrewContract,
  createCrewRequestSchema: () => createCrewRequestSchema,
  createCrewResponseSchema: () => createCrewResponseSchema,
  createPasswordResetRequestContract: () => createPasswordResetRequestContract,
  createPasswordResetRequestSchema: () => createPasswordResetRequestSchema,
  createPostContract: () => createPostContract,
  createPostRequestSchema: () => createPostRequestSchema,
  createPostResponseSchema: () => createPostResponseSchema,
  createUserContract: () => createUserContract,
  createUserRequestSchema: () => createUserRequestSchema,
  createUserResponseSchema: () => createUserResponseSchema,
  createUserUserSchema: () => createUserUserSchema,
  createVerificationEmailContract: () => createVerificationEmailContract,
  createVerificationEmailRequestSchema: () => createVerificationEmailRequestSchema,
  createVideoUploadUrlContract: () => createVideoUploadUrlContract,
  createVideoUploadUrlRequestSchema: () => createVideoUploadUrlRequestSchema,
  createVideoUploadUrlResponseSchema: () => createVideoUploadUrlResponseSchema,
  createWebSocketTicketContract: () => createWebSocketTicketContract,
  createWebSocketTicketRequestSchema: () => createWebSocketTicketRequestSchema,
  createWebSocketTicketResponseSchema: () => createWebSocketTicketResponseSchema,
  createWorkoutSessionContract: () => createWorkoutSessionContract,
  createWorkoutSessionRequestSchema: () => createWorkoutSessionRequestSchema,
  createWorkoutSessionResponseSchema: () => createWorkoutSessionResponseSchema,
  createdUserQueryDtoSchema: () => createdUserQueryDtoSchema,
  createdUserRawQueryDtoSchema: () => createdUserRawQueryDtoSchema,
  createdUserRowQueryDtoSchema: () => createdUserRowQueryDtoSchema,
  crewDbSchema: () => crewDbSchema,
  crewMembershipDbSchema: () => crewMembershipDbSchema,
  crewParticipantPreviewQueryDtoSchema: () => crewParticipantPreviewQueryDtoSchema,
  crewParticipantQueryDtoSchema: () => crewParticipantQueryDtoSchema,
  crewQueryDtoSchema: () => crewQueryDtoSchema,
  crewSuccessorQueryDtoSchema: () => crewSuccessorQueryDtoSchema,
  deleteAerobicEntryContract: () => deleteAerobicEntryContract,
  deleteAerobicEntryRequestSchema: () => deleteAerobicEntryRequestSchema,
  deleteCommentContract: () => deleteCommentContract,
  deleteCommentRequestSchema: () => deleteCommentRequestSchema,
  deleteCommentResponseSchema: () => deleteCommentResponseSchema,
  deleteCrewContract: () => deleteCrewContract,
  deleteCrewRequestSchema: () => deleteCrewRequestSchema,
  deleteCrewResponseSchema: () => deleteCrewResponseSchema,
  deleteMessageContract: () => deleteMessageContract,
  deleteMessageRequestSchema: () => deleteMessageRequestSchema,
  deleteMessageResponseSchema: () => deleteMessageResponseSchema,
  deletePostContract: () => deletePostContract,
  deletePostRequestSchema: () => deletePostRequestSchema,
  deletePostResponseSchema: () => deletePostResponseSchema,
  deleteProfilePictureContract: () => deleteProfilePictureContract,
  deleteProfilePictureRequestSchema: () => deleteProfilePictureRequestSchema,
  deleteReactionContract: () => deleteReactionContract,
  deleteReactionRequestSchema: () => deleteReactionRequestSchema,
  deleteReactionResponseSchema: () => deleteReactionResponseSchema,
  deletedCrewQueryDtoSchema: () => deletedCrewQueryDtoSchema,
  deletedMessageQueryDtoSchema: () => deletedMessageQueryDtoSchema,
  deletedPostQueryDtoSchema: () => deletedPostQueryDtoSchema,
  discoverableCrewQueryDtoSchema: () => discoverableCrewQueryDtoSchema,
  editCommentContract: () => editCommentContract,
  editCommentRequestSchema: () => editCommentRequestSchema,
  editCommentResponseSchema: () => editCommentResponseSchema,
  emailVerifyPayloadDtoSchema: () => emailVerifyPayloadDtoSchema,
  enqueueAnalyzeVideoParamsDtoSchema: () => enqueueAnalyzeVideoParamsDtoSchema,
  exerciseAssignmentIdQueryDtoSchema: () => exerciseAssignmentIdQueryDtoSchema,
  exerciseDbSchema: () => exerciseDbSchema,
  exerciseHistoryQueryDtoSchema: () => exerciseHistoryQueryDtoSchema,
  exerciseHistoryRowQueryDtoSchema: () => exerciseHistoryRowQueryDtoSchema,
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
  finishedWorkoutEntryQueryDtoSchema: () => finishedWorkoutEntryQueryDtoSchema,
  forgotPasswordPayloadDtoSchema: () => forgotPasswordPayloadDtoSchema,
  getAerobicHistoryContract: () => getAerobicHistoryContract,
  getAerobicHistoryRequestSchema: () => getAerobicHistoryRequestSchema,
  getAerobicHistoryResponseSchema: () => getAerobicHistoryResponseSchema,
  getAllExercisesExerciseQueryDtoSchema: () => getAllExercisesExerciseQueryDtoSchema,
  getCrewContract: () => getCrewContract,
  getCrewRequestSchema: () => getCrewRequestSchema,
  getCrewResponseSchema: () => getCrewResponseSchema,
  getCurrentUserContract: () => getCurrentUserContract,
  getCurrentUserResponseSchema: () => getCurrentUserResponseSchema,
  getExerciseHistoryContract: () => getExerciseHistoryContract,
  getExerciseHistoryRequestSchema: () => getExerciseHistoryRequestSchema,
  getExerciseHistoryResponseSchema: () => getExerciseHistoryResponseSchema,
  getPersonalRecordsContract: () => getPersonalRecordsContract,
  getPersonalRecordsRequestSchema: () => getPersonalRecordsRequestSchema,
  getPersonalRecordsResponseSchema: () => getPersonalRecordsResponseSchema,
  getReminderSettingsContract: () => getReminderSettingsContract,
  getReminderSettingsResponseSchema: () => getReminderSettingsResponseSchema,
  getVerificationStatusContract: () => getVerificationStatusContract,
  getVerificationStatusRequestSchema: () => getVerificationStatusRequestSchema,
  getWorkoutHistoryContract: () => getWorkoutHistoryContract,
  getWorkoutHistoryRequestSchema: () => getWorkoutHistoryRequestSchema,
  getWorkoutHistoryResponseSchema: () => getWorkoutHistoryResponseSchema,
  getWorkoutPlanContract: () => getWorkoutPlanContract,
  getWorkoutPlanRequestSchema: () => getWorkoutPlanRequestSchema,
  getWorkoutPlanResponseSchema: () => getWorkoutPlanResponseSchema,
  getWorkoutSchedulesContract: () => getWorkoutSchedulesContract,
  getWorkoutSchedulesResponseSchema: () => getWorkoutSchedulesResponseSchema,
  getWorkoutStatisticsContract: () => getWorkoutStatisticsContract,
  getWorkoutStatisticsResponseSchema: () => getWorkoutStatisticsResponseSchema,
  googleOAuthContract: () => googleOAuthContract,
  googleOAuthRequestSchema: () => googleOAuthRequestSchema,
  googleTokenVerificationResultDtoSchema: () => googleTokenVerificationResultDtoSchema,
  lastLoginQueryDtoSchema: () => lastLoginQueryDtoSchema,
  leaveCrewContextQueryDtoSchema: () => leaveCrewContextQueryDtoSchema,
  leaveCrewContract: () => leaveCrewContract,
  leaveCrewRequestSchema: () => leaveCrewRequestSchema,
  leaveCrewResponseSchema: () => leaveCrewResponseSchema,
  leaveCrewResultQueryDtoSchema: () => leaveCrewResultQueryDtoSchema,
  listCrewParticipantsContract: () => listCrewParticipantsContract,
  listCrewParticipantsRequestSchema: () => listCrewParticipantsRequestSchema,
  listCrewParticipantsResponseSchema: () => listCrewParticipantsResponseSchema,
  listCrewPostsContract: () => listCrewPostsContract,
  listCrewPostsRequestSchema: () => listCrewPostsRequestSchema,
  listCrewPostsResponseSchema: () => listCrewPostsResponseSchema,
  listCrewsContract: () => listCrewsContract,
  listCrewsRequestSchema: () => listCrewsRequestSchema,
  listCrewsResponseSchema: () => listCrewsResponseSchema,
  listExercisesContract: () => listExercisesContract,
  listExercisesResponseSchema: () => listExercisesResponseSchema,
  listMessagesContract: () => listMessagesContract,
  listMessagesRequestSchema: () => listMessagesRequestSchema,
  listMessagesResponseSchema: () => listMessagesResponseSchema,
  listPostCommentsContract: () => listPostCommentsContract,
  listPostCommentsRequestSchema: () => listPostCommentsRequestSchema,
  listPostCommentsResponseSchema: () => listPostCommentsResponseSchema,
  listPostReactionsContract: () => listPostReactionsContract,
  listPostReactionsRequestSchema: () => listPostReactionsRequestSchema,
  listPostReactionsResponseSchema: () => listPostReactionsResponseSchema,
  listVisiblePostsContract: () => listVisiblePostsContract,
  listVisiblePostsRequestSchema: () => listVisiblePostsRequestSchema,
  listVisiblePostsResponseSchema: () => listVisiblePostsResponseSchema,
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
  personalRecordQueryDtoSchema: () => personalRecordQueryDtoSchema,
  personalRecordsQueryDtoSchema: () => personalRecordsQueryDtoSchema,
  personalRecordsRowQueryDtoSchema: () => personalRecordsRowQueryDtoSchema,
  postDbSchema: () => postDbSchema,
  postQueryDtoSchema: () => postQueryDtoSchema,
  proceedLoginResponseSchema: () => proceedLoginResponseSchema,
  prsViewDbSchema: () => prsViewDbSchema,
  reactToPostContract: () => reactToPostContract,
  reactToPostRequestSchema: () => reactToPostRequestSchema,
  reactToPostResponseSchema: () => reactToPostResponseSchema,
  reactionDbSchema: () => reactionDbSchema,
  reactionQueryDtoSchema: () => reactionQueryDtoSchema,
  reactionWriteResultQueryDtoSchema: () => reactionWriteResultQueryDtoSchema,
  refreshTokenContract: () => refreshTokenContract,
  refreshTokenPayloadDtoSchema: () => refreshTokenPayloadDtoSchema,
  refreshTokenResponseSchema: () => refreshTokenResponseSchema,
  replaceProfilePictureContract: () => replaceProfilePictureContract,
  replaceProfilePictureResponseSchema: () => replaceProfilePictureResponseSchema,
  replacePushTokenContract: () => replacePushTokenContract,
  replacePushTokenRequestSchema: () => replacePushTokenRequestSchema,
  replaceWorkoutPlanContract: () => replaceWorkoutPlanContract,
  replaceWorkoutPlanRequestSchema: () => replaceWorkoutPlanRequestSchema,
  replaceWorkoutPlanResponseSchema: () => replaceWorkoutPlanResponseSchema,
  replaceWorkoutSchedulesContract: () => replaceWorkoutSchedulesContract,
  replaceWorkoutSchedulesRequestSchema: () => replaceWorkoutSchedulesRequestSchema,
  resetPasswordContract: () => resetPasswordContract,
  resetPasswordRequestSchema: () => resetPasswordRequestSchema,
  resetPasswordResponseSchema: () => resetPasswordResponseSchema,
  saveWorkoutSplitInputQueryDtoSchema: () => saveWorkoutSplitInputQueryDtoSchema,
  saveWorkoutSplitPayloadQueryDtoSchema: () => saveWorkoutSplitPayloadQueryDtoSchema,
  serializedDateSchema: () => serializedDateSchema,
  squatRepetitionDtoSchema: () => squatRepetitionDtoSchema,
  timezoneSchema: () => timezoneSchema,
  tokenVersionQueryDtoSchema: () => tokenVersionQueryDtoSchema,
  trackingByDateItemQueryDtoSchema: () => trackingByDateItemQueryDtoSchema,
  trackingBySplitNameItemQueryDtoSchema: () => trackingBySplitNameItemQueryDtoSchema,
  trackingMapItemQueryDtoSchema: () => trackingMapItemQueryDtoSchema,
  trackingSetDbSchema: () => trackingSetDbSchema,
  updateAerobicEntryContract: () => updateAerobicEntryContract,
  updateAerobicEntryRequestSchema: () => updateAerobicEntryRequestSchema,
  updateCrewContract: () => updateCrewContract,
  updateCrewRequestSchema: () => updateCrewRequestSchema,
  updateCrewResponseSchema: () => updateCrewResponseSchema,
  updateCurrentUserContract: () => updateCurrentUserContract,
  updateCurrentUserRequestSchema: () => updateCurrentUserRequestSchema,
  updateCurrentUserResponseSchema: () => updateCurrentUserResponseSchema,
  updatePostContract: () => updatePostContract,
  updatePostRequestSchema: () => updatePostRequestSchema,
  updatePostResponseSchema: () => updatePostResponseSchema,
  updateReminderTimeZoneContract: () => updateReminderTimeZoneContract,
  updateReminderTimeZoneRequestSchema: () => updateReminderTimeZoneRequestSchema,
  updateUnverifiedAccountEmailContract: () => updateUnverifiedAccountEmailContract,
  updateUnverifiedAccountEmailRequestSchema: () => updateUnverifiedAccountEmailRequestSchema,
  upsertReminderSettingsContract: () => upsertReminderSettingsContract,
  upsertReminderSettingsRequestSchema: () => upsertReminderSettingsRequestSchema,
  userAerobicsQueryDtoSchema: () => userAerobicsQueryDtoSchema,
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
  userUpdateDbSchema: () => userUpdateDbSchema,
  userWithNotificationsEnabledQueryDtoSchema: () => userWithNotificationsEnabledQueryDtoSchema,
  verifyEmailContract: () => verifyEmailContract,
  verifyEmailRequestSchema: () => verifyEmailRequestSchema,
  weeklyDataQueryDtoSchema: () => weeklyDataQueryDtoSchema,
  wholeUserWorkoutPlanQueryDtoSchema: () => wholeUserWorkoutPlanQueryDtoSchema,
  workoutExerciseInputQueryDtoSchema: () => workoutExerciseInputQueryDtoSchema,
  workoutPlanDbSchema: () => workoutPlanDbSchema,
  workoutPlanIdQueryDtoSchema: () => workoutPlanIdQueryDtoSchema,
  workoutScheduleDbSchema: () => workoutScheduleDbSchema,
  workoutScheduleInputDtoSchema: () => workoutScheduleInputDtoSchema,
  workoutScheduleQueryDtoSchema: () => workoutScheduleQueryDtoSchema,
  workoutSetDbSchema: () => workoutSetDbSchema,
  workoutSplitDbSchema: () => workoutSplitDbSchema,
  workoutSplitIdQueryDtoSchema: () => workoutSplitIdQueryDtoSchema,
  workoutSplitLookupQueryDtoSchema: () => workoutSplitLookupQueryDtoSchema,
  workoutSplitQueryDtoSchema: () => workoutSplitQueryDtoSchema,
  workoutSummaryDbSchema: () => workoutSummaryDbSchema,
  workoutSummaryIdQueryDtoSchema: () => workoutSummaryIdQueryDtoSchema
});
module.exports = __toCommonJS(index_exports);

// src/common/transport.schemas.ts
var import_v4 = require("zod/v4");
var serializedDateSchema = import_v4.z.string();
var timezoneSchema = import_v4.z.string().refine((timeZone) => {
  try {
    new Intl.DateTimeFormat("en-US", {
      timeZone
    }).format();
    return true;
  } catch {
    return false;
  }
}, {
  message: "Time zone must be a valid IANA time zone"
});

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
var schedulesSchema = (0, import_pg_core2.pgSchema)("schedules");
var messagesSchema = (0, import_pg_core2.pgSchema)("messages");
var socialSchema = (0, import_pg_core2.pgSchema)("social");
var authProviders = identitySchema.enum("Auth Providers", [
  "apple",
  "google",
  "app"
]);

// ../../src/infrastructure/db/schema/drizzle/identity/user/table.ts
var import_drizzle_orm28 = require("drizzle-orm");
var import_pg_core31 = require("drizzle-orm/pg-core");

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
  }).defaultNow().notNull(),
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
  id: (0, import_pg_core6.uuid)("id").defaultRandom().notNull(),
  userId: (0, import_pg_core6.uuid)("user_id").notNull(),
  reminderEnabled: (0, import_pg_core6.boolean)("reminder_enabled").default(false).notNull(),
  createdAt: (0, import_pg_core6.timestamp)("created_at", {
    withTimezone: true
  }).defaultNow().notNull(),
  updatedAt: (0, import_pg_core6.timestamp)("updated_at", {
    withTimezone: true
  }).defaultNow().notNull(),
  timeZone: (0, import_pg_core6.text)("time_zone").notNull()
}, (t) => [
  (0, import_pg_core6.primaryKey)({
    name: "user_reminder_setting_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core6.unique)("user_reminder_setting_user_id_key").on(t.userId),
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

// ../../src/infrastructure/db/schema/drizzle/schedules/workout_schedule/table.ts
var import_drizzle_orm22 = require("drizzle-orm");
var import_pg_core25 = require("drizzle-orm/pg-core");

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
  }).defaultNow().notNull(),
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
  }).defaultNow().notNull(),
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
  orderIndex: (0, import_pg_core23.integer)("order_index").notNull(),
  createdAt: (0, import_pg_core23.timestamp)("created_at", {
    withTimezone: true
  }).defaultNow().notNull(),
  updatedAt: (0, import_pg_core23.timestamp)("updated_at", {
    withTimezone: true
  }).defaultNow().notNull(),
  isActive: (0, import_pg_core23.boolean)("is_active").default(true).notNull()
}, (t) => [
  (0, import_pg_core23.primaryKey)({
    name: "workout_split_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core23.uniqueIndex)("uq_active_workout_split_order_index").on(t.workoutId, t.orderIndex).where(import_drizzle_orm20.sql`${t.isActive} = TRUE`),
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
  schedules: many(workoutSchedule)
}));

// ../../src/infrastructure/db/schema/drizzle/schedules/workout_schedule/policies.ts
var import_drizzle_orm21 = require("drizzle-orm");
var import_pg_core24 = require("drizzle-orm/pg-core");
var uid9 = import_drizzle_orm21.sql`"identity"."current_user_id"()`;
function workoutSchedulePolicies(t) {
  const owns = import_drizzle_orm21.sql`${uid9} = ${t.userId}`;
  return [
    (0, import_pg_core24.pgPolicy)("auth can SELECT own workout schedules", {
      for: "select",
      to: authenticatedRole,
      using: owns
    }),
    (0, import_pg_core24.pgPolicy)("auth can INSERT own workout schedules", {
      for: "insert",
      to: authenticatedRole,
      withCheck: owns
    }),
    (0, import_pg_core24.pgPolicy)("auth can UPDATE own workout schedules", {
      for: "update",
      to: authenticatedRole,
      using: owns,
      withCheck: owns
    }),
    (0, import_pg_core24.pgPolicy)("auth can DELETE own workout schedules", {
      for: "delete",
      to: authenticatedRole,
      using: owns
    })
  ];
}
__name(workoutSchedulePolicies, "workoutSchedulePolicies");

// ../../src/infrastructure/db/schema/drizzle/schedules/workout_schedule/table.ts
var workoutSchedule = schedulesSchema.table("workout_schedule", {
  id: (0, import_pg_core25.uuid)("id").defaultRandom().notNull(),
  userId: (0, import_pg_core25.uuid)("user_id").notNull(),
  workoutSplitId: (0, import_pg_core25.bigint)("workout_split_id", {
    mode: "number"
  }).notNull(),
  dayOfWeek: (0, import_pg_core25.integer)("day_of_week").notNull(),
  startTime: (0, import_pg_core25.time)("start_time", {
    precision: 0
  }).notNull(),
  createdAt: (0, import_pg_core25.timestamp)("created_at", {
    withTimezone: true
  }).defaultNow().notNull(),
  updatedAt: (0, import_pg_core25.timestamp)("updated_at", {
    withTimezone: true
  }).defaultNow().notNull()
}, (t) => [
  (0, import_pg_core25.primaryKey)({
    name: "workout_schedule_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core25.unique)("workout_schedule_user_split_weekday_key").on(t.userId, t.workoutSplitId, t.dayOfWeek),
  (0, import_pg_core25.check)("workout_schedule_day_of_week_check", import_drizzle_orm22.sql`${t.dayOfWeek} BETWEEN 0 AND 6`),
  (0, import_pg_core25.foreignKey)({
    name: "workout_schedule_user_id_fkey",
    columns: [
      t.userId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core25.foreignKey)({
    name: "workout_schedule_workout_split_id_fkey",
    columns: [
      t.workoutSplitId
    ],
    foreignColumns: [
      workoutSplit.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  ...workoutSchedulePolicies(t)
]).enableRLS();
var workoutScheduleRelations = (0, import_drizzle_orm22.relations)(workoutSchedule, ({ one }) => ({
  user: one(user, {
    fields: [
      workoutSchedule.userId
    ],
    references: [
      user.id
    ]
  }),
  workoutSplit: one(workoutSplit, {
    fields: [
      workoutSchedule.workoutSplitId
    ],
    references: [
      workoutSplit.id
    ]
  })
}));

// ../../src/infrastructure/db/schema/drizzle/tracking/aerobic_tracking/table.ts
var import_drizzle_orm24 = require("drizzle-orm");
var import_pg_core27 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/tracking/aerobic_tracking/policies.ts
var import_drizzle_orm23 = require("drizzle-orm");
var import_pg_core26 = require("drizzle-orm/pg-core");
var uid10 = import_drizzle_orm23.sql`"identity"."current_user_id"()`;
function aerobicTrackingPolicies(t) {
  return [
    // Lets authenticated users read only their own aerobic tracking rows.
    (0, import_pg_core26.pgPolicy)("Enable read access for auth users on aerobic_tracking", {
      for: "select",
      to: authenticatedRole,
      using: import_drizzle_orm23.sql`${uid10} = ${t.userId}`
    }),
    // Lets authenticated users insert aerobic tracking rows only for themselves.
    (0, import_pg_core26.pgPolicy)("Enable insert for auth users on aerobic_tracking", {
      for: "insert",
      to: authenticatedRole,
      withCheck: import_drizzle_orm23.sql`${uid10} = ${t.userId}`
    }),
    // Lets authenticated users update only their own aerobic tracking rows.
    (0, import_pg_core26.pgPolicy)("Enable update for auth users on aerobic_tracking", {
      for: "update",
      to: authenticatedRole,
      using: import_drizzle_orm23.sql`${uid10} = ${t.userId}`,
      withCheck: import_drizzle_orm23.sql`${uid10} = ${t.userId}`
    }),
    // Lets authenticated users delete only their own aerobic tracking rows.
    (0, import_pg_core26.pgPolicy)("Enable delete for auth users on aerobic_tracking", {
      for: "delete",
      to: authenticatedRole,
      using: import_drizzle_orm23.sql`${uid10} = ${t.userId}`
    })
  ];
}
__name(aerobicTrackingPolicies, "aerobicTrackingPolicies");

// ../../src/infrastructure/db/schema/drizzle/tracking/aerobic_tracking/table.ts
var aerobicTracking = trackingSchema.table("aerobic_tracking", {
  id: (0, import_pg_core27.bigint)("id", {
    mode: "number"
  }).generatedByDefaultAsIdentity({
    name: "aerobic_tracking_id_seq"
  }).notNull(),
  userId: (0, import_pg_core27.uuid)("user_id").notNull(),
  type: (0, import_pg_core27.text)("type").notNull(),
  durationSec: (0, import_pg_core27.bigint)("duration_sec", {
    mode: "number"
  }).default(0).notNull(),
  workoutTimeUtc: (0, import_pg_core27.timestamp)("workout_time_utc", {
    withTimezone: true
  }).defaultNow().notNull()
}, (t) => [
  (0, import_pg_core27.primaryKey)({
    name: "aerobic_tracking_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core27.foreignKey)({
    name: "aerobic_tracking_user_id_fkey",
    columns: [
      t.userId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core27.index)("aerobic_tracking_user_id_workout_time_utc_idx").on(t.userId, t.workoutTimeUtc.desc().nullsFirst()),
  ...aerobicTrackingPolicies(t)
]);
var aerobicTrackingRelations = (0, import_drizzle_orm24.relations)(aerobicTracking, ({ one }) => ({
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
var import_drizzle_orm26 = require("drizzle-orm");
var import_pg_core29 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/identity/oauth_account/policies.ts
var import_drizzle_orm25 = require("drizzle-orm");
var import_pg_core28 = require("drizzle-orm/pg-core");
var currentUserId3 = import_drizzle_orm25.sql`"identity"."current_user_id"()`;
function oauthAccountPolicies(table) {
  return [
    // Lets authenticated users read only OAuth accounts linked to themselves.
    (0, import_pg_core28.pgPolicy)("Enable read access for auth users on oauth_account", {
      for: "select",
      to: authenticatedRole,
      using: import_drizzle_orm25.sql`${currentUserId3} = ${table.userId}`
    }),
    // Lets authenticated users link OAuth accounts only to themselves.
    (0, import_pg_core28.pgPolicy)("Enable insert for auth users on oauth_account", {
      for: "insert",
      to: authenticatedRole,
      withCheck: import_drizzle_orm25.sql`${currentUserId3} = ${table.userId}`
    }),
    // Lets authenticated users update only OAuth accounts linked to themselves.
    (0, import_pg_core28.pgPolicy)("Enable update for auth users on oauth_account", {
      for: "update",
      to: authenticatedRole,
      using: import_drizzle_orm25.sql`${currentUserId3} = ${table.userId}`,
      withCheck: import_drizzle_orm25.sql`${currentUserId3} = ${table.userId}`
    }),
    // Lets authenticated users delete only OAuth accounts linked to themselves.
    (0, import_pg_core28.pgPolicy)("Enable delete for auth users on oauth_account", {
      for: "delete",
      to: authenticatedRole,
      using: import_drizzle_orm25.sql`${currentUserId3} = ${table.userId}`
    })
  ];
}
__name(oauthAccountPolicies, "oauthAccountPolicies");

// ../../src/infrastructure/db/schema/drizzle/identity/oauth_account/table.ts
var oauthAccount = identitySchema.table("oauth_account", {
  id: (0, import_pg_core29.uuid)("id").defaultRandom().notNull(),
  userId: (0, import_pg_core29.uuid)("user_id").notNull(),
  provider: (0, import_pg_core29.text)("provider").notNull(),
  providerUserId: (0, import_pg_core29.text)("provider_user_id").notNull(),
  providerEmail: (0, import_pg_core29.text)("provider_email").notNull(),
  linkedAt: (0, import_pg_core29.timestamp)("linked_at", {
    withTimezone: true
  }).defaultNow().notNull()
}, (t) => [
  (0, import_pg_core29.primaryKey)({
    name: "oauth_account_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core29.unique)("oauth_account_provider_user_unique").on(t.provider, t.providerUserId),
  (0, import_pg_core29.foreignKey)({
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
var oauthAccountRelations = (0, import_drizzle_orm26.relations)(oauthAccount, ({ one }) => ({
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
var import_drizzle_orm27 = require("drizzle-orm");
var import_pg_core30 = require("drizzle-orm/pg-core");
var currentUserId4 = import_drizzle_orm27.sql`"identity"."current_user_id"()`;
function userPolicies(table) {
  return [
    // Lets an authenticated user read their own profile.
    (0, import_pg_core30.pgPolicy)("Enable read access for auth users on own profile", {
      for: "select",
      to: authenticatedRole,
      using: import_drizzle_orm27.sql`${currentUserId4} = ${table.id}`
    }),
    // Lets a message receiver read the profile of a sender in their inbox.
    (0, import_pg_core30.pgPolicy)("Allow user to view senders in their messages", {
      for: "select",
      to: authenticatedRole,
      using: import_drizzle_orm27.sql`exists (select 1 from "messages"."message" m where m."sender_id" = ${table.id} and m."receiver_id" = ${currentUserId4})`
    }),
    // Lets an authenticated user create only their own profile row.
    (0, import_pg_core30.pgPolicy)("Enable insert for auth users on own profile", {
      for: "insert",
      to: authenticatedRole,
      withCheck: import_drizzle_orm27.sql`${currentUserId4} = ${table.id}`
    }),
    // Preserves the legacy public self-registration policy for compatibility.
    (0, import_pg_core30.pgPolicy)("Enable insert for public users on own profile", {
      for: "insert",
      to: "public",
      withCheck: import_drizzle_orm27.sql`${currentUserId4} = ${table.id}`
    }),
    // Lets an authenticated user update only their own profile.
    (0, import_pg_core30.pgPolicy)("Enable update for auth users on own profile", {
      for: "update",
      to: authenticatedRole,
      using: import_drizzle_orm27.sql`${currentUserId4} = ${table.id}`,
      withCheck: import_drizzle_orm27.sql`${currentUserId4} = ${table.id}`
    }),
    // Lets an authenticated user delete only their own profile.
    (0, import_pg_core30.pgPolicy)("Enable delete for auth users on own profile", {
      for: "delete",
      to: authenticatedRole,
      using: import_drizzle_orm27.sql`${currentUserId4} = ${table.id}`
    })
  ];
}
__name(userPolicies, "userPolicies");

// ../../src/infrastructure/db/schema/drizzle/identity/user/table.ts
var user = identitySchema.table("user", {
  username: (0, import_pg_core31.text)("username").notNull(),
  email: (0, import_pg_core31.text)("email").notNull(),
  name: (0, import_pg_core31.text)("name").notNull(),
  gender: (0, import_pg_core31.text)("gender").default("Unknown").notNull(),
  createdAt: (0, import_pg_core31.timestamp)("created_at", {
    withTimezone: true
  }).defaultNow().notNull(),
  updatedAt: (0, import_pg_core31.timestamp)("updated_at", {
    withTimezone: true
  }).defaultNow().notNull(),
  profilePicPath: (0, import_pg_core31.text)("profile_pic_path"),
  id: (0, import_pg_core31.uuid)("id").defaultRandom().notNull(),
  pushToken: (0, import_pg_core31.text)("push_token"),
  passwordHash: (0, import_pg_core31.text)("password_hash"),
  role: (0, import_pg_core31.text)("role").default("User").notNull(),
  tokenVersion: (0, import_pg_core31.bigint)("token_version", {
    mode: "number"
  }).default(0).notNull(),
  isVerified: (0, import_pg_core31.boolean)("is_verified").default(false).notNull(),
  authProvider: (0, import_pg_core31.text)("auth_provider").default("app").notNull(),
  lastLogin: (0, import_pg_core31.timestamp)("last_login", {
    withTimezone: true
  })
}, (t) => [
  (0, import_pg_core31.primaryKey)({
    name: "user_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core31.uniqueIndex)("user_email_ci_unique").on(import_drizzle_orm28.sql`
      LOWER(
        TRIM(
          BOTH
          FROM
            ${t.email}
        )
      )
    `),
  (0, import_pg_core31.uniqueIndex)("user_username_ci_unique").on(import_drizzle_orm28.sql`
      LOWER(
        TRIM(
          BOTH
          FROM
            ${t.username}
        )
      )
    `),
  ...userPolicies(t)
]);
var userRelations = (0, import_drizzle_orm28.relations)(user, ({ many, one }) => ({
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
  workoutSchedules: many(workoutSchedule),
  sentMessages: many(message, {
    relationName: "messageSender"
  }),
  receivedMessages: many(message, {
    relationName: "messageReceiver"
  })
}));

// ../../src/infrastructure/db/schema/drizzle/tracking/views/prs.view.ts
var import_drizzle_orm29 = require("drizzle-orm");
var import_pg_core32 = require("drizzle-orm/pg-core");
var prsView = trackingSchema.view("v_prs", {
  id: (0, import_pg_core32.bigint)("id", {
    mode: "number"
  }),
  exerciseToSplitId: (0, import_pg_core32.bigint)("exercise_to_split_id", {
    mode: "number"
  }),
  exerciseId: (0, import_pg_core32.bigint)("exercise_id", {
    mode: "number"
  }),
  exercise: (0, import_pg_core32.text)("exercise"),
  setIndex: (0, import_pg_core32.integer)("set_index"),
  weight: (0, import_pg_core32.real)("weight"),
  reps: (0, import_pg_core32.bigint)("reps", {
    mode: "number"
  }),
  workoutSummaryId: (0, import_pg_core32.uuid)("workout_summary_id"),
  workoutStartUtc: (0, import_pg_core32.timestamp)("workout_start_utc", {
    withTimezone: true
  }),
  workoutEndUtc: (0, import_pg_core32.timestamp)("workout_end_utc", {
    withTimezone: true
  })
}).with({
  securityInvoker: true
}).as(import_drizzle_orm29.sql`
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
      tracking.v_exercise_tracking_set_expanded et
    ORDER BY
      et.exercise_id,
      et.weight DESC,
      et.reps DESC,
      et.workout_start_utc DESC,
      et.id DESC
  `);

// ../../src/infrastructure/db/schema/drizzle/tracking/views/exercise-tracking-expanded.view.ts
var import_drizzle_orm30 = require("drizzle-orm");
var import_pg_core33 = require("drizzle-orm/pg-core");
var exerciseTrackingSetExpandedView = trackingSchema.view("v_exercise_tracking_set_expanded", {
  id: (0, import_pg_core33.bigint)("id", {
    mode: "number"
  }),
  exerciseToSplitId: (0, import_pg_core33.bigint)("exercise_to_split_id", {
    mode: "number"
  }),
  weight: (0, import_pg_core33.real)("weight"),
  reps: (0, import_pg_core33.integer)("reps"),
  orderIndex: (0, import_pg_core33.bigint)("order_index", {
    mode: "number"
  }),
  setIndex: (0, import_pg_core33.integer)("set_index"),
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
}).as(import_drizzle_orm30.sql`
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

// ../../src/infrastructure/db/schema/drizzle/workout/views/exercise-to-workoutsplit-expanded.view.ts
var import_pg_core34 = require("drizzle-orm/pg-core");
var import_drizzle_orm31 = require("drizzle-orm");
var import_pg_core35 = require("drizzle-orm/pg-core");
var exerciseToWorkoutSplitSetExpandedView = workoutSchema.view("v_exercise_to_workout_split_set_expanded", {
  id: (0, import_pg_core34.bigint)("id", {
    mode: "number"
  }),
  workoutSplitId: (0, import_pg_core34.bigint)("workout_split_id", {
    mode: "number"
  }),
  workoutId: (0, import_pg_core34.bigint)("workout_id", {
    mode: "number"
  }),
  exerciseId: (0, import_pg_core34.bigint)("exercise_id", {
    mode: "number"
  }),
  exercise: (0, import_pg_core34.text)("exercise"),
  workoutSplit: (0, import_pg_core34.text)("workout_split"),
  reps: (0, import_pg_core35.integer)("reps"),
  orderIndex: (0, import_pg_core34.bigint)("order_index", {
    mode: "number"
  }),
  setIndex: (0, import_pg_core35.integer)("set_index"),
  createdAt: (0, import_pg_core34.timestamp)("created_at", {
    withTimezone: true
  }),
  isActive: (0, import_pg_core34.boolean)("is_active")
}).with({
  securityInvoker: true
}).as(import_drizzle_orm31.sql`
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

// ../../src/infrastructure/db/schema/drizzle/social/crew/table.ts
var import_drizzle_orm34 = require("drizzle-orm");
var import_pg_core37 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/social/crew/policies.ts
var import_drizzle_orm33 = require("drizzle-orm");
var import_pg_core36 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/social/policy-helpers.ts
var import_drizzle_orm32 = require("drizzle-orm");
var isCrewPublic = /* @__PURE__ */ __name((crewId) => import_drizzle_orm32.sql`"social"."is_crew_public" (${crewId})`, "isCrewPublic");
var isCrewLeader = /* @__PURE__ */ __name((crewId) => import_drizzle_orm32.sql`"social"."is_crew_leader" (${crewId})`, "isCrewLeader");
var isPostAuthor = /* @__PURE__ */ __name((postId) => import_drizzle_orm32.sql`"social"."is_post_author" (${postId})`, "isPostAuthor");
var canAccessCrew = /* @__PURE__ */ __name((crewId) => import_drizzle_orm32.sql`"social"."can_access_crew" (${crewId})`, "canAccessCrew");
var canManageCrew = /* @__PURE__ */ __name((crewId) => import_drizzle_orm32.sql`"social"."can_manage_crew" (${crewId})`, "canManageCrew");
var canViewCrewParticipants = /* @__PURE__ */ __name((crewId) => import_drizzle_orm32.sql`"social"."can_view_crew_participants" (${crewId})`, "canViewCrewParticipants");
var canPublishToCrew = /* @__PURE__ */ __name((crewId) => import_drizzle_orm32.sql`"social"."can_publish_to_crew" (${crewId})`, "canPublishToCrew");
var canViewPost = /* @__PURE__ */ __name((postId) => import_drizzle_orm32.sql`"social"."can_view_post" (${postId})`, "canViewPost");

// ../../src/infrastructure/db/schema/drizzle/social/crew/policies.ts
var uid11 = import_drizzle_orm33.sql`"identity"."current_user_id" ()`;
function crewPolicies(t) {
  const leads = import_drizzle_orm33.sql`${t.leaderId} = ${uid11}`;
  const canManage = canManageCrew(t.id);
  return [
    // Authenticated users may discover crews; privacy controls participation rather than visibility of the crew record.
    (0, import_pg_core36.pgPolicy)("Allow authenticated users to read crews", {
      for: "select",
      to: authenticatedRole,
      using: import_drizzle_orm33.sql`TRUE`
    }),
    // A user may create a crew only when they assign themselves as its leader.
    (0, import_pg_core36.pgPolicy)("Allow users to create crews they lead", {
      for: "insert",
      to: authenticatedRole,
      withCheck: leads
    }),
    // Only the active leader may start an update; remaining an active member permits an atomic leadership transfer.
    (0, import_pg_core36.pgPolicy)("Allow active crew leaders to update their crews", {
      for: "update",
      to: authenticatedRole,
      using: canManage,
      withCheck: canAccessCrew(t.id)
    }),
    // Only the current leader may delete the crew.
    (0, import_pg_core36.pgPolicy)("Allow active crew leaders to delete their crews", {
      for: "delete",
      to: authenticatedRole,
      using: canManage
    })
  ];
}
__name(crewPolicies, "crewPolicies");

// ../../src/infrastructure/db/schema/drizzle/social/crew/table.ts
var crewPrivacy = socialSchema.enum("Crew Privacy", [
  "public",
  "private"
]);
var crew = socialSchema.table("crew", {
  id: (0, import_pg_core37.uuid)("id").defaultRandom().notNull(),
  leaderId: (0, import_pg_core37.uuid)("leader_id").notNull(),
  privacy: crewPrivacy("privacy").notNull(),
  createdAt: (0, import_pg_core37.timestamp)("created_at", {
    withTimezone: true
  }).defaultNow().notNull(),
  updatedAt: (0, import_pg_core37.timestamp)("updated_at", {
    withTimezone: true
  }).defaultNow().notNull()
}, (t) => [
  (0, import_pg_core37.primaryKey)({
    name: "crew_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core37.foreignKey)({
    name: "crew_leader_id_fkey",
    columns: [
      t.leaderId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  ...crewPolicies(t)
]).enableRLS();
var crewRelations = (0, import_drizzle_orm34.relations)(crew, ({ one }) => ({
  leader: one(user, {
    fields: [
      crew.leaderId
    ],
    references: [
      user.id
    ]
  })
}));

// ../../src/infrastructure/db/schema/drizzle/social/crew_membership/table.ts
var import_drizzle_orm36 = require("drizzle-orm");
var import_pg_core39 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/social/crew_membership/policies.ts
var import_drizzle_orm35 = require("drizzle-orm");
var import_pg_core38 = require("drizzle-orm/pg-core");
var uid12 = import_drizzle_orm35.sql`"identity"."current_user_id" ()`;
function crewMembershipPolicies(t) {
  const self = import_drizzle_orm35.sql`${t.userId} = ${uid12}`;
  const canManage = canManageCrew(t.crewId);
  const allowed = import_drizzle_orm35.sql`
    ${self}
    OR ${canManage}
  `;
  const createsOwnLeaderMembership = import_drizzle_orm35.sql`
    ${self}
    AND ${isCrewLeader(t.crewId)}
    AND ${t.role} = 'leader'
    AND ${t.status} = 'active'
  `;
  const canCreate = import_drizzle_orm35.sql`
    ${canManage}
    OR (${createsOwnLeaderMembership})
  `;
  const activeSelf = import_drizzle_orm35.sql`
    ${self}
    AND ${t.status} = 'active'
  `;
  const leftSelf = import_drizzle_orm35.sql`
    ${self}
    AND ${t.status} = 'left'
  `;
  return [
    // Participants are visible for public crews and to active members or leaders of private crews.
    (0, import_pg_core38.pgPolicy)("Allow authorized users to read crew participants", {
      for: "select",
      to: authenticatedRole,
      using: canViewCrewParticipants(t.crewId)
    }),
    // Only the crew leader may create a membership record.
    (0, import_pg_core38.pgPolicy)("Allow managers and new crew leaders to create memberships", {
      for: "insert",
      to: authenticatedRole,
      withCheck: canCreate
    }),
    // Only the crew leader may change membership state or role.
    (0, import_pg_core38.pgPolicy)("Allow active crew leaders to update memberships", {
      for: "update",
      to: authenticatedRole,
      using: canManage,
      withCheck: canManage
    }),
    // An active member may transition only their own membership to the left state.
    (0, import_pg_core38.pgPolicy)("Allow active members to leave crews", {
      for: "update",
      to: authenticatedRole,
      using: activeSelf,
      withCheck: leftSelf
    }),
    // A membership may be deleted by its user or the crew leader.
    (0, import_pg_core38.pgPolicy)("Allow members and active crew leaders to delete memberships", {
      for: "delete",
      to: authenticatedRole,
      using: allowed
    })
  ];
}
__name(crewMembershipPolicies, "crewMembershipPolicies");

// ../../src/infrastructure/db/schema/drizzle/social/crew_membership/table.ts
var crewMembershipStatus = socialSchema.enum("Crew Membership Status", [
  "active",
  "left",
  "removed",
  "banned"
]);
var crewMembershipRole = socialSchema.enum("Crew Membership Role", [
  "leader",
  "admin",
  "member"
]);
var crewMembership = socialSchema.table("crew_membership", {
  id: (0, import_pg_core39.uuid)("id").defaultRandom().notNull(),
  crewId: (0, import_pg_core39.uuid)("crew_id").notNull(),
  userId: (0, import_pg_core39.uuid)("user_id").notNull(),
  status: crewMembershipStatus("status").notNull().default("active"),
  role: crewMembershipRole("role").notNull().default("member"),
  joinedAt: (0, import_pg_core39.timestamp)("joined_at", {
    withTimezone: true
  }).notNull(),
  createdAt: (0, import_pg_core39.timestamp)("created_at", {
    withTimezone: true
  }).defaultNow().notNull(),
  updatedAt: (0, import_pg_core39.timestamp)("updated_at", {
    withTimezone: true
  }).defaultNow().notNull()
}, (t) => [
  (0, import_pg_core39.primaryKey)({
    name: "crew_membership_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core39.foreignKey)({
    name: "crew_membership_crew_id_fkey",
    columns: [
      t.crewId
    ],
    foreignColumns: [
      crew.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core39.foreignKey)({
    name: "crew_membership_user_id_fkey",
    columns: [
      t.userId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core39.unique)("crew_membership_crew_user_unique").on(t.crewId, t.userId),
  (0, import_pg_core39.index)("crew_membership_user_id_idx").on(t.userId),
  (0, import_pg_core39.index)("crew_membership_crew_status_idx").on(t.crewId, t.status),
  ...crewMembershipPolicies(t)
]).enableRLS();
var crewMembershipRelations = (0, import_drizzle_orm36.relations)(crewMembership, ({ one }) => ({
  crew: one(crew, {
    fields: [
      crewMembership.crewId
    ],
    references: [
      crew.id
    ]
  }),
  user: one(user, {
    fields: [
      crewMembership.userId
    ],
    references: [
      user.id
    ]
  })
}));

// ../../src/infrastructure/db/schema/drizzle/social/crew_participation_request/table.ts
var import_drizzle_orm38 = require("drizzle-orm");
var import_pg_core41 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/social/crew_participation_request/policies.ts
var import_drizzle_orm37 = require("drizzle-orm");
var import_pg_core40 = require("drizzle-orm/pg-core");
var uid13 = import_drizzle_orm37.sql`"identity"."current_user_id" ()`;
function crewParticipationRequestPolicies(t) {
  const involved = import_drizzle_orm37.sql`
    ${t.initiatorUserId} = ${uid13}
    OR ${t.participantUserId} = ${uid13}
  `;
  const canManage = canManageCrew(t.crewId);
  const validParticipants = import_drizzle_orm37.sql`
    ${t.initiatorUserId} = ${t.participantUserId}
    OR EXISTS (
      SELECT
        1
      FROM
        "social"."crew" c
      WHERE
        c."id" = ${t.crewId}
        AND c."leader_id" = ${t.initiatorUserId}
    )
  `;
  const canAccess = import_drizzle_orm37.sql`
    ${involved}
    OR ${canManage}
  `;
  const publicCrew = isCrewPublic(t.crewId);
  const insertable = import_drizzle_orm37.sql`
    ${t.initiatorUserId} = ${uid13}
    AND (
      (
        ${t.initiatorUserId} = ${t.participantUserId}
        AND (
          ((${publicCrew}) AND ${t.status} = 'accepted')
          OR ((NOT (${publicCrew})) AND ${t.status} = 'pending')
        )
      )
      OR (
        ${t.initiatorUserId} <> ${t.participantUserId}
        AND ${canManage}
        AND ${t.status} = 'pending'
      )
    )
  `;
  const isJoinRequest = import_drizzle_orm37.sql`(${t.initiatorUserId} = ${t.participantUserId})`;
  const isInvitation = import_drizzle_orm37.sql`(${t.initiatorUserId} <> ${t.participantUserId})`;
  const canRespond = import_drizzle_orm37.sql`(
    ((${isJoinRequest}) AND (${canManage}))
    OR ((${isInvitation}) AND (${t.participantUserId} = ${uid13}))
  )`;
  const canCancel = import_drizzle_orm37.sql`(${t.initiatorUserId} = ${uid13})`;
  const canUpdatePendingRequest = import_drizzle_orm37.sql`(
    (${t.status} = 'pending')
    AND ((${canRespond}) OR (${canCancel}))
  )`;
  const validUpdatedState = import_drizzle_orm37.sql`(
    ((${t.status} = 'cancelled') AND (${canCancel}))
    OR ((${t.status} IN ('accepted', 'declined')) AND (${canRespond}))
  )`;
  return [
    // A request is visible to its initiator, participant, and the relevant crew leader.
    (0, import_pg_core40.pgPolicy)("Allow involved users and leaders to read crew requests", {
      for: "select",
      to: authenticatedRole,
      using: canAccess
    }),
    // Public self-joins start accepted, private self-requests start pending, and leader invitations start pending.
    (0, import_pg_core40.pgPolicy)("Allow users to request crews and leaders to invite users", {
      for: "insert",
      to: authenticatedRole,
      withCheck: insertable
    }),
    // Leaders answer join requests, invitees answer invitations, and initiators may cancel pending requests.
    (0, import_pg_core40.pgPolicy)("Allow authorized users to resolve pending crew requests", {
      for: "update",
      to: authenticatedRole,
      using: canUpdatePendingRequest,
      withCheck: import_drizzle_orm37.sql`
        (
          (${validUpdatedState})
          AND (${validParticipants})
        )
      `
    }),
    // Only the request initiator may delete the request.
    (0, import_pg_core40.pgPolicy)("Allow initiators to delete participation requests", {
      for: "delete",
      to: authenticatedRole,
      using: import_drizzle_orm37.sql`${t.initiatorUserId} = ${uid13}`
    })
  ];
}
__name(crewParticipationRequestPolicies, "crewParticipationRequestPolicies");

// ../../src/infrastructure/db/schema/drizzle/social/crew_participation_request/table.ts
var crewParticipationRequestStatus = socialSchema.enum("Crew Participation Request Status", [
  "pending",
  "accepted",
  "declined",
  "cancelled",
  "expired"
]);
var crewParticipationRequest = socialSchema.table("crew_participation_request", {
  id: (0, import_pg_core41.uuid)("id").defaultRandom().notNull(),
  crewId: (0, import_pg_core41.uuid)("crew_id").notNull(),
  initiatorUserId: (0, import_pg_core41.uuid)("initiator_user_id").notNull(),
  participantUserId: (0, import_pg_core41.uuid)("participant_user_id").notNull(),
  status: crewParticipationRequestStatus("status").notNull().default("pending"),
  createdAt: (0, import_pg_core41.timestamp)("created_at", {
    withTimezone: true
  }).defaultNow().notNull(),
  updatedAt: (0, import_pg_core41.timestamp)("updated_at", {
    withTimezone: true
  }).defaultNow().notNull(),
  respondedAt: (0, import_pg_core41.timestamp)("responded_at", {
    withTimezone: true
  })
}, (t) => [
  (0, import_pg_core41.primaryKey)({
    name: "crew_participation_request_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core41.foreignKey)({
    name: "crew_participation_request_crew_id_fkey",
    columns: [
      t.crewId
    ],
    foreignColumns: [
      crew.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core41.foreignKey)({
    name: "crew_participation_request_initiator_fkey",
    columns: [
      t.initiatorUserId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core41.foreignKey)({
    name: "crew_participation_request_participant_fkey",
    columns: [
      t.participantUserId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core41.uniqueIndex)("crew_participation_request_pending_participant_unique").on(t.crewId, t.participantUserId).where(import_drizzle_orm38.sql`${t.status} = 'pending'`),
  (0, import_pg_core41.index)("crew_participation_request_crew_id_idx").on(t.crewId),
  (0, import_pg_core41.index)("crew_participation_request_participant_idx").on(t.participantUserId),
  ...crewParticipationRequestPolicies(t)
]).enableRLS();
var crewParticipationRequestRelations = (0, import_drizzle_orm38.relations)(crewParticipationRequest, ({ one }) => ({
  crew: one(crew, {
    fields: [
      crewParticipationRequest.crewId
    ],
    references: [
      crew.id
    ]
  }),
  initiator: one(user, {
    fields: [
      crewParticipationRequest.initiatorUserId
    ],
    references: [
      user.id
    ],
    relationName: "crewRequestInitiator"
  }),
  participant: one(user, {
    fields: [
      crewParticipationRequest.participantUserId
    ],
    references: [
      user.id
    ],
    relationName: "crewRequestParticipant"
  })
}));

// ../../src/infrastructure/db/schema/drizzle/social/post/table.ts
var import_drizzle_orm40 = require("drizzle-orm");
var import_pg_core43 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/social/post/policies.ts
var import_drizzle_orm39 = require("drizzle-orm");
var import_pg_core42 = require("drizzle-orm/pg-core");
var uid14 = import_drizzle_orm39.sql`"identity"."current_user_id" ()`;
function postPolicies(t) {
  const owns = import_drizzle_orm39.sql`${t.authorUserId} = ${uid14}`;
  const visible = import_drizzle_orm39.sql`
    ${owns}
    OR ${canViewPost(t.id)}
  `;
  return [
    // Public posts are visible to everyone, while crew-only posts require authorship or access to a crew where the post is shared.
    (0, import_pg_core42.pgPolicy)("Allow users to read public or accessible crew posts", {
      for: "select",
      to: authenticatedRole,
      using: visible
    }),
    // A user may create only posts authored by themselves.
    (0, import_pg_core42.pgPolicy)("Allow users to create their own posts", {
      for: "insert",
      to: authenticatedRole,
      withCheck: owns
    }),
    // Only the author may update a post, and authorship must remain unchanged.
    (0, import_pg_core42.pgPolicy)("Allow authors to update their posts", {
      for: "update",
      to: authenticatedRole,
      using: owns,
      withCheck: owns
    }),
    // Only the author may delete a post.
    (0, import_pg_core42.pgPolicy)("Allow authors to delete their posts", {
      for: "delete",
      to: authenticatedRole,
      using: owns
    })
  ];
}
__name(postPolicies, "postPolicies");

// ../../src/infrastructure/db/schema/drizzle/social/post/table.ts
var postVisibility = socialSchema.enum("Post Visibility", [
  "crews_only",
  "public"
]);
var post = socialSchema.table("post", {
  id: (0, import_pg_core43.uuid)("id").defaultRandom().notNull(),
  authorUserId: (0, import_pg_core43.uuid)("author_user_id").notNull(),
  content: (0, import_pg_core43.text)("content").notNull(),
  visibility: postVisibility("visibility").notNull(),
  publishedAt: (0, import_pg_core43.timestamp)("published_at", {
    withTimezone: true
  }).defaultNow().notNull(),
  updateddAt: (0, import_pg_core43.timestamp)("updated_at", {
    withTimezone: true
  }).defaultNow().notNull()
}, (t) => [
  (0, import_pg_core43.primaryKey)({
    name: "post_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core43.foreignKey)({
    name: "post_author_user_id_fkey",
    columns: [
      t.authorUserId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core43.index)("post_author_user_id_idx").on(t.authorUserId),
  (0, import_pg_core43.index)("post_published_at_idx").on(t.publishedAt),
  ...postPolicies(t)
]).enableRLS();
var postRelations = (0, import_drizzle_orm40.relations)(post, ({ one }) => ({
  author: one(user, {
    fields: [
      post.authorUserId
    ],
    references: [
      user.id
    ]
  })
}));

// ../../src/infrastructure/db/schema/drizzle/social/crew_shared_post/table.ts
var import_drizzle_orm42 = require("drizzle-orm");
var import_pg_core45 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/social/crew_shared_post/policies.ts
var import_drizzle_orm41 = require("drizzle-orm");
var import_pg_core44 = require("drizzle-orm/pg-core");
function crewSharedPostPolicies(t) {
  const canPublish = canPublishToCrew(t.crewId);
  const author = isPostAuthor(t.postId);
  const allowed = import_drizzle_orm41.sql`
    (${canPublish})
    AND (${author})
  `;
  return [
    // A placement is visible through post authorship, crew participation, or the post's public visibility.
    (0, import_pg_core44.pgPolicy)("Allow users to read visible crew post placements", {
      for: "select",
      to: authenticatedRole,
      using: canAccessCrew(t.crewId)
    }),
    // The post author may share their post only into a crew in which they actively participate or lead.
    (0, import_pg_core44.pgPolicy)("Allow member authors to share posts with crews", {
      for: "insert",
      to: authenticatedRole,
      withCheck: allowed
    }),
    // The author may remove their post placement while they still have access to the crew.
    (0, import_pg_core44.pgPolicy)("Allow member authors to remove posts from crews", {
      for: "delete",
      to: authenticatedRole,
      using: allowed
    })
  ];
}
__name(crewSharedPostPolicies, "crewSharedPostPolicies");

// ../../src/infrastructure/db/schema/drizzle/social/crew_shared_post/table.ts
var crewSharedPost = socialSchema.table("crew_shared_post", {
  id: (0, import_pg_core45.uuid)("id").defaultRandom().notNull(),
  crewId: (0, import_pg_core45.uuid)("crew_id").notNull(),
  postId: (0, import_pg_core45.uuid)("post_id").notNull()
}, (t) => [
  (0, import_pg_core45.primaryKey)({
    name: "crew_shared_post_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core45.foreignKey)({
    name: "crew_shared_post_crew_id_fkey",
    columns: [
      t.crewId
    ],
    foreignColumns: [
      crew.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core45.foreignKey)({
    name: "crew_shared_post_post_id_fkey",
    columns: [
      t.postId
    ],
    foreignColumns: [
      post.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core45.unique)("crew_shared_post_post_id_crew_id_unique").on(t.postId, t.crewId),
  (0, import_pg_core45.index)("crew_shared_post_crew_id_idx").on(t.crewId),
  ...crewSharedPostPolicies(t)
]).enableRLS();
var crewSharedPostRelations = (0, import_drizzle_orm42.relations)(crewSharedPost, ({ one }) => ({
  crew: one(crew, {
    fields: [
      crewSharedPost.crewId
    ],
    references: [
      crew.id
    ]
  }),
  post: one(post, {
    fields: [
      crewSharedPost.postId
    ],
    references: [
      post.id
    ]
  })
}));

// ../../src/infrastructure/db/schema/drizzle/social/comment/table.ts
var import_drizzle_orm44 = require("drizzle-orm");
var import_pg_core47 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/social/comment/policies.ts
var import_drizzle_orm43 = require("drizzle-orm");
var import_pg_core46 = require("drizzle-orm/pg-core");
var uid15 = import_drizzle_orm43.sql`"identity"."current_user_id" ()`;
function commentPolicies(t) {
  const owns = import_drizzle_orm43.sql`${t.userId} = ${uid15}`;
  const visible = canViewPost(t.postId);
  const allowed = import_drizzle_orm43.sql`
    ${owns}
    AND ${visible}
  `;
  return [
    // A comment is visible whenever its parent post is visible to the current user.
    (0, import_pg_core46.pgPolicy)("Allow users to read comments on visible posts", {
      for: "select",
      to: authenticatedRole,
      using: visible
    }),
    // A user may comment as themselves only on a post they can see.
    (0, import_pg_core46.pgPolicy)("Allow users to create their own comments on visible posts", {
      for: "insert",
      to: authenticatedRole,
      withCheck: allowed
    }),
    // Only the comment author may update it, and the resulting comment must remain attached to a visible post.
    (0, import_pg_core46.pgPolicy)("Allow authors to update their comments on visible posts", {
      for: "update",
      to: authenticatedRole,
      using: owns,
      withCheck: allowed
    }),
    // Only the comment author may delete it.
    (0, import_pg_core46.pgPolicy)("Allow authors to delete their comments", {
      for: "delete",
      to: authenticatedRole,
      using: owns
    })
  ];
}
__name(commentPolicies, "commentPolicies");

// ../../src/infrastructure/db/schema/drizzle/social/comment/table.ts
var comment = socialSchema.table("comment", {
  id: (0, import_pg_core47.uuid)("id").defaultRandom().notNull(),
  postId: (0, import_pg_core47.uuid)("post_id").notNull(),
  userId: (0, import_pg_core47.uuid)("user_id").notNull(),
  content: (0, import_pg_core47.text)("content").notNull(),
  createdAt: (0, import_pg_core47.timestamp)("created_at", {
    withTimezone: true
  }).defaultNow().notNull(),
  updatedAt: (0, import_pg_core47.timestamp)("updated_at", {
    withTimezone: true
  }).defaultNow().notNull()
}, (t) => [
  (0, import_pg_core47.primaryKey)({
    name: "comment_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core47.foreignKey)({
    name: "comment_post_id_fkey",
    columns: [
      t.postId
    ],
    foreignColumns: [
      post.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core47.foreignKey)({
    name: "comment_user_id_fkey",
    columns: [
      t.userId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core47.index)("comment_post_created_at_idx").on(t.postId, t.createdAt),
  (0, import_pg_core47.index)("comment_user_id_idx").on(t.userId),
  ...commentPolicies(t)
]).enableRLS();
var commentRelations = (0, import_drizzle_orm44.relations)(comment, ({ one }) => ({
  post: one(post, {
    fields: [
      comment.postId
    ],
    references: [
      post.id
    ]
  }),
  user: one(user, {
    fields: [
      comment.userId
    ],
    references: [
      user.id
    ]
  })
}));

// ../../src/infrastructure/db/schema/drizzle/social/reaction/table.ts
var import_drizzle_orm46 = require("drizzle-orm");
var import_pg_core49 = require("drizzle-orm/pg-core");

// ../../src/infrastructure/db/schema/drizzle/social/reaction/policies.ts
var import_drizzle_orm45 = require("drizzle-orm");
var import_pg_core48 = require("drizzle-orm/pg-core");
var uid16 = import_drizzle_orm45.sql`"identity"."current_user_id" ()`;
function reactionPolicies(t) {
  const owns = import_drizzle_orm45.sql`${t.userId} = ${uid16}`;
  const visible = canViewPost(t.postId);
  const allowed = import_drizzle_orm45.sql`
    ${owns}
    AND ${visible}
  `;
  return [
    // A reaction is visible whenever its parent post is visible to the current user.
    (0, import_pg_core48.pgPolicy)("Allow users to read reactions on visible posts", {
      for: "select",
      to: authenticatedRole,
      using: visible
    }),
    // A user may react as themselves only to a post they can see.
    (0, import_pg_core48.pgPolicy)("Allow users to create their own reactions on visible posts", {
      for: "insert",
      to: authenticatedRole,
      withCheck: allowed
    }),
    // Only the reacting user may update it, and the resulting reaction must remain attached to a visible post.
    (0, import_pg_core48.pgPolicy)("Allow users to update their reactions on visible posts", {
      for: "update",
      to: authenticatedRole,
      using: owns,
      withCheck: allowed
    }),
    // Only the reacting user may delete it.
    (0, import_pg_core48.pgPolicy)("Allow users to delete their own reactions", {
      for: "delete",
      to: authenticatedRole,
      using: owns
    })
  ];
}
__name(reactionPolicies, "reactionPolicies");

// ../../src/infrastructure/db/schema/drizzle/social/reaction/table.ts
var reactionType = socialSchema.enum("Reaction Type", [
  "like",
  "fire up",
  "muscle"
]);
var reaction = socialSchema.table("reaction", {
  id: (0, import_pg_core49.uuid)("id").defaultRandom().notNull(),
  postId: (0, import_pg_core49.uuid)("post_id").notNull(),
  userId: (0, import_pg_core49.uuid)("user_id").notNull(),
  type: reactionType("type").notNull(),
  reactedAt: (0, import_pg_core49.timestamp)("reacted_at", {
    withTimezone: true
  }).defaultNow().notNull()
}, (t) => [
  (0, import_pg_core49.primaryKey)({
    name: "reaction_pkey",
    columns: [
      t.id
    ]
  }),
  (0, import_pg_core49.foreignKey)({
    name: "reaction_post_id_fkey",
    columns: [
      t.postId
    ],
    foreignColumns: [
      post.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core49.foreignKey)({
    name: "reaction_user_id_fkey",
    columns: [
      t.userId
    ],
    foreignColumns: [
      user.id
    ]
  }).onUpdate("cascade").onDelete("cascade"),
  (0, import_pg_core49.unique)("reaction_post_user_unique").on(t.postId, t.userId),
  (0, import_pg_core49.index)("reaction_user_id_idx").on(t.userId),
  ...reactionPolicies(t)
]).enableRLS();
var reactionRelations = (0, import_drizzle_orm46.relations)(reaction, ({ one }) => ({
  post: one(post, {
    fields: [
      reaction.postId
    ],
    references: [
      post.id
    ]
  }),
  user: one(user, {
    fields: [
      reaction.userId
    ],
    references: [
      user.id
    ]
  })
}));

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
var workoutScheduleDbSchema = (0, import_drizzle_zod.createSelectSchema)(workoutSchedule);
var exerciseTrackingSetExpandedViewDbSchema = (0, import_drizzle_zod.createSelectSchema)(exerciseTrackingSetExpandedView);
var prsViewDbSchema = (0, import_drizzle_zod.createSelectSchema)(prsView);
var crewDbSchema = (0, import_drizzle_zod.createSelectSchema)(crew);
var crewMembershipDbSchema = (0, import_drizzle_zod.createSelectSchema)(crewMembership);
var postDbSchema = (0, import_drizzle_zod.createSelectSchema)(post);
var commentDbSchema = (0, import_drizzle_zod.createSelectSchema)(comment);
var reactionDbSchema = (0, import_drizzle_zod.createSelectSchema)(reaction);

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
  id: aerobicTrackingDbSchema.shape.id,
  type: aerobicTrackingDbSchema.shape.type,
  durationSec: aerobicTrackingDbSchema.shape.durationSec,
  durationMins: aerobicTrackingDbSchema.shape.durationSec
});
var aerobicsWeeklyRecordQueryDtoSchema = aerobicsDailyRecordQueryDtoSchema.extend({
  workoutTimeLocal: serializedDateSchema
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
var aerobicMutationRowQueryDtoSchema = import_v42.z.object({
  id: aerobicTrackingDbSchema.shape.id
});

// src/modules/aerobics/aerobics.contracts.ts
var createAerobicEntryRequestSchema = import_v43.z.object({
  query: import_v43.z.object({
    tz: timezoneSchema.optional()
  }),
  body: import_v43.z.object({
    record: addAerobicInputQueryDtoSchema
  })
});
var createAerobicEntryResponseSchema = import_v43.z.void();
var createAerobicEntryContract = {
  request: createAerobicEntryRequestSchema,
  response: createAerobicEntryResponseSchema
};
var getAerobicHistoryRequestSchema = import_v43.z.object({
  query: import_v43.z.object({
    tz: timezoneSchema.optional()
  })
});
var getAerobicHistoryResponseSchema = userAerobicsQueryDtoSchema;
var getAerobicHistoryContract = {
  request: getAerobicHistoryRequestSchema,
  response: getAerobicHistoryResponseSchema
};
var aerobicEntryIdParamsSchema = import_v43.z.object({
  id: import_v43.z.coerce.number().int().positive()
});
var updateAerobicEntryRequestSchema = import_v43.z.object({
  params: aerobicEntryIdParamsSchema,
  query: import_v43.z.object({
    tz: timezoneSchema.optional()
  }),
  body: import_v43.z.object({
    record: addAerobicInputQueryDtoSchema
  })
});
var updateAerobicEntryContract = {
  request: updateAerobicEntryRequestSchema,
  response: import_v43.z.void()
};
var deleteAerobicEntryRequestSchema = import_v43.z.object({
  params: aerobicEntryIdParamsSchema,
  query: import_v43.z.object({
    tz: timezoneSchema.optional()
  })
});
var deleteAerobicEntryContract = {
  request: deleteAerobicEntryRequestSchema,
  response: import_v43.z.void()
};

// src/modules/auth/password/password.contracts.ts
var import_v44 = require("zod/v4");
var createPasswordResetRequestSchema = import_v44.z.object({
  body: import_v44.z.object({
    identifier: import_v44.z.string()
  })
});
var createPasswordResetRequestContract = {
  request: createPasswordResetRequestSchema
};
var resetPasswordRequestSchema = import_v44.z.object({
  body: import_v44.z.object({
    newPassword: import_v44.z.string().min(8, "Password must be at least 8 characters long")
  }),
  query: import_v44.z.object({
    token: import_v44.z.string().optional()
  })
});
var resetPasswordResponseSchema = import_v44.z.void();
var resetPasswordContract = {
  request: resetPasswordRequestSchema,
  response: resetPasswordResponseSchema
};

// src/modules/auth/password/password.dtos.ts
var import_v45 = require("zod/v4");
var forgotPasswordPayloadDtoSchema = import_v45.z.object({
  sub: userDbSchema.shape.id,
  jti: import_v45.z.string(),
  exp: import_v45.z.number(),
  iss: import_v45.z.string(),
  typ: import_v45.z.string()
});

// src/modules/auth/session/session.contracts.ts
var import_v46 = require("zod/v4");
var loginRequestSchema = import_v46.z.object({
  body: import_v46.z.object({
    identifier: import_v46.z.string().min(3).refine((value) => import_v46.z.string().email().safeParse(value).success || /^[a-zA-Z0-9_]{3,20}$/.test(value), {
      message: "Must be a valid email or username"
    }),
    password: import_v46.z.string().min(1, "Username and password are required")
  })
});
var loginResponseSchema = import_v46.z.object({
  message: import_v46.z.string(),
  user: userDbSchema.shape.id,
  accessToken: import_v46.z.string(),
  refreshToken: import_v46.z.string()
});
var loginContract = {
  request: loginRequestSchema,
  response: loginResponseSchema
};
var refreshTokenResponseSchema = import_v46.z.object({
  message: import_v46.z.string(),
  accessToken: import_v46.z.string(),
  refreshToken: import_v46.z.string(),
  userId: userDbSchema.shape.id
});
var refreshTokenContract = {
  response: refreshTokenResponseSchema
};
var logoutResponseSchema = import_v46.z.object({
  message: import_v46.z.string()
});
var logoutContract = {
  response: logoutResponseSchema
};

// src/modules/auth/session/session.dtos.ts
var import_v48 = require("zod/v4");

// src/modules/user/update/update.dtos.ts
var import_v47 = require("zod/v4");
var authenticatedUserForUpdateQueryDtoSchema = import_v47.z.object({
  username: userDbSchema.shape.username.trim().min(3, "Username must be at least 3 characters").max(15, "Username must be at most 15 characters").regex(/^[a-zA-Z0-9_]+$/, "Username may contain letters, numbers, and underscore only"),
  fullName: userDbSchema.shape.name.trim().min(1, "Full name is required").max(20, "Full name is too long").regex(/^[a-zA-Z\s]+$/, "Full name may contain letters and spaces only"),
  email: userDbSchema.shape.email.trim().toLowerCase().email("Invalid email format")
}).partial();
var userDataQueryDtoSchema = import_v47.z.object({
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
  isFirstLogin: import_v47.z.boolean(),
  tokenVersion: userDbSchema.shape.tokenVersion,
  isVerified: userDbSchema.shape.isVerified,
  authProvider: userDbSchema.shape.authProvider,
  lastLogin: serializedDateSchema.nullable()
});
var userDataRowQueryDtoSchema = import_v47.z.object({
  userData: userDataQueryDtoSchema
});
var userConflictQueryDtoSchema = import_v47.z.object({
  conflict: import_v47.z.boolean()
});
var userMessageIdentityQueryDtoSchema = import_v47.z.object({
  id: userDbSchema.shape.id,
  username: userDbSchema.shape.username,
  name: userDbSchema.shape.name,
  profilePicPath: userDbSchema.shape.profilePicPath
});
var userProfilePicQueryDtoSchema = import_v47.z.object({
  profilePicPath: userDbSchema.shape.profilePicPath
});
var changeEmailTokenPayloadDtoSchema = import_v47.z.object({
  jti: import_v47.z.string(),
  sub: import_v47.z.string(),
  newEmail: import_v47.z.string(),
  exp: import_v47.z.number(),
  iss: import_v47.z.string(),
  typ: import_v47.z.string()
});

// src/modules/auth/session/session.dtos.ts
var accessTokenPayloadDtoSchema = import_v48.z.object({
  id: userDbSchema.shape.id,
  role: userDbSchema.shape.role,
  cnf: import_v48.z.object({
    jkt: import_v48.z.string()
  }).optional(),
  iat: import_v48.z.number().optional(),
  exp: import_v48.z.number().optional()
});
var refreshTokenPayloadDtoSchema = accessTokenPayloadDtoSchema.extend({
  tokenVer: userDbSchema.shape.tokenVersion
});
var userAfterBumpQueryDtoSchema = import_v48.z.object({
  tokenVersion: userDbSchema.shape.tokenVersion,
  userData: userDataQueryDtoSchema
});
var tokenVersionQueryDtoSchema = import_v48.z.object({
  tokenVersion: userDbSchema.shape.tokenVersion
});
var lastLoginQueryDtoSchema = import_v48.z.object({
  lastLogin: import_v48.z.date().nullable()
});

// src/modules/auth/verification/verification.contracts.ts
var import_v49 = require("zod/v4");
var verifyEmailRequestSchema = import_v49.z.object({
  query: import_v49.z.object({
    token: import_v49.z.string().optional()
  })
});
var verifyEmailContract = {
  request: verifyEmailRequestSchema
};
var createVerificationEmailRequestSchema = import_v49.z.object({
  body: import_v49.z.object({
    email: userDbSchema.shape.email.trim().email("Invalid email")
  })
});
var createVerificationEmailContract = {
  request: createVerificationEmailRequestSchema
};
var updateUnverifiedAccountEmailRequestSchema = import_v49.z.object({
  body: import_v49.z.object({
    username: userDbSchema.shape.username,
    password: import_v49.z.string(),
    newEmail: userDbSchema.shape.email.trim().email("Invalid email")
  })
});
var updateUnverifiedAccountEmailContract = {
  request: updateUnverifiedAccountEmailRequestSchema
};
var getVerificationStatusRequestSchema = import_v49.z.object({
  query: import_v49.z.object({
    username: userDbSchema.shape.username
  })
});
var getVerificationStatusContract = {
  request: getVerificationStatusRequestSchema
};

// src/modules/auth/verification/verification.dtos.ts
var import_v410 = require("zod/v4");
var emailVerifyPayloadDtoSchema = import_v410.z.object({
  sub: userDbSchema.shape.id,
  jti: import_v410.z.string(),
  exp: import_v410.z.number(),
  iss: import_v410.z.string(),
  typ: import_v410.z.string()
});

// src/modules/auth/auth.dtos.ts
var import_v411 = require("zod/v4");
var userByIdentifierQueryDtoSchema = import_v411.z.object({
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
  is_verified: import_v411.z.boolean(),
  last_login: serializedDateSchema.nullable()
});
var userByIdentifierRowQueryDtoSchema = import_v411.z.object({
  userData: userByIdentifierRawQueryDtoSchema.nullable()
});
var userByUsernameRawQueryDtoSchema = userByIdentifierQueryDtoSchema.omit({
  isVerified: true,
  passwordHash: true
}).extend({
  password_hash: userDbSchema.shape.passwordHash,
  is_verified: import_v411.z.boolean()
});
var userByUsernameRowQueryDtoSchema = import_v411.z.object({
  userData: userByUsernameRawQueryDtoSchema.nullable()
});

// src/modules/exercises/exercises.dtos.ts
var import_v412 = require("zod/v4");
var getAllExercisesExerciseQueryDtoSchema = import_v412.z.object({
  id: exerciseDbSchema.shape.id,
  name: exerciseDbSchema.shape.name,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var exercisesMapByMuscleQueryDtoSchema = import_v412.z.record(import_v412.z.string(), import_v412.z.array(getAllExercisesExerciseQueryDtoSchema));
var exerciseMapByMuscleRowQueryDtoSchema = import_v412.z.object({
  result: import_v412.z.object({
    map: exercisesMapByMuscleQueryDtoSchema.nullable()
  }).nullable()
});

// src/modules/exercises/exercises.contracts.ts
var listExercisesResponseSchema = exercisesMapByMuscleQueryDtoSchema;
var listExercisesContract = {
  response: listExercisesResponseSchema
};

// src/modules/messages/messages.contracts.ts
var import_v414 = require("zod/v4");

// src/modules/messages/messages.dtos.ts
var import_v413 = require("zod/v4");
var allUserMessageQueryDtoSchema = import_v413.z.object({
  id: messageDbSchema.shape.id,
  subject: messageDbSchema.shape.subject,
  msg: messageDbSchema.shape.msg,
  sentAt: serializedDateSchema,
  isRead: messageDbSchema.shape.isRead,
  senderFullName: userDbSchema.shape.name,
  senderProfilePicPath: userDbSchema.shape.profilePicPath
});
var messageAsReadQueryDtoSchema = import_v413.z.object({
  id: messageDbSchema.shape.id,
  isRead: messageDbSchema.shape.isRead
});
var deletedMessageQueryDtoSchema = import_v413.z.object({
  id: messageDbSchema.shape.id
});
var messageAfterSendQueryDtoSchema = import_v413.z.object({
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
var listMessagesRequestSchema = import_v414.z.object({
  query: import_v414.z.object({
    tz: timezoneSchema
  })
});
var listMessagesResponseSchema = import_v414.z.object({
  messages: import_v414.z.array(allUserMessageQueryDtoSchema)
});
var listMessagesContract = {
  request: listMessagesRequestSchema,
  response: listMessagesResponseSchema
};
var markMessageAsReadRequestSchema = import_v414.z.object({
  params: import_v414.z.object({
    id: messageDbSchema.shape.id
  })
});
var markMessageAsReadResponseSchema = import_v414.z.void();
var markMessageAsReadContract = {
  request: markMessageAsReadRequestSchema,
  response: markMessageAsReadResponseSchema
};
var deleteMessageRequestSchema = import_v414.z.object({
  params: import_v414.z.object({
    id: messageDbSchema.shape.id
  })
});
var deleteMessageResponseSchema = import_v414.z.void();
var deleteMessageContract = {
  request: deleteMessageRequestSchema,
  response: deleteMessageResponseSchema
};

// src/modules/oauth/apple/apple.contracts.ts
var import_v415 = require("zod/v4");
var appleNameInputSchema = import_v415.z.object({
  givenName: import_v415.z.string().nullable(),
  familyName: import_v415.z.string().nullable()
});
var appleOAuthRequestSchema = import_v415.z.object({
  body: import_v415.z.object({
    idToken: import_v415.z.string({
      error: "Missing or invalid Apple identityToken"
    }),
    rawNonce: import_v415.z.string(),
    name: appleNameInputSchema.optional(),
    email: userDbSchema.shape.email.email().nullable()
  })
});
var appleOAuthContract = {
  request: appleOAuthRequestSchema
};

// src/modules/oauth/apple/apple.dtos.ts
var import_v416 = require("zod/v4");
var appleTokenVerificationResultDtoSchema = import_v416.z.object({
  appleSub: import_v416.z.string(),
  email: userDbSchema.shape.email.nullable(),
  emailVerified: import_v416.z.boolean(),
  fullName: userDbSchema.shape.name
});

// src/modules/oauth/google/google.contracts.ts
var import_v417 = require("zod/v4");
var googleOAuthRequestSchema = import_v417.z.object({
  body: import_v417.z.object({
    idToken: import_v417.z.string().optional()
  })
});
var googleOAuthContract = {
  request: googleOAuthRequestSchema
};

// src/modules/oauth/google/google.dtos.ts
var import_v418 = require("zod/v4");
var googleTokenVerificationResultDtoSchema = import_v418.z.object({
  googleSub: import_v418.z.string(),
  email: userDbSchema.shape.email.nullable(),
  emailVerified: import_v418.z.boolean(),
  fullName: userDbSchema.shape.name
});

// src/modules/oauth/oauth.contracts.ts
var import_v419 = require("zod/v4");
var oAuthLoginResponseSchema = import_v419.z.object({
  message: import_v419.z.string(),
  user: userDbSchema.shape.id,
  accessToken: import_v419.z.string(),
  refreshToken: import_v419.z.string()
});
var proceedLoginResponseSchema = loginResponseSchema;
var oAuthLoginContract = {
  response: oAuthLoginResponseSchema
};

// src/modules/oauth/oauth.dtos.ts
var import_v420 = require("zod/v4");
var oAuthLookupQueryDtoSchema = import_v420.z.object({
  userId: userDbSchema.shape.id.nullable()
});
var oAuthLookupRawQueryDtoSchema = import_v420.z.object({
  user_id: userDbSchema.shape.id
});
var oAuthLookupRowQueryDtoSchema = import_v420.z.object({
  oauth_data: oAuthLookupRawQueryDtoSchema.nullable()
});
var oAuthLinkQueryDtoSchema = import_v420.z.object({
  userId: userDbSchema.shape.id.nullable()
});
var oAuthLinkRowQueryDtoSchema = import_v420.z.object({
  user_id: userDbSchema.shape.id.nullable()
});
var oAuthCreatedUserRowQueryDtoSchema = import_v420.z.object({
  user_id: userDbSchema.shape.id
});

// src/modules/push/push.dtos.ts
var import_v421 = require("zod/v4");
var userWithNotificationsEnabledQueryDtoSchema = import_v421.z.object({
  pushToken: userDbSchema.shape.pushToken,
  name: userDbSchema.shape.name
});

// src/modules/reminders/reminders.contracts.ts
var import_v422 = require("zod/v4");
var getReminderSettingsResponseSchema = import_v422.z.object({
  reminderSettings: userReminderSettingDbSchema.extend({
    createdAt: serializedDateSchema,
    updatedAt: serializedDateSchema
  }).nullable()
});
var getReminderSettingsContract = {
  response: getReminderSettingsResponseSchema
};
var upsertReminderSettingsRequestSchema = import_v422.z.object({
  body: import_v422.z.object({
    reminderEnabled: userReminderSettingDbSchema.shape.reminderEnabled,
    timeZone: timezoneSchema
  })
});
var upsertReminderSettingsContract = {
  request: upsertReminderSettingsRequestSchema,
  response: import_v422.z.void()
};
var updateReminderTimeZoneRequestSchema = import_v422.z.object({
  body: import_v422.z.object({
    timeZone: timezoneSchema
  })
});
var updateReminderTimeZoneContract = {
  request: updateReminderTimeZoneRequestSchema,
  response: import_v422.z.void()
};

// src/modules/user/create/create.contracts.ts
var import_v424 = require("zod/v4");

// src/modules/user/create/create.dtos.ts
var import_v423 = require("zod/v4");
var createdUserQueryDtoSchema = import_v423.z.object({
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
var createdUserRowQueryDtoSchema = import_v423.z.object({
  userData: createdUserRawQueryDtoSchema
});
var userExistsQueryDtoSchema = import_v423.z.object({
  id: userDbSchema.shape.id.nullable()
});

// src/modules/user/create/create.contracts.ts
var usernameSchema = userDbSchema.shape.username.trim().min(3, "Username must be at least 3 characters").max(15, "Username must be at most 15 characters").regex(/^[a-zA-Z0-9_]+$/, "Username may contain letters, numbers, and underscore only");
var fullNameSchema = userDbSchema.shape.name.trim().max(20, "Full name is too long").regex(/^[a-zA-Z\s]+$/, "Full name may contain letters and spaces only");
var createUserRequestSchema = import_v424.z.object({
  body: import_v424.z.object({
    username: usernameSchema,
    fullName: import_v424.z.preprocess((value) => value == null || typeof value === "string" && value.trim() === "" ? "User" : value, fullNameSchema),
    email: userDbSchema.shape.email.trim().toLowerCase().email("Invalid email format"),
    password: import_v424.z.string().min(8, "Password must be at least 8 characters long"),
    gender: import_v424.z.preprocess((value) => value === "" || value == null ? "Unknown" : value, import_v424.z.enum([
      "Male",
      "Female",
      "Other",
      "Unknown"
    ]))
  })
});
var createUserUserSchema = createdUserQueryDtoSchema;
var createUserResponseSchema = import_v424.z.void();
var createUserContract = {
  request: createUserRequestSchema,
  response: createUserResponseSchema
};

// src/modules/user/push-tokens/push-tokens.contracts.ts
var import_v425 = require("zod/v4");
var replacePushTokenRequestSchema = import_v425.z.object({
  body: import_v425.z.object({
    token: userDbSchema.shape.pushToken.unwrap()
  })
});
var replacePushTokenContract = {
  request: replacePushTokenRequestSchema
};

// src/modules/user/update/update.contracts.ts
var import_v426 = require("zod/v4");
var updateCurrentUserRequestSchema = import_v426.z.object({
  body: authenticatedUserForUpdateQueryDtoSchema
});
var updateCurrentUserResponseSchema = import_v426.z.void();
var updateCurrentUserContract = {
  request: updateCurrentUserRequestSchema,
  response: updateCurrentUserResponseSchema
};
var userDataResponseSchema = import_v426.z.object({
  userData: userDataQueryDtoSchema
});
var userDataContract = {
  response: userDataResponseSchema
};
var getCurrentUserResponseSchema = userDataQueryDtoSchema;
var getCurrentUserContract = {
  response: getCurrentUserResponseSchema
};
var deleteProfilePictureRequestSchema = import_v426.z.object({
  body: import_v426.z.object({
    profilePicPath: import_v426.z.string()
  })
});
var deleteProfilePictureContract = {
  request: deleteProfilePictureRequestSchema
};
var replaceProfilePictureResponseSchema = import_v426.z.object({
  profilePicPath: import_v426.z.string(),
  url: import_v426.z.string(),
  message: import_v426.z.string()
});
var replaceProfilePictureContract = {
  response: replaceProfilePictureResponseSchema
};

// src/modules/video-analysis/video-analysis.contracts.ts
var import_v427 = require("zod/v4");
var createVideoUploadUrlRequestSchema = import_v427.z.object({
  body: import_v427.z.object({
    exercise: exerciseDbSchema.shape.name,
    fileType: import_v427.z.string(),
    jobId: import_v427.z.string()
  })
});
var createVideoUploadUrlResponseSchema = import_v427.z.object({
  uploadUrl: import_v427.z.string(),
  fileKey: import_v427.z.string(),
  requestId: import_v427.z.string()
});
var createVideoUploadUrlContract = {
  request: createVideoUploadUrlRequestSchema,
  response: createVideoUploadUrlResponseSchema
};

// src/modules/video-analysis/video-analysis.dtos.ts
var import_v428 = require("zod/v4");
var enqueueAnalyzeVideoParamsDtoSchema = import_v428.z.object({
  fileKey: import_v428.z.string(),
  exercise: import_v428.z.string(),
  userId: userDbSchema.shape.id,
  requestId: import_v428.z.string(),
  sentryTrace: import_v428.z.string().optional(),
  baggage: import_v428.z.string().optional()
});
var analyzeVideoPayloadDtoSchema = enqueueAnalyzeVideoParamsDtoSchema.extend({
  expiresAt: import_v428.z.number()
});
var squatRepetitionDtoSchema = import_v428.z.object({
  depth: import_v428.z.object({
    value: import_v428.z.number(),
    status: import_v428.z.string(),
    confidence: import_v428.z.number()
  }),
  backLean: import_v428.z.object({
    value: import_v428.z.number(),
    excessive: import_v428.z.boolean(),
    confidence: import_v428.z.number()
  }),
  audit: import_v428.z.object({
    framesAnalyzed: import_v428.z.number(),
    validFrames: import_v428.z.number(),
    cameraAngle: import_v428.z.string(),
    rawBottomAngle: import_v428.z.number(),
    samplingRate: import_v428.z.string()
  })
});
var analyzeVideoResultPayloadDtoSchema = /* @__PURE__ */ __name((resultSchema) => import_v428.z.intersection(import_v428.z.object({
  jobId: import_v428.z.string(),
  userId: userDbSchema.shape.id,
  exercise: import_v428.z.string(),
  requestId: import_v428.z.string().optional()
}), import_v428.z.discriminatedUnion("status", [
  import_v428.z.object({
    status: import_v428.z.literal("completed"),
    result: import_v428.z.array(resultSchema),
    error: import_v428.z.null()
  }),
  import_v428.z.object({
    status: import_v428.z.literal("failed"),
    result: import_v428.z.null(),
    error: import_v428.z.string()
  })
])), "analyzeVideoResultPayloadDtoSchema");

// src/modules/web-sockets/web-sockets.contracts.ts
var import_v429 = require("zod/v4");
var createWebSocketTicketRequestSchema = import_v429.z.object({
  body: import_v429.z.object({
    username: userDbSchema.shape.username
  })
});
var createWebSocketTicketResponseSchema = import_v429.z.object({
  ticket: import_v429.z.string()
});
var createWebSocketTicketContract = {
  request: createWebSocketTicketRequestSchema,
  response: createWebSocketTicketResponseSchema
};

// src/modules/workout/plan/plan.contracts.ts
var import_v431 = require("zod/v4");

// src/modules/workout/plan/plan.dtos.ts
var import_v430 = require("zod/v4");
var workoutExerciseInputQueryDtoSchema = import_v430.z.object({
  exerciseId: exerciseDbSchema.shape.id,
  sets: import_v430.z.array(workoutSetDbSchema.shape.reps),
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex
});
var workoutSplitInputBaseQueryDtoSchema = import_v430.z.object({
  name: workoutSplitDbSchema.shape.name.min(1, "Split name is required"),
  orderIndex: import_v430.z.number().int().nonnegative(),
  exercises: import_v430.z.array(workoutExerciseInputQueryDtoSchema).min(1, "Each split must include at least one exercise")
});
var saveWorkoutSplitInputQueryDtoSchema = workoutSplitInputBaseQueryDtoSchema.extend({
  id: workoutSplitDbSchema.shape.id.optional()
});
var saveWorkoutSplitPayloadQueryDtoSchema = import_v430.z.array(saveWorkoutSplitInputQueryDtoSchema).min(1, "Workout must include at least one split");
var exerciseInPlanQueryDtoSchema = import_v430.z.object({
  exerciseToSplitId: exerciseToWorkoutSplitDbSchema.shape.id,
  exerciseId: exerciseDbSchema.shape.id,
  name: exerciseDbSchema.shape.name,
  sets: import_v430.z.array(import_v430.z.object({
    orderIndex: workoutSetDbSchema.shape.orderIndex,
    reps: workoutSetDbSchema.shape.reps
  })),
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
  isActive: exerciseToWorkoutSplitDbSchema.shape.isActive,
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var workoutSplitQueryDtoSchema = import_v430.z.object({
  id: workoutSplitDbSchema.shape.id,
  workoutId: workoutSplitDbSchema.shape.workoutId,
  name: workoutSplitDbSchema.shape.name,
  orderIndex: workoutSplitDbSchema.shape.orderIndex,
  createdAt: serializedDateSchema,
  muscleGroup: import_v430.z.string().nullable(),
  estimatedDurationMinutes: import_v430.z.number().nullable(),
  isActive: workoutSplitDbSchema.shape.isActive,
  exercises: import_v430.z.array(exerciseInPlanQueryDtoSchema)
});
var wholeUserWorkoutPlanQueryDtoSchema = import_v430.z.object({
  id: workoutPlanDbSchema.shape.id,
  numberOfSplits: import_v430.z.number(),
  createdAt: serializedDateSchema,
  userId: userDbSchema.shape.id,
  isActive: workoutPlanDbSchema.shape.isActive,
  updatedAt: serializedDateSchema,
  workoutSplits: import_v430.z.array(workoutSplitQueryDtoSchema).nullable()
});
var workoutPlanIdQueryDtoSchema = import_v430.z.object({
  id: workoutPlanDbSchema.shape.id
});
var workoutSplitIdQueryDtoSchema = import_v430.z.object({
  id: workoutSplitDbSchema.shape.id
});
var exerciseAssignmentIdQueryDtoSchema = import_v430.z.object({
  id: exerciseToWorkoutSplitDbSchema.shape.id
});

// src/modules/workout/plan/plan.contracts.ts
var getWorkoutPlanRequestSchema = import_v431.z.object({
  query: import_v431.z.object({
    tz: timezoneSchema.optional()
  })
});
var getWorkoutPlanResponseSchema = import_v431.z.object({
  workoutPlan: wholeUserWorkoutPlanQueryDtoSchema.nullable()
});
var getWorkoutPlanContract = {
  request: getWorkoutPlanRequestSchema,
  response: getWorkoutPlanResponseSchema
};
var replaceWorkoutPlanRequestSchema = import_v431.z.object({
  body: import_v431.z.object({
    workoutData: saveWorkoutSplitPayloadQueryDtoSchema,
    workoutName: import_v431.z.string().optional(),
    tz: timezoneSchema
  })
});
var replaceWorkoutPlanResponseSchema = import_v431.z.void();
var replaceWorkoutPlanContract = {
  request: replaceWorkoutPlanRequestSchema,
  response: replaceWorkoutPlanResponseSchema
};

// src/modules/workout/tracking/tracking.contracts.ts
var import_v433 = require("zod/v4");

// src/modules/workout/tracking/tracking.dtos.ts
var import_v432 = require("zod/v4");
var trackedSetQueryDtoSchema = import_v432.z.object({
  reps: trackingSetDbSchema.shape.reps,
  weight: trackingSetDbSchema.shape.weight,
  setIndex: trackingSetDbSchema.shape.setIndex
});
var finishedWorkoutEntryBaseQueryDtoSchema = import_v432.z.object({
  trackedSets: import_v432.z.array(trackedSetQueryDtoSchema),
  notes: exerciseTrackingDbSchema.shape.notes.optional()
});
var finishedWorkoutEntryQueryDtoSchema = import_v432.z.discriminatedUnion("isExerciseAssignedToSplit", [
  finishedWorkoutEntryBaseQueryDtoSchema.extend({
    isExerciseAssignedToSplit: import_v432.z.literal(true),
    exerciseToSplitId: exerciseTrackingDbSchema.shape.exerciseToSplitId.unwrap(),
    // Accepted temporarily for clients using the previous redundant payload.
    exerciseId: exerciseTrackingDbSchema.shape.exerciseId.optional()
  }),
  finishedWorkoutEntryBaseQueryDtoSchema.extend({
    isExerciseAssignedToSplit: import_v432.z.literal(false),
    exerciseToSplitId: import_v432.z.null().optional(),
    exerciseId: exerciseTrackingDbSchema.shape.exerciseId.unwrap()
  })
]);
var exerciseMetadataQueryDtoSchema = import_v432.z.object({
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var exerciseTrackingPrMaxQueryDtoSchema = import_v432.z.object({
  exercise: exerciseDbSchema.shape.name,
  weight: trackingSetDbSchema.shape.weight,
  reps: trackingSetDbSchema.shape.reps,
  workoutTimeUtc: serializedDateSchema
});
var exerciseTrackingAnalysisQueryDtoSchema = import_v432.z.object({
  uniqueDays: import_v432.z.number(),
  mostFrequentSplit: import_v432.z.string().nullable(),
  mostFrequentSplitDays: import_v432.z.number().nullable(),
  lastWorkoutDate: import_v432.z.string().nullable(),
  splitDaysByName: import_v432.z.record(import_v432.z.string(), import_v432.z.number()),
  prs: import_v432.z.object({
    prMax: exerciseTrackingPrMaxQueryDtoSchema.nullable()
  })
});
var trackingMapItemQueryDtoSchema = import_v432.z.object({
  id: exerciseTrackingDbSchema.shape.id,
  exerciseToSplitId: exerciseToWorkoutSplitDbSchema.shape.id,
  weight: import_v432.z.array(trackingSetDbSchema.shape.weight),
  reps: import_v432.z.array(trackingSetDbSchema.shape.reps),
  notes: exerciseTrackingDbSchema.shape.notes,
  exerciseId: exerciseDbSchema.shape.id,
  workoutSplitId: workoutSplitDbSchema.shape.id,
  splitName: workoutSplitDbSchema.shape.name,
  exercise: exerciseDbSchema.shape.name,
  workoutDate: serializedDateSchema,
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
  exerciseToWorkoutSplit: import_v432.z.object({
    sets: import_v432.z.array(workoutSetDbSchema.shape.reps),
    exercises: exerciseMetadataQueryDtoSchema
  })
});
var trackingByDateItemQueryDtoSchema = trackingMapItemQueryDtoSchema.omit({
  workoutDate: true
});
var trackingBySplitNameItemQueryDtoSchema = trackingMapItemQueryDtoSchema.omit({
  splitName: true
});
var groupedTrackingItemQueryDtoSchema = import_v432.z.object({
  exerciseTracking: import_v432.z.object({
    exerciseTrackingId: exerciseTrackingDbSchema.shape.id,
    sets: import_v432.z.array(import_v432.z.object({
      setIndex: trackingSetDbSchema.shape.setIndex,
      weight: trackingSetDbSchema.shape.weight,
      reps: trackingSetDbSchema.shape.reps
    })),
    notes: exerciseTrackingDbSchema.shape.notes,
    exerciseAssignment: import_v432.z.object({
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
var personalRecordQueryDtoSchema = import_v432.z.object({
  exerciseToSplitId: exerciseTrackingDbSchema.shape.exerciseToSplitId,
  exerciseId: exerciseDbSchema.shape.id,
  exerciseName: exerciseDbSchema.shape.name,
  prWeight: trackingSetDbSchema.shape.weight,
  prReps: trackingSetDbSchema.shape.reps,
  prSetIndex: trackingSetDbSchema.shape.setIndex,
  estimatedOneRepMax: import_v432.z.number().nullable(),
  workoutStartLocal: serializedDateSchema
});
var personalRecordsQueryDtoSchema = import_v432.z.object({
  prs: import_v432.z.record(import_v432.z.string(), personalRecordQueryDtoSchema.omit({
    exerciseId: true
  }))
});
var nextSplitQueryDtoSchema = import_v432.z.object({
  id: workoutSplitDbSchema.shape.id,
  name: workoutSplitDbSchema.shape.name,
  orderIndex: workoutSplitDbSchema.shape.orderIndex,
  muscleGroup: import_v432.z.string().nullable()
});
var exerciseTrackingStatsQueryDtoSchema = import_v432.z.object({
  workoutCount: import_v432.z.coerce.number(),
  hasExerciseTracking: import_v432.z.boolean(),
  nextSplitByOrderIndex: nextSplitQueryDtoSchema.nullable(),
  workoutTargets: import_v432.z.object({
    workoutCountThisWeek: import_v432.z.coerce.number(),
    workoutCountScheduledPerWeek: import_v432.z.coerce.number()
  }),
  lastWorkoutStats: import_v432.z.object({
    workoutDate: import_v432.z.string().nullable(),
    workoutSplitName: workoutSplitDbSchema.shape.name.nullable(),
    exerciseTrackedCount: import_v432.z.coerce.number().nullable(),
    setTrackedCount: import_v432.z.coerce.number().nullable()
  }),
  latestPr: import_v432.z.array(personalRecordQueryDtoSchema).max(1)
});
var exerciseTrackingMapsQueryDtoSchema = import_v432.z.object({
  byDate: import_v432.z.record(import_v432.z.string(), import_v432.z.object({
    durationMins: import_v432.z.number(),
    exerciseTracked: import_v432.z.array(groupedTrackingItemQueryDtoSchema)
  }))
});
var exerciseHistoryQueryDtoSchema = import_v432.z.object({
  byExerciseToSplitId: import_v432.z.record(import_v432.z.string(), import_v432.z.object({
    exerciseTracked: import_v432.z.array(trackingByExerciseToSplitIdItemQueryDtoSchema)
  }))
});
var exerciseTrackingAndStatsQueryDtoSchema = import_v432.z.object({
  trackingStats: exerciseTrackingStatsQueryDtoSchema,
  trackingMaps: exerciseTrackingMapsQueryDtoSchema
});
var exerciseTrackingAndStatsRowQueryDtoSchema = import_v432.z.object({
  data: exerciseTrackingAndStatsQueryDtoSchema
});
var exerciseTrackingStatsRowQueryDtoSchema = import_v432.z.object({
  data: exerciseTrackingStatsQueryDtoSchema
});
var exerciseTrackingMapsRowQueryDtoSchema = import_v432.z.object({
  data: exerciseTrackingMapsQueryDtoSchema
});
var exerciseHistoryRowQueryDtoSchema = import_v432.z.object({
  data: exerciseHistoryQueryDtoSchema
});
var personalRecordsRowQueryDtoSchema = import_v432.z.object({
  data: personalRecordsQueryDtoSchema
});
var workoutSplitLookupQueryDtoSchema = import_v432.z.object({
  workoutSplitId: workoutSplitDbSchema.shape.id
});
var workoutSummaryIdQueryDtoSchema = import_v432.z.object({
  id: import_v432.z.string().uuid()
});
var exerciseTrackingIdQueryDtoSchema = import_v432.z.object({
  id: exerciseTrackingDbSchema.shape.id
});

// src/modules/workout/tracking/tracking.contracts.ts
var getWorkoutHistoryRequestSchema = import_v433.z.object({
  query: import_v433.z.object({
    tz: timezoneSchema.optional()
  })
});
var getWorkoutHistoryResponseSchema = exerciseTrackingMapsQueryDtoSchema;
var getWorkoutHistoryContract = {
  request: getWorkoutHistoryRequestSchema,
  response: getWorkoutHistoryResponseSchema
};
var getExerciseHistoryRequestSchema = import_v433.z.object({
  query: import_v433.z.object({
    tz: timezoneSchema.optional()
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
var createWorkoutSessionRequestSchema = import_v433.z.object({
  body: import_v433.z.object({
    workout: import_v433.z.array(finishedWorkoutEntryQueryDtoSchema),
    tz: timezoneSchema.optional(),
    workoutStartUtc: import_v433.z.string().datetime("workoutStartUtc must be a valid ISO datetime"),
    workoutEndUtc: import_v433.z.string().datetime("workoutEndUtc must be a valid ISO datetime").optional().nullable()
  })
});
var createWorkoutSessionResponseSchema = import_v433.z.void();
var createWorkoutSessionContract = {
  request: createWorkoutSessionRequestSchema,
  response: createWorkoutSessionResponseSchema
};
var getPersonalRecordsResponseSchema = personalRecordsQueryDtoSchema;
var getPersonalRecordsRequestSchema = import_v433.z.object({
  query: import_v433.z.object({
    tz: timezoneSchema.optional()
  })
});
var getPersonalRecordsContract = {
  request: getPersonalRecordsRequestSchema,
  response: getPersonalRecordsResponseSchema
};

// src/modules/workout-schedule/workout-schedule.contracts.ts
var import_v435 = require("zod/v4");

// src/modules/workout-schedule/workout-schedule.dtos.ts
var import_v434 = require("zod/v4");
var workoutScheduleInputDtoSchema = import_v434.z.object({
  workoutSplitId: workoutScheduleDbSchema.shape.workoutSplitId,
  dayOfWeek: workoutScheduleDbSchema.shape.dayOfWeek.int().min(0).max(6),
  startTime: workoutScheduleDbSchema.shape.startTime.regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/)
});
var workoutScheduleQueryDtoSchema = workoutScheduleDbSchema.extend({
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema
});

// src/modules/workout-schedule/workout-schedule.contracts.ts
var getWorkoutSchedulesResponseSchema = import_v435.z.object({
  schedules: import_v435.z.array(workoutScheduleQueryDtoSchema)
});
var getWorkoutSchedulesContract = {
  response: getWorkoutSchedulesResponseSchema
};
var replaceWorkoutSchedulesRequestSchema = import_v435.z.object({
  body: import_v435.z.object({
    schedules: import_v435.z.array(workoutScheduleInputDtoSchema).superRefine((schedules, context) => {
      const keys = /* @__PURE__ */ new Set();
      for (const schedule of schedules) {
        const key = `${schedule.workoutSplitId}:${schedule.dayOfWeek}`;
        if (keys.has(key)) {
          context.addIssue({
            code: "custom",
            message: "A workout split can only be scheduled once per weekday"
          });
        }
        keys.add(key);
      }
    })
  })
});
var replaceWorkoutSchedulesContract = {
  request: replaceWorkoutSchedulesRequestSchema,
  response: import_v435.z.void()
};

// src/modules/social/crews/crews.contracts.ts
var import_v437 = require("zod/v4");

// src/modules/social/crews/crews.dtos.ts
var import_v436 = require("zod/v4");
var crewQueryDtoSchema = crewDbSchema.extend({
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema
});
var crewParticipantPreviewQueryDtoSchema = import_v436.z.object({
  username: userDbSchema.shape.username,
  fullName: userDbSchema.shape.name,
  profilePicPath: userDbSchema.shape.profilePicPath
});
var discoverableCrewQueryDtoSchema = crewQueryDtoSchema.extend({
  top5Participants: crewParticipantPreviewQueryDtoSchema.array()
});
var crewParticipantQueryDtoSchema = crewMembershipDbSchema.extend({
  joinedAt: serializedDateSchema,
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  fullName: userDbSchema.shape.name,
  profilePicPath: userDbSchema.shape.profilePicPath,
  username: userDbSchema.shape.username
});
var deletedCrewQueryDtoSchema = import_v436.z.object({
  id: crewDbSchema.shape.id
});
var leaveCrewResultQueryDtoSchema = import_v436.z.object({
  result: import_v436.z.enum([
    "left",
    "not_member"
  ])
});
var leaveCrewContextQueryDtoSchema = import_v436.z.object({
  membershipId: crewMembershipDbSchema.shape.id,
  isLeader: import_v436.z.boolean()
});
var crewSuccessorQueryDtoSchema = import_v436.z.object({
  membershipId: crewMembershipDbSchema.shape.id,
  userId: crewMembershipDbSchema.shape.userId
});

// src/modules/social/crews/crews.contracts.ts
var crewIdParamsSchema = import_v437.z.object({
  id: crewDbSchema.shape.id
});
var listCrewsRequestSchema = import_v437.z.object({
  query: import_v437.z.object({
    limit: import_v437.z.coerce.number().int().min(1).max(100).default(20),
    cursor: import_v437.z.string().min(1).optional()
  })
});
var listCrewsResponseSchema = import_v437.z.object({
  crews: import_v437.z.array(discoverableCrewQueryDtoSchema),
  nextCursor: import_v437.z.string().nullable()
});
var listCrewsContract = {
  request: listCrewsRequestSchema,
  response: listCrewsResponseSchema
};
var listCrewParticipantsRequestSchema = import_v437.z.object({
  params: import_v437.z.object({
    crewId: crewDbSchema.shape.id
  }),
  query: import_v437.z.object({
    limit: import_v437.z.coerce.number().int().min(1).max(100).default(20),
    cursor: import_v437.z.string().min(1).optional()
  })
});
var listCrewParticipantsResponseSchema = import_v437.z.object({
  participants: import_v437.z.array(crewParticipantQueryDtoSchema),
  nextCursor: import_v437.z.string().nullable()
});
var listCrewParticipantsContract = {
  request: listCrewParticipantsRequestSchema,
  response: listCrewParticipantsResponseSchema
};
var getCrewRequestSchema = import_v437.z.object({
  params: crewIdParamsSchema
});
var getCrewResponseSchema = crewQueryDtoSchema;
var getCrewContract = {
  request: getCrewRequestSchema,
  response: getCrewResponseSchema
};
var createCrewRequestSchema = import_v437.z.object({
  body: import_v437.z.object({
    privacy: crewDbSchema.shape.privacy
  })
});
var createCrewResponseSchema = import_v437.z.void();
var createCrewContract = {
  request: createCrewRequestSchema,
  response: createCrewResponseSchema
};
var updateCrewRequestSchema = import_v437.z.object({
  params: crewIdParamsSchema,
  body: import_v437.z.object({
    privacy: crewDbSchema.shape.privacy
  })
});
var updateCrewResponseSchema = import_v437.z.void();
var updateCrewContract = {
  request: updateCrewRequestSchema,
  response: updateCrewResponseSchema
};
var leaveCrewRequestSchema = import_v437.z.object({
  params: crewIdParamsSchema
});
var leaveCrewResponseSchema = import_v437.z.void();
var leaveCrewContract = {
  request: leaveCrewRequestSchema,
  response: leaveCrewResponseSchema
};
var deleteCrewRequestSchema = import_v437.z.object({
  params: crewIdParamsSchema
});
var deleteCrewResponseSchema = import_v437.z.void();
var deleteCrewContract = {
  request: deleteCrewRequestSchema,
  response: deleteCrewResponseSchema
};

// src/modules/social/posts/posts.contracts.ts
var import_v439 = require("zod/v4");

// src/modules/social/posts/posts.dtos.ts
var import_v438 = require("zod/v4");
var postQueryDtoSchema = postDbSchema.omit({
  updateddAt: true
}).extend({
  publishedAt: serializedDateSchema,
  updatedAt: serializedDateSchema
});
var deletedPostQueryDtoSchema = import_v438.z.object({
  id: postDbSchema.shape.id
});

// src/modules/social/posts/posts.contracts.ts
var postIdParamsSchema = import_v439.z.object({
  id: postDbSchema.shape.id
});
var postPaginationSchema = import_v439.z.object({
  limit: import_v439.z.coerce.number().int().min(1).max(100).default(20),
  cursor: import_v439.z.string().min(1).optional()
});
var listVisiblePostsRequestSchema = import_v439.z.object({
  query: postPaginationSchema
});
var listVisiblePostsResponseSchema = import_v439.z.object({
  posts: import_v439.z.array(postQueryDtoSchema),
  nextCursor: import_v439.z.string().nullable()
});
var listVisiblePostsContract = {
  request: listVisiblePostsRequestSchema,
  response: listVisiblePostsResponseSchema
};
var listCrewPostsRequestSchema = import_v439.z.object({
  params: import_v439.z.object({
    crewId: import_v439.z.uuid()
  }),
  query: postPaginationSchema
});
var listCrewPostsResponseSchema = import_v439.z.object({
  posts: import_v439.z.array(postQueryDtoSchema),
  nextCursor: import_v439.z.string().nullable()
});
var listCrewPostsContract = {
  request: listCrewPostsRequestSchema,
  response: listCrewPostsResponseSchema
};
var createPostBodySchema = import_v439.z.object({
  content: postDbSchema.shape.content,
  visibility: postDbSchema.shape.visibility,
  crewIds: import_v439.z.array(import_v439.z.uuid()).default([])
}).superRefine((body, context) => {
  if (body.visibility === "crews_only" && body.crewIds.length === 0) {
    context.addIssue({
      code: "custom",
      path: [
        "crewIds"
      ],
      message: "Crew-only posts require at least one crew"
    });
  }
  if (new Set(body.crewIds).size !== body.crewIds.length) {
    context.addIssue({
      code: "custom",
      path: [
        "crewIds"
      ],
      message: "Crew IDs must be unique"
    });
  }
});
var createPostRequestSchema = import_v439.z.object({
  body: createPostBodySchema
});
var createPostResponseSchema = import_v439.z.void();
var createPostContract = {
  request: createPostRequestSchema,
  response: createPostResponseSchema
};
var updatePostRequestSchema = import_v439.z.object({
  params: postIdParamsSchema,
  body: import_v439.z.object({
    content: postDbSchema.shape.content
  })
});
var updatePostResponseSchema = import_v439.z.void();
var updatePostContract = {
  request: updatePostRequestSchema,
  response: updatePostResponseSchema
};
var deletePostRequestSchema = import_v439.z.object({
  params: postIdParamsSchema
});
var deletePostResponseSchema = import_v439.z.void();
var deletePostContract = {
  request: deletePostRequestSchema,
  response: deletePostResponseSchema
};

// src/modules/social/posts/comments/comments.contracts.ts
var import_v441 = require("zod/v4");

// src/modules/social/posts/comments/comments.dtos.ts
var import_v440 = require("zod/v4");
var commentQueryDtoSchema = commentDbSchema.extend({
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema
});
var commentWriteResultQueryDtoSchema = import_v440.z.object({
  id: commentDbSchema.shape.id
});

// src/modules/social/posts/comments/comments.contracts.ts
var postParamsSchema = import_v441.z.object({
  postId: postDbSchema.shape.id
});
var commentParamsSchema = import_v441.z.object({
  id: commentDbSchema.shape.id
});
var commentContentSchema = commentDbSchema.shape.content.trim().min(1).max(2e3);
var listPostCommentsRequestSchema = import_v441.z.object({
  params: postParamsSchema,
  query: import_v441.z.object({
    limit: import_v441.z.coerce.number().int().min(1).max(100).default(20),
    cursor: import_v441.z.string().min(1).optional()
  })
});
var listPostCommentsResponseSchema = import_v441.z.object({
  comments: import_v441.z.array(commentQueryDtoSchema),
  nextCursor: import_v441.z.string().nullable()
});
var listPostCommentsContract = {
  request: listPostCommentsRequestSchema,
  response: listPostCommentsResponseSchema
};
var addCommentRequestSchema = import_v441.z.object({
  params: postParamsSchema,
  body: import_v441.z.object({
    content: commentContentSchema
  })
});
var addCommentResponseSchema = import_v441.z.void();
var addCommentContract = {
  request: addCommentRequestSchema,
  response: addCommentResponseSchema
};
var editCommentRequestSchema = import_v441.z.object({
  params: commentParamsSchema,
  body: import_v441.z.object({
    content: commentContentSchema
  })
});
var editCommentResponseSchema = import_v441.z.void();
var editCommentContract = {
  request: editCommentRequestSchema,
  response: editCommentResponseSchema
};
var deleteCommentRequestSchema = import_v441.z.object({
  params: commentParamsSchema
});
var deleteCommentResponseSchema = import_v441.z.void();
var deleteCommentContract = {
  request: deleteCommentRequestSchema,
  response: deleteCommentResponseSchema
};

// src/modules/social/posts/reactions/reactions.contracts.ts
var import_v443 = require("zod/v4");

// src/modules/social/posts/reactions/reactions.dtos.ts
var import_v442 = require("zod/v4");
var reactionQueryDtoSchema = reactionDbSchema.extend({
  reactedAt: serializedDateSchema
});
var reactionWriteResultQueryDtoSchema = import_v442.z.object({
  id: reactionDbSchema.shape.id
});

// src/modules/social/posts/reactions/reactions.contracts.ts
var postParamsSchema2 = import_v443.z.object({
  postId: postDbSchema.shape.id
});
var listPostReactionsRequestSchema = import_v443.z.object({
  params: postParamsSchema2,
  query: import_v443.z.object({
    limit: import_v443.z.coerce.number().int().min(1).max(100).default(20),
    cursor: import_v443.z.string().min(1).optional()
  })
});
var listPostReactionsResponseSchema = import_v443.z.object({
  reactions: import_v443.z.array(reactionQueryDtoSchema),
  nextCursor: import_v443.z.string().nullable()
});
var listPostReactionsContract = {
  request: listPostReactionsRequestSchema,
  response: listPostReactionsResponseSchema
};
var reactToPostRequestSchema = import_v443.z.object({
  params: postParamsSchema2,
  body: import_v443.z.object({
    type: reactionDbSchema.shape.type
  })
});
var reactToPostResponseSchema = import_v443.z.void();
var reactToPostContract = {
  request: reactToPostRequestSchema,
  response: reactToPostResponseSchema
};
var deleteReactionRequestSchema = import_v443.z.object({
  params: postParamsSchema2
});
var deleteReactionResponseSchema = import_v443.z.void();
var deleteReactionContract = {
  request: deleteReactionRequestSchema,
  response: deleteReactionResponseSchema
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  accessTokenPayloadDtoSchema,
  addAerobicInputQueryDtoSchema,
  addCommentContract,
  addCommentRequestSchema,
  addCommentResponseSchema,
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
  commentDbSchema,
  commentQueryDtoSchema,
  commentWriteResultQueryDtoSchema,
  createAerobicEntryContract,
  createAerobicEntryRequestSchema,
  createAerobicEntryResponseSchema,
  createCrewContract,
  createCrewRequestSchema,
  createCrewResponseSchema,
  createPasswordResetRequestContract,
  createPasswordResetRequestSchema,
  createPostContract,
  createPostRequestSchema,
  createPostResponseSchema,
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
  crewDbSchema,
  crewMembershipDbSchema,
  crewParticipantPreviewQueryDtoSchema,
  crewParticipantQueryDtoSchema,
  crewQueryDtoSchema,
  crewSuccessorQueryDtoSchema,
  deleteAerobicEntryContract,
  deleteAerobicEntryRequestSchema,
  deleteCommentContract,
  deleteCommentRequestSchema,
  deleteCommentResponseSchema,
  deleteCrewContract,
  deleteCrewRequestSchema,
  deleteCrewResponseSchema,
  deleteMessageContract,
  deleteMessageRequestSchema,
  deleteMessageResponseSchema,
  deletePostContract,
  deletePostRequestSchema,
  deletePostResponseSchema,
  deleteProfilePictureContract,
  deleteProfilePictureRequestSchema,
  deleteReactionContract,
  deleteReactionRequestSchema,
  deleteReactionResponseSchema,
  deletedCrewQueryDtoSchema,
  deletedMessageQueryDtoSchema,
  deletedPostQueryDtoSchema,
  discoverableCrewQueryDtoSchema,
  editCommentContract,
  editCommentRequestSchema,
  editCommentResponseSchema,
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
  getCrewContract,
  getCrewRequestSchema,
  getCrewResponseSchema,
  getCurrentUserContract,
  getCurrentUserResponseSchema,
  getExerciseHistoryContract,
  getExerciseHistoryRequestSchema,
  getExerciseHistoryResponseSchema,
  getPersonalRecordsContract,
  getPersonalRecordsRequestSchema,
  getPersonalRecordsResponseSchema,
  getReminderSettingsContract,
  getReminderSettingsResponseSchema,
  getVerificationStatusContract,
  getVerificationStatusRequestSchema,
  getWorkoutHistoryContract,
  getWorkoutHistoryRequestSchema,
  getWorkoutHistoryResponseSchema,
  getWorkoutPlanContract,
  getWorkoutPlanRequestSchema,
  getWorkoutPlanResponseSchema,
  getWorkoutSchedulesContract,
  getWorkoutSchedulesResponseSchema,
  getWorkoutStatisticsContract,
  getWorkoutStatisticsResponseSchema,
  googleOAuthContract,
  googleOAuthRequestSchema,
  googleTokenVerificationResultDtoSchema,
  lastLoginQueryDtoSchema,
  leaveCrewContextQueryDtoSchema,
  leaveCrewContract,
  leaveCrewRequestSchema,
  leaveCrewResponseSchema,
  leaveCrewResultQueryDtoSchema,
  listCrewParticipantsContract,
  listCrewParticipantsRequestSchema,
  listCrewParticipantsResponseSchema,
  listCrewPostsContract,
  listCrewPostsRequestSchema,
  listCrewPostsResponseSchema,
  listCrewsContract,
  listCrewsRequestSchema,
  listCrewsResponseSchema,
  listExercisesContract,
  listExercisesResponseSchema,
  listMessagesContract,
  listMessagesRequestSchema,
  listMessagesResponseSchema,
  listPostCommentsContract,
  listPostCommentsRequestSchema,
  listPostCommentsResponseSchema,
  listPostReactionsContract,
  listPostReactionsRequestSchema,
  listPostReactionsResponseSchema,
  listVisiblePostsContract,
  listVisiblePostsRequestSchema,
  listVisiblePostsResponseSchema,
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
  postDbSchema,
  postQueryDtoSchema,
  proceedLoginResponseSchema,
  prsViewDbSchema,
  reactToPostContract,
  reactToPostRequestSchema,
  reactToPostResponseSchema,
  reactionDbSchema,
  reactionQueryDtoSchema,
  reactionWriteResultQueryDtoSchema,
  refreshTokenContract,
  refreshTokenPayloadDtoSchema,
  refreshTokenResponseSchema,
  replaceProfilePictureContract,
  replaceProfilePictureResponseSchema,
  replacePushTokenContract,
  replacePushTokenRequestSchema,
  replaceWorkoutPlanContract,
  replaceWorkoutPlanRequestSchema,
  replaceWorkoutPlanResponseSchema,
  replaceWorkoutSchedulesContract,
  replaceWorkoutSchedulesRequestSchema,
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
  updateCrewContract,
  updateCrewRequestSchema,
  updateCrewResponseSchema,
  updateCurrentUserContract,
  updateCurrentUserRequestSchema,
  updateCurrentUserResponseSchema,
  updatePostContract,
  updatePostRequestSchema,
  updatePostResponseSchema,
  updateReminderTimeZoneContract,
  updateReminderTimeZoneRequestSchema,
  updateUnverifiedAccountEmailContract,
  updateUnverifiedAccountEmailRequestSchema,
  upsertReminderSettingsContract,
  upsertReminderSettingsRequestSchema,
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
  userUpdateDbSchema,
  userWithNotificationsEnabledQueryDtoSchema,
  verifyEmailContract,
  verifyEmailRequestSchema,
  weeklyDataQueryDtoSchema,
  wholeUserWorkoutPlanQueryDtoSchema,
  workoutExerciseInputQueryDtoSchema,
  workoutPlanDbSchema,
  workoutPlanIdQueryDtoSchema,
  workoutScheduleDbSchema,
  workoutScheduleInputDtoSchema,
  workoutScheduleQueryDtoSchema,
  workoutSetDbSchema,
  workoutSplitDbSchema,
  workoutSplitIdQueryDtoSchema,
  workoutSplitLookupQueryDtoSchema,
  workoutSplitQueryDtoSchema,
  workoutSummaryDbSchema,
  workoutSummaryIdQueryDtoSchema
});
