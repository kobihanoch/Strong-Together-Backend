import { Module } from '@nestjs/common';
import { SupabaseStorageService } from './storage/supabase-storage.service';
import { AWSModule } from '../aws/aws.module';

@Module({
  imports: [AWSModule],
  providers: [SupabaseStorageService],
  exports: [SupabaseStorageService],
})
export class SupabaseModule {}
