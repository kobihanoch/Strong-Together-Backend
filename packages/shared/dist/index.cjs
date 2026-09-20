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
  addCommentContract: () => addCommentContract,
  addCommentRequestSchema: () => addCommentRequestSchema,
  addCommentResponseSchema: () => addCommentResponseSchema,
  analyzeVideoPayloadDtoSchema: () => analyzeVideoPayloadDtoSchema,
  analyzeVideoResultPayloadDtoSchema: () => analyzeVideoResultPayloadDtoSchema,
  appleOAuthContract: () => appleOAuthContract,
  appleOAuthRequestSchema: () => appleOAuthRequestSchema,
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
  deleteAerobicEntryContract: () => deleteAerobicEntryContract,
  deleteAerobicEntryRequestSchema: () => deleteAerobicEntryRequestSchema,
  deleteCommentContract: () => deleteCommentContract,
  deleteCommentRequestSchema: () => deleteCommentRequestSchema,
  deleteCommentResponseSchema: () => deleteCommentResponseSchema,
  deleteCrewContract: () => deleteCrewContract,
  deleteCrewProfilePictureContract: () => deleteCrewProfilePictureContract,
  deleteCrewProfilePictureRequestSchema: () => deleteCrewProfilePictureRequestSchema,
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
  editCommentContract: () => editCommentContract,
  editCommentRequestSchema: () => editCommentRequestSchema,
  editCommentResponseSchema: () => editCommentResponseSchema,
  enqueueAnalyzeVideoParamsDtoSchema: () => enqueueAnalyzeVideoParamsDtoSchema,
  getAerobicHistoryContract: () => getAerobicHistoryContract,
  getAerobicHistoryRequestSchema: () => getAerobicHistoryRequestSchema,
  getAerobicHistoryResponseSchema: () => getAerobicHistoryResponseSchema,
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
  getSocialSummaryContract: () => getSocialSummaryContract,
  getSocialSummaryResponseSchema: () => getSocialSummaryResponseSchema,
  getSocialUserContract: () => getSocialUserContract,
  getSocialUserRequestSchema: () => getSocialUserRequestSchema,
  getSocialUserResponseSchema: () => getSocialUserResponseSchema,
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
  inviteCrewUserContract: () => inviteCrewUserContract,
  inviteCrewUserRequestSchema: () => inviteCrewUserRequestSchema,
  leaveCrewContract: () => leaveCrewContract,
  leaveCrewRequestSchema: () => leaveCrewRequestSchema,
  leaveCrewResponseSchema: () => leaveCrewResponseSchema,
  listCrewInvitationsContract: () => listCrewInvitationsContract,
  listCrewInvitationsRequestSchema: () => listCrewInvitationsRequestSchema,
  listCrewInvitationsResponseSchema: () => listCrewInvitationsResponseSchema,
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
  listMyCrewsContract: () => listMyCrewsContract,
  listMyCrewsRequestSchema: () => listMyCrewsRequestSchema,
  listMyCrewsResponseSchema: () => listMyCrewsResponseSchema,
  listPendingCrewJoinRequestsContract: () => listPendingCrewJoinRequestsContract,
  listPendingCrewJoinRequestsRequestSchema: () => listPendingCrewJoinRequestsRequestSchema,
  listPendingCrewJoinRequestsResponseSchema: () => listPendingCrewJoinRequestsResponseSchema,
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
  oAuthLoginContract: () => oAuthLoginContract,
  oAuthLoginResponseSchema: () => oAuthLoginResponseSchema,
  proceedLoginResponseSchema: () => proceedLoginResponseSchema,
  reactToPostContract: () => reactToPostContract,
  reactToPostRequestSchema: () => reactToPostRequestSchema,
  reactToPostResponseSchema: () => reactToPostResponseSchema,
  refreshTokenContract: () => refreshTokenContract,
  refreshTokenResponseSchema: () => refreshTokenResponseSchema,
  replaceCrewProfilePictureContract: () => replaceCrewProfilePictureContract,
  replaceCrewProfilePictureRequestSchema: () => replaceCrewProfilePictureRequestSchema,
  replaceCrewProfilePictureResponseSchema: () => replaceCrewProfilePictureResponseSchema,
  replaceProfilePictureContract: () => replaceProfilePictureContract,
  replaceProfilePictureResponseSchema: () => replaceProfilePictureResponseSchema,
  replacePushTokenContract: () => replacePushTokenContract,
  replacePushTokenRequestSchema: () => replacePushTokenRequestSchema,
  replaceWorkoutPlanContract: () => replaceWorkoutPlanContract,
  replaceWorkoutPlanRequestSchema: () => replaceWorkoutPlanRequestSchema,
  replaceWorkoutPlanResponseSchema: () => replaceWorkoutPlanResponseSchema,
  replaceWorkoutSchedulesContract: () => replaceWorkoutSchedulesContract,
  replaceWorkoutSchedulesRequestSchema: () => replaceWorkoutSchedulesRequestSchema,
  requestToJoinCrewContract: () => requestToJoinCrewContract,
  requestToJoinCrewRequestSchema: () => requestToJoinCrewRequestSchema,
  resetPasswordContract: () => resetPasswordContract,
  resetPasswordRequestSchema: () => resetPasswordRequestSchema,
  resetPasswordResponseSchema: () => resetPasswordResponseSchema,
  searchSocialUsersContract: () => searchSocialUsersContract,
  searchSocialUsersRequestSchema: () => searchSocialUsersRequestSchema,
  searchSocialUsersResponseSchema: () => searchSocialUsersResponseSchema,
  serializedDateSchema: () => serializedDateSchema,
  socialSummaryParticipantPreviewSchema: () => socialSummaryParticipantPreviewSchema,
  squatRepetitionDtoSchema: () => squatRepetitionDtoSchema,
  timezoneSchema: () => timezoneSchema,
  updateAerobicEntryContract: () => updateAerobicEntryContract,
  updateAerobicEntryRequestSchema: () => updateAerobicEntryRequestSchema,
  updateCrewContract: () => updateCrewContract,
  updateCrewParticipationRequestStatusContract: () => updateCrewParticipationRequestStatusContract,
  updateCrewParticipationRequestStatusRequestSchema: () => updateCrewParticipationRequestStatusRequestSchema,
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
  userDataContract: () => userDataContract,
  userDataResponseSchema: () => userDataResponseSchema,
  verifyEmailContract: () => verifyEmailContract,
  verifyEmailRequestSchema: () => verifyEmailRequestSchema
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

