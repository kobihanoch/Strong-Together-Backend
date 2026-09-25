import { z } from 'zod/v4';

/** Represents the request schema value. */
type RequestSchema = z.ZodObject<{
    body?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
}>;
/** Represents the contract value. */
type Contract = {
    request: RequestSchema;
    response?: z.ZodTypeAny;
} | {
    request?: RequestSchema;
    response: z.ZodTypeAny;
};
/** Represents the request of value. */
type RequestOf<TContract extends Contract> = TContract extends {
    request: infer TRequest extends RequestSchema;
} ? z.infer<TRequest> : never;
/** Represents the body of value. */
type BodyOf<TContract extends Contract> = RequestOf<TContract> extends {
    body: infer TBody;
} ? TBody : never;
/** Represents the query of value. */
type QueryOf<TContract extends Contract> = RequestOf<TContract> extends {
    query: infer TQuery;
} ? TQuery : never;
/** Represents the params of value. */
type ParamsOf<TContract extends Contract> = RequestOf<TContract> extends {
    params: infer TParams;
} ? TParams : never;
/** Represents the response of value. */
type ResponseOf<TContract extends Contract> = TContract extends {
    response: infer TResponse extends z.ZodTypeAny;
} ? z.infer<TResponse> : never;

/** ISO or PostgreSQL-rendered timestamp transported as JSON text. */
declare const serializedDateSchema: z.ZodString;
/** Valid IANA timezone identifier accepted at API boundaries. */
declare const timezoneSchema: z.ZodString;

