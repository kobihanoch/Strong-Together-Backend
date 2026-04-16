import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service.ts';

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
