var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/common/transport.schemas.ts
import { z } from "zod/v4";
var serializedDateSchema = z.string();
var timezoneSchema = z.string().trim().min(1).max(100).refine((timeZone) => {
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
import { z as z2 } from "zod/v4";
var aerobicEntrySchema = z2.object({
  durationMins: z2.number().int().min(0).max(10080),
  durationSec: z2.number().int().min(0).max(59),
  type: z2.string().trim().min(1).max(50)
}).refine((entry) => entry.durationMins > 0 || entry.durationSec > 0, {
  message: "Aerobic duration must be greater than zero"
});
var aerobicsDailyRecordSchema = z2.object({
  id: z2.number(),
  type: z2.string(),
  durationSec: z2.number(),
  durationMins: z2.number()
});
var aerobicsWeeklyRecordSchema = aerobicsDailyRecordSchema.extend({
  workoutTimeLocal: serializedDateSchema
});
var aerobicsWeeklyDataSchema = z2.object({
  records: z2.array(aerobicsWeeklyRecordSchema),
  totalDurationSec: z2.number(),
  totalDurationMins: z2.number()
});
var aerobicHistorySchema = z2.object({
  daily: z2.record(z2.string(), z2.array(aerobicsDailyRecordSchema)),
  weekly: z2.record(z2.string(), aerobicsWeeklyDataSchema)
});
var createAerobicEntryRequestSchema = z2.object({
  query: z2.object({
    tz: timezoneSchema.optional()
  }),
  body: z2.object({
    record: aerobicEntrySchema
  })
});
var createAerobicEntryResponseSchema = z2.void();
var createAerobicEntryContract = {
  request: createAerobicEntryRequestSchema,
  response: createAerobicEntryResponseSchema
};
var getAerobicHistoryRequestSchema = z2.object({
  query: z2.object({
    tz: timezoneSchema.optional()
  })
});
var getAerobicHistoryResponseSchema = aerobicHistorySchema;
var getAerobicHistoryContract = {
  request: getAerobicHistoryRequestSchema,
  response: getAerobicHistoryResponseSchema
};
var aerobicEntryIdParamsSchema = z2.object({
  id: z2.coerce.number().int().positive()
});
var updateAerobicEntryRequestSchema = z2.object({
  params: aerobicEntryIdParamsSchema,
  query: z2.object({
    tz: timezoneSchema.optional()
  }),
  body: z2.object({
    record: aerobicEntrySchema
  })
});
var updateAerobicEntryContract = {
  request: updateAerobicEntryRequestSchema,
  response: z2.void()
};
var deleteAerobicEntryRequestSchema = z2.object({
  params: aerobicEntryIdParamsSchema,
  query: z2.object({
    tz: timezoneSchema.optional()
  })
});
var deleteAerobicEntryContract = {
  request: deleteAerobicEntryRequestSchema,
  response: z2.void()
};

// src/modules/auth/password/password.contracts.ts
import { z as z3 } from "zod/v4";
var createPasswordResetRequestSchema = z3.object({
  body: z3.object({
    identifier: z3.string().trim().min(1).max(254)
  })
});
var createPasswordResetRequestContract = {
  request: createPasswordResetRequestSchema
};
var resetPasswordRequestSchema = z3.object({
  body: z3.object({
    newPassword: z3.string().min(8, "Password must be at least 8 characters long").max(128, "Password must be at most 128 characters long")
  }),
  query: z3.object({
    token: z3.string().min(1).max(16384).optional()
  })
});
var resetPasswordResponseSchema = z3.void();
var resetPasswordContract = {
  request: resetPasswordRequestSchema,
  response: resetPasswordResponseSchema
};

// src/modules/auth/session/session.contracts.ts
import { z as z4 } from "zod/v4";
var userIdSchema = z4.string().uuid();
var loginRequestSchema = z4.object({
  body: z4.object({
    identifier: z4.string().trim().min(3).max(254).refine((value) => z4.string().email().safeParse(value).success || /^[a-zA-Z0-9_]{3,20}$/.test(value), {
      message: "Must be a valid email or username"
    }),
    password: z4.string().min(1, "Username and password are required").max(128)
  })
});
var loginResponseSchema = z4.object({
  message: z4.string(),
  user: userIdSchema,
  accessToken: z4.string(),
  refreshToken: z4.string()
});
var loginContract = {
  request: loginRequestSchema,
  response: loginResponseSchema
};
var refreshTokenResponseSchema = z4.object({
  message: z4.string(),
  accessToken: z4.string(),
  refreshToken: z4.string(),
  userId: userIdSchema
});
var refreshTokenContract = {
  response: refreshTokenResponseSchema
};
var logoutResponseSchema = z4.object({
  message: z4.string()
});
var logoutContract = {
  response: logoutResponseSchema
};

// src/modules/auth/verification/verification.contracts.ts
import { z as z5 } from "zod/v4";
var usernameSchema = z5.string().trim().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "Invalid username");
var emailSchema = z5.string().trim().max(254).email("Invalid email");
var verifyEmailRequestSchema = z5.object({
  query: z5.object({
    token: z5.string().min(1).max(16384).optional()
  })
});
var verifyEmailContract = {
  request: verifyEmailRequestSchema
};
var createVerificationEmailRequestSchema = z5.object({
  body: z5.object({
    email: emailSchema
  })
});
var createVerificationEmailContract = {
  request: createVerificationEmailRequestSchema
};
var updateUnverifiedAccountEmailRequestSchema = z5.object({
  body: z5.object({
    username: usernameSchema,
    password: z5.string().min(1).max(128),
    newEmail: emailSchema
  })
});
var updateUnverifiedAccountEmailContract = {
  request: updateUnverifiedAccountEmailRequestSchema
};
var getVerificationStatusRequestSchema = z5.object({
  query: z5.object({
    username: usernameSchema
  })
});
var getVerificationStatusContract = {
  request: getVerificationStatusRequestSchema
};

// src/modules/exercises/exercises.contracts.ts
import { z as z6 } from "zod/v4";
var listExercisesResponseSchema = z6.record(z6.string(), z6.array(z6.object({
  id: z6.number().int(),
  name: z6.string(),
  specificTargetMuscle: z6.string()
})));
var listExercisesContract = {
  response: listExercisesResponseSchema
};

// src/modules/messages/messages.contracts.ts
import { z as z7 } from "zod/v4";
var listMessagesRequestSchema = z7.object({
  query: z7.object({
    tz: timezoneSchema
  })
});
var listMessagesResponseSchema = z7.object({
  messages: z7.array(z7.object({
    id: z7.string().uuid(),
    subject: z7.string(),
    msg: z7.string(),
    sentAt: serializedDateSchema,
    isRead: z7.boolean(),
    senderFullName: z7.string(),
    senderProfilePicPath: z7.string().nullable()
  }))
});
var listMessagesContract = {
  request: listMessagesRequestSchema,
  response: listMessagesResponseSchema
};
var markMessageAsReadRequestSchema = z7.object({
  params: z7.object({
    id: z7.string().uuid()
  })
});
var markMessageAsReadResponseSchema = z7.void();
var markMessageAsReadContract = {
  request: markMessageAsReadRequestSchema,
  response: markMessageAsReadResponseSchema
};
var deleteMessageRequestSchema = z7.object({
  params: z7.object({
    id: z7.string().uuid()
  })
});
var deleteMessageResponseSchema = z7.void();
var deleteMessageContract = {
  request: deleteMessageRequestSchema,
  response: deleteMessageResponseSchema
};

// src/modules/oauth/apple/apple.contracts.ts
import { z as z8 } from "zod/v4";
var appleNameInputSchema = z8.object({
  givenName: z8.string().trim().min(1).max(100).nullable(),
  familyName: z8.string().trim().min(1).max(100).nullable()
});
var appleOAuthRequestSchema = z8.object({
  body: z8.object({
    idToken: z8.string({
      error: "Missing or invalid Apple identityToken"
    }).min(1).max(2e4),
    rawNonce: z8.string().min(1).max(1024),
    name: appleNameInputSchema.optional(),
    email: z8.email().max(254).nullable()
  })
});
var appleOAuthContract = {
  request: appleOAuthRequestSchema
};

// src/modules/oauth/google/google.contracts.ts
import { z as z9 } from "zod/v4";
var googleOAuthRequestSchema = z9.object({
  body: z9.object({
    idToken: z9.string().min(1).max(2e4).optional()
  })
});
var googleOAuthContract = {
  request: googleOAuthRequestSchema
};

// src/modules/oauth/oauth.contracts.ts
import { z as z10 } from "zod/v4";
var oAuthLoginResponseSchema = z10.object({
  message: z10.string(),
  user: z10.string().uuid(),
  accessToken: z10.string(),
  refreshToken: z10.string()
});
var proceedLoginResponseSchema = loginResponseSchema;
var oAuthLoginContract = {
  response: oAuthLoginResponseSchema
};

// src/modules/reminders/reminders.contracts.ts
import { z as z11 } from "zod/v4";
var reminderSettingsSchema = z11.object({
  id: z11.string().uuid(),
  userId: z11.string().uuid(),
  reminderEnabled: z11.boolean(),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  timeZone: timezoneSchema
});
var getReminderSettingsResponseSchema = z11.object({
  reminderSettings: reminderSettingsSchema.nullable()
});
var getReminderSettingsContract = {
  response: getReminderSettingsResponseSchema
};
var upsertReminderSettingsRequestSchema = z11.object({
  body: z11.object({
    reminderEnabled: z11.boolean(),
    timeZone: timezoneSchema
  })
});
var upsertReminderSettingsContract = {
  request: upsertReminderSettingsRequestSchema,
  response: z11.void()
};
var updateReminderTimeZoneRequestSchema = z11.object({
  body: z11.object({
    timeZone: timezoneSchema
  })
});
var updateReminderTimeZoneContract = {
  request: updateReminderTimeZoneRequestSchema,
  response: z11.void()
};

// src/modules/user/create/create.contracts.ts
import { z as z12 } from "zod/v4";
var usernameSchema2 = z12.string().trim().min(1, "Full name is required").min(3, "Username must be at least 3 characters").max(15, "Username must be at most 15 characters").regex(/^[a-zA-Z0-9_]+$/, "Username may contain letters, numbers, and underscore only");
var fullNameSchema = z12.string().trim().max(20, "Full name is too long").regex(/^[a-zA-Z\s]+$/, "Full name may contain letters and spaces only");
var createUserRequestSchema = z12.object({
  body: z12.object({
    username: usernameSchema2,
    fullName: z12.preprocess((value) => value == null || typeof value === "string" && value.trim() === "" ? "User" : value, fullNameSchema),
    email: z12.string().trim().toLowerCase().max(254).email("Invalid email format"),
    password: z12.string().min(8, "Password must be at least 8 characters long").max(128, "Password must be at most 128 characters long"),
    gender: z12.preprocess((value) => value === "" || value == null ? "Unknown" : value, z12.enum([
      "Male",
      "Female",
      "Other",
      "Unknown"
    ]))
  })
});
var createUserUserSchema = z12.object({
  id: z12.string().uuid(),
  username: z12.string(),
  name: z12.string(),
  email: z12.string(),
  gender: z12.string(),
  role: z12.string(),
  createdAt: z12.string()
});
var createUserResponseSchema = z12.void();
var createUserContract = {
  request: createUserRequestSchema,
  response: createUserResponseSchema
};

// src/modules/user/push-tokens/push-tokens.contracts.ts
import { z as z13 } from "zod/v4";
var replacePushTokenRequestSchema = z13.object({
  body: z13.object({
    token: z13.string().trim().min(1).max(4096)
  })
});
var replacePushTokenContract = {
  request: replacePushTokenRequestSchema
};

// src/modules/user/update/update.contracts.ts
import { z as z14 } from "zod/v4";
var authenticatedUserForUpdateSchema = z14.object({
  username: z14.string().trim().min(3, "Username must be at least 3 characters").max(15, "Username must be at most 15 characters").regex(/^[a-zA-Z0-9_]+$/, "Username may contain letters, numbers, and underscore only").optional(),
  fullName: z14.string().trim().min(1, "Full name is required").max(20, "Full name is too long").regex(/^[a-zA-Z\s]+$/, "Full name may contain letters and spaces only").optional(),
  email: z14.string().trim().toLowerCase().max(254).email("Invalid email format").optional()
}).refine((input) => Object.values(input).some((value) => value !== void 0), {
  message: "At least one profile field must be provided"
});
var userDataSchema = z14.object({
  id: z14.string().uuid(),
  username: z14.string(),
  email: z14.string(),
  name: z14.string(),
  gender: z14.string(),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  profilePicPath: z14.string().nullable(),
  pushToken: z14.string().nullable(),
  role: z14.string(),
  isFirstLogin: z14.boolean(),
  tokenVersion: z14.number(),
  isVerified: z14.boolean(),
  authProvider: z14.string(),
  lastLogin: serializedDateSchema.nullable()
});
var updateCurrentUserRequestSchema = z14.object({
  body: authenticatedUserForUpdateSchema
});
var updateCurrentUserResponseSchema = z14.void();
var updateCurrentUserContract = {
  request: updateCurrentUserRequestSchema,
  response: updateCurrentUserResponseSchema
};
var confirmEmailChangeRequestSchema = z14.object({
  query: z14.object({
    token: z14.string().min(1).max(16384).optional()
  })
});
var confirmEmailChangeContract = {
  request: confirmEmailChangeRequestSchema
};
var userDataResponseSchema = z14.object({
  userData: userDataSchema
});
var userDataContract = {
  response: userDataResponseSchema
};
var getCurrentUserResponseSchema = userDataSchema;
var getCurrentUserContract = {
  response: getCurrentUserResponseSchema
};
var deleteProfilePictureRequestSchema = z14.object({
  body: z14.object({
    profilePicPath: z14.string().trim().min(1).max(2048)
  })
});
var deleteProfilePictureContract = {
  request: deleteProfilePictureRequestSchema
};
var replaceProfilePictureResponseSchema = z14.object({
  profilePicPath: z14.string(),
  url: z14.string(),
  message: z14.string()
});
var replaceProfilePictureContract = {
  response: replaceProfilePictureResponseSchema
};

// src/modules/video-analysis/video-analysis.contracts.ts
import { z as z15 } from "zod/v4";
var createVideoUploadUrlRequestSchema = z15.object({
  body: z15.object({
    exercise: z15.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/, "Invalid exercise name"),
    fileType: z15.enum([
      "video/mp4",
      "video/quicktime",
      "video/webm"
    ]),
    jobId: z15.string().trim().min(1).max(128)
  })
});
var createVideoUploadUrlResponseSchema = z15.object({
  uploadUrl: z15.string(),
  fileKey: z15.string(),
  requestId: z15.string()
});
var createVideoUploadUrlContract = {
  request: createVideoUploadUrlRequestSchema,
  response: createVideoUploadUrlResponseSchema
};
var enqueueAnalyzeVideoParamsDtoSchema = z15.object({
  fileKey: z15.string(),
  exercise: z15.string(),
  userId: z15.string().uuid(),
  requestId: z15.string(),
  sentryTrace: z15.string().optional(),
  baggage: z15.string().optional()
});
var analyzeVideoPayloadDtoSchema = enqueueAnalyzeVideoParamsDtoSchema.extend({
  expiresAt: z15.number()
});
var squatRepetitionDtoSchema = z15.object({
  depth: z15.object({
    value: z15.number(),
    status: z15.string(),
    confidence: z15.number()
  }),
  backLean: z15.object({
    value: z15.number(),
    excessive: z15.boolean(),
    confidence: z15.number()
  }),
  audit: z15.object({
    framesAnalyzed: z15.number(),
    validFrames: z15.number(),
    cameraAngle: z15.string(),
    rawBottomAngle: z15.number(),
    samplingRate: z15.string()
  })
});
var analyzeVideoResultPayloadDtoSchema = /* @__PURE__ */ __name((resultSchema) => z15.intersection(z15.object({
  jobId: z15.string(),
  userId: z15.string().uuid(),
  exercise: z15.string(),
  requestId: z15.string().optional()
}), z15.discriminatedUnion("status", [
  z15.object({
    status: z15.literal("completed"),
    result: z15.array(resultSchema),
    error: z15.null()
  }),
  z15.object({
    status: z15.literal("failed"),
    result: z15.null(),
    error: z15.string()
  })
])), "analyzeVideoResultPayloadDtoSchema");