// src/modules/aerobics/aerobics.contracts.ts
var import_v42 = require("zod/v4");
var aerobicEntrySchema = import_v42.z.object({
  durationMins: import_v42.z.number(),
  durationSec: import_v42.z.number(),
  type: import_v42.z.string()
});
var aerobicsDailyRecordSchema = import_v42.z.object({
  id: import_v42.z.number(),
  type: import_v42.z.string(),
  durationSec: import_v42.z.number(),
  durationMins: import_v42.z.number()
});
var aerobicsWeeklyRecordSchema = aerobicsDailyRecordSchema.extend({
  workoutTimeLocal: serializedDateSchema
});
var aerobicsWeeklyDataSchema = import_v42.z.object({
  records: import_v42.z.array(aerobicsWeeklyRecordSchema),
  totalDurationSec: import_v42.z.number(),
  totalDurationMins: import_v42.z.number()
});
var aerobicHistorySchema = import_v42.z.object({
  daily: import_v42.z.record(import_v42.z.string(), import_v42.z.array(aerobicsDailyRecordSchema)),
  weekly: import_v42.z.record(import_v42.z.string(), aerobicsWeeklyDataSchema)
});
var createAerobicEntryRequestSchema = import_v42.z.object({
  query: import_v42.z.object({
    tz: timezoneSchema.optional()
  }),
  body: import_v42.z.object({
    record: aerobicEntrySchema
  })
});
var createAerobicEntryResponseSchema = import_v42.z.void();
var createAerobicEntryContract = {
  request: createAerobicEntryRequestSchema,
  response: createAerobicEntryResponseSchema
};
var getAerobicHistoryRequestSchema = import_v42.z.object({
  query: import_v42.z.object({
    tz: timezoneSchema.optional()
  })
});
var getAerobicHistoryResponseSchema = aerobicHistorySchema;
var getAerobicHistoryContract = {
  request: getAerobicHistoryRequestSchema,
  response: getAerobicHistoryResponseSchema
};
var aerobicEntryIdParamsSchema = import_v42.z.object({
  id: import_v42.z.coerce.number().int().positive()
});
var updateAerobicEntryRequestSchema = import_v42.z.object({
  params: aerobicEntryIdParamsSchema,
  query: import_v42.z.object({
    tz: timezoneSchema.optional()
  }),
  body: import_v42.z.object({
    record: aerobicEntrySchema
  })
});
var updateAerobicEntryContract = {
  request: updateAerobicEntryRequestSchema,
  response: import_v42.z.void()
};
var deleteAerobicEntryRequestSchema = import_v42.z.object({
  params: aerobicEntryIdParamsSchema,
  query: import_v42.z.object({
    tz: timezoneSchema.optional()
  })
});
var deleteAerobicEntryContract = {
  request: deleteAerobicEntryRequestSchema,
  response: import_v42.z.void()
};

// src/modules/auth/password/password.contracts.ts
var import_v43 = require("zod/v4");
var createPasswordResetRequestSchema = import_v43.z.object({
  body: import_v43.z.object({
    identifier: import_v43.z.string()
  })
});
var createPasswordResetRequestContract = {
  request: createPasswordResetRequestSchema
};
var resetPasswordRequestSchema = import_v43.z.object({
  body: import_v43.z.object({
    newPassword: import_v43.z.string().min(8, "Password must be at least 8 characters long")
  }),
  query: import_v43.z.object({
    token: import_v43.z.string().optional()
  })
});
var resetPasswordResponseSchema = import_v43.z.void();
var resetPasswordContract = {
  request: resetPasswordRequestSchema,
  response: resetPasswordResponseSchema
};

// src/modules/auth/session/session.contracts.ts
var import_v44 = require("zod/v4");
var userIdSchema = import_v44.z.string().uuid();
var loginRequestSchema = import_v44.z.object({
  body: import_v44.z.object({
    identifier: import_v44.z.string().min(3).refine((value) => import_v44.z.string().email().safeParse(value).success || /^[a-zA-Z0-9_]{3,20}$/.test(value), {
      message: "Must be a valid email or username"
    }),
    password: import_v44.z.string().min(1, "Username and password are required")
  })
});
var loginResponseSchema = import_v44.z.object({
  message: import_v44.z.string(),
  user: userIdSchema,
  accessToken: import_v44.z.string(),
  refreshToken: import_v44.z.string()
});
var loginContract = {
  request: loginRequestSchema,
  response: loginResponseSchema
};
var refreshTokenResponseSchema = import_v44.z.object({
  message: import_v44.z.string(),
  accessToken: import_v44.z.string(),
  refreshToken: import_v44.z.string(),
  userId: userIdSchema
});
var refreshTokenContract = {
  response: refreshTokenResponseSchema
};
var logoutResponseSchema = import_v44.z.object({
  message: import_v44.z.string()
});
var logoutContract = {
  response: logoutResponseSchema
};

// src/modules/auth/verification/verification.contracts.ts
var import_v45 = require("zod/v4");
var usernameSchema = import_v45.z.string();
var emailSchema = import_v45.z.string().trim().email("Invalid email");
var verifyEmailRequestSchema = import_v45.z.object({
  query: import_v45.z.object({
    token: import_v45.z.string().optional()
  })
});
var verifyEmailContract = {
  request: verifyEmailRequestSchema
};
var createVerificationEmailRequestSchema = import_v45.z.object({
  body: import_v45.z.object({
    email: emailSchema
  })
});
var createVerificationEmailContract = {
  request: createVerificationEmailRequestSchema
};
var updateUnverifiedAccountEmailRequestSchema = import_v45.z.object({
  body: import_v45.z.object({
    username: usernameSchema,
    password: import_v45.z.string(),
    newEmail: emailSchema
  })
});
var updateUnverifiedAccountEmailContract = {
  request: updateUnverifiedAccountEmailRequestSchema
};
var getVerificationStatusRequestSchema = import_v45.z.object({
  query: import_v45.z.object({
    username: usernameSchema
  })
});
var getVerificationStatusContract = {
  request: getVerificationStatusRequestSchema
};

// src/modules/exercises/exercises.contracts.ts
var import_v46 = require("zod/v4");
var listExercisesResponseSchema = import_v46.z.record(import_v46.z.string(), import_v46.z.array(import_v46.z.object({
  id: import_v46.z.number().int(),
  name: import_v46.z.string(),
  specificTargetMuscle: import_v46.z.string()
})));
var listExercisesContract = {
  response: listExercisesResponseSchema
};

// src/modules/messages/messages.contracts.ts
var import_v47 = require("zod/v4");
var listMessagesRequestSchema = import_v47.z.object({
  query: import_v47.z.object({
    tz: timezoneSchema
  })
});
var listMessagesResponseSchema = import_v47.z.object({
  messages: import_v47.z.array(import_v47.z.object({
    id: import_v47.z.string().uuid(),
    subject: import_v47.z.string(),
    msg: import_v47.z.string(),
    sentAt: serializedDateSchema,
    isRead: import_v47.z.boolean(),
    senderFullName: import_v47.z.string(),
    senderProfilePicPath: import_v47.z.string().nullable()
  }))
});
var listMessagesContract = {
  request: listMessagesRequestSchema,
  response: listMessagesResponseSchema
};
var markMessageAsReadRequestSchema = import_v47.z.object({
  params: import_v47.z.object({
    id: import_v47.z.string().uuid()
  })
});
var markMessageAsReadResponseSchema = import_v47.z.void();
var markMessageAsReadContract = {
  request: markMessageAsReadRequestSchema,
  response: markMessageAsReadResponseSchema
};
var deleteMessageRequestSchema = import_v47.z.object({
  params: import_v47.z.object({
    id: import_v47.z.string().uuid()
  })
});
var deleteMessageResponseSchema = import_v47.z.void();
var deleteMessageContract = {
  request: deleteMessageRequestSchema,
  response: deleteMessageResponseSchema
};

// src/modules/oauth/apple/apple.contracts.ts
var import_v48 = require("zod/v4");
var appleNameInputSchema = import_v48.z.object({
  givenName: import_v48.z.string().nullable(),
  familyName: import_v48.z.string().nullable()
});
var appleOAuthRequestSchema = import_v48.z.object({
  body: import_v48.z.object({
    idToken: import_v48.z.string({
      error: "Missing or invalid Apple identityToken"
    }),
    rawNonce: import_v48.z.string(),
    name: appleNameInputSchema.optional(),
    email: import_v48.z.email().nullable()
  })
});
var appleOAuthContract = {
  request: appleOAuthRequestSchema
};

