import sql from "../config/db.js";

// @desc    Get all exercises
// @route   GET /api/exercises/getall
// @access  Private
export const getAllExercises = async (req, res) => {
  const data = await sql`SELECT * FROM exercises`;
  return res.status(200).json(data);
};
