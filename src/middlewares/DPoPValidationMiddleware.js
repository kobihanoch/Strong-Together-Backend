// dpopValidationMiddleware.js
import * as jose from "jose";
import createError from "http-errors";

// Import or define your JTI storage/checking function
//import { checkAndStoreJti } from "./jtiStore";
// Use a placeholder for your custom error creation function
// const createError = (status, message) => { const e = new Error(message); e.status = status; return e; };

const DPOP_EXPIRATION_SECONDS = 60;

export async function dpopValidationMiddleware(req, res, next) {
  // Bypass for current users
  /*if (
    req.headers["x-app-version"] === "4.1.0" ||
    req.headers["x-app-version"] === "4.1.1" ||
    
  ) {
    return next();
  }*/

  const dpopProof = req.headers["dpop"];

  // 1. Check for DPoP Proof presence
  if (!dpopProof) {
    // Only for secured routes where DPoP is expected.
    return next(createError(401, "DPoP proof is missing in the request."));
  }

  try {
    // 2. JOSE: Decode and Verify Signature
    const verificationResult = await jose.compactVerify(
      dpopProof,
      // jose automatically imports the 'jwk' from the header to verify the signature
      (protectedHeader) => {
        const jwk = protectedHeader.jwk;
        if (!jwk) {
          throw next(createError("DPoP header must contain jwk."));
        }
        return jose.importJWK(jwk, protectedHeader.alg);
      }
    );

    const payload = JSON.parse(
      new TextDecoder().decode(verificationResult.payload)
    );
    const protectedHeader = JSON.parse(
      new TextDecoder().decode(verificationResult.protectedHeader)
    );

    // 3. Mandatory Claims Validation

    // a. JTI validation (Replay Attack Prevention)
    /*const isUnique = await checkAndStoreJti(
      payload.jti,
      DPOP_EXPIRATION_SECONDS
    );
    if (!isUnique) {
      return next(
        createError(401, "DPoP proof JTI reuse detected (Replay Attack).")
      );
    }*/

    // b. HTM (HTTP Method) validation
    const htm = payload.htm?.toUpperCase();
    if (htm !== req.method) {
      return next(createError(401, "DPoP proof HTM mismatch."));
    }

    // c. HTU (HTTP URI) validation
    // Crucial: Use the URI *before* any query parameters for security, or the canonical URL.
    // We ensure the HTU in the Proof matches the full URI (including path).
    // Note: req.originalUrl includes path and query, which is fine if the client sent the full URI.
    const requestUri = req.originalUrl;
    const htu = payload.htu;

    if (requestUri !== htu) {
      return next(
        createError(401, `DPoP proof HTU mismatch. Expected: ${requestUri}`)
      );
    }

    // d. IAT (Issued At) validation (Proof freshness)
    const now = Math.floor(Date.now() / 1000);
    // Proof must be recent (e.g., within 60 seconds) and not in the far future.
    if (now - payload.iat > DPOP_EXPIRATION_SECONDS || payload.iat > now + 5) {
      return next(
        createError(401, "DPoP proof is expired or timestamp is invalid.")
      );
    }

    // 4. Extract JKT (JWK Thumbprint) and pass it to the next middleware
    const jwk = protectedHeader.jwk;

    // Calculate the JKT from the JWK (using SHA-256 by convention)
    const jkt = await jose.calculateJwkThumbprint(jwk, "sha256");

    // Store JKT on the request object for the Auth Middleware
    req.dpopJkt = jkt;

    next();
  } catch (error) {
    // Catch signature failures, bad JWT format, etc.
    console.error("DPoP Proof validation failed:", error.message);
    return next(createError(401, "Invalid DPoP proof signature or format."));
  }
}