// src/modules/oauth/google/google.contracts.ts
var import_v49 = require("zod/v4");
var googleOAuthRequestSchema = import_v49.z.object({
  body: import_v49.z.object({
    idToken: import_v49.z.string().optional()
  })
});
var googleOAuthContract = {
  request: googleOAuthRequestSchema
};

// src/modules/oauth/oauth.contracts.ts
var import_v410 = require("zod/v4");
var oAuthLoginResponseSchema = import_v410.z.object({
  message: import_v410.z.string(),
  user: import_v410.z.string().uuid(),
  accessToken: import_v410.z.string(),
  refreshToken: import_v410.z.string()
});
var proceedLoginResponseSchema = loginResponseSchema;
var oAuthLoginContract = {
  response: oAuthLoginResponseSchema
};

// src/modules/reminders/reminders.contracts.ts
var import_v411 = require("zod/v4");
var reminderSettingsSchema = import_v411.z.object({
  id: import_v411.z.string().uuid(),
  userId: import_v411.z.string().uuid(),
  reminderEnabled: import_v411.z.boolean(),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  timeZone: timezoneSchema
});
var getReminderSettingsResponseSchema = import_v411.z.object({
  reminderSettings: reminderSettingsSchema.nullable()
});
var getReminderSettingsContract = {
  response: getReminderSettingsResponseSchema
};
var upsertReminderSettingsRequestSchema = import_v411.z.object({
  body: import_v411.z.object({
    reminderEnabled: import_v411.z.boolean(),
    timeZone: timezoneSchema
  })
});
var upsertReminderSettingsContract = {
  request: upsertReminderSettingsRequestSchema,
  response: import_v411.z.void()
};
var updateReminderTimeZoneRequestSchema = import_v411.z.object({
  body: import_v411.z.object({
    timeZone: timezoneSchema
  })
});
var updateReminderTimeZoneContract = {
  request: updateReminderTimeZoneRequestSchema,
  response: import_v411.z.void()
};

// src/modules/user/create/create.contracts.ts
var import_v412 = require("zod/v4");
var usernameSchema2 = import_v412.z.string().trim().min(3, "Username must be at least 3 characters").max(15, "Username must be at most 15 characters").regex(/^[a-zA-Z0-9_]+$/, "Username may contain letters, numbers, and underscore only");
var fullNameSchema = import_v412.z.string().trim().max(20, "Full name is too long").regex(/^[a-zA-Z\s]+$/, "Full name may contain letters and spaces only");
var createUserRequestSchema = import_v412.z.object({
  body: import_v412.z.object({
    username: usernameSchema2,
    fullName: import_v412.z.preprocess((value) => value == null || typeof value === "string" && value.trim() === "" ? "User" : value, fullNameSchema),
    email: import_v412.z.string().trim().toLowerCase().email("Invalid email format"),
    password: import_v412.z.string().min(8, "Password must be at least 8 characters long"),
    gender: import_v412.z.preprocess((value) => value === "" || value == null ? "Unknown" : value, import_v412.z.enum([
      "Male",
      "Female",
      "Other",
      "Unknown"
    ]))
  })
});
var createUserUserSchema = import_v412.z.object({
  id: import_v412.z.string().uuid(),
  username: import_v412.z.string(),
  name: import_v412.z.string(),
  email: import_v412.z.string(),
  gender: import_v412.z.string(),
  role: import_v412.z.string(),
  createdAt: import_v412.z.string()
});
var createUserResponseSchema = import_v412.z.void();
var createUserContract = {
  request: createUserRequestSchema,
  response: createUserResponseSchema
};

// src/modules/user/push-tokens/push-tokens.contracts.ts
var import_v413 = require("zod/v4");
var replacePushTokenRequestSchema = import_v413.z.object({
  body: import_v413.z.object({
    token: import_v413.z.string()
  })
});
var replacePushTokenContract = {
  request: replacePushTokenRequestSchema
};

// src/modules/user/update/update.contracts.ts
var import_v414 = require("zod/v4");
var authenticatedUserForUpdateSchema = import_v414.z.object({
  username: import_v414.z.string().trim().min(3, "Username must be at least 3 characters").max(15, "Username must be at most 15 characters").regex(/^[a-zA-Z0-9_]+$/, "Username may contain letters, numbers, and underscore only").optional(),
  fullName: import_v414.z.string().trim().min(1, "Full name is required").max(20, "Full name is too long").regex(/^[a-zA-Z\s]+$/, "Full name may contain letters and spaces only").optional(),
  email: import_v414.z.string().trim().toLowerCase().email("Invalid email format").optional()
});
var userDataSchema = import_v414.z.object({
  id: import_v414.z.string().uuid(),
  username: import_v414.z.string(),
  email: import_v414.z.string(),
  name: import_v414.z.string(),
  gender: import_v414.z.string(),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  profilePicPath: import_v414.z.string().nullable(),
  pushToken: import_v414.z.string().nullable(),
  role: import_v414.z.string(),
  isFirstLogin: import_v414.z.boolean(),
  tokenVersion: import_v414.z.number(),
  isVerified: import_v414.z.boolean(),
  authProvider: import_v414.z.string(),
  lastLogin: serializedDateSchema.nullable()
});
var updateCurrentUserRequestSchema = import_v414.z.object({
  body: authenticatedUserForUpdateSchema
});
var updateCurrentUserResponseSchema = import_v414.z.void();
var updateCurrentUserContract = {
  request: updateCurrentUserRequestSchema,
  response: updateCurrentUserResponseSchema
};
var userDataResponseSchema = import_v414.z.object({
  userData: userDataSchema
});
var userDataContract = {
  response: userDataResponseSchema
};
var getCurrentUserResponseSchema = userDataSchema;
var getCurrentUserContract = {
  response: getCurrentUserResponseSchema
};
var deleteProfilePictureRequestSchema = import_v414.z.object({
  body: import_v414.z.object({
    profilePicPath: import_v414.z.string()
  })
});
var deleteProfilePictureContract = {
  request: deleteProfilePictureRequestSchema
};
var replaceProfilePictureResponseSchema = import_v414.z.object({
  profilePicPath: import_v414.z.string(),
  url: import_v414.z.string(),
  message: import_v414.z.string()
});
var replaceProfilePictureContract = {
  response: replaceProfilePictureResponseSchema
};

