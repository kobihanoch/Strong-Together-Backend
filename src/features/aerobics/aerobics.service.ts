import { queryAddAerobicTracking, queryGetUserAerobicsForNDays } from './aerobics.queries.ts';
import type { UserAerobicsResponse } from '../../types/api/aerobics/responses.ts';
import type { AddUserAerobicsBody } from '../../types/api/aerobics/requests.ts';
import {
  buildAerobicsKeyStable,
  cacheDeleteOtherTimezones,
  cacheGetJSON,
  cacheSetJSON,
  TTL_AEROBICS,
} from '../../utils/cache.ts';

export const getAerobicsData = async (
  userId: string,
  days: number = 45,
  fromCache: boolean = true,
  tz: string = 'Asia/Jerusalem',
): Promise<{ payload: UserAerobicsResponse; cacheHit: boolean }> => {
  const aerobicsKey = buildAerobicsKeyStable(userId, days, tz);

  if (fromCache) {
    await cacheDeleteOtherTimezones(aerobicsKey);
    const cached = await cacheGetJSON<UserAerobicsResponse>(aerobicsKey);
    if (cached) {
      return { payload: cached, cacheHit: true };
    }
  }

  const rows = await queryGetUserAerobicsForNDays(userId, days, tz);
  await cacheSetJSON(aerobicsKey, rows, TTL_AEROBICS);

  return { payload: rows, cacheHit: false };
};

export const addUserAerobicsRecord = async (
  userId: string,
  body: AddUserAerobicsBody,
): Promise<UserAerobicsResponse> => {
  await queryAddAerobicTracking(userId, body.record);

  const { payload } = await getAerobicsData(userId, 45, false, body.tz);
  const aerobicsKey = buildAerobicsKeyStable(userId, 45, body.tz);

  await cacheSetJSON(aerobicsKey, payload, TTL_AEROBICS);
  return payload;
};
