import createError from "http-errors";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    throw createError(
      400,
      result.error?.issues?.[0]?.message || "Invalid Input"
    );
  }
  next();
};