// src/modules/video-analysis/video-analysis.contracts.ts
var import_v415 = require("zod/v4");
var createVideoUploadUrlRequestSchema = import_v415.z.object({
  body: import_v415.z.object({
    exercise: import_v415.z.string(),
    fileType: import_v415.z.string(),
    jobId: import_v415.z.string()
  })
});
var createVideoUploadUrlResponseSchema = import_v415.z.object({
  uploadUrl: import_v415.z.string(),
  fileKey: import_v415.z.string(),
  requestId: import_v415.z.string()
});
var createVideoUploadUrlContract = {
  request: createVideoUploadUrlRequestSchema,
  response: createVideoUploadUrlResponseSchema
};
var enqueueAnalyzeVideoParamsDtoSchema = import_v415.z.object({
  fileKey: import_v415.z.string(),
  exercise: import_v415.z.string(),
  userId: import_v415.z.string().uuid(),
  requestId: import_v415.z.string(),
  sentryTrace: import_v415.z.string().optional(),
  baggage: import_v415.z.string().optional()
});
var analyzeVideoPayloadDtoSchema = enqueueAnalyzeVideoParamsDtoSchema.extend({
  expiresAt: import_v415.z.number()
});
var squatRepetitionDtoSchema = import_v415.z.object({
  depth: import_v415.z.object({
    value: import_v415.z.number(),
    status: import_v415.z.string(),
    confidence: import_v415.z.number()
  }),
  backLean: import_v415.z.object({
    value: import_v415.z.number(),
    excessive: import_v415.z.boolean(),
    confidence: import_v415.z.number()
  }),
  audit: import_v415.z.object({
    framesAnalyzed: import_v415.z.number(),
    validFrames: import_v415.z.number(),
    cameraAngle: import_v415.z.string(),
    rawBottomAngle: import_v415.z.number(),
    samplingRate: import_v415.z.string()
  })
});
var analyzeVideoResultPayloadDtoSchema = /* @__PURE__ */ __name((resultSchema) => import_v415.z.intersection(import_v415.z.object({
  jobId: import_v415.z.string(),
  userId: import_v415.z.string().uuid(),
  exercise: import_v415.z.string(),
  requestId: import_v415.z.string().optional()
}), import_v415.z.discriminatedUnion("status", [
  import_v415.z.object({
    status: import_v415.z.literal("completed"),
    result: import_v415.z.array(resultSchema),
    error: import_v415.z.null()
  }),
  import_v415.z.object({
    status: import_v415.z.literal("failed"),
    result: import_v415.z.null(),
    error: import_v415.z.string()
  })
])), "analyzeVideoResultPayloadDtoSchema");

// src/modules/web-sockets/web-sockets.contracts.ts
var import_v416 = require("zod/v4");
var createWebSocketTicketRequestSchema = import_v416.z.object({
  body: import_v416.z.object({
    username: import_v416.z.string()
  })
});
var createWebSocketTicketResponseSchema = import_v416.z.object({
  ticket: import_v416.z.string()
});
var createWebSocketTicketContract = {
  request: createWebSocketTicketRequestSchema,
  response: createWebSocketTicketResponseSchema
};

// src/modules/workout/plan/plan.contracts.ts
var import_v418 = require("zod/v4");

// src/modules/workout/plan/plan.dtos.ts
var import_v417 = require("zod/v4");
var idSchema = import_v417.z.number().int();
var uuidSchema = import_v417.z.string().uuid();
var textSchema = import_v417.z.string();
var booleanSchema = import_v417.z.boolean();
var numberSchema = import_v417.z.number();
var workoutExerciseInputQueryDtoSchema = import_v417.z.object({
  exerciseId: idSchema,
  sets: import_v417.z.array(numberSchema),
  orderIndex: numberSchema
});
var workoutSplitInputBaseQueryDtoSchema = import_v417.z.object({
  name: textSchema.min(1, "Split name is required"),
  orderIndex: import_v417.z.number().int().nonnegative(),
  exercises: import_v417.z.array(workoutExerciseInputQueryDtoSchema).min(1, "Each split must include at least one exercise")
});
var saveWorkoutSplitInputQueryDtoSchema = workoutSplitInputBaseQueryDtoSchema.extend({
  id: idSchema.optional()
});
var saveWorkoutSplitPayloadQueryDtoSchema = import_v417.z.array(saveWorkoutSplitInputQueryDtoSchema).min(1, "Workout must include at least one split");
var exerciseInPlanQueryDtoSchema = import_v417.z.object({
  exerciseToSplitId: idSchema,
  exerciseId: idSchema,
  name: textSchema,
  sets: import_v417.z.array(import_v417.z.object({
    orderIndex: numberSchema,
    reps: numberSchema
  })),
  orderIndex: numberSchema,
  isActive: booleanSchema,
  targetMuscle: textSchema,
  specificTargetMuscle: textSchema
});
var workoutSplitQueryDtoSchema = import_v417.z.object({
  id: idSchema,
  workoutId: idSchema,
  name: textSchema,
  orderIndex: numberSchema,
  createdAt: serializedDateSchema,
  muscleGroup: import_v417.z.string().nullable(),
  estimatedDurationMinutes: import_v417.z.number().nullable(),
  isActive: booleanSchema,
  exercises: import_v417.z.array(exerciseInPlanQueryDtoSchema)
});
var wholeUserWorkoutPlanQueryDtoSchema = import_v417.z.object({
  id: idSchema,
  numberOfSplits: import_v417.z.number(),
  createdAt: serializedDateSchema,
  userId: uuidSchema,
  isActive: booleanSchema,
  updatedAt: serializedDateSchema,
  workoutSplits: import_v417.z.array(workoutSplitQueryDtoSchema).nullable()
});

// src/modules/workout/plan/plan.contracts.ts
var getWorkoutPlanRequestSchema = import_v418.z.object({
  query: import_v418.z.object({
    tz: timezoneSchema.optional()
  })
});
var getWorkoutPlanResponseSchema = import_v418.z.object({
  workoutPlan: wholeUserWorkoutPlanQueryDtoSchema.nullable()
});
var getWorkoutPlanContract = {
  request: getWorkoutPlanRequestSchema,
  response: getWorkoutPlanResponseSchema
};
var replaceWorkoutPlanRequestSchema = import_v418.z.object({
  body: import_v418.z.object({
    workoutData: saveWorkoutSplitPayloadQueryDtoSchema,
    workoutName: import_v418.z.string().optional(),
    tz: timezoneSchema
  })
});
var replaceWorkoutPlanResponseSchema = import_v418.z.void();
var replaceWorkoutPlanContract = {
  request: replaceWorkoutPlanRequestSchema,
  response: replaceWorkoutPlanResponseSchema
};

// src/modules/workout/tracking/tracking.contracts.ts
var import_v420 = require("zod/v4");

