import jwt from "jsonwebtoken";
import { Request } from "express";
import crypto from "crypto";
import {
  AccessTokenPayload,
  EmailVerifyPayload,
  ForgotPasswordPayload,
} from "../types/dto/auth.dto.ts";

/*
 * Extracts a Bearer token from a header string safely.
 */
export const extractBearerToken = (
  rawHeader: string | undefined,
): string | null => {
  if (!rawHeader || typeof rawHeader !== "string") return null;
  return rawHeader.startsWith("Bearer ")
    ? rawHeader.slice(7).trim()
    : rawHeader.trim() || null;
};

export const extractDpopToken = (
  rawHeader: string | undefined,
): string | null => {
  if (!rawHeader || typeof rawHeader !== "string") return null;
  if (!rawHeader.startsWith("DPoP ")) return null;
  return rawHeader.slice(5).trim() || null;
};

/*
 * Extracts the access token from the Authorization header.
 */
export const getAccessToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  return extractDpopToken(authHeader) || extractBearerToken(authHeader);
};

/*
 * Extracts the refresh token from the x-refresh-token header.
 */
export const getRefreshToken = (req: Request): string | null => {
  const refreshHeader = req.headers["x-refresh-token"] as string | undefined;
  return extractDpopToken(refreshHeader) || extractBearerToken(refreshHeader);
};

export const decodeRefreshToken = (
  refreshToken: string | null,
): AccessTokenPayload | null => {
  if (!refreshToken) return null;
  try {
    return jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as AccessTokenPayload;
  } catch {
    return null;
  }
};

export const decodeAccessToken = (
  accessToken: string | null,
): AccessTokenPayload | null => {
  if (!accessToken) return null;
  try {
    return jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET!,
    ) as AccessTokenPayload;
  } catch (e) {
    return null;
  }
};

export const decodeVerifyToken = (
  verifyToken: string,
): EmailVerifyPayload | null => {
  try {
    return jwt.verify(
      verifyToken,
      process.env.JWT_VERIFY_SECRET!,
    ) as EmailVerifyPayload;
  } catch {
    return null;
  }
};

export const decodeForgotPasswordToken = (
  forgotPasswordToken: string,
): ForgotPasswordPayload | null => {
  try {
    return jwt.verify(
      forgotPasswordToken,
      process.env.JWT_FORGOT_PASSWORD_SECRET!,
    ) as ForgotPasswordPayload;
  } catch {
    return null;
  }
};

export const decodeChangeEmailToken = (
  changeEmailToken: string,
): any | null => {
  try {
    return jwt.verify(
      changeEmailToken,
      process.env.CHANGE_EMAIL_SECRET!,
    ) as any;
  } catch {
    return null;
  }
};

export const decodeSocketToken = (ticket: string): any | null => {
  try {
    return jwt.verify(ticket, process.env.JWT_SOCKET_SECRET!) as any;
  } catch {
    return null;
  }
};

export const generateJti = (): string => {
  return crypto.randomBytes(16).toString("hex");
};
