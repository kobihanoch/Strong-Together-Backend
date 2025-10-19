import * as jose from "jose";
import createError from "http-errors";

const DPOP_EXPIRATION_SECONDS = 60;

// Allowed production domains (hardcoded)
const ALLOWED_BASES = [
  process.env.PUBLIC_BASE_URL,
  process.env.PUBLIC_BASE_URL_RENDER_DEFAULT,
  process.env.PRIVATE_BASE_URL_DEV,
];

export default async function dpopValidationMiddleware(req, res, next) {
  const dpopProof = req.headers["dpop"];
  if (!dpopProof) {
    return next(createError(401, "DPoP proof is missing in the request."));
  }

  try {
    // 1) Verify JWS using public JWK from header
    const { payload, protectedHeader } = await jose.compactVerify(
      dpopProof,
      (h) => {
        const jwk = h.jwk;
        if (!jwk) throw createError(400, "DPoP header must contain jwk.");
        if (h.alg !== "ES256") throw createError(401, "Unsupported DPoP alg.");
        if (jwk.kty !== "EC" || jwk.crv !== "P-256") {
          throw createError(401, "Invalid DPoP JWK (must be EC P-256).");
        }
        const { kid, ...publicJwkToImport } = jwk;
        return jose.importJWK(publicJwkToImport, h.alg);
      }
    );

    const claims = JSON.parse(new TextDecoder().decode(payload));

    // 2) Validate typ
    if ((protectedHeader.typ || "").toLowerCase() !== "dpop+jwt") {
      return next(createError(401, "Invalid DPoP typ."));
    }

    // 3) Validate method
    const htm = (claims.htm || "").toUpperCase();
    if (htm !== req.method) {
      return next(createError(401, "DPoP proof HTM mismatch."));
    }

    // 4) Validate HTU
    const proto = req.protocol;
    const host = (req.get("host") || "").trim();
    if (!host) return next(createError(400, "Missing Host header."));

    const serverURL = new URL(`${proto}://${host}${req.originalUrl}`);
    const htuURL = new URL(claims.htu);

    // Check allowed base domains
    const isAllowed = ALLOWED_BASES.some(
      (base) => base.toLowerCase() === htuURL.origin.toLowerCase()
    );

    if (!isAllowed) {
      return next(createError(401, `DPoP request host not allowed.`));
    }

    const serverPath =
      serverURL.pathname.replace(/\/+$/, "").toLowerCase() || "/";
    const clientPath = htuURL.pathname.replace(/\/+$/, "").toLowerCase() || "/";

    if (clientPath !== serverPath) {
      return next(createError(401, `DPoP proof HTU mismatch.`));
    }

    // 5) Validate IAT
    const now = Math.floor(Date.now() / 1000);
    if (now - claims.iat > DPOP_EXPIRATION_SECONDS || claims.iat > now + 5) {
      return next(
        createError(401, "DPoP proof is expired or timestamp is invalid.")
      );
    }

    // 6) Attach JKT
    const jkt = await jose.calculateJwkThumbprint(
      protectedHeader.jwk,
      "sha256"
    );
    req.dpopJkt = jkt;

    return next();
  } catch (error) {
    console.error("DPoP Proof validation failed:", error?.message || error);
    return next(createError(401, "Invalid DPoP proof signature or format."));
  }
}
