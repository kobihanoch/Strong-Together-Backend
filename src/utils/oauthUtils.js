import { createRemoteJWKSet, jwtVerify } from "jose";
import createError from "http-errors";

const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs")
);

// Allow both dev and prod iOS client IDs as valid audiences
const GOOGLE_ALLOWED_AUDIENCES = new Set([
  "251052469921-m94nh37mk2tpeda5ft32p5k6sbll46ad.apps.googleusercontent.com", // dev iOS
  "251052469921-49q99ipshcsktkt3v6hemmrdjbec8oo8.apps.googleusercontent.com", // prod iOS
]);

export async function verifyGoogleIdToken(idToken) {
  // Verify signature and standard claims
  const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    // We check 'aud' manually since we allow two client IDs
    audience: undefined,
  });

  // Strict audience check
  if (!payload.aud || !GOOGLE_ALLOWED_AUDIENCES.has(payload.aud)) {
    throw createError(400, "Invalid audience for Google ID token");
  }

  // Extract useful fields
  return {
    googleSub: payload.sub,
    email: payload.email || null,
    emailVerified: payload.email_verified === true,
    fullName: payload.name || null,
    picture: payload.picture || null,
    raw: payload,
  };
}

export async function ensureUniqueUsername(trx, candidate) {
  // If no candidate (no email or full name) => random fallback
  if (!candidate) return `user_${Math.random().toString(36).slice(2, 8)}`;

  // Start with the base name (e.g., "kobi")
  let username = candidate.toLowerCase();
  let i = 0;

  // Keep checking until we find a username that does not exist
  while (true) {
    const exists =
      await trx`SELECT 1 FROM users WHERE username = ${username} LIMIT 1`;

    if (exists.length === 0) {
      // Found a free username
      return username;
    }

    // Append a number (e.g., kobi1, kobi2, ...)
    i += 1;
    username = `${candidate}${i}`;
  }
}