// src/modules/workout/tracking/tracking.dtos.ts
var import_v419 = require("zod/v4");
var exerciseDbSchema = {
  shape: {
    id: import_v419.z.number().int(),
    name: import_v419.z.string(),
    targetMuscle: import_v419.z.string(),
    specificTargetMuscle: import_v419.z.string()
  }
};
var exerciseToWorkoutSplitDbSchema = {
  shape: {
    id: import_v419.z.number().int(),
    orderIndex: import_v419.z.number(),
    isActive: import_v419.z.boolean()
  }
};
var exerciseTrackingDbSchema = {
  shape: {
    id: import_v419.z.number().int(),
    notes: import_v419.z.string().nullable(),
    exerciseToSplitId: import_v419.z.number().int().nullable(),
    exerciseId: import_v419.z.number().int().nullable()
  }
};
var trackingSetDbSchema = {
  shape: {
    reps: import_v419.z.number(),
    weight: import_v419.z.number(),
    setIndex: import_v419.z.number()
  }
};
var workoutSetDbSchema = {
  shape: {
    reps: import_v419.z.number()
  }
};
var workoutSplitDbSchema = {
  shape: {
    id: import_v419.z.number().int(),
    name: import_v419.z.string(),
    orderIndex: import_v419.z.number()
  }
};
var trackedSetQueryDtoSchema = import_v419.z.object({
  reps: trackingSetDbSchema.shape.reps,
  weight: trackingSetDbSchema.shape.weight,
  setIndex: trackingSetDbSchema.shape.setIndex
});
var finishedWorkoutEntryBaseQueryDtoSchema = import_v419.z.object({
  trackedSets: import_v419.z.array(trackedSetQueryDtoSchema),
  notes: exerciseTrackingDbSchema.shape.notes.optional()
});
var finishedWorkoutEntryQueryDtoSchema = import_v419.z.discriminatedUnion("isExerciseAssignedToSplit", [
  finishedWorkoutEntryBaseQueryDtoSchema.extend({
    isExerciseAssignedToSplit: import_v419.z.literal(true),
    exerciseToSplitId: exerciseTrackingDbSchema.shape.exerciseToSplitId.unwrap(),
    // Accepted temporarily for clients using the previous redundant payload.
    exerciseId: exerciseTrackingDbSchema.shape.exerciseId.optional()
  }),
  finishedWorkoutEntryBaseQueryDtoSchema.extend({
    isExerciseAssignedToSplit: import_v419.z.literal(false),
    exerciseToSplitId: import_v419.z.null().optional(),
    exerciseId: exerciseTrackingDbSchema.shape.exerciseId.unwrap()
  })
]);
var exerciseMetadataQueryDtoSchema = import_v419.z.object({
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var exerciseTrackingPrMaxQueryDtoSchema = import_v419.z.object({
  exercise: exerciseDbSchema.shape.name,
  weight: trackingSetDbSchema.shape.weight,
  reps: trackingSetDbSchema.shape.reps,
  workoutTimeUtc: serializedDateSchema
});
var exerciseTrackingAnalysisQueryDtoSchema = import_v419.z.object({
  uniqueDays: import_v419.z.number(),
  mostFrequentSplit: import_v419.z.string().nullable(),
  mostFrequentSplitDays: import_v419.z.number().nullable(),
  lastWorkoutDate: import_v419.z.string().nullable(),
  splitDaysByName: import_v419.z.record(import_v419.z.string(), import_v419.z.number()),
  prs: import_v419.z.object({
    prMax: exerciseTrackingPrMaxQueryDtoSchema.nullable()
  })
});
var trackingMapItemQueryDtoSchema = import_v419.z.object({
  id: exerciseTrackingDbSchema.shape.id,
  exerciseToSplitId: exerciseToWorkoutSplitDbSchema.shape.id,
  weight: import_v419.z.array(trackingSetDbSchema.shape.weight),
  reps: import_v419.z.array(trackingSetDbSchema.shape.reps),
  notes: exerciseTrackingDbSchema.shape.notes,
  exerciseId: exerciseDbSchema.shape.id,
  workoutSplitId: workoutSplitDbSchema.shape.id,
  splitName: workoutSplitDbSchema.shape.name,
  exercise: exerciseDbSchema.shape.name,
  workoutDate: serializedDateSchema,
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
  exerciseToWorkoutSplit: import_v419.z.object({
    sets: import_v419.z.array(workoutSetDbSchema.shape.reps),
    exercises: exerciseMetadataQueryDtoSchema
  })
});
var trackingByDateItemQueryDtoSchema = trackingMapItemQueryDtoSchema.omit({
  workoutDate: true
});
var trackingBySplitNameItemQueryDtoSchema = trackingMapItemQueryDtoSchema.omit({
  splitName: true
});
var groupedTrackingItemQueryDtoSchema = import_v419.z.object({
  exerciseTracking: import_v419.z.object({
    exerciseTrackingId: exerciseTrackingDbSchema.shape.id,
    sets: import_v419.z.array(import_v419.z.object({
      setIndex: trackingSetDbSchema.shape.setIndex,
      weight: trackingSetDbSchema.shape.weight,
      reps: trackingSetDbSchema.shape.reps
    })),
    notes: exerciseTrackingDbSchema.shape.notes,
    exerciseAssignment: import_v419.z.object({
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
var personalRecordQueryDtoSchema = import_v419.z.object({
  exerciseToSplitId: exerciseTrackingDbSchema.shape.exerciseToSplitId,
  exerciseId: exerciseDbSchema.shape.id,
  exerciseName: exerciseDbSchema.shape.name,
  prWeight: trackingSetDbSchema.shape.weight,
  prReps: trackingSetDbSchema.shape.reps,
  prSetIndex: trackingSetDbSchema.shape.setIndex,
  estimatedOneRepMax: import_v419.z.number().nullable(),
  workoutStartLocal: serializedDateSchema
});
var personalRecordsQueryDtoSchema = import_v419.z.object({
  prs: import_v419.z.record(import_v419.z.string(), personalRecordQueryDtoSchema.omit({
    exerciseId: true
  }))
});
var nextSplitQueryDtoSchema = import_v419.z.object({
  id: workoutSplitDbSchema.shape.id,
  name: workoutSplitDbSchema.shape.name,
  orderIndex: workoutSplitDbSchema.shape.orderIndex,
  muscleGroup: import_v419.z.string().nullable()
});
var exerciseTrackingStatsQueryDtoSchema = import_v419.z.object({
  workoutCount: import_v419.z.coerce.number(),
  hasExerciseTracking: import_v419.z.boolean(),
  nextSplitByOrderIndex: nextSplitQueryDtoSchema.nullable(),
  workoutTargets: import_v419.z.object({
    workoutCountThisWeek: import_v419.z.coerce.number(),
    workoutCountScheduledPerWeek: import_v419.z.coerce.number()
  }),
  lastWorkoutStats: import_v419.z.object({
    workoutDate: import_v419.z.string().nullable(),
    workoutSplitName: workoutSplitDbSchema.shape.name.nullable(),
    exerciseTrackedCount: import_v419.z.coerce.number().nullable(),
    setTrackedCount: import_v419.z.coerce.number().nullable()
  }),
  latestPr: import_v419.z.array(personalRecordQueryDtoSchema).max(1)
});
var exerciseTrackingMapsQueryDtoSchema = import_v419.z.object({
  byDate: import_v419.z.record(import_v419.z.string(), import_v419.z.object({
    durationMins: import_v419.z.number(),
    exerciseTracked: import_v419.z.array(groupedTrackingItemQueryDtoSchema)
  }))
});
var exerciseHistoryQueryDtoSchema = import_v419.z.object({
  byExerciseToSplitId: import_v419.z.record(import_v419.z.string(), import_v419.z.object({
    exerciseTracked: import_v419.z.array(trackingByExerciseToSplitIdItemQueryDtoSchema)
  }))
});
var exerciseTrackingAndStatsQueryDtoSchema = import_v419.z.object({
  trackingStats: exerciseTrackingStatsQueryDtoSchema,
  trackingMaps: exerciseTrackingMapsQueryDtoSchema
});

// src/modules/workout/tracking/tracking.contracts.ts
var getWorkoutHistoryRequestSchema = import_v420.z.object({
  query: import_v420.z.object({
    tz: timezoneSchema.optional()
  })
});
var getWorkoutHistoryResponseSchema = exerciseTrackingMapsQueryDtoSchema;
var getWorkoutHistoryContract = {
  request: getWorkoutHistoryRequestSchema,
  response: getWorkoutHistoryResponseSchema
};
var getExerciseHistoryRequestSchema = import_v420.z.object({
  query: import_v420.z.object({
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
var createWorkoutSessionRequestSchema = import_v420.z.object({
  body: import_v420.z.object({
    workout: import_v420.z.array(finishedWorkoutEntryQueryDtoSchema),
    tz: timezoneSchema.optional(),
    workoutStartUtc: import_v420.z.string().datetime("workoutStartUtc must be a valid ISO datetime"),
    workoutEndUtc: import_v420.z.string().datetime("workoutEndUtc must be a valid ISO datetime").optional().nullable()
  })
});
var createWorkoutSessionResponseSchema = import_v420.z.void();
var createWorkoutSessionContract = {
  request: createWorkoutSessionRequestSchema,
  response: createWorkoutSessionResponseSchema
};
var getPersonalRecordsResponseSchema = personalRecordsQueryDtoSchema;
var getPersonalRecordsRequestSchema = import_v420.z.object({
  query: import_v420.z.object({
    tz: timezoneSchema.optional()
  })
});
var getPersonalRecordsContract = {
  request: getPersonalRecordsRequestSchema,
  response: getPersonalRecordsResponseSchema
};

// src/modules/workout-schedule/workout-schedule.contracts.ts
var import_v421 = require("zod/v4");
var workoutScheduleInputSchema = import_v421.z.object({
  workoutSplitId: import_v421.z.number().int(),
  dayOfWeek: import_v421.z.number().int().min(0).max(6),
  startTime: import_v421.z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/)
});
var workoutScheduleSchema = workoutScheduleInputSchema.extend({
  id: import_v421.z.string().uuid(),
  userId: import_v421.z.string().uuid(),
  startTime: import_v421.z.string(),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema
});
var getWorkoutSchedulesResponseSchema = import_v421.z.object({
  schedules: import_v421.z.array(workoutScheduleSchema)
});
var getWorkoutSchedulesContract = {
  response: getWorkoutSchedulesResponseSchema
};
var replaceWorkoutSchedulesRequestSchema = import_v421.z.object({
  body: import_v421.z.object({
    schedules: import_v421.z.array(workoutScheduleInputSchema).superRefine((schedules, context) => {
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
  response: import_v421.z.void()
};

// src/modules/social/crews/crews.contracts.ts
var import_v423 = require("zod/v4");

// src/modules/social/crews/crews.schemas.ts
var import_v422 = require("zod/v4");
var crewSchema = import_v422.z.object({
  id: import_v422.z.string().uuid(),
  name: import_v422.z.string(),
  createdBy: import_v422.z.string().uuid(),
  privacy: import_v422.z.enum([
    "public",
    "private"
  ]),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema
});
var crewWithParticipantCountSchema = crewSchema.extend({
  participantCount: import_v422.z.number().int().nonnegative()
});
var crewParticipantPreviewSchema = import_v422.z.object({
  username: import_v422.z.string(),
  fullName: import_v422.z.string(),
  profilePicPath: import_v422.z.string().nullable()
});
var discoverableCrewSchema = crewWithParticipantCountSchema.extend({
  top5Participants: crewParticipantPreviewSchema.array()
});
var crewParticipantSchema = import_v422.z.object({
  id: import_v422.z.string().uuid(),
  crewId: import_v422.z.string().uuid(),
  userId: import_v422.z.string().uuid(),
  status: import_v422.z.enum([
    "active",
    "left",
    "removed",
    "banned"
  ]),
  role: import_v422.z.enum([
    "leader",
    "admin",
    "member"
  ]),
  joinedAt: serializedDateSchema,
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  fullName: import_v422.z.string(),
  profilePicPath: import_v422.z.string().nullable(),
  username: import_v422.z.string()
});

// src/modules/social/crews/crews.contracts.ts
var crewIdParamsSchema = import_v423.z.object({
  id: import_v423.z.string().uuid()
});
var listCrewsRequestSchema = import_v423.z.object({
  query: import_v423.z.object({
    search: import_v423.z.string().trim().min(1).max(50).optional(),
    limit: import_v423.z.coerce.number().int().min(1).max(100).default(20),
    cursor: import_v423.z.string().min(1).optional()
  })
});
var listCrewsResponseSchema = import_v423.z.object({
  crews: import_v423.z.array(discoverableCrewSchema),
  nextCursor: import_v423.z.string().nullable()
});
var listCrewsContract = {
  request: listCrewsRequestSchema,
  response: listCrewsResponseSchema
};
var listMyCrewsRequestSchema = import_v423.z.object({
  query: import_v423.z.object({
    limit: import_v423.z.coerce.number().int().min(1).max(100).default(20),
    cursor: import_v423.z.string().min(1).optional()
  })
});
var listMyCrewsResponseSchema = listCrewsResponseSchema;
var listMyCrewsContract = {
  request: listMyCrewsRequestSchema,
  response: listMyCrewsResponseSchema
};
var listCrewParticipantsRequestSchema = import_v423.z.object({
  params: import_v423.z.object({
    crewId: import_v423.z.string().uuid()
  }),
  query: import_v423.z.object({
    limit: import_v423.z.coerce.number().int().min(1).max(100).default(20),
    cursor: import_v423.z.string().min(1).optional()
  })
});
var listCrewParticipantsResponseSchema = import_v423.z.object({
  participants: import_v423.z.array(crewParticipantSchema),
  nextCursor: import_v423.z.string().nullable()
});
var listCrewParticipantsContract = {
  request: listCrewParticipantsRequestSchema,
  response: listCrewParticipantsResponseSchema
};
var getCrewRequestSchema = import_v423.z.object({
  params: crewIdParamsSchema
});
var getCrewResponseSchema = crewWithParticipantCountSchema;
var getCrewContract = {
  request: getCrewRequestSchema,
  response: getCrewResponseSchema
};
var createCrewRequestSchema = import_v423.z.object({
  body: import_v423.z.object({
    name: import_v423.z.string(),
    privacy: import_v423.z.enum([
      "public",
      "private"
    ])
  })
});
var createCrewResponseSchema = import_v423.z.void();
var createCrewContract = {
  request: createCrewRequestSchema,
  response: createCrewResponseSchema
};
var updateCrewRequestSchema = import_v423.z.object({
  params: crewIdParamsSchema,
  body: import_v423.z.object({
    name: import_v423.z.string(),
    privacy: import_v423.z.enum([
      "public",
      "private"
    ])
  })
});
var updateCrewResponseSchema = import_v423.z.void();
var updateCrewContract = {
  request: updateCrewRequestSchema,
  response: updateCrewResponseSchema
};
var leaveCrewRequestSchema = import_v423.z.object({
  params: crewIdParamsSchema
});
var leaveCrewResponseSchema = import_v423.z.void();
var leaveCrewContract = {
  request: leaveCrewRequestSchema,
  response: leaveCrewResponseSchema
};
var deleteCrewRequestSchema = import_v423.z.object({
  params: crewIdParamsSchema
});
var deleteCrewResponseSchema = import_v423.z.void();
var deleteCrewContract = {
  request: deleteCrewRequestSchema,
  response: deleteCrewResponseSchema
};
var replaceCrewProfilePictureRequestSchema = import_v423.z.object({
  params: crewIdParamsSchema
});
var replaceCrewProfilePictureResponseSchema = import_v423.z.object({
  profilePicPath: import_v423.z.string(),
  url: import_v423.z.string(),
  message: import_v423.z.string()
});
var replaceCrewProfilePictureContract = {
  request: replaceCrewProfilePictureRequestSchema,
  response: replaceCrewProfilePictureResponseSchema
};
var deleteCrewProfilePictureRequestSchema = import_v423.z.object({
  params: crewIdParamsSchema
});
var deleteCrewProfilePictureContract = {
  request: deleteCrewProfilePictureRequestSchema,
  response: import_v423.z.void()
};

// src/modules/social/crews/requests/crew-requests.contracts.ts
var import_v425 = require("zod/v4");

// src/modules/social/crews/requests/crew-requests.schemas.ts
var import_v424 = require("zod/v4");
var crewParticipationRequestSchema = import_v424.z.object({
  id: import_v424.z.string().uuid(),
  crewId: import_v424.z.string().uuid(),
  initiatorUserId: import_v424.z.string().uuid(),
  participantUserId: import_v424.z.string().uuid(),
  status: import_v424.z.enum([
    "pending",
    "accepted",
    "declined",
    "cancelled",
    "expired"
  ]),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  respondedAt: serializedDateSchema.nullable()
});

// src/modules/social/crews/requests/crew-requests.contracts.ts
var crewParamsSchema = import_v425.z.object({
  crewId: import_v425.z.string().uuid()
});
var requestParamsSchema = import_v425.z.object({
  requestId: import_v425.z.uuid()
});
var inviteCrewUserRequestSchema = import_v425.z.object({
  params: crewParamsSchema,
  body: import_v425.z.object({
    userId: import_v425.z.uuid()
  })
});
var inviteCrewUserContract = {
  request: inviteCrewUserRequestSchema,
  response: import_v425.z.void()
};
var requestToJoinCrewRequestSchema = import_v425.z.object({
  params: crewParamsSchema
});
var requestToJoinCrewContract = {
  request: requestToJoinCrewRequestSchema,
  response: import_v425.z.void()
};
var updateCrewParticipationRequestStatusRequestSchema = import_v425.z.object({
  params: requestParamsSchema,
  body: import_v425.z.object({
    status: import_v425.z.enum([
      "accepted",
      "declined"
    ])
  })
});
var updateCrewParticipationRequestStatusContract = {
  request: updateCrewParticipationRequestStatusRequestSchema,
  response: import_v425.z.void()
};
var listCrewInvitationsRequestSchema = import_v425.z.object({});
var listCrewInvitationsResponseSchema = import_v425.z.object({
  invitations: import_v425.z.array(crewParticipationRequestSchema)
});
var listCrewInvitationsContract = {
  request: listCrewInvitationsRequestSchema,
  response: listCrewInvitationsResponseSchema
};
var listPendingCrewJoinRequestsRequestSchema = import_v425.z.object({
  params: crewParamsSchema
});
var listPendingCrewJoinRequestsResponseSchema = import_v425.z.object({
  requests: import_v425.z.array(crewParticipationRequestSchema)
});
var listPendingCrewJoinRequestsContract = {
  request: listPendingCrewJoinRequestsRequestSchema,
  response: listPendingCrewJoinRequestsResponseSchema
};

// src/modules/social/posts/posts.contracts.ts
var import_v427 = require("zod/v4");

// src/modules/social/posts/posts.schemas.ts
var import_v426 = require("zod/v4");
var postSchema = import_v426.z.object({
  id: import_v426.z.string().uuid(),
  authorUserId: import_v426.z.string().uuid(),
  workoutSummaryId: import_v426.z.string().uuid().nullable(),
  content: import_v426.z.string(),
  visibility: import_v426.z.enum([
    "crews_only",
    "public"
  ]),
  publishedAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  username: import_v426.z.string(),
  fullName: import_v426.z.string(),
  profilePicPath: import_v426.z.string().nullable(),
  interactions: import_v426.z.object({
    reactionsCount: import_v426.z.object({
      likesCount: import_v426.z.number().int().nonnegative(),
      fireUpCount: import_v426.z.number().int().nonnegative(),
      muscleCount: import_v426.z.number().int().nonnegative()
    }),
    commentsCount: import_v426.z.number().int().nonnegative()
  })
});

// src/modules/social/posts/posts.contracts.ts
var postIdParamsSchema = import_v427.z.object({
  id: import_v427.z.string().uuid()
});
var postPaginationSchema = import_v427.z.object({
  limit: import_v427.z.coerce.number().int().min(1).max(100).default(20),
  cursor: import_v427.z.string().min(1).optional()
});
var listVisiblePostsRequestSchema = import_v427.z.object({
  query: postPaginationSchema
});
var listVisiblePostsResponseSchema = import_v427.z.object({
  posts: import_v427.z.array(postSchema),
  nextCursor: import_v427.z.string().nullable()
});
var listVisiblePostsContract = {
  request: listVisiblePostsRequestSchema,
  response: listVisiblePostsResponseSchema
};
var listCrewPostsRequestSchema = import_v427.z.object({
  params: import_v427.z.object({
    crewId: import_v427.z.uuid()
  }),
  query: postPaginationSchema
});
var listCrewPostsResponseSchema = import_v427.z.object({
  posts: import_v427.z.array(postSchema),
  nextCursor: import_v427.z.string().nullable()
});
var listCrewPostsContract = {
  request: listCrewPostsRequestSchema,
  response: listCrewPostsResponseSchema
};
var createPostBodySchema = import_v427.z.object({
  content: import_v427.z.string(),
  visibility: import_v427.z.enum([
    "crews_only",
    "public"
  ]),
  crewIds: import_v427.z.array(import_v427.z.uuid()).default([]),
  workoutSummaryId: import_v427.z.string().uuid().nullable().optional()
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
var createPostRequestSchema = import_v427.z.object({
  body: createPostBodySchema
});
var createPostResponseSchema = import_v427.z.void();
var createPostContract = {
  request: createPostRequestSchema,
  response: createPostResponseSchema
};
var updatePostRequestSchema = import_v427.z.object({
  params: postIdParamsSchema,
  body: import_v427.z.object({
    content: import_v427.z.string()
  })
});
var updatePostResponseSchema = import_v427.z.void();
var updatePostContract = {
  request: updatePostRequestSchema,
  response: updatePostResponseSchema
};
var deletePostRequestSchema = import_v427.z.object({
  params: postIdParamsSchema
});
var deletePostResponseSchema = import_v427.z.void();
var deletePostContract = {
  request: deletePostRequestSchema,
  response: deletePostResponseSchema
};

// src/modules/social/posts/comments/comments.contracts.ts
var import_v429 = require("zod/v4");

// src/modules/social/posts/comments/comments.schemas.ts
var import_v428 = require("zod/v4");
var commentSchema = import_v428.z.object({
  id: import_v428.z.string().uuid(),
  postId: import_v428.z.string().uuid(),
  userId: import_v428.z.string().uuid(),
  content: import_v428.z.string(),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  authorFullName: import_v428.z.string(),
  authorProfilePicPath: import_v428.z.string().nullable(),
  authorUsername: import_v428.z.string()
});

// src/modules/social/posts/comments/comments.contracts.ts
var postParamsSchema = import_v429.z.object({
  postId: import_v429.z.string().uuid()
});
var commentParamsSchema = import_v429.z.object({
  id: import_v429.z.string().uuid()
});
var commentContentSchema = import_v429.z.string().trim().min(1).max(2e3);
var listPostCommentsRequestSchema = import_v429.z.object({
  params: postParamsSchema,
  query: import_v429.z.object({
    limit: import_v429.z.coerce.number().int().min(1).max(100).default(20),
    cursor: import_v429.z.string().min(1).optional()
  })
});
var listPostCommentsResponseSchema = import_v429.z.object({
  comments: import_v429.z.array(commentSchema),
  nextCursor: import_v429.z.string().nullable()
});
var listPostCommentsContract = {
  request: listPostCommentsRequestSchema,
  response: listPostCommentsResponseSchema
};
var addCommentRequestSchema = import_v429.z.object({
  params: postParamsSchema,
  body: import_v429.z.object({
    content: commentContentSchema
  })
});
var addCommentResponseSchema = import_v429.z.void();
var addCommentContract = {
  request: addCommentRequestSchema,
  response: addCommentResponseSchema
};
var editCommentRequestSchema = import_v429.z.object({
  params: commentParamsSchema,
  body: import_v429.z.object({
    content: commentContentSchema
  })
});
var editCommentResponseSchema = import_v429.z.void();
var editCommentContract = {
  request: editCommentRequestSchema,
  response: editCommentResponseSchema
};
var deleteCommentRequestSchema = import_v429.z.object({
  params: commentParamsSchema
});
var deleteCommentResponseSchema = import_v429.z.void();
var deleteCommentContract = {
  request: deleteCommentRequestSchema,
  response: deleteCommentResponseSchema
};

// src/modules/social/posts/reactions/reactions.contracts.ts
var import_v431 = require("zod/v4");

// src/modules/social/posts/reactions/reactions.schemas.ts
var import_v430 = require("zod/v4");
var reactionSchema = import_v430.z.object({
  id: import_v430.z.string().uuid(),
  postId: import_v430.z.string().uuid(),
  userId: import_v430.z.string().uuid(),
  type: import_v430.z.enum([
    "like",
    "fire up",
    "muscle"
  ]),
  reactedAt: serializedDateSchema
});

// src/modules/social/posts/reactions/reactions.contracts.ts
var postParamsSchema2 = import_v431.z.object({
  postId: import_v431.z.string().uuid()
});
var listPostReactionsRequestSchema = import_v431.z.object({
  params: postParamsSchema2,
  query: import_v431.z.object({
    limit: import_v431.z.coerce.number().int().min(1).max(100).default(20),
    cursor: import_v431.z.string().min(1).optional()
  })
});
var listPostReactionsResponseSchema = import_v431.z.object({
  reactions: import_v431.z.array(reactionSchema),
  nextCursor: import_v431.z.string().nullable()
});
var listPostReactionsContract = {
  request: listPostReactionsRequestSchema,
  response: listPostReactionsResponseSchema
};
var reactToPostRequestSchema = import_v431.z.object({
  params: postParamsSchema2,
  body: import_v431.z.object({
    type: import_v431.z.enum([
      "like",
      "fire up",
      "muscle"
    ])
  })
});
var reactToPostResponseSchema = import_v431.z.void();
var reactToPostContract = {
  request: reactToPostRequestSchema,
  response: reactToPostResponseSchema
};
var deleteReactionRequestSchema = import_v431.z.object({
  params: postParamsSchema2
});
var deleteReactionResponseSchema = import_v431.z.void();
var deleteReactionContract = {
  request: deleteReactionRequestSchema,
  response: deleteReactionResponseSchema
};

// src/modules/social/summary/social-summary.contracts.ts
var import_v432 = require("zod/v4");
var socialSummaryParticipantPreviewSchema = import_v432.z.object({
  userId: import_v432.z.string().uuid(),
  username: import_v432.z.string(),
  fullName: import_v432.z.string(),
  profilePicPath: import_v432.z.string().nullable()
});
var getSocialSummaryResponseSchema = import_v432.z.object({
  activeCrewCount: import_v432.z.number().int().nonnegative(),
  participantPreviews: socialSummaryParticipantPreviewSchema.array().max(3)
});
var getSocialSummaryContract = {
  response: getSocialSummaryResponseSchema
};

// src/modules/social/users/social-users.contracts.ts
var import_v434 = require("zod/v4");

// src/modules/social/users/social-users.schemas.ts
var import_v433 = require("zod/v4");
var socialUserSchema = import_v433.z.object({
  userId: import_v433.z.string().uuid(),
  username: import_v433.z.string(),
  fullName: import_v433.z.string(),
  profilePicPath: import_v433.z.string().nullable(),
  createdAt: serializedDateSchema
});

// src/modules/social/users/social-users.contracts.ts
var searchSocialUsersRequestSchema = import_v434.z.object({
  query: import_v434.z.object({
    search: import_v434.z.string().trim().min(1).max(50),
    limit: import_v434.z.coerce.number().int().min(1).max(100).default(20),
    cursor: import_v434.z.string().min(1).optional()
  })
});
var searchSocialUsersResponseSchema = import_v434.z.object({
  users: import_v434.z.array(socialUserSchema),
  nextCursor: import_v434.z.string().nullable()
});
var searchSocialUsersContract = {
  request: searchSocialUsersRequestSchema,
  response: searchSocialUsersResponseSchema
};
var getSocialUserRequestSchema = import_v434.z.object({
  params: import_v434.z.object({
    userId: import_v434.z.string().uuid()
  })
});
var getSocialUserResponseSchema = socialUserSchema.omit({
  createdAt: true
});
var getSocialUserContract = {
  request: getSocialUserRequestSchema,
  response: getSocialUserResponseSchema
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addCommentContract,
  addCommentRequestSchema,
  addCommentResponseSchema,
  analyzeVideoPayloadDtoSchema,
  analyzeVideoResultPayloadDtoSchema,
  appleOAuthContract,
  appleOAuthRequestSchema,
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
  deleteAerobicEntryContract,
  deleteAerobicEntryRequestSchema,
  deleteCommentContract,
  deleteCommentRequestSchema,
  deleteCommentResponseSchema,
  deleteCrewContract,
  deleteCrewProfilePictureContract,
  deleteCrewProfilePictureRequestSchema,
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
  editCommentContract,
  editCommentRequestSchema,
  editCommentResponseSchema,
  enqueueAnalyzeVideoParamsDtoSchema,
  getAerobicHistoryContract,
  getAerobicHistoryRequestSchema,
  getAerobicHistoryResponseSchema,
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
  getSocialSummaryContract,
  getSocialSummaryResponseSchema,
  getSocialUserContract,
  getSocialUserRequestSchema,
  getSocialUserResponseSchema,
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
  inviteCrewUserContract,
  inviteCrewUserRequestSchema,
  leaveCrewContract,
  leaveCrewRequestSchema,
  leaveCrewResponseSchema,
  listCrewInvitationsContract,
  listCrewInvitationsRequestSchema,
  listCrewInvitationsResponseSchema,
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
  listMyCrewsContract,
  listMyCrewsRequestSchema,
  listMyCrewsResponseSchema,
  listPendingCrewJoinRequestsContract,
  listPendingCrewJoinRequestsRequestSchema,
  listPendingCrewJoinRequestsResponseSchema,
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
  oAuthLoginContract,
  oAuthLoginResponseSchema,
  proceedLoginResponseSchema,
  reactToPostContract,
  reactToPostRequestSchema,
  reactToPostResponseSchema,
  refreshTokenContract,
  refreshTokenResponseSchema,
  replaceCrewProfilePictureContract,
  replaceCrewProfilePictureRequestSchema,
  replaceCrewProfilePictureResponseSchema,
  replaceProfilePictureContract,
  replaceProfilePictureResponseSchema,
  replacePushTokenContract,
  replacePushTokenRequestSchema,
  replaceWorkoutPlanContract,
  replaceWorkoutPlanRequestSchema,
  replaceWorkoutPlanResponseSchema,
  replaceWorkoutSchedulesContract,
  replaceWorkoutSchedulesRequestSchema,
  requestToJoinCrewContract,
  requestToJoinCrewRequestSchema,
  resetPasswordContract,
  resetPasswordRequestSchema,
  resetPasswordResponseSchema,
  searchSocialUsersContract,
  searchSocialUsersRequestSchema,
  searchSocialUsersResponseSchema,
  serializedDateSchema,
  socialSummaryParticipantPreviewSchema,
  squatRepetitionDtoSchema,
  timezoneSchema,
  updateAerobicEntryContract,
  updateAerobicEntryRequestSchema,
  updateCrewContract,
  updateCrewParticipationRequestStatusContract,
  updateCrewParticipationRequestStatusRequestSchema,
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
  userDataContract,
  userDataResponseSchema,
  verifyEmailContract,
  verifyEmailRequestSchema
});