// src/modules/web-sockets/web-sockets.contracts.ts
import { z as z16 } from "zod/v4";
var createWebSocketTicketRequestSchema = z16.object({
  body: z16.object({
    username: z16.string().trim().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, "Invalid username")
  })
});
var createWebSocketTicketResponseSchema = z16.object({
  ticket: z16.string()
});
var createWebSocketTicketContract = {
  request: createWebSocketTicketRequestSchema,
  response: createWebSocketTicketResponseSchema
};

// src/modules/workout/plan/plan.contracts.ts
import { z as z18 } from "zod/v4";

// src/modules/workout/plan/plan.dtos.ts
import { z as z17 } from "zod/v4";
var idSchema = z17.number().int().positive();
var uuidSchema = z17.string().uuid();
var textSchema = z17.string();
var booleanSchema = z17.boolean();
var numberSchema = z17.number().finite();
var orderIndexSchema = z17.number().int().nonnegative();
var repetitionsSchema = z17.number().int().min(1).max(1e4);
var workoutExerciseInputQueryDtoSchema = z17.object({
  exerciseId: idSchema,
  sets: z17.array(repetitionsSchema).min(1, "Each exercise must include at least one set").max(100, "An exercise cannot include more than 100 sets"),
  orderIndex: orderIndexSchema
});
var workoutSplitInputBaseQueryDtoSchema = z17.object({
  name: textSchema.trim().min(1, "Split name is required").max(100, "Split name must be at most 100 characters"),
  orderIndex: orderIndexSchema,
  exercises: z17.array(workoutExerciseInputQueryDtoSchema).min(1, "Each split must include at least one exercise").max(100, "A split cannot include more than 100 exercises").superRefine((exercises, context) => {
    const exerciseIds = /* @__PURE__ */ new Set();
    const orderIndexes = /* @__PURE__ */ new Set();
    exercises.forEach((exercise, index) => {
      if (exerciseIds.has(exercise.exerciseId)) context.addIssue({
        code: "custom",
        path: [
          index,
          "exerciseId"
        ],
        message: "Exercise IDs must be unique within a split"
      });
      if (orderIndexes.has(exercise.orderIndex)) context.addIssue({
        code: "custom",
        path: [
          index,
          "orderIndex"
        ],
        message: "Exercise order indexes must be unique within a split"
      });
      exerciseIds.add(exercise.exerciseId);
      orderIndexes.add(exercise.orderIndex);
    });
  })
});
var saveWorkoutSplitInputQueryDtoSchema = workoutSplitInputBaseQueryDtoSchema.extend({
  id: idSchema.optional()
});
var saveWorkoutSplitPayloadQueryDtoSchema = z17.array(saveWorkoutSplitInputQueryDtoSchema).min(1, "Workout must include at least one split").max(20, "A workout cannot include more than 20 splits").superRefine((splits, context) => {
  const ids = /* @__PURE__ */ new Set();
  const orderIndexes = /* @__PURE__ */ new Set();
  splits.forEach((split, index) => {
    if (split.id !== void 0) {
      if (ids.has(split.id)) context.addIssue({
        code: "custom",
        path: [
          index,
          "id"
        ],
        message: "Workout split IDs must be unique"
      });
      ids.add(split.id);
    }
    if (orderIndexes.has(split.orderIndex)) context.addIssue({
      code: "custom",
      path: [
        index,
        "orderIndex"
      ],
      message: "Workout split order indexes must be unique"
    });
    orderIndexes.add(split.orderIndex);
  });
});
var exerciseInPlanQueryDtoSchema = z17.object({
  exerciseToSplitId: idSchema,
  exerciseId: idSchema,
  name: textSchema,
  sets: z17.array(z17.object({
    orderIndex: numberSchema,
    reps: numberSchema
  })),
  orderIndex: numberSchema,
  isActive: booleanSchema,
  targetMuscle: textSchema,
  specificTargetMuscle: textSchema
});
var workoutSplitQueryDtoSchema = z17.object({
  id: idSchema,
  workoutId: idSchema,
  name: textSchema,
  orderIndex: numberSchema,
  createdAt: serializedDateSchema,
  muscleGroup: z17.string().nullable(),
  estimatedDurationMinutes: z17.number().nullable(),
  isActive: booleanSchema,
  exercises: z17.array(exerciseInPlanQueryDtoSchema)
});
var wholeUserWorkoutPlanQueryDtoSchema = z17.object({
  id: idSchema,
  numberOfSplits: z17.number(),
  createdAt: serializedDateSchema,
  userId: uuidSchema,
  isActive: booleanSchema,
  updatedAt: serializedDateSchema,
  workoutSplits: z17.array(workoutSplitQueryDtoSchema).nullable()
});

