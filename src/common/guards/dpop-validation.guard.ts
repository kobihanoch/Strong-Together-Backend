import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jose from 'jose';
import { appConfig } from '../../config/app.config.ts';
import { cacheStoreJti } from '../../infrastructure/cache/redis.cache.ts';
import { createLogger } from '../../infrastructure/logger.ts';
import type { AppRequest } from '../types/express.ts';

const DPOP_EXPIRATION_SECONDS = 60;

const ALLOWED_BASES = [
  appConfig.publicBaseUrl,
  appConfig.publicBaseUrlRenderDefault,
  appConfig.privateBaseUrlDev,
].filter((value): value is string => Boolean(value));

@Injectable()
export class DpopGuard implements CanActivate {
  private readonly logger = createLogger('middleware:dpop');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!appConfig.dpopEnabled) {
      return true;
    }

    const req = context.switchToHttp().getRequest<AppRequest>();
    const rawDpop = req.headers['dpop'];
    const dpopProof = Array.isArray(rawDpop) ? rawDpop[0] : rawDpop;

    if (!dpopProof) {
      throw new UnauthorizedException('DPoP proof is missing in the request.');
    }

    try {
      const { payload, protectedHeader } = await jose.compactVerify(dpopProof, (h) => {
        const jwk = h.jwk;
        if (!jwk) {
          throw new BadRequestException('DPoP header must contain jwk.');
        }

        if (h.alg !== 'ES256') {
          throw new UnauthorizedException('Unsupported DPoP alg.');
        }

        if (jwk.kty !== 'EC' || jwk.crv !== 'P-256') {
          throw new UnauthorizedException('Invalid DPoP JWK (must be EC P-256).');
        }

        return jose.importJWK(jwk, h.alg);
      });

      const claims = JSON.parse(new TextDecoder().decode(payload));

      if ((protectedHeader.typ || '').toLowerCase() !== 'dpop+jwt') {
        throw new UnauthorizedException('Invalid DPoP typ.');
      }

      const htm = (claims.htm || '').toUpperCase();
      if (htm !== req.method) {
        throw new UnauthorizedException('DPoP proof HTM mismatch.');
      }

      const proto = req.protocol;
      const host = (req.get('host') || '').trim();

      if (!host) {
        throw new BadRequestException('Missing Host header.');
      }

      const serverURL = new URL(`${proto}://${host}${req.originalUrl}`);
      const htuURL = new URL(claims.htu);

      const isAllowed = ALLOWED_BASES.some((base) => base.toLowerCase() === htuURL.origin.toLowerCase());

      if (!isAllowed) {
        throw new UnauthorizedException('DPoP request host not allowed.');
      }

      const serverPath = serverURL.pathname.replace(/\/+$/, '').toLowerCase() || '/';
      const clientPath = htuURL.pathname.replace(/\/+$/, '').toLowerCase() || '/';

      if (clientPath !== serverPath) {
        throw new UnauthorizedException('DPoP proof HTU mismatch.');
      }

      const now = Math.floor(Date.now() / 1000);
      if (now - claims.iat > DPOP_EXPIRATION_SECONDS || claims.iat > now + 60) {
        throw new UnauthorizedException('DPoP proof is expired or timestamp is invalid.');
      }

      const jti = claims.jti;
      if (!jti) {
        throw new UnauthorizedException('DPoP proof missing jti.');
      }

      const inserted = await cacheStoreJti('dpop', jti, DPOP_EXPIRATION_SECONDS);
      if (!inserted) {
        throw new UnauthorizedException('DPoP already used');
      }

      if (!protectedHeader.jwk) {
        throw new BadRequestException('DPoP header must contain jwk.');
      }

      const jkt = await jose.calculateJwkThumbprint(protectedHeader.jwk, 'sha256');

      req.dpopJkt = jkt;
      req.dpopAth = claims.ath;

      return true;
    } catch (error) {
      (req.logger || this.logger).error(
        { err: error, event: 'dpop.validation_failed', path: req.originalUrl },
        'DPoP proof validation failed',
      );

      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Invalid DPoP proof signature or format.');
    }
  }
}
