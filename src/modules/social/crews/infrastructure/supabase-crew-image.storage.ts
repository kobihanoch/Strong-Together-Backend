import { Injectable } from '@nestjs/common';
import { supabaseConfig } from '../../../../config/storage.config';
import { SupabaseStorageService } from '../../../../infrastructure/capabilities/storage/supabase/storage/supabase-storage.service';
import { CrewImageStorage, type StoredCrewImage } from '../application/ports/crew-image-storage.port';

/** Supabase-backed storage adapter for crew profile images. */
@Injectable()
export class SupabaseCrewImageStorage implements CrewImageStorage {
  public constructor(private readonly storage: SupabaseStorageService) {}
  public upload(key: string, data: Buffer, contentType: string): Promise<StoredCrewImage> {
    return this.storage.uploadBufferToSupabase(supabaseConfig.bucketName, key, data, contentType);
  }
  public delete(path: string): Promise<void> {
    return this.storage.deleteFromSupabase(path);
  }
}