declare const createAerobicEntryRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    body: z.ZodObject<{
        record: z.ZodObject<{
            durationMins: z.ZodNumber;
            durationSec: z.ZodNumber;
            type: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const createAerobicEntryResponseSchema: z.ZodVoid;
declare const createAerobicEntryContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        body: z.ZodObject<{
            record: z.ZodObject<{
                durationMins: z.ZodNumber;
                durationSec: z.ZodNumber;
                type: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
declare const getAerobicHistoryRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getAerobicHistoryResponseSchema: z.ZodObject<{
    daily: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        type: z.ZodString;
        durationSec: z.ZodNumber;
        durationMins: z.ZodNumber;
    }, z.core.$strip>>>;
    weekly: z.ZodRecord<z.ZodString, z.ZodObject<{
        records: z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
            type: z.ZodString;
            durationSec: z.ZodNumber;
            durationMins: z.ZodNumber;
            workoutTimeLocal: z.ZodString;
        }, z.core.$strip>>;
        totalDurationSec: z.ZodNumber;
        totalDurationMins: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const getAerobicHistoryContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        daily: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
            type: z.ZodString;
            durationSec: z.ZodNumber;
            durationMins: z.ZodNumber;
        }, z.core.$strip>>>;
        weekly: z.ZodRecord<z.ZodString, z.ZodObject<{
            records: z.ZodArray<z.ZodObject<{
                id: z.ZodNumber;
                type: z.ZodString;
                durationSec: z.ZodNumber;
                durationMins: z.ZodNumber;
                workoutTimeLocal: z.ZodString;
            }, z.core.$strip>>;
            totalDurationSec: z.ZodNumber;
            totalDurationMins: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
declare const updateAerobicEntryRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>;
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    body: z.ZodObject<{
        record: z.ZodObject<{
            durationMins: z.ZodNumber;
            durationSec: z.ZodNumber;
            type: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const updateAerobicEntryContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodCoercedNumber<unknown>;
        }, z.core.$strip>;
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        body: z.ZodObject<{
            record: z.ZodObject<{
                durationMins: z.ZodNumber;
                durationSec: z.ZodNumber;
                type: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
declare const deleteAerobicEntryRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>;
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const deleteAerobicEntryContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodCoercedNumber<unknown>;
        }, z.core.$strip>;
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Represents the create aerobic entry body value. */
type CreateAerobicEntryBody = BodyOf<typeof createAerobicEntryContract>;
/** Represents the create aerobic entry query value. */
type CreateAerobicEntryQuery = QueryOf<typeof createAerobicEntryContract>;
/** Represents the get aerobic history query value. */
type GetAerobicHistoryQuery = QueryOf<typeof getAerobicHistoryContract>;
/** Represents the get aerobic history response value. */
type GetAerobicHistoryResponse = ResponseOf<typeof getAerobicHistoryContract>;
/** Represents the update aerobic entry body value. */
type UpdateAerobicEntryBody = BodyOf<typeof updateAerobicEntryContract>;
/** Represents the update aerobic entry params value. */
type UpdateAerobicEntryParams = ParamsOf<typeof updateAerobicEntryContract>;
/** Represents the update aerobic entry query value. */
type UpdateAerobicEntryQuery = QueryOf<typeof updateAerobicEntryContract>;
/** Represents the update aerobic entry response value. */
type UpdateAerobicEntryResponse = ResponseOf<typeof updateAerobicEntryContract>;
/** Represents the delete aerobic entry query value. */
type DeleteAerobicEntryQuery = QueryOf<typeof deleteAerobicEntryContract>;
/** Represents the delete aerobic entry params value. */
type DeleteAerobicEntryParams = ParamsOf<typeof deleteAerobicEntryContract>;
/** Represents the delete aerobic entry response value. */
type DeleteAerobicEntryResponse = ResponseOf<typeof deleteAerobicEntryContract>;

declare const createPasswordResetRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        identifier: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const createPasswordResetRequestContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            identifier: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
declare const resetPasswordRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        newPassword: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodObject<{
        token: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const resetPasswordResponseSchema: z.ZodVoid;
declare const resetPasswordContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            newPassword: z.ZodString;
        }, z.core.$strip>;
        query: z.ZodObject<{
            token: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Represents the create password reset request body value. */
type CreatePasswordResetRequestBody = BodyOf<typeof createPasswordResetRequestContract>;
/** Represents the reset password body value. */
type ResetPasswordBody = BodyOf<typeof resetPasswordContract>;
/** Represents the reset password query value. */
type ResetPasswordQuery = QueryOf<typeof resetPasswordContract>;
/** Represents the reset password response value. */
type ResetPasswordResponse = ResponseOf<typeof resetPasswordContract>;

declare const loginRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        identifier: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const loginResponseSchema: z.ZodObject<{
    message: z.ZodString;
    user: z.ZodString;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
}, z.core.$strip>;
declare const loginContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            identifier: z.ZodString;
            password: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        message: z.ZodString;
        user: z.ZodString;
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
    }, z.core.$strip>;
};
declare const refreshTokenResponseSchema: z.ZodObject<{
    message: z.ZodString;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    userId: z.ZodString;
}, z.core.$strip>;
declare const refreshTokenContract: {
    response: z.ZodObject<{
        message: z.ZodString;
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
        userId: z.ZodString;
    }, z.core.$strip>;
};
declare const logoutResponseSchema: z.ZodObject<{
    message: z.ZodString;
}, z.core.$strip>;
declare const logoutContract: {
    response: z.ZodObject<{
        message: z.ZodString;
    }, z.core.$strip>;
};
/** Represents the login request body value. */
type LoginRequestBody = BodyOf<typeof loginContract>;
/** Represents the login response value. */
type LoginResponse = ResponseOf<typeof loginContract>;
/** Represents the refresh token response value. */
type RefreshTokenResponse = ResponseOf<typeof refreshTokenContract>;
/** Represents the logout response value. */
type LogoutResponse = ResponseOf<typeof logoutContract>;

declare const verifyEmailRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        token: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const verifyEmailContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            token: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
declare const createVerificationEmailRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const createVerificationEmailContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
declare const updateUnverifiedAccountEmailRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodString;
        password: z.ZodString;
        newEmail: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const updateUnverifiedAccountEmailContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            username: z.ZodString;
            password: z.ZodString;
            newEmail: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
declare const getVerificationStatusRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        username: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getVerificationStatusContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            username: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
/** Represents the verify email query value. */
type VerifyEmailQuery = QueryOf<typeof verifyEmailContract>;
/** Represents the create verification email body value. */
type CreateVerificationEmailBody = BodyOf<typeof createVerificationEmailContract>;
/** Represents the update unverified account email body value. */
type UpdateUnverifiedAccountEmailBody = BodyOf<typeof updateUnverifiedAccountEmailContract>;
/** Represents the get verification status query value. */
type GetVerificationStatusQuery = QueryOf<typeof getVerificationStatusContract>;

declare const listExercisesResponseSchema: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    specificTargetMuscle: z.ZodString;
}, z.core.$strip>>>;
declare const listExercisesContract: {
    response: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        specificTargetMuscle: z.ZodString;
    }, z.core.$strip>>>;
};
/** Represents the list exercises response value. */
type ListExercisesResponse = ResponseOf<typeof listExercisesContract>;

declare const listMessagesRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const listMessagesResponseSchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        subject: z.ZodString;
        msg: z.ZodString;
        sentAt: z.ZodString;
        isRead: z.ZodBoolean;
        senderFullName: z.ZodString;
        senderProfilePicPath: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const listMessagesContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            tz: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        messages: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            subject: z.ZodString;
            msg: z.ZodString;
            sentAt: z.ZodString;
            isRead: z.ZodBoolean;
            senderFullName: z.ZodString;
            senderProfilePicPath: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
/** Represents the list messages query value. */
type ListMessagesQuery = QueryOf<typeof listMessagesContract>;
/** Represents the list messages response value. */
type ListMessagesResponse = ResponseOf<typeof listMessagesContract>;
declare const markMessageAsReadRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const markMessageAsReadResponseSchema: z.ZodVoid;
declare const markMessageAsReadContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Represents the mark message as read params value. */
type MarkMessageAsReadParams = ParamsOf<typeof markMessageAsReadContract>;
/** Represents the mark message as read response value. */
type MarkMessageAsReadResponse = ResponseOf<typeof markMessageAsReadContract>;
declare const deleteMessageRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const deleteMessageResponseSchema: z.ZodVoid;
declare const deleteMessageContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Represents the delete message params value. */
type DeleteMessageParams = ParamsOf<typeof deleteMessageContract>;
/** Represents the delete message response value. */
type DeleteMessageResponse = ResponseOf<typeof deleteMessageContract>;

declare const appleOAuthRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        idToken: z.ZodString;
        rawNonce: z.ZodString;
        name: z.ZodOptional<z.ZodObject<{
            givenName: z.ZodNullable<z.ZodString>;
            familyName: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
        email: z.ZodNullable<z.ZodEmail>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const appleOAuthContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            idToken: z.ZodString;
            rawNonce: z.ZodString;
            name: z.ZodOptional<z.ZodObject<{
                givenName: z.ZodNullable<z.ZodString>;
                familyName: z.ZodNullable<z.ZodString>;
            }, z.core.$strip>>;
            email: z.ZodNullable<z.ZodEmail>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
/** Represents the apple oauth body value. */
type AppleOAuthBody = BodyOf<typeof appleOAuthContract>;

declare const googleOAuthRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        idToken: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const googleOAuthContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            idToken: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
/** Represents the google oauth body value. */
type GoogleOAuthBody = BodyOf<typeof googleOAuthContract>;

declare const oAuthLoginResponseSchema: z.ZodObject<{
    message: z.ZodString;
    user: z.ZodString;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
}, z.core.$strip>;
declare const proceedLoginResponseSchema: z.ZodObject<{
    message: z.ZodString;
    user: z.ZodString;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
}, z.core.$strip>;
declare const oAuthLoginContract: {
    response: z.ZodObject<{
        message: z.ZodString;
        user: z.ZodString;
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
    }, z.core.$strip>;
};
/** Represents the oauth login response value. */
type OAuthLoginResponse = ResponseOf<typeof oAuthLoginContract>;

declare const getReminderSettingsResponseSchema: z.ZodObject<{
    reminderSettings: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        reminderEnabled: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        timeZone: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const getReminderSettingsContract: {
    response: z.ZodObject<{
        reminderSettings: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            userId: z.ZodString;
            reminderEnabled: z.ZodBoolean;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            timeZone: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
declare const upsertReminderSettingsRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        reminderEnabled: z.ZodBoolean;
        timeZone: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const upsertReminderSettingsContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            reminderEnabled: z.ZodBoolean;
            timeZone: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
declare const updateReminderTimeZoneRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        timeZone: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const updateReminderTimeZoneContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            timeZone: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Represents the upsert reminder settings body value. */
type UpsertReminderSettingsBody = BodyOf<typeof upsertReminderSettingsContract>;
/** Represents the upsert reminder settings response value. */
type UpsertReminderSettingsResponse = ResponseOf<typeof upsertReminderSettingsContract>;
/** Represents the update reminder time zone body value. */
type UpdateReminderTimeZoneBody = BodyOf<typeof updateReminderTimeZoneContract>;
/** Represents the update reminder time zone response value. */
type UpdateReminderTimeZoneResponse = ResponseOf<typeof updateReminderTimeZoneContract>;
/** Represents the get reminder settings response value. */
type GetReminderSettingsResponse = ResponseOf<typeof getReminderSettingsContract>;

declare const createUserRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodString;
        fullName: z.ZodPipe<z.ZodTransform<{}, unknown>, z.ZodString>;
        email: z.ZodString;
        password: z.ZodString;
        gender: z.ZodPipe<z.ZodTransform<{}, unknown>, z.ZodEnum<{
            Male: "Male";
            Female: "Female";
            Other: "Other";
            Unknown: "Unknown";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const createUserUserSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    gender: z.ZodString;
    role: z.ZodString;
    createdAt: z.ZodString;
}, z.core.$strip>;
declare const createUserResponseSchema: z.ZodVoid;
declare const createUserContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            username: z.ZodString;
            fullName: z.ZodPipe<z.ZodTransform<{}, unknown>, z.ZodString>;
            email: z.ZodString;
            password: z.ZodString;
            gender: z.ZodPipe<z.ZodTransform<{}, unknown>, z.ZodEnum<{
                Male: "Male";
                Female: "Female";
                Other: "Other";
                Unknown: "Unknown";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Represents the create user body value. */
type CreateUserBody = BodyOf<typeof createUserContract>;
/** Represents the create user response value. */
type CreateUserResponse = ResponseOf<typeof createUserContract>;

declare const replacePushTokenRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        token: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const replacePushTokenContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            token: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
/** Represents the replace push token body value. */
type ReplacePushTokenBody = BodyOf<typeof replacePushTokenContract>;

declare const updateCurrentUserRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodOptional<z.ZodString>;
        fullName: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const updateCurrentUserResponseSchema: z.ZodVoid;
declare const updateCurrentUserContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            username: z.ZodOptional<z.ZodString>;
            fullName: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
declare const confirmEmailChangeRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        token: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const confirmEmailChangeContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            token: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
declare const userDataResponseSchema: z.ZodObject<{
    userData: z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        email: z.ZodString;
        name: z.ZodString;
        gender: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
        pushToken: z.ZodNullable<z.ZodString>;
        role: z.ZodString;
        isFirstLogin: z.ZodBoolean;
        tokenVersion: z.ZodNumber;
        isVerified: z.ZodBoolean;
        authProvider: z.ZodString;
        lastLogin: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const userDataContract: {
    response: z.ZodObject<{
        userData: z.ZodObject<{
            id: z.ZodString;
            username: z.ZodString;
            email: z.ZodString;
            name: z.ZodString;
            gender: z.ZodString;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            profilePicPath: z.ZodNullable<z.ZodString>;
            pushToken: z.ZodNullable<z.ZodString>;
            role: z.ZodString;
            isFirstLogin: z.ZodBoolean;
            tokenVersion: z.ZodNumber;
            isVerified: z.ZodBoolean;
            authProvider: z.ZodString;
            lastLogin: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
declare const getCurrentUserResponseSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    gender: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    profilePicPath: z.ZodNullable<z.ZodString>;
    pushToken: z.ZodNullable<z.ZodString>;
    role: z.ZodString;
    isFirstLogin: z.ZodBoolean;
    tokenVersion: z.ZodNumber;
    isVerified: z.ZodBoolean;
    authProvider: z.ZodString;
    lastLogin: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
declare const getCurrentUserContract: {
    response: z.ZodObject<{
        id: z.ZodString;
        username: z.ZodString;
        email: z.ZodString;
        name: z.ZodString;
        gender: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
        pushToken: z.ZodNullable<z.ZodString>;
        role: z.ZodString;
        isFirstLogin: z.ZodBoolean;
        tokenVersion: z.ZodNumber;
        isVerified: z.ZodBoolean;
        authProvider: z.ZodString;
        lastLogin: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
declare const deleteProfilePictureRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        profilePicPath: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const deleteProfilePictureContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            profilePicPath: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
declare const replaceProfilePictureResponseSchema: z.ZodObject<{
    profilePicPath: z.ZodString;
    url: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
declare const replaceProfilePictureContract: {
    response: z.ZodObject<{
        profilePicPath: z.ZodString;
        url: z.ZodString;
        message: z.ZodString;
    }, z.core.$strip>;
};
/** Represents the update current user body value. */
type UpdateCurrentUserBody = BodyOf<typeof updateCurrentUserContract>;
/** Represents the update current user response value. */
type UpdateCurrentUserResponse = ResponseOf<typeof updateCurrentUserContract>;
/** Represents the confirm email change query value. */
type ConfirmEmailChangeQuery = QueryOf<typeof confirmEmailChangeContract>;
/** Represents the user data response value. */
type UserDataResponse = ResponseOf<typeof userDataContract>;
/** Represents the get current user response value. */
type GetCurrentUserResponse = ResponseOf<typeof getCurrentUserContract>;
/** Represents the delete profile picture body value. */
type DeleteProfilePictureBody = BodyOf<typeof deleteProfilePictureContract>;
/** Represents the replace profile picture response value. */
type ReplaceProfilePictureResponse = ResponseOf<typeof replaceProfilePictureContract>;

declare const createVideoUploadUrlRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        exercise: z.ZodString;
        fileType: z.ZodEnum<{
            "video/mp4": "video/mp4";
            "video/quicktime": "video/quicktime";
            "video/webm": "video/webm";
        }>;
        jobId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const createVideoUploadUrlResponseSchema: z.ZodObject<{
    uploadUrl: z.ZodString;
    fileKey: z.ZodString;
    requestId: z.ZodString;
}, z.core.$strip>;
declare const createVideoUploadUrlContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            exercise: z.ZodString;
            fileType: z.ZodEnum<{
                "video/mp4": "video/mp4";
                "video/quicktime": "video/quicktime";
                "video/webm": "video/webm";
            }>;
            jobId: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        uploadUrl: z.ZodString;
        fileKey: z.ZodString;
        requestId: z.ZodString;
    }, z.core.$strip>;
};
/** Represents the create video upload url body value. */
type CreateVideoUploadUrlBody = BodyOf<typeof createVideoUploadUrlContract>;
/** Represents the create video upload url response value. */
type CreateVideoUploadUrlResponse = ResponseOf<typeof createVideoUploadUrlContract>;
/** Parameters used to enqueue a video-analysis job. */
declare const enqueueAnalyzeVideoParamsDtoSchema: z.ZodObject<{
    fileKey: z.ZodString;
    exercise: z.ZodString;
    userId: z.ZodString;
    requestId: z.ZodString;
    sentryTrace: z.ZodOptional<z.ZodString>;
    baggage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/** Queue payload containing video-analysis parameters and expiration. */
declare const analyzeVideoPayloadDtoSchema: z.ZodObject<{
    fileKey: z.ZodString;
    exercise: z.ZodString;
    userId: z.ZodString;
    requestId: z.ZodString;
    sentryTrace: z.ZodOptional<z.ZodString>;
    baggage: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodNumber;
}, z.core.$strip>;
/** Analysis result for one detected squat repetition. */
declare const squatRepetitionDtoSchema: z.ZodObject<{
    depth: z.ZodObject<{
        value: z.ZodNumber;
        status: z.ZodString;
        confidence: z.ZodNumber;
    }, z.core.$strip>;
    backLean: z.ZodObject<{
        value: z.ZodNumber;
        excessive: z.ZodBoolean;
        confidence: z.ZodNumber;
    }, z.core.$strip>;
    audit: z.ZodObject<{
        framesAnalyzed: z.ZodNumber;
        validFrames: z.ZodNumber;
        cameraAngle: z.ZodString;
        rawBottomAngle: z.ZodNumber;
        samplingRate: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Completed-or-failed result emitted by a video-analysis worker. */
declare const analyzeVideoResultPayloadDtoSchema: <TResultSchema extends z.ZodType>(resultSchema: TResultSchema) => z.ZodIntersection<z.ZodObject<{
    jobId: z.ZodString;
    userId: z.ZodString;
    exercise: z.ZodString;
    requestId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodDiscriminatedUnion<[z.ZodObject<{
    status: z.ZodLiteral<"completed">;
    result: z.ZodArray<TResultSchema>;
    error: z.ZodNull;
}, z.core.$strip>, z.ZodObject<{
    status: z.ZodLiteral<"failed">;
    result: z.ZodNull;
    error: z.ZodString;
}, z.core.$strip>]>>;
/** Represents the enqueue analyze video params dto value. */
type EnqueueAnalyzeVideoParamsDto = z.infer<typeof enqueueAnalyzeVideoParamsDtoSchema>;
/** Represents the analyze video payload dto value. */
type AnalyzeVideoPayloadDto = z.infer<typeof analyzeVideoPayloadDtoSchema>;
/** Represents the squat repetition dto value. */
type SquatRepetitionDto = z.infer<typeof squatRepetitionDtoSchema>;
/** Represents the analyze video result payload dto value. */
type AnalyzeVideoResultPayloadDto<TResult> = z.infer<ReturnType<typeof analyzeVideoResultPayloadDtoSchema<z.ZodType<TResult>>>>;

declare const createWebSocketTicketRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const createWebSocketTicketResponseSchema: z.ZodObject<{
    ticket: z.ZodString;
}, z.core.$strip>;
declare const createWebSocketTicketContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            username: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        ticket: z.ZodString;
    }, z.core.$strip>;
};
/** Represents the create web socket ticket body value. */
type CreateWebSocketTicketBody = BodyOf<typeof createWebSocketTicketContract>;
/** Represents the create web socket ticket response value. */
type CreateWebSocketTicketResponse = ResponseOf<typeof createWebSocketTicketContract>;

declare const getWorkoutPlanRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getWorkoutPlanResponseSchema: z.ZodObject<{
    workoutPlan: z.ZodNullable<z.ZodObject<{
        id: z.ZodNumber;
        numberOfSplits: z.ZodNumber;
        createdAt: z.ZodString;
        userId: z.ZodString;
        isActive: z.ZodBoolean;
        updatedAt: z.ZodString;
        workoutSplits: z.ZodNullable<z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
            workoutId: z.ZodNumber;
            name: z.ZodString;
            orderIndex: z.ZodNumber;
            createdAt: z.ZodString;
            muscleGroup: z.ZodNullable<z.ZodString>;
            estimatedDurationMinutes: z.ZodNullable<z.ZodNumber>;
            isActive: z.ZodBoolean;
            exercises: z.ZodArray<z.ZodObject<{
                exerciseToSplitId: z.ZodNumber;
                exerciseId: z.ZodNumber;
                name: z.ZodString;
                sets: z.ZodArray<z.ZodObject<{
                    orderIndex: z.ZodNumber;
                    reps: z.ZodNumber;
                }, z.core.$strip>>;
                orderIndex: z.ZodNumber;
                isActive: z.ZodBoolean;
                targetMuscle: z.ZodString;
                specificTargetMuscle: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const getWorkoutPlanContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        workoutPlan: z.ZodNullable<z.ZodObject<{
            id: z.ZodNumber;
            numberOfSplits: z.ZodNumber;
            createdAt: z.ZodString;
            userId: z.ZodString;
            isActive: z.ZodBoolean;
            updatedAt: z.ZodString;
            workoutSplits: z.ZodNullable<z.ZodArray<z.ZodObject<{
                id: z.ZodNumber;
                workoutId: z.ZodNumber;
                name: z.ZodString;
                orderIndex: z.ZodNumber;
                createdAt: z.ZodString;
                muscleGroup: z.ZodNullable<z.ZodString>;
                estimatedDurationMinutes: z.ZodNullable<z.ZodNumber>;
                isActive: z.ZodBoolean;
                exercises: z.ZodArray<z.ZodObject<{
                    exerciseToSplitId: z.ZodNumber;
                    exerciseId: z.ZodNumber;
                    name: z.ZodString;
                    sets: z.ZodArray<z.ZodObject<{
                        orderIndex: z.ZodNumber;
                        reps: z.ZodNumber;
                    }, z.core.$strip>>;
                    orderIndex: z.ZodNumber;
                    isActive: z.ZodBoolean;
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
declare const replaceWorkoutPlanRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        workoutData: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            orderIndex: z.ZodNumber;
            exercises: z.ZodArray<z.ZodObject<{
                exerciseId: z.ZodNumber;
                sets: z.ZodArray<z.ZodNumber>;
                orderIndex: z.ZodNumber;
            }, z.core.$strip>>;
            id: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        workoutName: z.ZodOptional<z.ZodString>;
        tz: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const replaceWorkoutPlanResponseSchema: z.ZodVoid;
declare const replaceWorkoutPlanContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            workoutData: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                orderIndex: z.ZodNumber;
                exercises: z.ZodArray<z.ZodObject<{
                    exerciseId: z.ZodNumber;
                    sets: z.ZodArray<z.ZodNumber>;
                    orderIndex: z.ZodNumber;
                }, z.core.$strip>>;
                id: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            workoutName: z.ZodOptional<z.ZodString>;
            tz: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Represents the get workout plan query value. */
type GetWorkoutPlanQuery = QueryOf<typeof getWorkoutPlanContract>;
/** Represents the get workout plan response value. */
type GetWorkoutPlanResponse = ResponseOf<typeof getWorkoutPlanContract>;
/** Represents the replace workout plan body value. */
type ReplaceWorkoutPlanBody = BodyOf<typeof replaceWorkoutPlanContract>;
/** Represents the replace workout plan response value. */
type ReplaceWorkoutPlanResponse = ResponseOf<typeof replaceWorkoutPlanContract>;

declare const getWorkoutHistoryRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getWorkoutHistoryResponseSchema: z.ZodObject<{
    byDate: z.ZodRecord<z.ZodString, z.ZodObject<{
        durationMins: z.ZodNumber;
        exerciseTracked: z.ZodArray<z.ZodObject<{
            exerciseTracking: z.ZodObject<{
                exerciseTrackingId: z.ZodNumber;
                sets: z.ZodArray<z.ZodObject<{
                    setIndex: z.ZodNumber;
                    weight: z.ZodNumber;
                    reps: z.ZodNumber;
                }, z.core.$strip>>;
                notes: z.ZodNullable<z.ZodString>;
                exerciseAssignment: z.ZodObject<{
                    exerciseToSplitId: z.ZodNullable<z.ZodNumber>;
                    orderIndex: z.ZodNullable<z.ZodNumber>;
                    exerciseId: z.ZodNumber;
                    workoutSplitId: z.ZodNumber;
                    workoutSplitName: z.ZodString;
                    exerciseName: z.ZodString;
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const getWorkoutHistoryContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        byDate: z.ZodRecord<z.ZodString, z.ZodObject<{
            durationMins: z.ZodNumber;
            exerciseTracked: z.ZodArray<z.ZodObject<{
                exerciseTracking: z.ZodObject<{
                    exerciseTrackingId: z.ZodNumber;
                    sets: z.ZodArray<z.ZodObject<{
                        setIndex: z.ZodNumber;
                        weight: z.ZodNumber;
                        reps: z.ZodNumber;
                    }, z.core.$strip>>;
                    notes: z.ZodNullable<z.ZodString>;
                    exerciseAssignment: z.ZodObject<{
                        exerciseToSplitId: z.ZodNullable<z.ZodNumber>;
                        orderIndex: z.ZodNullable<z.ZodNumber>;
                        exerciseId: z.ZodNumber;
                        workoutSplitId: z.ZodNumber;
                        workoutSplitName: z.ZodString;
                        exerciseName: z.ZodString;
                        targetMuscle: z.ZodString;
                        specificTargetMuscle: z.ZodString;
                    }, z.core.$strip>;
                }, z.core.$strip>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
declare const getExerciseHistoryRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getExerciseHistoryResponseSchema: z.ZodObject<{
    byExerciseToSplitId: z.ZodRecord<z.ZodString, z.ZodObject<{
        exerciseTracked: z.ZodArray<z.ZodObject<{
            sets: z.ZodArray<z.ZodObject<{
                setIndex: z.ZodNumber;
                weight: z.ZodNumber;
                reps: z.ZodNumber;
            }, z.core.$strip>>;
            exerciseTrackingId: z.ZodNumber;
            exerciseAssignment: z.ZodObject<{
                exerciseToSplitId: z.ZodNullable<z.ZodNumber>;
                orderIndex: z.ZodNullable<z.ZodNumber>;
                exerciseId: z.ZodNumber;
                workoutSplitId: z.ZodNumber;
                workoutSplitName: z.ZodString;
                exerciseName: z.ZodString;
                targetMuscle: z.ZodString;
                specificTargetMuscle: z.ZodString;
            }, z.core.$strip>;
            workoutStartLocal: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const getExerciseHistoryContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        byExerciseToSplitId: z.ZodRecord<z.ZodString, z.ZodObject<{
            exerciseTracked: z.ZodArray<z.ZodObject<{
                sets: z.ZodArray<z.ZodObject<{
                    setIndex: z.ZodNumber;
                    weight: z.ZodNumber;
                    reps: z.ZodNumber;
                }, z.core.$strip>>;
                exerciseTrackingId: z.ZodNumber;
                exerciseAssignment: z.ZodObject<{
                    exerciseToSplitId: z.ZodNullable<z.ZodNumber>;
                    orderIndex: z.ZodNullable<z.ZodNumber>;
                    exerciseId: z.ZodNumber;
                    workoutSplitId: z.ZodNumber;
                    workoutSplitName: z.ZodString;
                    exerciseName: z.ZodString;
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>;
                workoutStartLocal: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
declare const getWorkoutStatisticsResponseSchema: z.ZodObject<{
    workoutCount: z.ZodCoercedNumber<unknown>;
    hasExerciseTracking: z.ZodBoolean;
    nextSplitByOrderIndex: z.ZodNullable<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        orderIndex: z.ZodNumber;
        muscleGroup: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    workoutTargets: z.ZodObject<{
        workoutCountThisWeek: z.ZodCoercedNumber<unknown>;
        workoutCountScheduledPerWeek: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>;
    lastWorkoutStats: z.ZodObject<{
        workoutDate: z.ZodNullable<z.ZodString>;
        workoutSplitName: z.ZodNullable<z.ZodString>;
        exerciseTrackedCount: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
        setTrackedCount: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
    }, z.core.$strip>;
    latestPr: z.ZodArray<z.ZodObject<{
        exerciseToSplitId: z.ZodNullable<z.ZodNumber>;
        exerciseId: z.ZodNumber;
        exerciseName: z.ZodString;
        prWeight: z.ZodNumber;
        prReps: z.ZodNumber;
        prSetIndex: z.ZodNumber;
        estimatedOneRepMax: z.ZodNullable<z.ZodNumber>;
        workoutStartLocal: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const getWorkoutStatisticsContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        workoutCount: z.ZodCoercedNumber<unknown>;
        hasExerciseTracking: z.ZodBoolean;
        nextSplitByOrderIndex: z.ZodNullable<z.ZodObject<{
            id: z.ZodNumber;
            name: z.ZodString;
            orderIndex: z.ZodNumber;
            muscleGroup: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
        workoutTargets: z.ZodObject<{
            workoutCountThisWeek: z.ZodCoercedNumber<unknown>;
            workoutCountScheduledPerWeek: z.ZodCoercedNumber<unknown>;
        }, z.core.$strip>;
        lastWorkoutStats: z.ZodObject<{
            workoutDate: z.ZodNullable<z.ZodString>;
            workoutSplitName: z.ZodNullable<z.ZodString>;
            exerciseTrackedCount: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
            setTrackedCount: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
        }, z.core.$strip>;
        latestPr: z.ZodArray<z.ZodObject<{
            exerciseToSplitId: z.ZodNullable<z.ZodNumber>;
            exerciseId: z.ZodNumber;
            exerciseName: z.ZodString;
            prWeight: z.ZodNumber;
            prReps: z.ZodNumber;
            prSetIndex: z.ZodNumber;
            estimatedOneRepMax: z.ZodNullable<z.ZodNumber>;
            workoutStartLocal: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
declare const createWorkoutSessionRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        workout: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            trackedSets: z.ZodArray<z.ZodObject<{
                reps: z.ZodNumber;
                weight: z.ZodNumber;
                setIndex: z.ZodNumber;
            }, z.core.$strip>>;
            notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            isExerciseAssignedToSplit: z.ZodLiteral<true>;
            exerciseToSplitId: z.ZodNumber;
            exerciseId: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>, z.ZodObject<{
            trackedSets: z.ZodArray<z.ZodObject<{
                reps: z.ZodNumber;
                weight: z.ZodNumber;
                setIndex: z.ZodNumber;
            }, z.core.$strip>>;
            notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            isExerciseAssignedToSplit: z.ZodLiteral<false>;
            exerciseToSplitId: z.ZodOptional<z.ZodNull>;
            exerciseId: z.ZodNumber;
        }, z.core.$strip>]>>;
        tz: z.ZodOptional<z.ZodString>;
        workoutStartUtc: z.ZodString;
        workoutEndUtc: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const createWorkoutSessionResponseSchema: z.ZodVoid;
declare const createWorkoutSessionContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            workout: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                trackedSets: z.ZodArray<z.ZodObject<{
                    reps: z.ZodNumber;
                    weight: z.ZodNumber;
                    setIndex: z.ZodNumber;
                }, z.core.$strip>>;
                notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                isExerciseAssignedToSplit: z.ZodLiteral<true>;
                exerciseToSplitId: z.ZodNumber;
                exerciseId: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>, z.ZodObject<{
                trackedSets: z.ZodArray<z.ZodObject<{
                    reps: z.ZodNumber;
                    weight: z.ZodNumber;
                    setIndex: z.ZodNumber;
                }, z.core.$strip>>;
                notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                isExerciseAssignedToSplit: z.ZodLiteral<false>;
                exerciseToSplitId: z.ZodOptional<z.ZodNull>;
                exerciseId: z.ZodNumber;
            }, z.core.$strip>]>>;
            tz: z.ZodOptional<z.ZodString>;
            workoutStartUtc: z.ZodString;
            workoutEndUtc: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
declare const getPersonalRecordsResponseSchema: z.ZodObject<{
    prs: z.ZodRecord<z.ZodString, z.ZodObject<{
        exerciseToSplitId: z.ZodNullable<z.ZodNumber>;
        exerciseName: z.ZodString;
        workoutStartLocal: z.ZodString;
        prWeight: z.ZodNumber;
        prReps: z.ZodNumber;
        prSetIndex: z.ZodNumber;
        estimatedOneRepMax: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const getPersonalRecordsRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getPersonalRecordsContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        prs: z.ZodRecord<z.ZodString, z.ZodObject<{
            exerciseToSplitId: z.ZodNullable<z.ZodNumber>;
            exerciseName: z.ZodString;
            workoutStartLocal: z.ZodString;
            prWeight: z.ZodNumber;
            prReps: z.ZodNumber;
            prSetIndex: z.ZodNumber;
            estimatedOneRepMax: z.ZodNullable<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
/** Represents the get workout history query value. */
type GetWorkoutHistoryQuery = QueryOf<typeof getWorkoutHistoryContract>;
/** Represents the get exercise history query value. */
type GetExerciseHistoryQuery = QueryOf<typeof getExerciseHistoryContract>;
/** Represents the get personal records query value. */
type GetPersonalRecordsQuery = QueryOf<typeof getPersonalRecordsContract>;
/** Represents the get workout history response value. */
type GetWorkoutHistoryResponse = ResponseOf<typeof getWorkoutHistoryContract>;
/** Represents the get exercise history response value. */
type GetExerciseHistoryResponse = ResponseOf<typeof getExerciseHistoryContract>;
/** Represents the get workout statistics response value. */
type GetWorkoutStatisticsResponse = ResponseOf<typeof getWorkoutStatisticsContract>;
/** Represents the get personal records response value. */
type GetPersonalRecordsResponse = ResponseOf<typeof getPersonalRecordsContract>;
/** Represents the create workout session body value. */
type CreateWorkoutSessionBody = BodyOf<typeof createWorkoutSessionContract>;
/** Represents the create workout session response value. */
type CreateWorkoutSessionResponse = ResponseOf<typeof createWorkoutSessionContract>;

declare const getWorkoutSchedulesResponseSchema: z.ZodObject<{
    schedules: z.ZodArray<z.ZodObject<{
        workoutSplitId: z.ZodNumber;
        dayOfWeek: z.ZodNumber;
        id: z.ZodString;
        userId: z.ZodString;
        startTime: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const getWorkoutSchedulesContract: {
    response: z.ZodObject<{
        schedules: z.ZodArray<z.ZodObject<{
            workoutSplitId: z.ZodNumber;
            dayOfWeek: z.ZodNumber;
            id: z.ZodString;
            userId: z.ZodString;
            startTime: z.ZodString;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
declare const replaceWorkoutSchedulesRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        schedules: z.ZodArray<z.ZodObject<{
            workoutSplitId: z.ZodNumber;
            dayOfWeek: z.ZodNumber;
            startTime: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const replaceWorkoutSchedulesContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            schedules: z.ZodArray<z.ZodObject<{
                workoutSplitId: z.ZodNumber;
                dayOfWeek: z.ZodNumber;
                startTime: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Represents the get workout schedules response value. */
type GetWorkoutSchedulesResponse = ResponseOf<typeof getWorkoutSchedulesContract>;
/** Represents the replace workout schedules body value. */
type ReplaceWorkoutSchedulesBody = BodyOf<typeof replaceWorkoutSchedulesContract>;
/** Represents the replace workout schedules response value. */
type ReplaceWorkoutSchedulesResponse = ResponseOf<typeof replaceWorkoutSchedulesContract>;

/** Validates a request to list crews visible to the authenticated user. */
declare const listCrewsRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        search: z.ZodOptional<z.ZodString>;
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the collection returned by the list-crews endpoint. */
declare const listCrewsResponseSchema: z.ZodObject<{
    crews: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        createdBy: z.ZodString;
        privacy: z.ZodEnum<{
            public: "public";
            private: "private";
        }>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        participantCount: z.ZodNumber;
        top5Participants: z.ZodArray<z.ZodObject<{
            username: z.ZodString;
            fullName: z.ZodString;
            profilePicPath: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the request and response contract for listing visible crews. */
declare const listCrewsContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            search: z.ZodOptional<z.ZodString>;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        crews: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            createdBy: z.ZodString;
            privacy: z.ZodEnum<{
                public: "public";
                private: "private";
            }>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            participantCount: z.ZodNumber;
            top5Participants: z.ZodArray<z.ZodObject<{
                username: z.ZodString;
                fullName: z.ZodString;
                profilePicPath: z.ZodNullable<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Pagination query accepted by the list-crews endpoint. */
type ListCrewsQuery = QueryOf<typeof listCrewsContract>;
/** Response returned when listing crews visible to the caller. */
type ListCrewsResponse = ResponseOf<typeof listCrewsContract>;
/** Validates pagination for crews in which the authenticated user is an active member. */
declare const listMyCrewsRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the authenticated user's crew collection. */
declare const listMyCrewsResponseSchema: z.ZodObject<{
    crews: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        createdBy: z.ZodString;
        privacy: z.ZodEnum<{
            public: "public";
            private: "private";
        }>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        participantCount: z.ZodNumber;
        top5Participants: z.ZodArray<z.ZodObject<{
            username: z.ZodString;
            fullName: z.ZodString;
            profilePicPath: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the request and response contract for listing the authenticated user's crews. */
declare const listMyCrewsContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        crews: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            createdBy: z.ZodString;
            privacy: z.ZodEnum<{
                public: "public";
                private: "private";
            }>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            participantCount: z.ZodNumber;
            top5Participants: z.ZodArray<z.ZodObject<{
                username: z.ZodString;
                fullName: z.ZodString;
                profilePicPath: z.ZodNullable<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Pagination query accepted by the list-my-crews endpoint. */
type ListMyCrewsQuery = QueryOf<typeof listMyCrewsContract>;
/** Response containing crews in which the authenticated user is an active member. */
type ListMyCrewsResponse = ResponseOf<typeof listMyCrewsContract>;
/** Validates the crew identifier and pagination for listing participants. */
declare const listCrewParticipantsRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        crewId: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the participant collection returned by the endpoint. */
declare const listCrewParticipantsResponseSchema: z.ZodObject<{
    participants: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        crewId: z.ZodString;
        userId: z.ZodString;
        status: z.ZodEnum<{
            active: "active";
            left: "left";
            removed: "removed";
            banned: "banned";
        }>;
        role: z.ZodEnum<{
            leader: "leader";
            admin: "admin";
            member: "member";
        }>;
        joinedAt: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        fullName: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
        username: z.ZodString;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the request and response contract for listing crew participants. */
declare const listCrewParticipantsContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            crewId: z.ZodString;
        }, z.core.$strip>;
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        participants: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            crewId: z.ZodString;
            userId: z.ZodString;
            status: z.ZodEnum<{
                active: "active";
                left: "left";
                removed: "removed";
                banned: "banned";
            }>;
            role: z.ZodEnum<{
                leader: "leader";
                admin: "admin";
                member: "member";
            }>;
            joinedAt: z.ZodString;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            fullName: z.ZodString;
            profilePicPath: z.ZodNullable<z.ZodString>;
            username: z.ZodString;
        }, z.core.$strip>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Route parameters accepted by the list-crew-participants endpoint. */
type ListCrewParticipantsParams = ParamsOf<typeof listCrewParticipantsContract>;
/** Pagination query accepted by the list-crew-participants endpoint. */
type ListCrewParticipantsQuery = QueryOf<typeof listCrewParticipantsContract>;
/** Response returned after listing authorized crew participants. */
type ListCrewParticipantsResponse = ResponseOf<typeof listCrewParticipantsContract>;
/** Validates the route parameters used to retrieve one crew. */
declare const getCrewRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the crew returned by the get-crew endpoint. */
declare const getCrewResponseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    createdBy: z.ZodString;
    privacy: z.ZodEnum<{
        public: "public";
        private: "private";
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    participantCount: z.ZodNumber;
}, z.core.$strip>;
/** Defines the request and response contract for retrieving one crew. */
declare const getCrewContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        createdBy: z.ZodString;
        privacy: z.ZodEnum<{
            public: "public";
            private: "private";
        }>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        participantCount: z.ZodNumber;
    }, z.core.$strip>;
};
/** Route parameters accepted by the get-crew endpoint. */
type GetCrewParams = ParamsOf<typeof getCrewContract>;
/** Response returned after retrieving one crew. */
type GetCrewResponse = ResponseOf<typeof getCrewContract>;
/** Validates the body used to create a crew. */
declare const createCrewRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        privacy: z.ZodEnum<{
            public: "public";
            private: "private";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after crew creation. */
declare const createCrewResponseSchema: z.ZodVoid;
/** Defines the request and response contract for creating a crew. */
declare const createCrewContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            privacy: z.ZodEnum<{
                public: "public";
                private: "private";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Request body accepted by the create-crew endpoint. */
type CreateCrewBody = BodyOf<typeof createCrewContract>;
/** Empty response returned after creating a crew. */
type CreateCrewResponse = ResponseOf<typeof createCrewContract>;
/** Validates the route parameters and body used to update a crew. */
declare const updateCrewRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        name: z.ZodString;
        privacy: z.ZodEnum<{
            public: "public";
            private: "private";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after updating a crew. */
declare const updateCrewResponseSchema: z.ZodVoid;
/** Defines the request and response contract for updating a crew. */
declare const updateCrewContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            name: z.ZodString;
            privacy: z.ZodEnum<{
                public: "public";
                private: "private";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the update-crew endpoint. */
type UpdateCrewParams = ParamsOf<typeof updateCrewContract>;
/** Request body accepted by the update-crew endpoint. */
type UpdateCrewBody = BodyOf<typeof updateCrewContract>;
/** Empty response returned after updating a crew. */
type UpdateCrewResponse = ResponseOf<typeof updateCrewContract>;
/** Validates the crew identifier used by the authenticated user leaving a crew. */
declare const leaveCrewRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after leaving a crew. */
declare const leaveCrewResponseSchema: z.ZodVoid;
/** Defines the request and response contract for leaving a crew. */
declare const leaveCrewContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the leave-crew endpoint. */
type LeaveCrewParams = ParamsOf<typeof leaveCrewContract>;
/** Empty response returned after leaving a crew. */
type LeaveCrewResponse = ResponseOf<typeof leaveCrewContract>;
/** Validates the route parameters used to delete a crew. */
declare const deleteCrewRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after deleting a crew. */
declare const deleteCrewResponseSchema: z.ZodVoid;
/** Defines the request and response contract for deleting a crew. */
declare const deleteCrewContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the delete-crew endpoint. */
type DeleteCrewParams = ParamsOf<typeof deleteCrewContract>;
/** Response returned after deleting a crew. */
type DeleteCrewResponse = ResponseOf<typeof deleteCrewContract>;
/** Validates the crew ID used when replacing its profile picture. */
declare const replaceCrewProfilePictureRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the stored path and public URL returned after upload. */
declare const replaceCrewProfilePictureResponseSchema: z.ZodObject<{
    profilePicPath: z.ZodString;
    url: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
/** Defines the replace-crew-profile-picture request and response. */
declare const replaceCrewProfilePictureContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        profilePicPath: z.ZodString;
        url: z.ZodString;
        message: z.ZodString;
    }, z.core.$strip>;
};
/** Route parameters accepted when replacing a crew profile picture. */
type ReplaceCrewProfilePictureParams = ParamsOf<typeof replaceCrewProfilePictureContract>;
/** Response returned after replacing a crew profile picture. */
type ReplaceCrewProfilePictureResponse = ResponseOf<typeof replaceCrewProfilePictureContract>;
/** Validates the crew ID used when deleting its profile picture. */
declare const deleteCrewProfilePictureRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Defines the delete-crew-profile-picture request and empty response. */
declare const deleteCrewProfilePictureContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted when deleting a crew profile picture. */
type DeleteCrewProfilePictureParams = ParamsOf<typeof deleteCrewProfilePictureContract>;
/** Empty response returned after deleting a crew profile picture. */
type DeleteCrewProfilePictureResponse = ResponseOf<typeof deleteCrewProfilePictureContract>;

/** Validates a crew invitation creation request. */
declare const inviteCrewUserRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        crewId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        userId: z.ZodUUID;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const inviteCrewUserContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            crewId: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            userId: z.ZodUUID;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Represents the invite crew user params value. */
type InviteCrewUserParams = ParamsOf<typeof inviteCrewUserContract>;
/** Represents the invite crew user body value. */
type InviteCrewUserBody = BodyOf<typeof inviteCrewUserContract>;
/** Represents the invite crew user response value. */
type InviteCrewUserResponse = ResponseOf<typeof inviteCrewUserContract>;
/** Validates a request by the authenticated user to join a crew. */
declare const requestToJoinCrewRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        crewId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const requestToJoinCrewContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            crewId: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Represents the request to join crew params value. */
type RequestToJoinCrewParams = ParamsOf<typeof requestToJoinCrewContract>;
/** Represents the request to join crew response value. */
type RequestToJoinCrewResponse = ResponseOf<typeof requestToJoinCrewContract>;
/** Validates an accepted or declined participation-request status update. */
declare const updateCrewParticipationRequestStatusRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        requestId: z.ZodUUID;
    }, z.core.$strip>;
    body: z.ZodObject<{
        status: z.ZodEnum<{
            accepted: "accepted";
            declined: "declined";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const updateCrewParticipationRequestStatusContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            requestId: z.ZodUUID;
        }, z.core.$strip>;
        body: z.ZodObject<{
            status: z.ZodEnum<{
                accepted: "accepted";
                declined: "declined";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Represents the update crew participation request status params value. */
type UpdateCrewParticipationRequestStatusParams = ParamsOf<typeof updateCrewParticipationRequestStatusContract>;
/** Represents the update crew participation request status body value. */
type UpdateCrewParticipationRequestStatusBody = BodyOf<typeof updateCrewParticipationRequestStatusContract>;
/** Represents the update crew participation request status response value. */
type UpdateCrewParticipationRequestStatusResponse = ResponseOf<typeof updateCrewParticipationRequestStatusContract>;
/** Validates a request to list invitations addressed to the authenticated user. */
declare const listCrewInvitationsRequestSchema: z.ZodObject<{}, z.core.$strip>;
declare const listCrewInvitationsResponseSchema: z.ZodObject<{
    invitations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        crewId: z.ZodString;
        initiatorUserId: z.ZodString;
        participantUserId: z.ZodString;
        status: z.ZodEnum<{
            pending: "pending";
            accepted: "accepted";
            declined: "declined";
            cancelled: "cancelled";
            expired: "expired";
        }>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        respondedAt: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const listCrewInvitationsContract: {
    request: z.ZodObject<{}, z.core.$strip>;
    response: z.ZodObject<{
        invitations: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            crewId: z.ZodString;
            initiatorUserId: z.ZodString;
            participantUserId: z.ZodString;
            status: z.ZodEnum<{
                pending: "pending";
                accepted: "accepted";
                declined: "declined";
                cancelled: "cancelled";
                expired: "expired";
            }>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            respondedAt: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
/** Represents the list crew invitations response value. */
type ListCrewInvitationsResponse = ResponseOf<typeof listCrewInvitationsContract>;
/** Validates a request to list pending join requests for a crew. */
declare const listPendingCrewJoinRequestsRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        crewId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const listPendingCrewJoinRequestsResponseSchema: z.ZodObject<{
    requests: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        crewId: z.ZodString;
        initiatorUserId: z.ZodString;
        participantUserId: z.ZodString;
        status: z.ZodEnum<{
            pending: "pending";
            accepted: "accepted";
            declined: "declined";
            cancelled: "cancelled";
            expired: "expired";
        }>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        respondedAt: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const listPendingCrewJoinRequestsContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            crewId: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        requests: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            crewId: z.ZodString;
            initiatorUserId: z.ZodString;
            participantUserId: z.ZodString;
            status: z.ZodEnum<{
                pending: "pending";
                accepted: "accepted";
                declined: "declined";
                cancelled: "cancelled";
                expired: "expired";
            }>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            respondedAt: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
/** Represents the list pending crew join requests params value. */
type ListPendingCrewJoinRequestsParams = ParamsOf<typeof listPendingCrewJoinRequestsContract>;
/** Represents the list pending crew join requests response value. */
type ListPendingCrewJoinRequestsResponse = ResponseOf<typeof listPendingCrewJoinRequestsContract>;

/** Validates a request to list posts visible to the authenticated user. */
declare const listVisiblePostsRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the collection returned by the list-posts endpoint. */
declare const listVisiblePostsResponseSchema: z.ZodObject<{
    posts: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        authorUserId: z.ZodString;
        workoutSummaryId: z.ZodNullable<z.ZodString>;
        content: z.ZodString;
        visibility: z.ZodEnum<{
            public: "public";
            crews_only: "crews_only";
        }>;
        publishedAt: z.ZodString;
        updatedAt: z.ZodString;
        username: z.ZodString;
        fullName: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
        interactions: z.ZodObject<{
            reactionsCount: z.ZodObject<{
                likesCount: z.ZodNumber;
                fireUpCount: z.ZodNumber;
                muscleCount: z.ZodNumber;
            }, z.core.$strip>;
            commentsCount: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the request and response contract for listing visible posts. */
declare const listVisiblePostsContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        posts: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            authorUserId: z.ZodString;
            workoutSummaryId: z.ZodNullable<z.ZodString>;
            content: z.ZodString;
            visibility: z.ZodEnum<{
                public: "public";
                crews_only: "crews_only";
            }>;
            publishedAt: z.ZodString;
            updatedAt: z.ZodString;
            username: z.ZodString;
            fullName: z.ZodString;
            profilePicPath: z.ZodNullable<z.ZodString>;
            interactions: z.ZodObject<{
                reactionsCount: z.ZodObject<{
                    likesCount: z.ZodNumber;
                    fireUpCount: z.ZodNumber;
                    muscleCount: z.ZodNumber;
                }, z.core.$strip>;
                commentsCount: z.ZodNumber;
            }, z.core.$strip>;
        }, z.core.$strip>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Pagination query accepted by the list-visible-posts endpoint. */
type ListVisiblePostsQuery = QueryOf<typeof listVisiblePostsContract>;
/** Response containing each visible post once, regardless of its crew placements. */
type ListVisiblePostsResponse = ResponseOf<typeof listVisiblePostsContract>;
/** Validates the crew identifier and pagination used to list a crew's posts. */
declare const listCrewPostsRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        crewId: z.ZodUUID;
    }, z.core.$strip>;
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the collection returned by the list-crew-posts endpoint. */
declare const listCrewPostsResponseSchema: z.ZodObject<{
    posts: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        authorUserId: z.ZodString;
        workoutSummaryId: z.ZodNullable<z.ZodString>;
        content: z.ZodString;
        visibility: z.ZodEnum<{
            public: "public";
            crews_only: "crews_only";
        }>;
        publishedAt: z.ZodString;
        updatedAt: z.ZodString;
        username: z.ZodString;
        fullName: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
        interactions: z.ZodObject<{
            reactionsCount: z.ZodObject<{
                likesCount: z.ZodNumber;
                fireUpCount: z.ZodNumber;
                muscleCount: z.ZodNumber;
            }, z.core.$strip>;
            commentsCount: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the request and response contract for listing posts from one crew. */
declare const listCrewPostsContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            crewId: z.ZodUUID;
        }, z.core.$strip>;
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        posts: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            authorUserId: z.ZodString;
            workoutSummaryId: z.ZodNullable<z.ZodString>;
            content: z.ZodString;
            visibility: z.ZodEnum<{
                public: "public";
                crews_only: "crews_only";
            }>;
            publishedAt: z.ZodString;
            updatedAt: z.ZodString;
            username: z.ZodString;
            fullName: z.ZodString;
            profilePicPath: z.ZodNullable<z.ZodString>;
            interactions: z.ZodObject<{
                reactionsCount: z.ZodObject<{
                    likesCount: z.ZodNumber;
                    fireUpCount: z.ZodNumber;
                    muscleCount: z.ZodNumber;
                }, z.core.$strip>;
                commentsCount: z.ZodNumber;
            }, z.core.$strip>;
        }, z.core.$strip>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Route parameters accepted by the list-crew-posts endpoint. */
type ListCrewPostsParams = ParamsOf<typeof listCrewPostsContract>;
/** Pagination query accepted by the list-crew-posts endpoint. */
type ListCrewPostsQuery = QueryOf<typeof listCrewPostsContract>;
/** Response containing posts from the requested accessible crew. */
type ListCrewPostsResponse = ResponseOf<typeof listCrewPostsContract>;
/** Validates a public or crew-only post and all requested crew placements. */
declare const createPostRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        content: z.ZodString;
        visibility: z.ZodEnum<{
            public: "public";
            crews_only: "crews_only";
        }>;
        crewIds: z.ZodDefault<z.ZodArray<z.ZodUUID>>;
        workoutSummaryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after post creation. */
declare const createPostResponseSchema: z.ZodVoid;
/** Defines the request and response contract for creating a post. */
declare const createPostContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            content: z.ZodString;
            visibility: z.ZodEnum<{
                public: "public";
                crews_only: "crews_only";
            }>;
            crewIds: z.ZodDefault<z.ZodArray<z.ZodUUID>>;
            workoutSummaryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Request body accepted by the create-post endpoint. */
type CreatePostBody = BodyOf<typeof createPostContract>;
/** Empty response returned after creating a post. */
type CreatePostResponse = ResponseOf<typeof createPostContract>;
/** Validates the route parameters and body used to update a post. */
declare const updatePostRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        content: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after updating a post. */
declare const updatePostResponseSchema: z.ZodVoid;
/** Defines the request and response contract for updating a post. */
declare const updatePostContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            content: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the update-post endpoint. */
type UpdatePostParams = ParamsOf<typeof updatePostContract>;
/** Request body accepted by the update-post endpoint. */
type UpdatePostBody = BodyOf<typeof updatePostContract>;
/** Empty response returned after updating a post. */
type UpdatePostResponse = ResponseOf<typeof updatePostContract>;
/** Validates the route parameters used to delete a post. */
declare const deletePostRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after deleting a post. */
declare const deletePostResponseSchema: z.ZodVoid;
/** Defines the request and response contract for deleting a post. */
declare const deletePostContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the delete-post endpoint. */
type DeletePostParams = ParamsOf<typeof deletePostContract>;
/** Response returned after deleting a post. */
type DeletePostResponse = ResponseOf<typeof deletePostContract>;

/** Validates cursor pagination for comments on a visible post. */
declare const listPostCommentsRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        postId: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates a page of comments and its continuation cursor. */
declare const listPostCommentsResponseSchema: z.ZodObject<{
    comments: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        postId: z.ZodString;
        userId: z.ZodString;
        content: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        authorFullName: z.ZodString;
        authorProfilePicPath: z.ZodNullable<z.ZodString>;
        authorUsername: z.ZodString;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the contract for listing comments on a post. */
declare const listPostCommentsContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            postId: z.ZodString;
        }, z.core.$strip>;
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        comments: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            postId: z.ZodString;
            userId: z.ZodString;
            content: z.ZodString;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            authorFullName: z.ZodString;
            authorProfilePicPath: z.ZodNullable<z.ZodString>;
            authorUsername: z.ZodString;
        }, z.core.$strip>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Route parameters accepted by the list-post-comments endpoint. */
type ListPostCommentsParams = ParamsOf<typeof listPostCommentsContract>;
/** Cursor pagination accepted by the list-post-comments endpoint. */
type ListPostCommentsQuery = QueryOf<typeof listPostCommentsContract>;
/** Paginated comments returned for a visible post. */
type ListPostCommentsResponse = ResponseOf<typeof listPostCommentsContract>;
/** Validates a comment to add to a post. */
declare const addCommentRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        postId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        content: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Defines the contract for adding a comment. */
declare const addCommentResponseSchema: z.ZodVoid;
/** Defines the contract for adding a comment. */
declare const addCommentContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            postId: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            content: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the add-comment endpoint. */
type AddCommentParams = ParamsOf<typeof addCommentContract>;
/** Request body accepted by the add-comment endpoint. */
type AddCommentBody = BodyOf<typeof addCommentContract>;
/** Empty response returned after adding a comment. */
type AddCommentResponse = ResponseOf<typeof addCommentContract>;
/** Validates a comment identifier and its replacement content. */
declare const editCommentRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        content: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Defines the contract for editing an authored comment. */
declare const editCommentResponseSchema: z.ZodVoid;
/** Defines the contract for editing an authored comment. */
declare const editCommentContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            content: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the edit-comment endpoint. */
type EditCommentParams = ParamsOf<typeof editCommentContract>;
/** Request body accepted by the edit-comment endpoint. */
type EditCommentBody = BodyOf<typeof editCommentContract>;
/** Empty response returned after editing a comment. */
type EditCommentResponse = ResponseOf<typeof editCommentContract>;
/** Validates the identifier of a comment to delete. */
declare const deleteCommentRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Defines the contract for deleting an authored comment. */
declare const deleteCommentResponseSchema: z.ZodVoid;
/** Defines the contract for deleting an authored comment. */
declare const deleteCommentContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the delete-comment endpoint. */
type DeleteCommentParams = ParamsOf<typeof deleteCommentContract>;
/** Empty response returned after deleting a comment. */
type DeleteCommentResponse = ResponseOf<typeof deleteCommentContract>;

/** Validates cursor pagination for reactions on a visible post. */
declare const listPostReactionsRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        postId: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates a page of reactions and its continuation cursor. */
declare const listPostReactionsResponseSchema: z.ZodObject<{
    reactions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        postId: z.ZodString;
        userId: z.ZodString;
        type: z.ZodEnum<{
            like: "like";
            "fire up": "fire up";
            muscle: "muscle";
        }>;
        reactedAt: z.ZodString;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the contract for listing reactions on a post. */
declare const listPostReactionsContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            postId: z.ZodString;
        }, z.core.$strip>;
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        reactions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            postId: z.ZodString;
            userId: z.ZodString;
            type: z.ZodEnum<{
                like: "like";
                "fire up": "fire up";
                muscle: "muscle";
            }>;
            reactedAt: z.ZodString;
        }, z.core.$strip>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Route parameters accepted by the list-post-reactions endpoint. */
type ListPostReactionsParams = ParamsOf<typeof listPostReactionsContract>;
/** Cursor pagination accepted by the list-post-reactions endpoint. */
type ListPostReactionsQuery = QueryOf<typeof listPostReactionsContract>;
/** Paginated reactions returned for a visible post. */
type ListPostReactionsResponse = ResponseOf<typeof listPostReactionsContract>;
/** Validates a request that creates or replaces the caller's reaction to a post. */
declare const reactToPostRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        postId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        type: z.ZodEnum<{
            like: "like";
            "fire up": "fire up";
            muscle: "muscle";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Defines the empty response returned after reacting to a post. */
declare const reactToPostResponseSchema: z.ZodVoid;
/** Defines the contract for creating or replacing a reaction. */
declare const reactToPostContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            postId: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            type: z.ZodEnum<{
                like: "like";
                "fire up": "fire up";
                muscle: "muscle";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the react-to-post endpoint. */
type ReactToPostParams = ParamsOf<typeof reactToPostContract>;
/** Request body accepted by the react-to-post endpoint. */
type ReactToPostBody = BodyOf<typeof reactToPostContract>;
/** Empty response returned after reacting to a post. */
type ReactToPostResponse = ResponseOf<typeof reactToPostContract>;
/** Validates the post whose reaction the caller wants to remove. */
declare const deleteReactionRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        postId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Defines the empty response returned after deleting a reaction. */
declare const deleteReactionResponseSchema: z.ZodVoid;
/** Defines the contract for deleting the caller's reaction from a post. */
declare const deleteReactionContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            postId: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the delete-reaction endpoint. */
type DeleteReactionParams = ParamsOf<typeof deleteReactionContract>;
/** Empty response returned after deleting a reaction. */
type DeleteReactionResponse = ResponseOf<typeof deleteReactionContract>;

/** Validates the public profile fields shown in the social summary. */
declare const socialSummaryParticipantPreviewSchema: z.ZodObject<{
    userId: z.ZodString;
    username: z.ZodString;
    fullName: z.ZodString;
    profilePicPath: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Validates the authenticated user's social summary. */
declare const getSocialSummaryResponseSchema: z.ZodObject<{
    activeCrewCount: z.ZodNumber;
    participantPreviews: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        username: z.ZodString;
        fullName: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** Defines the response contract for retrieving the authenticated user's social summary. */
declare const getSocialSummaryContract: {
    response: z.ZodObject<{
        activeCrewCount: z.ZodNumber;
        participantPreviews: z.ZodArray<z.ZodObject<{
            userId: z.ZodString;
            username: z.ZodString;
            fullName: z.ZodString;
            profilePicPath: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
/** Social summary containing the caller's active crew total and up to three unique co-members. */
type GetSocialSummaryResponse = ResponseOf<typeof getSocialSummaryContract>;

/** Validates user-search text and cursor pagination. */
declare const searchSocialUsersRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        search: z.ZodString;
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates a page of public user search results. */
declare const searchSocialUsersResponseSchema: z.ZodObject<{
    users: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        username: z.ZodString;
        fullName: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the social user-search request and response. */
declare const searchSocialUsersContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            search: z.ZodString;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        users: z.ZodArray<z.ZodObject<{
            userId: z.ZodString;
            username: z.ZodString;
            fullName: z.ZodString;
            profilePicPath: z.ZodNullable<z.ZodString>;
            createdAt: z.ZodString;
        }, z.core.$strip>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Query accepted by social user search. */
type SearchSocialUsersQuery = QueryOf<typeof searchSocialUsersContract>;
/** Response returned by social user search. */
type SearchSocialUsersResponse = ResponseOf<typeof searchSocialUsersContract>;
/** Validates the user ID used to retrieve one public profile. */
declare const getSocialUserRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        userId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the public profile returned for one user. */
declare const getSocialUserResponseSchema: z.ZodObject<{
    userId: z.ZodString;
    username: z.ZodString;
    fullName: z.ZodString;
    profilePicPath: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the get-social-user request and response. */
declare const getSocialUserContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            userId: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        userId: z.ZodString;
        username: z.ZodString;
        fullName: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Route parameters accepted by the get-social-user endpoint. */
type GetSocialUserParams = ParamsOf<typeof getSocialUserContract>;
/** Public profile returned by the get-social-user endpoint. */
type GetSocialUserResponse = ResponseOf<typeof getSocialUserContract>;

export { type AddCommentBody, type AddCommentParams, type AddCommentResponse, type AnalyzeVideoPayloadDto, type AnalyzeVideoResultPayloadDto, type AppleOAuthBody, type BodyOf, type ConfirmEmailChangeQuery, type Contract, type CreateAerobicEntryBody, type CreateAerobicEntryQuery, type CreateCrewBody, type CreateCrewResponse, type CreatePasswordResetRequestBody, type CreatePostBody, type CreatePostResponse, type CreateUserBody, type CreateUserResponse, type CreateVerificationEmailBody, type CreateVideoUploadUrlBody, type CreateVideoUploadUrlResponse, type CreateWebSocketTicketBody, type CreateWebSocketTicketResponse, type CreateWorkoutSessionBody, type CreateWorkoutSessionResponse, type DeleteAerobicEntryParams, type DeleteAerobicEntryQuery, type DeleteAerobicEntryResponse, type DeleteCommentParams, type DeleteCommentResponse, type DeleteCrewParams, type DeleteCrewProfilePictureParams, type DeleteCrewProfilePictureResponse, type DeleteCrewResponse, type DeleteMessageParams, type DeleteMessageResponse, type DeletePostParams, type DeletePostResponse, type DeleteProfilePictureBody, type DeleteReactionParams, type DeleteReactionResponse, type EditCommentBody, type EditCommentParams, type EditCommentResponse, type EnqueueAnalyzeVideoParamsDto, type GetAerobicHistoryQuery, type GetAerobicHistoryResponse, type GetCrewParams, type GetCrewResponse, type GetCurrentUserResponse, type GetExerciseHistoryQuery, type GetExerciseHistoryResponse, type GetPersonalRecordsQuery, type GetPersonalRecordsResponse, type GetReminderSettingsResponse, type GetSocialSummaryResponse, type GetSocialUserParams, type GetSocialUserResponse, type GetVerificationStatusQuery, type GetWorkoutHistoryQuery, type GetWorkoutHistoryResponse, type GetWorkoutPlanQuery, type GetWorkoutPlanResponse, type GetWorkoutSchedulesResponse, type GetWorkoutStatisticsResponse, type GoogleOAuthBody, type InviteCrewUserBody, type InviteCrewUserParams, type InviteCrewUserResponse, type LeaveCrewParams, type LeaveCrewResponse, type ListCrewInvitationsResponse, type ListCrewParticipantsParams, type ListCrewParticipantsQuery, type ListCrewParticipantsResponse, type ListCrewPostsParams, type ListCrewPostsQuery, type ListCrewPostsResponse, type ListCrewsQuery, type ListCrewsResponse, type ListExercisesResponse, type ListMessagesQuery, type ListMessagesResponse, type ListMyCrewsQuery, type ListMyCrewsResponse, type ListPendingCrewJoinRequestsParams, type ListPendingCrewJoinRequestsResponse, type ListPostCommentsParams, type ListPostCommentsQuery, type ListPostCommentsResponse, type ListPostReactionsParams, type ListPostReactionsQuery, type ListPostReactionsResponse, type ListVisiblePostsQuery, type ListVisiblePostsResponse, type LoginRequestBody, type LoginResponse, type LogoutResponse, type MarkMessageAsReadParams, type MarkMessageAsReadResponse, type OAuthLoginResponse, type ParamsOf, type QueryOf, type ReactToPostBody, type ReactToPostParams, type ReactToPostResponse, type RefreshTokenResponse, type ReplaceCrewProfilePictureParams, type ReplaceCrewProfilePictureResponse, type ReplaceProfilePictureResponse, type ReplacePushTokenBody, type ReplaceWorkoutPlanBody, type ReplaceWorkoutPlanResponse, type ReplaceWorkoutSchedulesBody, type ReplaceWorkoutSchedulesResponse, type RequestOf, type RequestSchema, type RequestToJoinCrewParams, type RequestToJoinCrewResponse, type ResetPasswordBody, type ResetPasswordQuery, type ResetPasswordResponse, type ResponseOf, type SearchSocialUsersQuery, type SearchSocialUsersResponse, type SquatRepetitionDto, type UpdateAerobicEntryBody, type UpdateAerobicEntryParams, type UpdateAerobicEntryQuery, type UpdateAerobicEntryResponse, type UpdateCrewBody, type UpdateCrewParams, type UpdateCrewParticipationRequestStatusBody, type UpdateCrewParticipationRequestStatusParams, type UpdateCrewParticipationRequestStatusResponse, type UpdateCrewResponse, type UpdateCurrentUserBody, type UpdateCurrentUserResponse, type UpdatePostBody, type UpdatePostParams, type UpdatePostResponse, type UpdateReminderTimeZoneBody, type UpdateReminderTimeZoneResponse, type UpdateUnverifiedAccountEmailBody, type UpsertReminderSettingsBody, type UpsertReminderSettingsResponse, type UserDataResponse, type VerifyEmailQuery, addCommentContract, addCommentRequestSchema, addCommentResponseSchema, analyzeVideoPayloadDtoSchema, analyzeVideoResultPayloadDtoSchema, appleOAuthContract, appleOAuthRequestSchema, confirmEmailChangeContract, confirmEmailChangeRequestSchema, createAerobicEntryContract, createAerobicEntryRequestSchema, createAerobicEntryResponseSchema, createCrewContract, createCrewRequestSchema, createCrewResponseSchema, createPasswordResetRequestContract, createPasswordResetRequestSchema, createPostContract, createPostRequestSchema, createPostResponseSchema, createUserContract, createUserRequestSchema, createUserResponseSchema, createUserUserSchema, createVerificationEmailContract, createVerificationEmailRequestSchema, createVideoUploadUrlContract, createVideoUploadUrlRequestSchema, createVideoUploadUrlResponseSchema, createWebSocketTicketContract, createWebSocketTicketRequestSchema, createWebSocketTicketResponseSchema, createWorkoutSessionContract, createWorkoutSessionRequestSchema, createWorkoutSessionResponseSchema, deleteAerobicEntryContract, deleteAerobicEntryRequestSchema, deleteCommentContract, deleteCommentRequestSchema, deleteCommentResponseSchema, deleteCrewContract, deleteCrewProfilePictureContract, deleteCrewProfilePictureRequestSchema, deleteCrewRequestSchema, deleteCrewResponseSchema, deleteMessageContract, deleteMessageRequestSchema, deleteMessageResponseSchema, deletePostContract, deletePostRequestSchema, deletePostResponseSchema, deleteProfilePictureContract, deleteProfilePictureRequestSchema, deleteReactionContract, deleteReactionRequestSchema, deleteReactionResponseSchema, editCommentContract, editCommentRequestSchema, editCommentResponseSchema, enqueueAnalyzeVideoParamsDtoSchema, getAerobicHistoryContract, getAerobicHistoryRequestSchema, getAerobicHistoryResponseSchema, getCrewContract, getCrewRequestSchema, getCrewResponseSchema, getCurrentUserContract, getCurrentUserResponseSchema, getExerciseHistoryContract, getExerciseHistoryRequestSchema, getExerciseHistoryResponseSchema, getPersonalRecordsContract, getPersonalRecordsRequestSchema, getPersonalRecordsResponseSchema, getReminderSettingsContract, getReminderSettingsResponseSchema, getSocialSummaryContract, getSocialSummaryResponseSchema, getSocialUserContract, getSocialUserRequestSchema, getSocialUserResponseSchema, getVerificationStatusContract, getVerificationStatusRequestSchema, getWorkoutHistoryContract, getWorkoutHistoryRequestSchema, getWorkoutHistoryResponseSchema, getWorkoutPlanContract, getWorkoutPlanRequestSchema, getWorkoutPlanResponseSchema, getWorkoutSchedulesContract, getWorkoutSchedulesResponseSchema, getWorkoutStatisticsContract, getWorkoutStatisticsResponseSchema, googleOAuthContract, googleOAuthRequestSchema, inviteCrewUserContract, inviteCrewUserRequestSchema, leaveCrewContract, leaveCrewRequestSchema, leaveCrewResponseSchema, listCrewInvitationsContract, listCrewInvitationsRequestSchema, listCrewInvitationsResponseSchema, listCrewParticipantsContract, listCrewParticipantsRequestSchema, listCrewParticipantsResponseSchema, listCrewPostsContract, listCrewPostsRequestSchema, listCrewPostsResponseSchema, listCrewsContract, listCrewsRequestSchema, listCrewsResponseSchema, listExercisesContract, listExercisesResponseSchema, listMessagesContract, listMessagesRequestSchema, listMessagesResponseSchema, listMyCrewsContract, listMyCrewsRequestSchema, listMyCrewsResponseSchema, listPendingCrewJoinRequestsContract, listPendingCrewJoinRequestsRequestSchema, listPendingCrewJoinRequestsResponseSchema, listPostCommentsContract, listPostCommentsRequestSchema, listPostCommentsResponseSchema, listPostReactionsContract, listPostReactionsRequestSchema, listPostReactionsResponseSchema, listVisiblePostsContract, listVisiblePostsRequestSchema, listVisiblePostsResponseSchema, loginContract, loginRequestSchema, loginResponseSchema, logoutContract, logoutResponseSchema, markMessageAsReadContract, markMessageAsReadRequestSchema, markMessageAsReadResponseSchema, oAuthLoginContract, oAuthLoginResponseSchema, proceedLoginResponseSchema, reactToPostContract, reactToPostRequestSchema, reactToPostResponseSchema, refreshTokenContract, refreshTokenResponseSchema, replaceCrewProfilePictureContract, replaceCrewProfilePictureRequestSchema, replaceCrewProfilePictureResponseSchema, replaceProfilePictureContract, replaceProfilePictureResponseSchema, replacePushTokenContract, replacePushTokenRequestSchema, replaceWorkoutPlanContract, replaceWorkoutPlanRequestSchema, replaceWorkoutPlanResponseSchema, replaceWorkoutSchedulesContract, replaceWorkoutSchedulesRequestSchema, requestToJoinCrewContract, requestToJoinCrewRequestSchema, resetPasswordContract, resetPasswordRequestSchema, resetPasswordResponseSchema, searchSocialUsersContract, searchSocialUsersRequestSchema, searchSocialUsersResponseSchema, serializedDateSchema, socialSummaryParticipantPreviewSchema, squatRepetitionDtoSchema, timezoneSchema, updateAerobicEntryContract, updateAerobicEntryRequestSchema, updateCrewContract, updateCrewParticipationRequestStatusContract, updateCrewParticipationRequestStatusRequestSchema, updateCrewRequestSchema, updateCrewResponseSchema, updateCurrentUserContract, updateCurrentUserRequestSchema, updateCurrentUserResponseSchema, updatePostContract, updatePostRequestSchema, updatePostResponseSchema, updateReminderTimeZoneContract, updateReminderTimeZoneRequestSchema, updateUnverifiedAccountEmailContract, updateUnverifiedAccountEmailRequestSchema, upsertReminderSettingsContract, upsertReminderSettingsRequestSchema, userDataContract, userDataResponseSchema, verifyEmailContract, verifyEmailRequestSchema };
