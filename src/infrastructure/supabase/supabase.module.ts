import { Module } from '@nestjs/common';
import { SupabaseStorageService } from './storage/supabase-storage.service';

@Module({
  providers: [SupabaseStorageService],
  exports: [SupabaseStorageService],
})
export class SupabaseModule {}
