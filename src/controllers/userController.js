import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { username, fullName, email, password, birthDate, gender } = req.body;

    // Basic field validation
    if (
      !username ||
      !fullName ||
      !email ||
      !password ||
      !birthDate ||
      !gender
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating the user with hashed password
    const user = await User.create({
      username,
      fullName,
      email,
      password: hashedPassword,
      birthDate,
      gender,
      role: "user", // Always default to "user" at creation
    });

    res.status(201).json({
      message: "User created successfully!",
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        birthDate: user.birthDate,
        gender: user.gender,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user by ID
export const getAuthenticatedUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password +role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user by ID (Admin route)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password +role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user by ID
export const updateUser = async (req, res) => {
  try {
    const { username, fullName, email, birthDate, gender, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.birthDate = birthDate || user.birthDate;
    user.gender = gender || user.gender;
    user.role = role || user.role;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update authenticated user by ID
export const updateAuthenticatedUser = async (req, res) => {
  try {
    const { username, fullName, email, birthDate, gender } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.birthDate = birthDate || user.birthDate;
    user.gender = gender || user.gender;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
