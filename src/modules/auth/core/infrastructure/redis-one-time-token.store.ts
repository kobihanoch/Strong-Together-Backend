import { Injectable } from '@nestjs/common';
import { CacheService } from '../../../../infrastructure/capabilities/cache/cache.service';
import { OneTimeTokenStore } from '../application/ports/one-time-token-store.port';

/** Shared Redis-backed single-use authentication-token store. */
@Injectable()
export class RedisOneTimeTokenStore implements OneTimeTokenStore {
  constructor(private readonly cache: CacheService) {}

  claim(namespace: string, tokenId: string, ttlSeconds: number): Promise<boolean> {
    return this.cache.cacheStoreJti(namespace, tokenId, ttlSeconds);
  }
}