// src/modules/workout/plan/plan.contracts.ts
var getWorkoutPlanRequestSchema = z18.object({
  query: z18.object({
    tz: timezoneSchema.optional()
  })
});
var getWorkoutPlanResponseSchema = z18.object({
  workoutPlan: wholeUserWorkoutPlanQueryDtoSchema.nullable()
});
var getWorkoutPlanContract = {
  request: getWorkoutPlanRequestSchema,
  response: getWorkoutPlanResponseSchema
};
var replaceWorkoutPlanRequestSchema = z18.object({
  body: z18.object({
    workoutData: saveWorkoutSplitPayloadQueryDtoSchema,
    workoutName: z18.string().trim().min(1).max(100).optional(),
    tz: timezoneSchema
  })
});
var replaceWorkoutPlanResponseSchema = z18.void();
var replaceWorkoutPlanContract = {
  request: replaceWorkoutPlanRequestSchema,
  response: replaceWorkoutPlanResponseSchema
};

// src/modules/workout/tracking/tracking.contracts.ts
import { z as z20 } from "zod/v4";

// src/modules/workout/tracking/tracking.dtos.ts
import { z as z19 } from "zod/v4";
var exerciseDbSchema = {
  shape: {
    id: z19.number().int(),
    name: z19.string(),
    targetMuscle: z19.string(),
    specificTargetMuscle: z19.string()
  }
};
var exerciseToWorkoutSplitDbSchema = {
  shape: {
    id: z19.number().int(),
    orderIndex: z19.number(),
    isActive: z19.boolean()
  }
};
var exerciseTrackingDbSchema = {
  shape: {
    id: z19.number().int(),
    notes: z19.string().nullable(),
    exerciseToSplitId: z19.number().int().nullable(),
    exerciseId: z19.number().int().nullable()
  }
};
var trackingSetDbSchema = {
  shape: {
    reps: z19.number(),
    weight: z19.number(),
    setIndex: z19.number()
  }
};
var workoutSetDbSchema = {
  shape: {
    reps: z19.number()
  }
};
var workoutSplitDbSchema = {
  shape: {
    id: z19.number().int(),
    name: z19.string(),
    orderIndex: z19.number()
  }
};
var trackedSetQueryDtoSchema = z19.object({
  reps: trackingSetDbSchema.shape.reps.int().min(1).max(1e4),
  weight: trackingSetDbSchema.shape.weight.finite().nonnegative().max(1e5),
  setIndex: trackingSetDbSchema.shape.setIndex.int().nonnegative()
});
var finishedWorkoutEntryBaseQueryDtoSchema = z19.object({
  trackedSets: z19.array(trackedSetQueryDtoSchema).min(1, "Each exercise must include at least one tracked set").max(100, "An exercise cannot include more than 100 tracked sets").superRefine((sets, context) => {
    const indexes = /* @__PURE__ */ new Set();
    sets.forEach((set, index) => {
      if (indexes.has(set.setIndex)) context.addIssue({
        code: "custom",
        path: [
          index,
          "setIndex"
        ],
        message: "Set indexes must be unique"
      });
      indexes.add(set.setIndex);
    });
  }),
  notes: z19.string().trim().max(2e3).nullable().optional()
});
var finishedWorkoutEntryQueryDtoSchema = z19.discriminatedUnion("isExerciseAssignedToSplit", [
  finishedWorkoutEntryBaseQueryDtoSchema.extend({
    isExerciseAssignedToSplit: z19.literal(true),
    exerciseToSplitId: exerciseTrackingDbSchema.shape.exerciseToSplitId.unwrap().positive(),
    // Accepted temporarily for clients using the previous redundant payload.
    exerciseId: exerciseTrackingDbSchema.shape.exerciseId.unwrap().positive().optional()
  }),
  finishedWorkoutEntryBaseQueryDtoSchema.extend({
    isExerciseAssignedToSplit: z19.literal(false),
    exerciseToSplitId: z19.null().optional(),
    exerciseId: exerciseTrackingDbSchema.shape.exerciseId.unwrap().positive()
  })
]);
var exerciseMetadataQueryDtoSchema = z19.object({
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle
});
var exerciseTrackingPrMaxQueryDtoSchema = z19.object({
  exercise: exerciseDbSchema.shape.name,
  weight: trackingSetDbSchema.shape.weight,
  reps: trackingSetDbSchema.shape.reps,
  workoutTimeUtc: serializedDateSchema
});
var exerciseTrackingAnalysisQueryDtoSchema = z19.object({
  uniqueDays: z19.number(),
  mostFrequentSplit: z19.string().nullable(),
  mostFrequentSplitDays: z19.number().nullable(),
  lastWorkoutDate: z19.string().nullable(),
  splitDaysByName: z19.record(z19.string(), z19.number()),
  prs: z19.object({
    prMax: exerciseTrackingPrMaxQueryDtoSchema.nullable()
  })
});
var trackingMapItemQueryDtoSchema = z19.object({
  id: exerciseTrackingDbSchema.shape.id,
  exerciseToSplitId: exerciseToWorkoutSplitDbSchema.shape.id,
  weight: z19.array(trackingSetDbSchema.shape.weight),
  reps: z19.array(trackingSetDbSchema.shape.reps),
  notes: exerciseTrackingDbSchema.shape.notes,
  exerciseId: exerciseDbSchema.shape.id,
  workoutSplitId: workoutSplitDbSchema.shape.id,
  splitName: workoutSplitDbSchema.shape.name,
  exercise: exerciseDbSchema.shape.name,
  workoutDate: serializedDateSchema,
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
  exerciseToWorkoutSplit: z19.object({
    sets: z19.array(workoutSetDbSchema.shape.reps),
    exercises: exerciseMetadataQueryDtoSchema
  })
});
var trackingByDateItemQueryDtoSchema = trackingMapItemQueryDtoSchema.omit({
  workoutDate: true
});
var trackingBySplitNameItemQueryDtoSchema = trackingMapItemQueryDtoSchema.omit({
  splitName: true
});
var groupedTrackingItemQueryDtoSchema = z19.object({
  exerciseTracking: z19.object({
    exerciseTrackingId: exerciseTrackingDbSchema.shape.id,
    sets: z19.array(z19.object({
      setIndex: trackingSetDbSchema.shape.setIndex,
      weight: trackingSetDbSchema.shape.weight,
      reps: trackingSetDbSchema.shape.reps
    })),
    notes: exerciseTrackingDbSchema.shape.notes,
    exerciseAssignment: z19.object({
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
var personalRecordQueryDtoSchema = z19.object({
  exerciseToSplitId: exerciseTrackingDbSchema.shape.exerciseToSplitId,
  exerciseId: exerciseDbSchema.shape.id,
  exerciseName: exerciseDbSchema.shape.name,
  prWeight: trackingSetDbSchema.shape.weight,
  prReps: trackingSetDbSchema.shape.reps,
  prSetIndex: trackingSetDbSchema.shape.setIndex,
  estimatedOneRepMax: z19.number().nullable(),
  workoutStartLocal: serializedDateSchema
});
var personalRecordsQueryDtoSchema = z19.object({
  prs: z19.record(z19.string(), personalRecordQueryDtoSchema.omit({
    exerciseId: true
  }))
});
var nextSplitQueryDtoSchema = z19.object({
  id: workoutSplitDbSchema.shape.id,
  name: workoutSplitDbSchema.shape.name,
  orderIndex: workoutSplitDbSchema.shape.orderIndex,
  muscleGroup: z19.string().nullable()
});
var exerciseTrackingStatsQueryDtoSchema = z19.object({
  workoutCount: z19.coerce.number(),
  hasExerciseTracking: z19.boolean(),
  nextSplitByOrderIndex: nextSplitQueryDtoSchema.nullable(),
  workoutTargets: z19.object({
    workoutCountThisWeek: z19.coerce.number(),
    workoutCountScheduledPerWeek: z19.coerce.number()
  }),
  lastWorkoutStats: z19.object({
    workoutDate: z19.string().nullable(),
    workoutSplitName: workoutSplitDbSchema.shape.name.nullable(),
    exerciseTrackedCount: z19.coerce.number().nullable(),
    setTrackedCount: z19.coerce.number().nullable()
  }),
  latestPr: z19.array(personalRecordQueryDtoSchema).max(1)
});
var exerciseTrackingMapsQueryDtoSchema = z19.object({
  byDate: z19.record(z19.string(), z19.object({
    durationMins: z19.number(),
    exerciseTracked: z19.array(groupedTrackingItemQueryDtoSchema)
  }))
});
var exerciseHistoryQueryDtoSchema = z19.object({
  byExerciseToSplitId: z19.record(z19.string(), z19.object({
    exerciseTracked: z19.array(trackingByExerciseToSplitIdItemQueryDtoSchema)
  }))
});
var exerciseTrackingAndStatsQueryDtoSchema = z19.object({
  trackingStats: exerciseTrackingStatsQueryDtoSchema,
  trackingMaps: exerciseTrackingMapsQueryDtoSchema
});

// src/modules/workout/tracking/tracking.contracts.ts
var getWorkoutHistoryRequestSchema = z20.object({
  query: z20.object({
    tz: timezoneSchema.optional()
  })
});
var getWorkoutHistoryResponseSchema = exerciseTrackingMapsQueryDtoSchema;
var getWorkoutHistoryContract = {
  request: getWorkoutHistoryRequestSchema,
  response: getWorkoutHistoryResponseSchema
};
var getExerciseHistoryRequestSchema = z20.object({
  query: z20.object({
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
var createWorkoutSessionRequestSchema = z20.object({
  body: z20.object({
    workout: z20.array(finishedWorkoutEntryQueryDtoSchema).min(1, "Workout must include at least one exercise").max(200),
    tz: timezoneSchema.optional(),
    workoutStartUtc: z20.string().datetime({
      offset: true,
      message: "workoutStartUtc must be a valid ISO datetime"
    }),
    workoutEndUtc: z20.string().datetime({
      offset: true,
      message: "workoutEndUtc must be a valid ISO datetime"
    }).optional().nullable()
  }).refine((body) => !body.workoutEndUtc || Date.parse(body.workoutEndUtc) >= Date.parse(body.workoutStartUtc), {
    path: [
      "workoutEndUtc"
    ],
    message: "workoutEndUtc must not be earlier than workoutStartUtc"
  })
});
var createWorkoutSessionResponseSchema = z20.void();
var createWorkoutSessionContract = {
  request: createWorkoutSessionRequestSchema,
  response: createWorkoutSessionResponseSchema
};
var getPersonalRecordsResponseSchema = personalRecordsQueryDtoSchema;
var getPersonalRecordsRequestSchema = z20.object({
  query: z20.object({
    tz: timezoneSchema.optional()
  })
});
var getPersonalRecordsContract = {
  request: getPersonalRecordsRequestSchema,
  response: getPersonalRecordsResponseSchema
};

// src/modules/workout-schedule/workout-schedule.contracts.ts
import { z as z21 } from "zod/v4";
var workoutScheduleInputSchema = z21.object({
  workoutSplitId: z21.number().int().positive(),
  dayOfWeek: z21.number().int().min(0).max(6),
  startTime: z21.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/)
});
var workoutScheduleSchema = workoutScheduleInputSchema.extend({
  id: z21.string().uuid(),
  userId: z21.string().uuid(),
  startTime: z21.string(),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema
});
var getWorkoutSchedulesResponseSchema = z21.object({
  schedules: z21.array(workoutScheduleSchema)
});
var getWorkoutSchedulesContract = {
  response: getWorkoutSchedulesResponseSchema
};
var replaceWorkoutSchedulesRequestSchema = z21.object({
  body: z21.object({
    schedules: z21.array(workoutScheduleInputSchema).max(140, "A weekly schedule cannot contain more than 140 entries").superRefine((schedules, context) => {
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
  response: z21.void()
};

// src/modules/social/crews/crews.contracts.ts
import { z as z23 } from "zod/v4";

// src/modules/social/crews/crews.schemas.ts
import { z as z22 } from "zod/v4";
var crewSchema = z22.object({
  id: z22.string().uuid(),
  name: z22.string(),
  createdBy: z22.string().uuid(),
  privacy: z22.enum([
    "public",
    "private"
  ]),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema
});
var crewWithParticipantCountSchema = crewSchema.extend({
  participantCount: z22.number().int().nonnegative()
});
var crewParticipantPreviewSchema = z22.object({
  username: z22.string(),
  fullName: z22.string(),
  profilePicPath: z22.string().nullable()
});
var discoverableCrewSchema = crewWithParticipantCountSchema.extend({
  top5Participants: crewParticipantPreviewSchema.array()
});
var crewParticipantSchema = z22.object({
  id: z22.string().uuid(),
  crewId: z22.string().uuid(),
  userId: z22.string().uuid(),
  status: z22.enum([
    "active",
    "left",
    "removed",
    "banned"
  ]),
  role: z22.enum([
    "leader",
    "admin",
    "member"
  ]),
  joinedAt: serializedDateSchema,
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  fullName: z22.string(),
  profilePicPath: z22.string().nullable(),
  username: z22.string()
});

// src/modules/social/crews/crews.contracts.ts
var crewIdParamsSchema = z23.object({
  id: z23.string().uuid()
});
var crewNameSchema = z23.string().trim().min(1, "Crew name is required").max(100, "Crew name must be at most 100 characters");
var cursorSchema = z23.string().min(1).max(2048).optional();
var listCrewsRequestSchema = z23.object({
  query: z23.object({
    search: z23.string().trim().min(1).max(50).optional(),
    limit: z23.coerce.number().int().min(1).max(100).default(20),
    cursor: cursorSchema
  })
});
var listCrewsResponseSchema = z23.object({
  crews: z23.array(discoverableCrewSchema),
  nextCursor: z23.string().nullable()
});
var listCrewsContract = {
  request: listCrewsRequestSchema,
  response: listCrewsResponseSchema
};
var listMyCrewsRequestSchema = z23.object({
  query: z23.object({
    limit: z23.coerce.number().int().min(1).max(100).default(20),
    cursor: cursorSchema
  })
});
var listMyCrewsResponseSchema = listCrewsResponseSchema;
var listMyCrewsContract = {
  request: listMyCrewsRequestSchema,
  response: listMyCrewsResponseSchema
};
var listCrewParticipantsRequestSchema = z23.object({
  params: z23.object({
    crewId: z23.string().uuid()
  }),
  query: z23.object({
    limit: z23.coerce.number().int().min(1).max(100).default(20),
    cursor: cursorSchema
  })
});
var listCrewParticipantsResponseSchema = z23.object({
  participants: z23.array(crewParticipantSchema),
  nextCursor: z23.string().nullable()
});
var listCrewParticipantsContract = {
  request: listCrewParticipantsRequestSchema,
  response: listCrewParticipantsResponseSchema
};
var getCrewRequestSchema = z23.object({
  params: crewIdParamsSchema
});
var getCrewResponseSchema = crewWithParticipantCountSchema;
var getCrewContract = {
  request: getCrewRequestSchema,
  response: getCrewResponseSchema
};
var createCrewRequestSchema = z23.object({
  body: z23.object({
    name: crewNameSchema,
    privacy: z23.enum([
      "public",
      "private"
    ])
  })
});
var createCrewResponseSchema = z23.void();
var createCrewContract = {
  request: createCrewRequestSchema,
  response: createCrewResponseSchema
};
var updateCrewRequestSchema = z23.object({
  params: crewIdParamsSchema,
  body: z23.object({
    name: crewNameSchema,
    privacy: z23.enum([
      "public",
      "private"
    ])
  })
});
var updateCrewResponseSchema = z23.void();
var updateCrewContract = {
  request: updateCrewRequestSchema,
  response: updateCrewResponseSchema
};
var leaveCrewRequestSchema = z23.object({
  params: crewIdParamsSchema
});
var leaveCrewResponseSchema = z23.void();
var leaveCrewContract = {
  request: leaveCrewRequestSchema,
  response: leaveCrewResponseSchema
};
var deleteCrewRequestSchema = z23.object({
  params: crewIdParamsSchema
});
var deleteCrewResponseSchema = z23.void();
var deleteCrewContract = {
  request: deleteCrewRequestSchema,
  response: deleteCrewResponseSchema
};
var replaceCrewProfilePictureRequestSchema = z23.object({
  params: crewIdParamsSchema
});
var replaceCrewProfilePictureResponseSchema = z23.object({
  profilePicPath: z23.string(),
  url: z23.string(),
  message: z23.string()
});
var replaceCrewProfilePictureContract = {
  request: replaceCrewProfilePictureRequestSchema,
  response: replaceCrewProfilePictureResponseSchema
};
var deleteCrewProfilePictureRequestSchema = z23.object({
  params: crewIdParamsSchema
});
var deleteCrewProfilePictureContract = {
  request: deleteCrewProfilePictureRequestSchema,
  response: z23.void()
};

// src/modules/social/crews/requests/crew-requests.contracts.ts
import { z as z25 } from "zod/v4";

// src/modules/social/crews/requests/crew-requests.schemas.ts
import { z as z24 } from "zod/v4";
var crewParticipationRequestSchema = z24.object({
  id: z24.string().uuid(),
  crewId: z24.string().uuid(),
  initiatorUserId: z24.string().uuid(),
  participantUserId: z24.string().uuid(),
  status: z24.enum([
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
var crewParamsSchema = z25.object({
  crewId: z25.string().uuid()
});
var requestParamsSchema = z25.object({
  requestId: z25.uuid()
});
var inviteCrewUserRequestSchema = z25.object({
  params: crewParamsSchema,
  body: z25.object({
    userId: z25.uuid()
  })
});
var inviteCrewUserContract = {
  request: inviteCrewUserRequestSchema,
  response: z25.void()
};
var requestToJoinCrewRequestSchema = z25.object({
  params: crewParamsSchema
});
var requestToJoinCrewContract = {
  request: requestToJoinCrewRequestSchema,
  response: z25.void()
};
var updateCrewParticipationRequestStatusRequestSchema = z25.object({
  params: requestParamsSchema,
  body: z25.object({
    status: z25.enum([
      "accepted",
      "declined"
    ])
  })
});
var updateCrewParticipationRequestStatusContract = {
  request: updateCrewParticipationRequestStatusRequestSchema,
  response: z25.void()
};
var listCrewInvitationsRequestSchema = z25.object({});
var listCrewInvitationsResponseSchema = z25.object({
  invitations: z25.array(crewParticipationRequestSchema)
});
var listCrewInvitationsContract = {
  request: listCrewInvitationsRequestSchema,
  response: listCrewInvitationsResponseSchema
};
var listPendingCrewJoinRequestsRequestSchema = z25.object({
  params: crewParamsSchema
});
var listPendingCrewJoinRequestsResponseSchema = z25.object({
  requests: z25.array(crewParticipationRequestSchema)
});
var listPendingCrewJoinRequestsContract = {
  request: listPendingCrewJoinRequestsRequestSchema,
  response: listPendingCrewJoinRequestsResponseSchema
};

// src/modules/social/posts/posts.contracts.ts
import { z as z27 } from "zod/v4";

// src/modules/social/posts/posts.schemas.ts
import { z as z26 } from "zod/v4";
var postSchema = z26.object({
  id: z26.string().uuid(),
  authorUserId: z26.string().uuid(),
  workoutSummaryId: z26.string().uuid().nullable(),
  content: z26.string(),
  visibility: z26.enum([
    "crews_only",
    "public"
  ]),
  publishedAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  username: z26.string(),
  fullName: z26.string(),
  profilePicPath: z26.string().nullable(),
  interactions: z26.object({
    reactionsCount: z26.object({
      likesCount: z26.number().int().nonnegative(),
      fireUpCount: z26.number().int().nonnegative(),
      muscleCount: z26.number().int().nonnegative()
    }),
    commentsCount: z26.number().int().nonnegative()
  })
});

// src/modules/social/posts/posts.contracts.ts
var postIdParamsSchema = z27.object({
  id: z27.string().uuid()
});
var postContentSchema = z27.string().trim().min(1, "Post content is required").max(5e3, "Post content must be at most 5000 characters");
var postPaginationSchema = z27.object({
  limit: z27.coerce.number().int().min(1).max(100).default(20),
  cursor: z27.string().min(1).max(2048).optional()
});
var listVisiblePostsRequestSchema = z27.object({
  query: postPaginationSchema
});
var listVisiblePostsResponseSchema = z27.object({
  posts: z27.array(postSchema),
  nextCursor: z27.string().nullable()
});
var listVisiblePostsContract = {
  request: listVisiblePostsRequestSchema,
  response: listVisiblePostsResponseSchema
};
var listCrewPostsRequestSchema = z27.object({
  params: z27.object({
    crewId: z27.uuid()
  }),
  query: postPaginationSchema
});
var listCrewPostsResponseSchema = z27.object({
  posts: z27.array(postSchema),
  nextCursor: z27.string().nullable()
});
var listCrewPostsContract = {
  request: listCrewPostsRequestSchema,
  response: listCrewPostsResponseSchema
};
var createPostBodySchema = z27.object({
  content: postContentSchema,
  visibility: z27.enum([
    "crews_only",
    "public"
  ]),
  crewIds: z27.array(z27.uuid()).max(100, "A post cannot target more than 100 crews").default([]),
  workoutSummaryId: z27.string().uuid().nullable().optional()
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
var createPostRequestSchema = z27.object({
  body: createPostBodySchema
});
var createPostResponseSchema = z27.void();
var createPostContract = {
  request: createPostRequestSchema,
  response: createPostResponseSchema
};
var updatePostRequestSchema = z27.object({
  params: postIdParamsSchema,
  body: z27.object({
    content: postContentSchema
  })
});
var updatePostResponseSchema = z27.void();
var updatePostContract = {
  request: updatePostRequestSchema,
  response: updatePostResponseSchema
};
var deletePostRequestSchema = z27.object({
  params: postIdParamsSchema
});
var deletePostResponseSchema = z27.void();
var deletePostContract = {
  request: deletePostRequestSchema,
  response: deletePostResponseSchema
};

// src/modules/social/posts/comments/comments.contracts.ts
import { z as z29 } from "zod/v4";

// src/modules/social/posts/comments/comments.schemas.ts
import { z as z28 } from "zod/v4";
var commentSchema = z28.object({
  id: z28.string().uuid(),
  postId: z28.string().uuid(),
  userId: z28.string().uuid(),
  content: z28.string(),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  authorFullName: z28.string(),
  authorProfilePicPath: z28.string().nullable(),
  authorUsername: z28.string()
});

// src/modules/social/posts/comments/comments.contracts.ts
var postParamsSchema = z29.object({
  postId: z29.string().uuid()
});
var commentParamsSchema = z29.object({
  id: z29.string().uuid()
});
var commentContentSchema = z29.string().trim().min(1).max(2e3);
var listPostCommentsRequestSchema = z29.object({
  params: postParamsSchema,
  query: z29.object({
    limit: z29.coerce.number().int().min(1).max(100).default(20),
    cursor: z29.string().min(1).max(2048).optional()
  })
});
var listPostCommentsResponseSchema = z29.object({
  comments: z29.array(commentSchema),
  nextCursor: z29.string().nullable()
});
var listPostCommentsContract = {
  request: listPostCommentsRequestSchema,
  response: listPostCommentsResponseSchema
};
var addCommentRequestSchema = z29.object({
  params: postParamsSchema,
  body: z29.object({
    content: commentContentSchema
  })
});
var addCommentResponseSchema = z29.void();
var addCommentContract = {
  request: addCommentRequestSchema,
  response: addCommentResponseSchema
};
var editCommentRequestSchema = z29.object({
  params: commentParamsSchema,
  body: z29.object({
    content: commentContentSchema
  })
});
var editCommentResponseSchema = z29.void();
var editCommentContract = {
  request: editCommentRequestSchema,
  response: editCommentResponseSchema
};
var deleteCommentRequestSchema = z29.object({
  params: commentParamsSchema
});
var deleteCommentResponseSchema = z29.void();
var deleteCommentContract = {
  request: deleteCommentRequestSchema,
  response: deleteCommentResponseSchema
};

// src/modules/social/posts/reactions/reactions.contracts.ts
import { z as z31 } from "zod/v4";

// src/modules/social/posts/reactions/reactions.schemas.ts
import { z as z30 } from "zod/v4";
var reactionSchema = z30.object({
  id: z30.string().uuid(),
  postId: z30.string().uuid(),
  userId: z30.string().uuid(),
  type: z30.enum([
    "like",
    "fire up",
    "muscle"
  ]),
  reactedAt: serializedDateSchema
});

// src/modules/social/posts/reactions/reactions.contracts.ts
var postParamsSchema2 = z31.object({
  postId: z31.string().uuid()
});
var listPostReactionsRequestSchema = z31.object({
  params: postParamsSchema2,
  query: z31.object({
    limit: z31.coerce.number().int().min(1).max(100).default(20),
    cursor: z31.string().min(1).max(2048).optional()
  })
});
var listPostReactionsResponseSchema = z31.object({
  reactions: z31.array(reactionSchema),
  nextCursor: z31.string().nullable()
});
var listPostReactionsContract = {
  request: listPostReactionsRequestSchema,
  response: listPostReactionsResponseSchema
};
var reactToPostRequestSchema = z31.object({
  params: postParamsSchema2,
  body: z31.object({
    type: z31.enum([
      "like",
      "fire up",
      "muscle"
    ])
  })
});
var reactToPostResponseSchema = z31.void();
var reactToPostContract = {
  request: reactToPostRequestSchema,
  response: reactToPostResponseSchema
};
var deleteReactionRequestSchema = z31.object({
  params: postParamsSchema2
});
var deleteReactionResponseSchema = z31.void();
var deleteReactionContract = {
  request: deleteReactionRequestSchema,
  response: deleteReactionResponseSchema
};

// src/modules/social/summary/social-summary.contracts.ts
import { z as z32 } from "zod/v4";
var socialSummaryParticipantPreviewSchema = z32.object({
  userId: z32.string().uuid(),
  username: z32.string(),
  fullName: z32.string(),
  profilePicPath: z32.string().nullable()
});
var getSocialSummaryResponseSchema = z32.object({
  activeCrewCount: z32.number().int().nonnegative(),
  participantPreviews: socialSummaryParticipantPreviewSchema.array().max(3)
});
var getSocialSummaryContract = {
  response: getSocialSummaryResponseSchema
};

// src/modules/social/users/social-users.contracts.ts
import { z as z34 } from "zod/v4";

// src/modules/social/users/social-users.schemas.ts
import { z as z33 } from "zod/v4";
var socialUserSchema = z33.object({
  userId: z33.string().uuid(),
  username: z33.string(),
  fullName: z33.string(),
  profilePicPath: z33.string().nullable(),
  createdAt: serializedDateSchema
});

// src/modules/social/users/social-users.contracts.ts
var searchSocialUsersRequestSchema = z34.object({
  query: z34.object({
    search: z34.string().trim().min(1).max(50),
    limit: z34.coerce.number().int().min(1).max(100).default(20),
    cursor: z34.string().min(1).max(2048).optional()
  })
});
var searchSocialUsersResponseSchema = z34.object({
  users: z34.array(socialUserSchema),
  nextCursor: z34.string().nullable()
});
var searchSocialUsersContract = {
  request: searchSocialUsersRequestSchema,
  response: searchSocialUsersResponseSchema
};
var getSocialUserRequestSchema = z34.object({
  params: z34.object({
    userId: z34.string().uuid()
  })
});
var getSocialUserResponseSchema = socialUserSchema.omit({
  createdAt: true
});
var getSocialUserContract = {
  request: getSocialUserRequestSchema,
  response: getSocialUserResponseSchema
};
export {
  addCommentContract,
  addCommentRequestSchema,
  addCommentResponseSchema,
  analyzeVideoPayloadDtoSchema,
  analyzeVideoResultPayloadDtoSchema,
  appleOAuthContract,
  appleOAuthRequestSchema,
  confirmEmailChangeContract,
  confirmEmailChangeRequestSchema,
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
};
