import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import * as jose from 'jose';
import { appConfig } from '../../config/app.config.ts';
import { createLogger } from '../../infrastructure/logger.ts';
import { cacheStoreJti } from '../utils/cache.ts';

const DPOP_EXPIRATION_SECONDS = 60;
const logger = createLogger('middleware:dpop');

const ALLOWED_BASES = [
  appConfig.publicBaseUrl,
  appConfig.publicBaseUrlRenderDefault,
  appConfig.privateBaseUrlDev,
].filter((value): value is string => Boolean(value));

export default async function dpopValidationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!appConfig.dpopEnabled) {
    return next();
  }

  const rawDpop = req.headers['dpop'];
  const dpopProof = Array.isArray(rawDpop) ? rawDpop[0] : rawDpop;

  if (!dpopProof) {
    return next(createError(401, 'DPoP proof is missing in the request.'));
  }

  try {
    const { payload, protectedHeader } = await jose.compactVerify(dpopProof, (h) => {
      const jwk = h.jwk;
      if (!jwk) throw createError(400, 'DPoP header must contain jwk.');
      if (h.alg !== 'ES256') throw createError(401, 'Unsupported DPoP alg.');
      if (jwk.kty !== 'EC' || jwk.crv !== 'P-256') {
        throw createError(401, 'Invalid DPoP JWK (must be EC P-256).');
      }

      return jose.importJWK(jwk, h.alg);
    });

    const claims = JSON.parse(new TextDecoder().decode(payload));

    if ((protectedHeader.typ || '').toLowerCase() !== 'dpop+jwt') {
      return next(createError(401, 'Invalid DPoP typ.'));
    }

    const htm = (claims.htm || '').toUpperCase();
    if (htm !== req.method) {
      return next(createError(401, 'DPoP proof HTM mismatch.'));
    }

    const proto = req.protocol;
    const host = (req.get('host') || '').trim();
    if (!host) return next(createError(400, 'Missing Host header.'));

    const serverURL = new URL(`${proto}://${host}${req.originalUrl}`);
    const htuURL = new URL(claims.htu);

    const isAllowed = ALLOWED_BASES.some((base) => base.toLowerCase() === htuURL.origin.toLowerCase());

    if (!isAllowed) {
      return next(createError(401, 'DPoP request host not allowed.'));
    }

    const serverPath = serverURL.pathname.replace(/\/+$/, '').toLowerCase() || '/';
    const clientPath = htuURL.pathname.replace(/\/+$/, '').toLowerCase() || '/';

    if (clientPath !== serverPath) {
      return next(createError(401, 'DPoP proof HTU mismatch.'));
    }

    const now = Math.floor(Date.now() / 1000);
    if (now - claims.iat > DPOP_EXPIRATION_SECONDS || claims.iat > now + 60) {
      return next(createError(401, 'DPoP proof is expired or timestamp is invalid.'));
    }

    const jti = claims.jti;
    const inserted = await cacheStoreJti('dpop', jti, DPOP_EXPIRATION_SECONDS);
    if (!inserted) throw createError(401, 'DPoP already used');

    if (!protectedHeader.jwk) {
      return next(createError(400, 'DPoP header must contain jwk.'));
    }
    const jkt = await jose.calculateJwkThumbprint(protectedHeader.jwk, 'sha256');

    req.dpopJkt = jkt;
    req.dpopAth = claims.ath;

    return next();
  } catch (error) {
    if (error instanceof Error) {
      (req.logger || logger).error(
        { err: error, event: 'dpop.validation_failed', path: req.originalUrl },
        'DPoP proof validation failed',
      );
      return next(createError(401, 'Invalid DPoP proof signature or format.'));
    }
  }
}
