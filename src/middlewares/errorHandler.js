export const errorHandler = (err, req, res, next) => {
  // Log to dev console error stack
  // Log to prod console error message
  console.error(
    process.env.NODE_ENV == "development" ? err.stack : err.message
  );
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
