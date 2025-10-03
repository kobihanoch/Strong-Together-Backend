// src/controllers/userController.js
import bcrypt from "bcryptjs";
import createError from "http-errors";
import {
  queryUserExistsByUsernameOrEmail,
  queryInsertUser,
  queryAuthenticatedUserById,
  queryUsernameOrEmailConflict,
  queryUpdateAuthenticatedUser,
  queryDeleteUserById,
  queryUserUsernamePicAndName,
  queryGetUserProfilePicURL,
  queryUpdateUserProfilePicURL,
} from "../queries/userQueries.js";
import sql from "../config/db.js";
import { Expo } from "expo-server-sdk";
import {
  deleteFromSupabase,
  uploadBufferToSupabase,
} from "../services/supabaseStorageService.js";
const expo = new Expo();
import path from "path";
import mime from "mime";
import { sendVerificationEmail } from "../services/emailService.js";

// ---------- HELPERS -----------------
export const getUserData = async (userId) => {
  const rows = await queryAuthenticatedUserById(userId);
  const [user] = rows;
  return { payload: user.user_data };
};

// -----------------------------------------------------------

// @desc    Create a new user
// @route   POST /api/users/create
// @access  Public
export const createUser = async (req, res) => {
  const { username, fullName, email, password, gender } = req.body;
  // Check if user already exists
  const rowsExists = await queryUserExistsByUsernameOrEmail(username, email);
  const [user] = rowsExists;
  if (user) throw createError(400, "User already exists");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const rowsCreated = await queryInsertUser(
    username,
    fullName,
    email,
    gender,
    hash
  );
  const [created] = rowsCreated;

  await sendVerificationEmail(email, created.id, fullName);

  res
    .status(201)
    .json({ message: "User created successfully!", user: created });
};

// @desc    Get authenticated user by ID
// @route   GET /api/users/get
// @access  Private
export const getAuthenticatedUserById = async (req, res) => {
  const { payload } = await getUserData(req.user.id);
  res.status(200).json(payload);
};

// @desc    Update authenticated user
// @route   PUT /api/users/updateself
// @access  Private
export const updateAuthenticatedUser = async (req, res) => {
  const {
    username = null,
    fullName = null,
    email = null,
    gender = null,
    password = null,
    profileImgUrl = null,
    pushToken = null,
  } = req.body;
  if (username || email) {
    const rowsConflict = await queryUsernameOrEmailConflict(
      username,
      email,
      req.user.id
    );
    const [conflict] = rowsConflict;
    if (conflict) throw createError(409, "Username or email already in use");
  }

  let hashed = null;
  if (password) {
    hashed = await bcrypt.hash(password, 10);
  }

  const rowsUpdated = await queryUpdateAuthenticatedUser(req.user.id, {
    username,
    fullName,
    email,
    gender,
    hashed,
    profileImgUrl,
    pushToken,
  });
  const [updated] = rowsUpdated;

  res.status(200).json({
    message: "User updated successfully",
    user: updated.user_data,
  });
};

// @desc    Delete a user by ID
// @route   DELETE /api/users/deleteself
// @access  Private/Admin
export const deleteSelfUser = async (req, res) => {
  await queryDeleteUserById(req.user.id);
  res.json({ message: "User deleted successfully" });
};

// @desc    Save user's expo push token to DB
// @route   PUT /api/users/pushtoken
// @access  Private
export const saveUserPushToken = async (req, res) => {
  await sql`UPDATE users SET push_token=${req.body.token} WHERE id=${req.user.id}`;
  res.status(204).end();
};

// @desc    Stores profile pic in bucket, and updates user DB to profile pic new URL
// @route   PUT /api/users/setprofilepic
// @access  Private
export const setProfilePicAndUpdateDB = async (req, res) => {
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
    process.env.BUCKET_NAME,
    key,
    req.file.buffer,
    req.file.mimetype
  );

  // Get last profile pic url to delete
  const [row] = await queryGetUserProfilePicURL(userId);
  const oldPath = row?.profile_image_url;

  // Update user profile url
  await queryUpdateUserProfilePicURL(userId, newPath);

  // Delete last image from bucket
  if (oldPath && oldPath !== newPath) {
    deleteFromSupabase(oldPath).catch((e) =>
      console.warn(
        "Failed to delete old profile image:",
        e?.response?.data || e.message
      )
    );
  }

  return res
    .status(201)
    .json({ path: newPath, url: publicUrl, message: "Upload success" });
};

// @desc    Deletes a pic from bucket and from user DB
// @route   DELETE /api/users/deleteprofilepic
// @access  Private
export const deleteUserProfilePic = async (req, res) => {
  await deleteFromSupabase(req.body.path);
  // Update user profile url
  await queryUpdateUserProfilePicURL(req.user.id, null);
  return res.status(200).end();
};
