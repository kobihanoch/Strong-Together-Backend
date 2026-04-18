import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import mime from 'mime';
import path from 'path';
import type postgres from 'postgres';
import { supabaseConfig } from '../../../config/storage.config';
import type { AppLogger } from '../../../infrastructure/logger';
import { SQL } from '../../../infrastructure/db/db.tokens';
import { UpdateUserQueries } from './update.queries';
import { generateEmailChangeFailedHTML, generateEmailChangeSuccessHTML } from './update.views';
import type {
  ChangeEmailTokenPayload,
  DeleteUserProfilePicBody,
  SetProfilePicAndUpdateDBResponse,
  UpdateUserBody,
  UpdateAuthenticatedUserResponse,
  UserDataResponse,
} from '@strong-together/shared';
import { decodeChangeEmailToken } from './update.utils';
import { UpdateEmailsService } from './update-emails/update-emails.service';
import { CacheService } from '../../../infrastructure/cache/cache.service';
import { SupabaseStorageService } from '../../../infrastructure/supabase/storage/supabase-storage.service';

@Injectable()
export class UpdateUserService {
  constructor(
    @Inject(SQL) private readonly sql: postgres.Sql,
    private readonly updateUserQueries: UpdateUserQueries,
    private readonly updateEmailsService: UpdateEmailsService,
    private readonly supabaseStorageService: SupabaseStorageService,
    private readonly cacheService: CacheService,
  ) {}

  async getUserData(userId: string): Promise<{ payload: UserDataResponse['user_data'] }> {
    const rows = await this.updateUserQueries.queryAuthenticatedUserById(userId);
    const [user] = rows;
    if (!user) throw new NotFoundException('User not found');
    return { payload: user.user_data };
  }

  async updateUsersReminderSettingsTimezone(userId: string, tz: string): Promise<void> {
    await this
      .sql`update public.user_reminder_settings urs set timezone=${tz}::text where urs.user_id = ${userId}::uuid and urs.timezone is distinct from ${tz}::text;`;
  }

  async updateAuthenticatedUserData(
    userId: string,
    body: UpdateUserBody,
    requestId?: string,
  ): Promise<UpdateAuthenticatedUserResponse> {
    const { username, fullName, email } = body;
    const { payload: currentUser } = await this.getUserData(userId);

    let rowsUpdated: UserDataResponse[];
    try {
      rowsUpdated = await this.updateUserQueries.queryUpdateAuthenticatedUser(userId, { username, fullName, email });
    } catch (e: any) {
      if (e.code === '23505') {
        throw new ConflictException('Username or email already in use');
      }
      throw e;
    }

    const [updated] = rowsUpdated;
    if (!updated) return { message: 'User not found' } as any;

    const { user_data: userData } = updated;
    const currentEmail = (currentUser.email || '').trim().toLowerCase();
    const candidate = (email || '').trim().toLowerCase();

    let emailChanged = false;
    if (candidate && candidate !== currentEmail) {
      await this.updateEmailsService.sendVerificationEmailForEmailUpdate(candidate, userId, userData.name || 'there', {
        ...(requestId ? { requestId } : {}),
      });
      emailChanged = true;
    }

    return {
      message: 'User updated successfully',
      emailChanged,
      user: updated.user_data,
    };
  }

  async updateSelfEmailData(
    token: string | undefined,
    requestLogger: AppLogger,
  ): Promise<{ statusCode: number; html: string }> {
    if (!token) return { statusCode: 401, html: generateEmailChangeFailedHTML('Missing token') };

    const decoded = decodeChangeEmailToken(token) as ChangeEmailTokenPayload | null;
    if (!decoded) {
      return { statusCode: 401, html: generateEmailChangeFailedHTML('Invalid or expired link') };
    }

    const { jti, sub, newEmail, exp, iss, typ } = decoded;
    if (iss !== 'strong-together' || typ !== 'email-confirm' || !jti || !sub || !newEmail || !exp) {
      return { statusCode: 400, html: generateEmailChangeFailedHTML('Malformed token') };
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const ttlSec = Math.max(1, exp - nowSec);
    const inserted = await this.cacheService.cacheStoreJti('emailchange', jti, ttlSec);
    if (!inserted) {
      return { statusCode: 401, html: generateEmailChangeFailedHTML('URL already used or expired') };
    }

    const normalized = newEmail.trim().toLowerCase();

    try {
      await this.sql.begin(async (trx) => {
        await trx`
          UPDATE users
          SET email = ${normalized}
          WHERE id = ${sub}::uuid
        `;
      });
    } catch (e: any) {
      if (e.code === '23505') {
        requestLogger.warn({ event: 'user.email_change_conflict', userId: sub }, 'Email already in use');
        return { statusCode: 409, html: generateEmailChangeFailedHTML('Email already in use') };
      }
      requestLogger.error({ err: e, event: 'user.email_change_failed', userId: sub }, 'Failed to update user email');
      return { statusCode: 500, html: generateEmailChangeFailedHTML('Server error') };
    }

    return { statusCode: 200, html: generateEmailChangeSuccessHTML() };
  }

  async deleteSelfUserData(userId: string): Promise<void> {
    await this.updateUserQueries.queryDeleteUserById(userId);
  }

  async setProfilePicAndUpdateDBData(
    userId: string,
    file: Express.Multer.File | undefined,
    requestLogger: AppLogger,
  ): Promise<SetProfilePicAndUpdateDBResponse> {
    if (!file) throw new BadRequestException('No file provided');

    const ext = path.extname(file.originalname) || `.${mime.getExtension(file.mimetype) || 'jpg'}`;
    const key = `${userId}/${Date.now()}${ext}`;

    const { path: newPath, publicUrl } = await this.supabaseStorageService.uploadBufferToSupabase(
      supabaseConfig.bucketName,
      key,
      file.buffer,
      file.mimetype,
    );

    const [row] = await this.updateUserQueries.queryGetUserProfilePicURL(userId);
    const oldPath = row?.profile_image_url;
    await this.updateUserQueries.queryUpdateUserProfilePicURL(userId, newPath);

    if (oldPath && oldPath !== newPath) {
      this.supabaseStorageService.deleteFromSupabase(oldPath).catch((e: any) => {
        requestLogger.warn(
          {
            err: e,
            event: 'user.old_profile_image_delete_failed',
            userId,
            oldPath,
            responseData: e?.response?.data,
          },
          'Failed to delete old profile image',
        );
      });
    }

    return { path: newPath, url: publicUrl, message: 'Upload success' };
  }

  async deleteUserProfilePicData(userId: string, body: DeleteUserProfilePicBody): Promise<void> {
    await this.supabaseStorageService.deleteFromSupabase(body.path);
    await this.updateUserQueries.queryUpdateUserProfilePicURL(userId, null);
  }
}
