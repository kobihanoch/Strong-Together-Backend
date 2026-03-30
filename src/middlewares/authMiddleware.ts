import { AccessTokenPayload, AuthenticatedUser } from './../types/dto/auth.dto.ts';
import { Response, NextFunction, Request } from 'express';
import createError from 'http-errors';
import sql from '../config/db.js';
import { decodeAccessToken, getAccessToken } from '../utils/tokenUtils.js';
import { queryGetCurrentTokenVersion } from '../queries/authQueries.js';
import * as crypto from 'crypto';

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const dpopJkt = req.dpopJkt;
  try {
    if (process.env.DPOP_ENABLED === 'true') {
      if (!dpopJkt) {
        throw createError(500, 'Internal error: DPoP JKT not found on request.');
      }
    }

    // Get access token
    const accessToken = getAccessToken(req);
    if (!accessToken) {
      res.status(401).json({ message: 'No access token provided' });
      return;
    }

    // Decode
    const decoded = decodeAccessToken(accessToken) as unknown as AccessTokenPayload;
    if (!decoded) {
      throw createError(401, 'Access token is not valid');
    }

    // Check if access token JKT is equal to DPoP JKT
    if (process.env.DPOP_ENABLED === 'true') {
      const tokenJkt = decoded.cnf?.jkt;

      if (!tokenJkt || tokenJkt !== dpopJkt) {
        throw createError(401, 'Proof-of-Possession failed (JKT mismatch).');
      }

      const currentAth = crypto
        .createHash('sha256')
        .update(accessToken, 'ascii')
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      if (currentAth !== req.dpopAth) throw createError(401, "DPoP ath doens't match.");
    }

    const [versionData] = await queryGetCurrentTokenVersion(decoded.id);
    if (!versionData || decoded.tokenVer !== versionData.token_version) {
      throw createError(401, 'New login required');
    }

    // Fetch user id and role
    const [user]: [AuthenticatedUser?] = await sql`
      SELECT id, role, is_verified FROM users WHERE id=${decoded.id}::uuid
    `;

    // If user not found
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (!user?.is_verified) {
      res.status(401).json({ message: 'A validation email is pending.' });
      return;
    }

    // Inject to request
    req.user = user;
    if (req.logger) {
      req.logger = req.logger.child({
        userId: user.id,
        role: user.role,
      });
    }

    next();
  } catch (err: any) {
    next(createError(401, err.message || 'Invalid or expired access token'));
  }
};
