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
} from "../queries/userQueries.js";

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

  res
    .status(201)
    .json({ message: "User created successfully!", user: created });
};

// @desc    Get all users
// @route   GET /api/users/all
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  /*const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const search = req.query.search || "";
  const sortField = req.query.sortField || "username";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
  const skip = (page - 1) * limit;

  if (page < 1 || limit < 1 || limit > 100) {
    throw createError(400, "Invalid pagination parameters");
  }

  // Free text search
  const filter = {
    $or: [
      { username: { $regex: search, $options: "i" } },
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { gender: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } },
    ],
  };

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password +role")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });*/
};

// @desc    Get authenticated user by ID
// @route   GET /api/users/get
// @access  Private
export const getAuthenticatedUserById = async (req, res) => {
  const rows = await queryAuthenticatedUserById(req.user.id);
  const [user] = rows;
  res.json(user.user_data);
};

// @desc    Get a user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  /*const user = await User.findById(req.params.id).select("-password +role");
  if (!user) throw createError(404, "User not found");
  res.json(user);*/
};

// @desc    Update a user by ID
// @route   PUT /api/users/update/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  /*// Locate user
  const user = await User.findById(req.params.id).select("+role"); // role is normally hidden
  if (!user) throw createError(404, "User not found");

  Object.assign(user, req.body);
  await user.save();

  // Re-fetch WITHOUT the password field and send back to client
  const updated = await User.findById(user._id).select("-password +role");

  res.status(200).json({
    message: "User updated successfully",
    user: updated,
  });*/
};

// @desc    Update authenticated user
// @route   PUT /api/users/update
// @access  Private
export const updateAuthenticatedUser = async (req, res) => {
  const {
    username,
    fullName,
    email,
    gender,
    password,
    profileImgUrl,
    pushToken,
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
// @route   DELETE /api/users/delete/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  await queryDeleteUserById(req.params.id);
  res.json({ message: "User deleted successfully" });
};

// @desc    Get a user username and porifle pic url
// @route   GET /api/users/getusernamepicandname/:id
// @access  Private
export const getUserUsernamePicAndName = async (req, res) => {
  const rows = await queryUserUsernamePicAndName(req.params.id);
  const [data] = rows;

  if (!data) {
    throw createError(404, "User not found");
  }
  res.status(200).json(data);
};
