import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Expo } from "expo-server-sdk";
import createError from "http-errors";
import mime from "mime";
import path from "path";
import sql from "../config/db.js";
import {
  queryAuthenticatedUserById,
  queryDeleteUserById,
  queryGetUserProfilePicURL,
  queryInsertUser,
  queryUpdateAuthenticatedUser,
  queryUpdateUserProfilePicURL,
  queryUserExistsByUsernameOrEmail,
} from "../queries/userQueries.js";
import {
  sendVerificationEmail,
  sendVerificationEmailForEmailUpdate,
} from "../services/emailService.js";
import {
  deleteFromSupabase,
  uploadBufferToSupabase,
} from "../services/supabaseStorageService.js";
import {
  generateEmailChangeFailedHTML,
  generateEmailChangeSuccessHTML,
} from "../templates/responseHTMLTemplates.js";
import { decodeChangeEmailToken } from "../utils/tokenUtils.js";
import { cacheStoreJti } from "../utils/cache.js";
import { AuthenticatedRequest } from "../types/sharedTypes.js";
import {
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserBody,
  UpdateAuthenticatedUserResponse,
  UserDataResponse,
  ChangeEmailTokenPayload,
  GetAuthenticatedUserByIdResponse,
  SaveUserPushTokenRequest,
  SetProfilePicAndUpdateDBResponse,
  DeleteUserProfilePicRequest,
} from "../types/userTypes.js";
import { UserEntity } from "../types/db/entities.js";

const expo = new Expo();

// ---------- HELPERS -----------------
export const getUserData = async (
  userId: string,
): Promise<{ payload: UserDataResponse["user_data"] }> => {
  const rows = (await queryAuthenticatedUserById(
    userId,
  )) as unknown as UserDataResponse[];
  const [user] = rows;
  if (!user) throw createError(404, "User not found");
  return { payload: user.user_data };
};

export const updateUsersReminderSettingsTimezone = async (
  userId: string,
  tz: string,
): Promise<void> => {
  await sql`update public.user_reminder_settings urs set timezone=${tz}::text where urs.user_id = ${userId}::uuid and urs.timezone is distinct from ${tz}::text;`;
};

// -----------------------------------------------------------

// @desc    Create a new user
// @route   POST /api/users/create
// @access  Public
export const createUser = async (
  req: Request<{}, {}, CreateUserRequest>,
  res: Response<CreateUserResponse>,
): Promise<void | Response> => {
  const { username, fullName, email, password, gender } = req.body;
  // Check if user already exists
  const rowsExists = (await queryUserExistsByUsernameOrEmail(
    username,
    email,
  )) as unknown as Pick<UserEntity, "id">[];
  const [user] = rowsExists;
  if (user) throw createError(400, "User already exists");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const created = (await queryInsertUser(
    username,
    fullName,
    email,
    gender,
    hash,
  )) as UserEntity;

  await sendVerificationEmail(email as string, created.id, fullName);

  return res
    .status(201)
    .json({ message: "User created successfully!", user: created });
};

// @desc    Get authenticated user by ID
// @route   GET /api/users/get
// @access  Private
export const getAuthenticatedUserById = async (
  req: AuthenticatedRequest,
  res: Response<GetAuthenticatedUserByIdResponse>,
): Promise<void | Response> => {
  const { payload } = await getUserData(req.user.id);
  return res.status(200).json(payload);
};

// @desc    Update authenticated user
// @route   PUT /api/users/updateself
// @access  Private
export const updateAuthenticatedUser = async (
  req: AuthenticatedRequest<UpdateUserBody>,
  res: Response<UpdateAuthenticatedUserResponse>,
): Promise<void | Response> => {
  const {
    username = null,
    fullName = null,
    email = null,
    gender = null,
    password = null,
    profileImgUrl = null,
    pushToken = null,
    setCompletedOnOAuth = false,
  } = req.body;

  let hashed: string | null = null;
  if (password) {
    hashed = await bcrypt.hash(password, 10);
  }

  let rowsUpdated: UserDataResponse[];
  try {
    rowsUpdated = (await queryUpdateAuthenticatedUser(
      req.user.id,
      { username, fullName, gender, hashed, profileImgUrl, pushToken },
      setCompletedOnOAuth,
      email as any, // emailCandidate for the probe (may be null)
    )) as unknown as UserDataResponse[];
  } catch (e: any) {
    if (e.code === "23505") {
      throw createError(409, "Username or email already in use");
    }
    throw e;
  }

  const [updated] = rowsUpdated;

  // fetch current name and current email to decide if we really changed it
  const [userRow] = (await sql`
    SELECT name, email
    FROM users
    WHERE id = ${req.user.id}
    LIMIT 1
  `) as Pick<UserEntity, "name" | "email">[];

  if (!userRow)
    return res.status(404).json({ message: "User not found" } as any);

  const currentEmail = (userRow.email || "").trim().toLowerCase();
  const candidate = (email || "").trim().toLowerCase();

  let emailChanged = false;
  if (candidate && candidate !== currentEmail) {
    await sendVerificationEmailForEmailUpdate(
      candidate,
      req.user.id,
      userRow.name || "there",
    );
    emailChanged = true;
  }

  return res.status(200).json({
    message: "User updated successfully",
    emailChanged,
    user: updated.user_data,
  });
};

