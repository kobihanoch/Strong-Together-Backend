import jwt from "jsonwebtoken";

export function buildVerifyUrl(userId) {
  // Create a short-lived JWT (e.g., 1h)
  const token = jwt.sign(
    { sub: userId, typ: "email-verify" }, // payload
    process.env.JWT_VERIFY_SECRET, // strong secret in env
    { expiresIn: "1h", issuer: "strong-together" } // claims
  );
  // Public HTTPS domain (not local IP)
  const base = "http://10.0.0.39:5000"; //process.env.PUBLIC_BASE_URL; // e.g., https://api.yourdomain.com
  return `${base}/api/auth/verify?token=${token}`;
}
