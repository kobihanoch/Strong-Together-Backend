// English comments only inside the code

import createError from "http-errors";

// Public endpoints that should bypass the version gate (extend as needed)
const EXEMPT_PREFIXES = [
  "/health",
  "/api/auth/verify",
  "/api/auth/resetpassword",
  "/api/auth/forgotpassemail",
];

// Parse "v4.2.1", "4.2", or "4" into [major, minor, patch] (numbers)
function toParts(v) {
  const parts = String(v || "")
    .replace(/^v/i, "")
    .split(/[^\d]+/)
    .filter(Boolean)
    .map((n) => parseInt(n, 10));
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}

// Compare a vs b as semantic versions: returns -1, 0, or 1
function compareVersions(a, b) {
  const A = toParts(a);
  const B = toParts(b);
  if (A[0] !== B[0]) return A[0] < B[0] ? -1 : 1;
  if (A[1] !== B[1]) return A[1] < B[1] ? -1 : 1;
  if (A[2] !== B[2]) return A[2] < B[2] ? -1 : 1;
  return 0;
}

export const checkAppVersion = (req, res, next) => {
  // Skip exempt paths (prefix-based)
  if (EXEMPT_PREFIXES.some((p) => req.path.startsWith(p))) return next();

  // Read current version and minimum allowed
  const current = req.headers["x-app-version"]; // case-insensitive
  const min = process.env.MIN_APP_VERSION || "0.0.0";

  // If header missing
  if (!current) {
    res.setHeader("x-min-version", min);
    return next(createError(426, `Please update the app on AppStore`));
  }

  // Compare semver-like (major -> minor -> patch)
  if (compareVersions(current, min) < 0) {
    res.setHeader("x-min-Version", min);
    return next(createError(426, `Please update the app on AppStore`));
  }

  // Optional: expose the minimum in responses
  res.setHeader("x-min-version", min);
  return next();
};