// @desc    Confirm email change (via link)
// @route   PUT /api/users/changeemail?token=...
// @access  Public (link-based)
export const updateSelfEmail = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const token = req.query?.token as string | undefined;
  if (!token)
    return res
      .status(401)
      .type("html")
      .set("Cache-Control", "no-store")
      .send(generateEmailChangeFailedHTML("Missing token"));

  const decoded = decodeChangeEmailToken(
    token,
  ) as ChangeEmailTokenPayload | null;
  if (!decoded)
    return res
      .status(401)
      .type("html")
      .set("Cache-Control", "no-store")
      .send(generateEmailChangeFailedHTML("Invalid or expired link"));

  const { jti, sub, newEmail, exp, iss, typ } = decoded;

  // basic claim validation
  if (
    iss !== "strong-together" ||
    typ !== "email-confirm" ||
    !jti ||
    !sub ||
    !newEmail ||
    !exp
  ) {
    return res
      .status(400)
      .type("html")
      .set("Cache-Control", "no-store")
      .send(generateEmailChangeFailedHTML("Malformed token"));
  }

  // compute remaining TTL from exp (JWT 'exp' is seconds since epoch)
  const nowSec = Math.floor(Date.now() / 1000);
  const ttlSec = Math.max(1, exp - nowSec);

  // JTI single-use allow-list
  const inserted = await cacheStoreJti("emailchange", jti, ttlSec);
  if (!inserted) {
    return res
      .status(401)
      .type("html")
      .set("Cache-Control", "no-store")
      .send(generateEmailChangeFailedHTML("URL already used or expired"));
  }

  const normalized = newEmail.trim().toLowerCase();

  try {
    await sql.begin(async (trx) => {
      await trx`
        UPDATE users
        SET email = ${normalized}
        WHERE id = ${sub}
      `;
    });
  } catch (e: any) {
    if (e.code === "23505") {
      console.error("Email already in use");
      return res
        .status(409)
        .type("html")
        .set("Cache-Control", "no-store")
        .send(generateEmailChangeFailedHTML("Email already in use"));
    }
    console.error(e.message);
    return res
      .status(500)
      .type("html")
      .set("Cache-Control", "no-store")
      .send(generateEmailChangeFailedHTML("Server error"));
  }

  // return HTML 200 (not 204)
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res
    .status(200)
    .type("html")
    .set("Cache-Control", "no-store")
    .send(generateEmailChangeSuccessHTML());
};

// @desc    Delete a user by ID
// @route   DELETE /api/users/deleteself
// @access  Private/Admin
export const deleteSelfUser = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void | Response> => {
  await queryDeleteUserById(req.user.id);
  return res.json({ message: "User deleted successfully" });
};

// @desc    Save user's expo push token to DB
// @route   PUT /api/users/pushtoken
// @access  Private
export const saveUserPushToken = async (
  req: AuthenticatedRequest<SaveUserPushTokenRequest>,
  res: Response,
): Promise<void | Response> => {
  await sql`UPDATE users SET push_token=${req.body.token} WHERE id=${req.user.id}`;
  return res.status(204).end();
};

// @desc    Stores profile pic in bucket, and updates user DB to profile pic new URL
// @route   PUT /api/users/setprofilepic
// @access  Private
export const setProfilePicAndUpdateDB = async (
  req: AuthenticatedRequest & { file?: any },
  res: Response<SetProfilePicAndUpdateDBResponse>,
): Promise<void | Response> => {
  if (!req.file) {
    throw createError(400, "No file provided");
  }

  const userId = req.user.id;

  // Media params
  const ext =
    path.extname(req.file.originalname) ||
    `.${mime.getExtension(req.file.mimetype) || "jpg"}`;
  const key = `${userId}/${Date.now()}${ext}`;

  const { path: newPath, publicUrl } = await uploadBufferToSupabase(
    process.env.BUCKET_NAME as string,
    key,
    req.file.buffer,
    req.file.mimetype,
  );

  // Get last profile pic url to delete
  const [row] = (await queryGetUserProfilePicURL(userId)) as unknown as Pick<
    UserEntity,
    "profile_image_url"
  >[];
  const oldPath = row?.profile_image_url;

  // Update user profile url
  await queryUpdateUserProfilePicURL(userId, newPath);

  // Delete last image from bucket
  if (oldPath && oldPath !== newPath) {
    deleteFromSupabase(oldPath).catch((e: any) =>
      console.warn(
        "Failed to delete old profile image:",
        e?.response?.data || e.message,
      ),
    );
  }

  return res
    .status(201)
    .json({ path: newPath, url: publicUrl, message: "Upload success" });
};

// @desc    Deletes a pic from bucket and from user DB
// @route   DELETE /api/users/deleteprofilepic
// @access  Private
export const deleteUserProfilePic = async (
  req: AuthenticatedRequest<DeleteUserProfilePicRequest>,
  res: Response,
): Promise<void | Response> => {
  await deleteFromSupabase(req.body.path);
  // Update user profile url
  await queryUpdateUserProfilePicURL(req.user.id, null);
  return res.status(200).end();
};
