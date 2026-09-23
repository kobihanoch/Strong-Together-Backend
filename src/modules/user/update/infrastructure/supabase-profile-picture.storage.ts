import { Injectable } from '@nestjs/common';
import mime from 'mime';
import path from 'path';
import { supabaseConfig } from '../../../../config/storage.config';
import { SupabaseStorageService } from '../../../../infrastructure/supabase/storage/supabase-storage.service';
import type { ProfilePictureFile } from '../application/models/update-user.models';
import { ProfilePictureStorage } from '../application/ports/profile-picture-storage.port';
/** Supabase adapter for user profile pictures. */
@Injectable()
export class SupabaseProfilePictureStorage implements ProfilePictureStorage {
  constructor(private readonly storage: SupabaseStorageService) {}
  async upload(userId: string, file: ProfilePictureFile): Promise<{ path: string; publicUrl: string }> {
    const extension = path.extname(file.originalname) || `.${mime.getExtension(file.mimetype) || 'jpg'}`;
    return this.storage.uploadBufferToSupabase(supabaseConfig.bucketName, `${userId}/${Date.now()}${extension}`, file.buffer, file.mimetype);
  }
  delete(objectPath: string): Promise<void> {
    return this.storage.deleteFromSupabase(objectPath);
  }
}
