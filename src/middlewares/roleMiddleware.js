export const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({ message: "Access forbidden: Insufficient role" });
    }
    next();
  };
};
