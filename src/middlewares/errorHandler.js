export const errorHandler = (err, req, res, next) => {
  // Log to dev console error stack
  // Log to prod console error message
  const statusCode = err.statusCode || 500;

  const logMessage =
    process.env.NODE_ENV === "development" ? err.stack : err.message;

  console.error(`[Error ${err.statusCode}]: ${logMessage}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
