export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ success: false, message: "Not Found", error: { code: "not_found" }, data: null });
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || "internal_error";
  const message = err.message || "Internal Server Error";
  try {
    // basic server-side logging
    // eslint-disable-next-line no-console
    console.error(code, message, err.stack);
  } catch {}
  if (err.code === "P2002") {
    return res
      .status(409)
      .json({ success: false, message: "Unique constraint violation", error: { code: "unique_violation", details: err.meta }, data: null });
  }
  if (err.name === "ZodError") {
    return res
      .status(400)
      .json({ success: false, message: "Validation failed", error: { code: "validation_error", details: err.errors }, data: null });
  }
  res.status(status).json({ success: false, message, error: { code }, data: null });
};
