# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.12.0](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.11.0...v1.12.0) (2025-10-30)


### Features

* **User Reminders:** Updated creating a new user queries (oauth/regular) to create a new record in user_reminder_settings also ([df714fa](https://github.com/kobihanoch/Strong-Together-Backend/commit/df714fafc0e1c9d49099c95e6ba56a89042ee21a))
* **User Reminders:** User hourly reminders is implemented ([edb5646](https://github.com/kobihanoch/Strong-Together-Backend/commit/edb56469567a2fc7381e301cabe5eacc445da491))

## [1.11.0](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.10.1...v1.11.0) (2025-10-28)


### Features

* **Bull:** Created an email producer and consumer ([9773d1e](https://github.com/kobihanoch/Strong-Together-Backend/commit/9773d1e78226b472065293310a557561002fb0ce))
* **Logs:** Added losg labels ([71ddeff](https://github.com/kobihanoch/Strong-Together-Backend/commit/71ddeff4360d390a8c7ba7e5ba9a8287d3174d75))
* **Web Socket:** Web socket generates a ticket with DPoP validation, and secures handshake with a socket secret ([77e0182](https://github.com/kobihanoch/Strong-Together-Backend/commit/77e0182fdb2a76e3c043c9c35ef2b1199907e955))
* **Workers:** Created another process for emails with bull ([428acb9](https://github.com/kobihanoch/Strong-Together-Backend/commit/428acb9287512d3410cc8bd466d481272b3a05c0))
* **Workers:** Createda  worker for push notifications ([9f51f65](https://github.com/kobihanoch/Strong-Together-Backend/commit/9f51f65df621ba307bc4683c79ff414f7ebed82c))

### [1.10.1](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.10.0...v1.10.1) (2025-10-27)


### Bug Fixes

* **DPoP:** Fixed cache disabled behaviuor with JTI allow-list ([6e3fd4b](https://github.com/kobihanoch/Strong-Together-Backend/commit/6e3fd4bbf2a03b56d20b4875a202d2b46f585789))

## [1.10.0](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.9.0...v1.10.0) (2025-10-22)


### Features

* **Email Change:** Change email requires email verification ([80a8c38](https://github.com/kobihanoch/Strong-Together-Backend/commit/80a8c384f4fd1855b6b760d87cf0358845340042))
* **Jti Allow List:** Added JTI Allow list in Redis for email tokens ([c5879e3](https://github.com/kobihanoch/Strong-Together-Backend/commit/c5879e3b98fbfbbf808461fb66fd9b1af244f2b1))
* **OAuth:** Apple auth is fully implemented ([336d81e](https://github.com/kobihanoch/Strong-Together-Backend/commit/336d81e8634db23da1b32d77a6802fed9a906c33))
* **OAuth:** Created route ([58b948b](https://github.com/kobihanoch/Strong-Together-Backend/commit/58b948b476d47364f61e860c0b835f15b98a023a))
* **OAuth:** Google auth is fully implemented ([6ed2bb6](https://github.com/kobihanoch/Strong-Together-Backend/commit/6ed2bb67e6dd5bac62e12651f3de67fdb70c2a5d))
* **OAuth:** Google sign in is fully implemented ([c6c36c6](https://github.com/kobihanoch/Strong-Together-Backend/commit/c6c36c6c6a6733539d8040f0b6bc2719fe60fd0c))
* **OAuth:** Require full name if name from google is not in English ([981445a](https://github.com/kobihanoch/Strong-Together-Backend/commit/981445abc3f7f422b5cb519b6dccfc6c00f69469))


### Bug Fixes

* **Register:** Gender is optional ([ec6a296](https://github.com/kobihanoch/Strong-Together-Backend/commit/ec6a29656d470754492ed27d22f937e46bcc04de))
* **Welcome Message:** New welcome message without AI ([edd866d](https://github.com/kobihanoch/Strong-Together-Backend/commit/edd866dbe64696382f20d361ee7902dbcecd1242))

## [1.9.0](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.8.0...v1.9.0) (2025-10-19)


### Features

* **DPoP:** Added JTI redis caching for jtis ([46feafa](https://github.com/kobihanoch/Strong-Together-Backend/commit/46feafa29be363f9bea12d09cee21709e8f42d0c))

## [1.8.0](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.7.3...v1.8.0) (2025-10-19)


### Features

* **DPoP:** Created DPoP middleware ([73f56f1](https://github.com/kobihanoch/Strong-Together-Backend/commit/73f56f138f24e716d314f3d20769758030f8adb3))
* **DPoP:** DPoP is implemented in routes ([ac0313b](https://github.com/kobihanoch/Strong-Together-Backend/commit/ac0313b9d3e2e7d5cf8eae2c0ca8f54bad9a903c))
* **DPoP:** DPoP is working ([ba3fe35](https://github.com/kobihanoch/Strong-Together-Backend/commit/ba3fe353b6b6062bcc0074607102290c8dfbb19b))

### [1.7.3](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.7.2...v1.7.3) (2025-10-11)


### Bug Fixes

* **Create Workout:** Fixed inserting new workouts with new RLS policies by seperating into 2 automic queries (unexpected beahviuor) ([43a62c0](https://github.com/kobihanoch/Strong-Together-Backend/commit/43a62c0de591db7703abb23e09cfedf7590d6fa0))

### [1.7.2](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.7.1...v1.7.2) (2025-10-11)


### Bug Fixes

* **Create Workout:** Fixed inserting new workouts with new RLS policies by seperating into 2 automic queries (exerisetoworkoutsplit) ([7951e89](https://github.com/kobihanoch/Strong-Together-Backend/commit/7951e89882e7921212c8df012ce6eb7661182e81))

### [1.7.1](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.7.0...v1.7.1) (2025-10-11)


### Bug Fixes

* **Create Workout:** Fixed inserting new workouts with new RLS policies by seperating into 2 automic queries ([95393b5](https://github.com/kobihanoch/Strong-Together-Backend/commit/95393b5721bd9c1c62056d64f1d8d43e051bde4b))

## [1.7.0](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.6.0...v1.7.0) (2025-10-10)


### Features

* **Auth:** Enhance user verification and token management logic, and more frequent token versions increasments ([9b81fbb](https://github.com/kobihanoch/Strong-Together-Backend/commit/9b81fbb745d1bb64ee090b680c275f22c9a84784))

## [1.6.0](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.5.0...v1.6.0) (2025-10-10)


### Features

* **SQL:** Added authenticated role to pg and enabled RLS security and policies ([2639c02](https://github.com/kobihanoch/Strong-Together-Backend/commit/2639c0224f673746dcacd86357b79e7890a100fb))


### Bug Fixes

* **Middleware:** Don't return min app version ([449d2fe](https://github.com/kobihanoch/Strong-Together-Backend/commit/449d2fec0e541952dbaebe6326ae839b7b2c552e))
* **Middleware:** Push daily bypass middleware ([ac7a823](https://github.com/kobihanoch/Strong-Together-Backend/commit/ac7a823d15d9c0cf9d5e6297f103bcf179e06817))
* **Queries:** Disabled inner trx inside add workout ([ec3add2](https://github.com/kobihanoch/Strong-Together-Backend/commit/ec3add2f0d28da5c687ac7998e959889fbfa17c0))

## [1.5.0](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.4.2...v1.5.0) (2025-10-09)


### Features

* **Auth:** Added rate limiting to forgot password ([2cb5a43](https://github.com/kobihanoch/Strong-Together-Backend/commit/2cb5a4346424d2f46cfde8e3b0a3a1df3f635761))
* **Auth:** Implemented forgot my password ([1a3e5ad](https://github.com/kobihanoch/Strong-Together-Backend/commit/1a3e5add35e3ce35147d8e3c8e20c3b0dcd1a7e9))
* **Cache:** Delete other timezones cache keys to ensure one cache source of truth and prevent stale data ([b025ba9](https://github.com/kobihanoch/Strong-Together-Backend/commit/b025ba95e4b8b802f6919329d6b80cf897e1e099))
* **Date and Time:** Implemented UTC timestamp fetch on prs ([98994ac](https://github.com/kobihanoch/Strong-Together-Backend/commit/98994ac361d5290c2172b09da83fcc130ab83271))
* **Date and Time:** Inject tz from client to requests ([acc68cc](https://github.com/kobihanoch/Strong-Together-Backend/commit/acc68cc13bcd7a8e78060e553be72bf316bbd8cf))
* **Date and Time:** Messages and workout with timezone ([68842df](https://github.com/kobihanoch/Strong-Together-Backend/commit/68842dfab1e8081d0721e435835eb5b2491beb45))
* **Date and Time:** Timezone aerobics ([32ad44c](https://github.com/kobihanoch/Strong-Together-Backend/commit/32ad44ca0fd06aff2d6ed2822a334302b2ee5009))
* **Logs:** Added username to logs ([48512da](https://github.com/kobihanoch/Strong-Together-Backend/commit/48512dada72e5cdcf0d7122072f671c5dc9dafe3))
* **Mailer:** Use new bought domain ([8896e83](https://github.com/kobihanoch/Strong-Together-Backend/commit/8896e8363b42efde845308faa1148204b2e4e07e))
* **Middlewares:** Added a minimum version middleware ([9dce20c](https://github.com/kobihanoch/Strong-Together-Backend/commit/9dce20c7115254c50ae053454366279565bd1202))
* **Middlewares:** Added bot blocker middleware and login rate limit ([b8a9a1e](https://github.com/kobihanoch/Strong-Together-Backend/commit/b8a9a1e07f7cef291884ae94a5a89f6e9316c6cf))
* **Verification:** Added a rate limiter to change email and verify endpoint ([746cac3](https://github.com/kobihanoch/Strong-Together-Backend/commit/746cac367814b5ca77d7e8b21ad734f21a59aa23))
* **Verification:** Added send verify email (for resending) ([0805886](https://github.com/kobihanoch/Strong-Together-Backend/commit/0805886250326ef907067781f6d28fe24af8676c))
* **Verification:** Created email verification on user register ([b39566c](https://github.com/kobihanoch/Strong-Together-Backend/commit/b39566c87076e26beb5329efcf4cd26453ccece8))
* **Verification:** New change email in verification endpoint ([05807ee](https://github.com/kobihanoch/Strong-Together-Backend/commit/05807ee002f62a2448f49618ebc8136cd16df500))

### [1.4.2](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.4.1...v1.4.2) (2025-09-30)

### [1.4.1](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.4.0...v1.4.1) (2025-09-29)


### Features

* **Auth:** Deleted usage of blacklisted tokens for now ([01fe5eb](https://github.com/kobihanoch/Strong-Together-Backend/commit/01fe5ebd6b9efe79e3841a5bd698d41105ce41e5))
* **Queries:** Reduced paylaod size from DB in exercise tracking ([71ebd7f](https://github.com/kobihanoch/Strong-Together-Backend/commit/71ebd7feecd4ab652a21ea1202fcd298af53125f))
* **Queries:** Refactored save editing of workout query logic to upsert instead of recreating new workout every change ([72e45b3](https://github.com/kobihanoch/Strong-Together-Backend/commit/72e45b3bdcf85e8fd72e483b3d3d06cc9d0d6bba))

## [1.4.0](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.3.0...v1.4.0) (2025-09-28)


### Features

* **Aerobics:** Added an endpoint for receiving user's aerobics for last N days mapped by date ([6c43d7c](https://github.com/kobihanoch/Strong-Together-Backend/commit/6c43d7c2dba59d93ccf1a3994afce03fe017b4d9))
* **Aerobics:** Added cache control over aerobics data and new endpoints for add tracking ([ebd7767](https://github.com/kobihanoch/Strong-Together-Backend/commit/ebd77670eab74326ac82b059d6d181ed88339642))
* **Aerobics:** Added records view for each week ([0da7dc4](https://github.com/kobihanoch/Strong-Together-Backend/commit/0da7dc4e911798d61466f819abc4b96de8b594a0))
* **Analytics:** Add logging for cached analytics retrieval ([0cdd541](https://github.com/kobihanoch/Strong-Together-Backend/commit/0cdd541f3def4ecbb555ecac93840cd3a2fe703f))
* **Analytics:** Added anayltics endpoints ([a7837f0](https://github.com/kobihanoch/Strong-Together-Backend/commit/a7837f0f40526b9135c2780317aca6061bf582a7))
* **Analytics:** Added goal adherence query ([d0ea364](https://github.com/kobihanoch/Strong-Together-Backend/commit/d0ea364a76aff544057ec6d896be48a876ec40d8))
* **Analytics:** Implement caching for analytics data retrieval and deletion ([eefc4ad](https://github.com/kobihanoch/Strong-Together-Backend/commit/eefc4ad64ba3c3426c92e9e29a20b3fbab67e8b4))
* **Auth:** Added token_version to make sure one device is integrated with client cache ([8ce1493](https://github.com/kobihanoch/Strong-Together-Backend/commit/8ce1493378569c584f7c1fea938b788dc2cc56be))
* **Bootstrap:** Created bootstrap router and endpoint for all initial data, and divided controllers with pure helpers ([3e5a0f3](https://github.com/kobihanoch/Strong-Together-Backend/commit/3e5a0f30d164cec2441b6eca2f1d08e5f7c2e924))
* **Cache:** Implement gzip compression for cache storage and retrieval ([5faa9b9](https://github.com/kobihanoch/Strong-Together-Backend/commit/5faa9b99f2d9a9749f9caca15b9ef3ee3c5d6b09))
* **Cache:** Write back cache when updating data ([b41f474](https://github.com/kobihanoch/Strong-Together-Backend/commit/b41f47443c1abf67b23f51c87e30989e6620a8ca))
* **Push:** Daily push notifications for all logged in users ([cd6df50](https://github.com/kobihanoch/Strong-Together-Backend/commit/cd6df507aae08106394170add4594e962f5581ce))
* **Queries:** Messages queries is returned sorted ([87965ae](https://github.com/kobihanoch/Strong-Together-Backend/commit/87965aefda6867b2df21e23533d0998d39f7ab94))
* **Queries:** Optimize DB latency, moved delete tokens to cron and store only refresh tokens at DB ([6157192](https://github.com/kobihanoch/Strong-Together-Backend/commit/6157192aa1a7a6f784282837b5f3dc1a7280593c))
* **Queries:** Updated analysis query to fetch also PRs (Added view in DB) ([8da3a17](https://github.com/kobihanoch/Strong-Together-Backend/commit/8da3a17e46d063066611d472e2ab5d9a00d69b29))
* **User:** Implemented new endpoint and query for update self user and delete self user ([00b70a1](https://github.com/kobihanoch/Strong-Together-Backend/commit/00b70a156cbf16ddfc5656acdc7bd7935799096e))


### Bug Fixes

* **Aerobics:** Fixed table name in query ([ec39f7d](https://github.com/kobihanoch/Strong-Together-Backend/commit/ec39f7d5536bbdcae1a8fe3de8206bb64ade5c1f))
* **Analytics:** Returns an empty object istead of null when no workout history is available ([3f4eded](https://github.com/kobihanoch/Strong-Together-Backend/commit/3f4ededabf54998a465c0529f3e02d423c468542))
* **Cache:** Fixed unexpected caching problems ([37745f7](https://github.com/kobihanoch/Strong-Together-Backend/commit/37745f71bbab5f4072375f501f2be2c1a9a9ae8a))
* **Cache:** IMPORTANT - Fixed roken compressed cache data usage with base 64 data formatting ([df8fd99](https://github.com/kobihanoch/Strong-Together-Backend/commit/df8fd99543259e44266b27e0098835f16e8d2b22))
* **Cache:** Patched exercise tracking analysis "hasTrainedToday" for next day login ([06012fd](https://github.com/kobihanoch/Strong-Together-Backend/commit/06012fd5f718cbb396d4d8d4c6c6144a3b21a42f))
* **Tracking:** Patch exercise tracking analysis for accurate caching response ([ff125bf](https://github.com/kobihanoch/Strong-Together-Backend/commit/ff125bffcdac06293ac0a821677cfa973ae5173f))
* **Zod:** FIxed passing parsed request body to controllers ([b3b64e2](https://github.com/kobihanoch/Strong-Together-Backend/commit/b3b64e29cd01abf48da6d409ccf4d6fe6d5bbc76))

## [1.3.0](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.2.0...v1.3.0) (2025-08-19)


### Features

* **CORS:** DIsabled CORS ([dd8c8a7](https://github.com/kobihanoch/Strong-Together-Backend/commit/dd8c8a76ac5c0b41c151c61a95f38344afb14dcd))
* **CORS:** Enbaled CORS ([1493167](https://github.com/kobihanoch/Strong-Together-Backend/commit/1493167a4f60bb47a0abf928d38d3dcdc4a6021e))
* **Queries:** Created new indexes and views on DB ([b363b53](https://github.com/kobihanoch/Strong-Together-Backend/commit/b363b534b21bca00ab92f0854e255425e947dc4d))

## [1.2.0](https://github.com/kobihanoch/Strong-Together-Backend/compare/v1.1.0...v1.2.0) (2025-08-18)


### Features

* **Postgres:** Auto reconnect Postgres client after idle ([c628ff1](https://github.com/kobihanoch/Strong-Together-Backend/commit/c628ff17b4f6c649ad80a4388e511561ffbf3396))
* **Push:** Create push notification endpoint and route ([4c7f215](https://github.com/kobihanoch/Strong-Together-Backend/commit/4c7f2157551d12d29f967545be7a0d516f28b9bb))
* **Queries:** Added counter for each split in analytics fetch ([31a2c08](https://github.com/kobihanoch/Strong-Together-Backend/commit/31a2c08869b0a3d3d59c8ba4797918db59c26e0c))
* **Queries:** Added query to set push token of user to null on logging out ([42ee1ce](https://github.com/kobihanoch/Strong-Together-Backend/commit/42ee1ce787c0aab18cc13820598ea615d8e8c2b3))
* **Redis:** Bump versioning to invalidate data already cached on data updates ([82bb3a3](https://github.com/kobihanoch/Strong-Together-Backend/commit/82bb3a3b571926f9fb486e029b84d2ca70888e69))
* **Redis:** Cached exercise tracking and analysis ([7f517d4](https://github.com/kobihanoch/Strong-Together-Backend/commit/7f517d493fc535698bb28125b7fd00dbc5ca1f7d))
* **Redis:** Cached workout plan ([9c2b94c](https://github.com/kobihanoch/Strong-Together-Backend/commit/9c2b94c8d108e9f8cf41093c699c878187fb4c0f))
* **Redis:** Connected redis client and created Redis utiils file ([4e28bf8](https://github.com/kobihanoch/Strong-Together-Backend/commit/4e28bf846b874993e66509f24a50c2e007292923))
* **Redis:** Updated TTL for tracking and analysis and workout plan to 36 hours cache ([1be56f5](https://github.com/kobihanoch/Strong-Together-Backend/commit/1be56f5cfc4c79db869e2ebf53db333fcfd3f71e))
* **Redis:** Updated TTL for tracking and analysis and workout plan to 48 hours cache ([937fa81](https://github.com/kobihanoch/Strong-Together-Backend/commit/937fa818fdd64d563abf66e14f8f00330d83e6e6))


### Bug Fixes

* **Queries:** Fixed JSON parsing in add workout ([89884d3](https://github.com/kobihanoch/Strong-Together-Backend/commit/89884d32846fe3994b478a2baabea1b2ce87f486))

## 1.1.0 (2025-08-17)


### Features

* **Auth:** Add token cleanup for expired tokens during check auth ([670ec50](https://github.com/kobihanoch/Strong-Together-Backend/commit/670ec50f192b4fcb0157797de964296fd8de5886))
* **Auth:** Added auth middleware ([3260180](https://github.com/kobihanoch/Strong-Together-Backend/commit/326018071bed50d1518671fe977c5236ca95ab89))
* **Auth:** Added checkauth endpoint under protect (auth) middleware ([393e310](https://github.com/kobihanoch/Strong-Together-Backend/commit/393e3102507363a3e9c3fffc2f0eba3b8911843c))
* **Auth:** Added log in endpoint ([7b66571](https://github.com/kobihanoch/Strong-Together-Backend/commit/7b6657136d893127d215ec242ca2f84b4a327b47))
* **Auth:** Added logout endpoint ([d4117d4](https://github.com/kobihanoch/Strong-Together-Backend/commit/d4117d40072fce378eb295e27d1406351f829537))
* **Auth:** Log in, log out, refresh access token is fully functional. Added some utils. ([8b76fa5](https://github.com/kobihanoch/Strong-Together-Backend/commit/8b76fa5f293004c3f689aa3181d1939335a7044f))
* **Auth:** Update loginUser to return user data upon successful login ([47476c6](https://github.com/kobihanoch/Strong-Together-Backend/commit/47476c625480b3bda679b93d62474e15e1745242))
* **Auth:** Update refresh token expiration to 30 days and remove checkAuthAndRefresh route ([b9b0108](https://github.com/kobihanoch/Strong-Together-Backend/commit/b9b0108df7c65b5725c8bf33736eb00901fa5993))
* **ConnectPostgres:** Connected to Postgres via IPv4 ([48383f2](https://github.com/kobihanoch/Strong-Together-Backend/commit/48383f2c72280d313788150230fdbb67d1c0e30c))
* **CreateWorkout:** Creating and modifying workout is now working ([f5b6f2b](https://github.com/kobihanoch/Strong-Together-Backend/commit/f5b6f2b59ac9db24bf2d245fa249a3d2e44f669d))
* **Exercises:** Built a new route for exercises with get all exercises endpoint ([b8c400a](https://github.com/kobihanoch/Strong-Together-Backend/commit/b8c400a8e46f8534b0fbc0960bfae06bfa280910))
* **FinishWorkout:** A system message is now sent on workout finished ([2b61d4d](https://github.com/kobihanoch/Strong-Together-Backend/commit/2b61d4d3c3a6ef6c0e21e26393a8d87794b43026))
* **FinishWorkout:** Return all analyzed exercise tracking at end of workout ([4975c23](https://github.com/kobihanoch/Strong-Together-Backend/commit/4975c23599afa9ea51b39dee2d4acb6afd40999f))
* **FinishWorkout:** Workouts is now saved in DB ([8e3bf06](https://github.com/kobihanoch/Strong-Together-Backend/commit/8e3bf06a782dcba99495e5ea3b93a3d141f38060))
* **Messages:** Add route to get all user messages and integrate with messages controller ([fe97d47](https://github.com/kobihanoch/Strong-Together-Backend/commit/fe97d471eca1bec74239d057217e1d8275c8bf3a))
* **Messages:** Auto sending welcome message when first logging in ([1e862db](https://github.com/kobihanoch/Strong-Together-Backend/commit/1e862db49a94680b8530ce0fb7d3ffbe7f554116))
* **Messages:** Created endpoints for mark as read and delete messages ([4226789](https://github.com/kobihanoch/Strong-Together-Backend/commit/422678964a89a760067a2fdab0c685cbb24d340c))
* **Messages:** Remove unused jwt import and clean up message controller ([d39d07a](https://github.com/kobihanoch/Strong-Together-Backend/commit/d39d07aa97344984ab6d31fa60763654cc28c64e))
* **Middleware:** Add image upload middleware with file size limit and type validation ([6950347](https://github.com/kobihanoch/Strong-Together-Backend/commit/6950347199272c6f495e060c29d4265a9b10a3bc))
* **Package:** Add axios ([ae0d401](https://github.com/kobihanoch/Strong-Together-Backend/commit/ae0d401da6ce75a019479db5fdb0368a663bb036))
* **Queries:** Fetch user workout with is_active true flag ([267715f](https://github.com/kobihanoch/Strong-Together-Backend/commit/267715fa09c8a34f0c4d22d371ede2c22fd279ae))
* **Queries:** Updated workout queries ([2ba570f](https://github.com/kobihanoch/Strong-Together-Backend/commit/2ba570f2bd6606ac261c26423be25b4ba8c6dab8))
* **Services:** Created Supabase storage services for API requests to Supabase bucket (Upload/Delete) ([2e43b5e](https://github.com/kobihanoch/Strong-Together-Backend/commit/2e43b5e53d6ce5f85b39049ac6484d26a49bc33a))
* **Socket:** Add emitNewMessage function to handle new message events ([8f6892f](https://github.com/kobihanoch/Strong-Together-Backend/commit/8f6892f1716a9a2c1723ebab71e6b85552a7b236))
* **User:** Add delete user profile picture functionality and update Supabase service ([7573577](https://github.com/kobihanoch/Strong-Together-Backend/commit/757357732769e15aee0fe721277dd0cdd7e4fee9))
* **User:** Add endpoint to save user's expo push token to the database ([339318a](https://github.com/kobihanoch/Strong-Together-Backend/commit/339318a9353129c9e39423c00239ad494a306347))
* **User:** Add profile picture upload functionality and update user profile URL in the database ([86a112b](https://github.com/kobihanoch/Strong-Together-Backend/commit/86a112b4056ebd6ace49fe00629b52c54fb0fe29))
* **User:** Added update user functionality, and register/update schemas (Zod). ([f792012](https://github.com/kobihanoch/Strong-Together-Backend/commit/f79201268fd651f1ec1f0db73b73401cee00b232))
* **User:** Added user CRUD endpoints ([20ea8f5](https://github.com/kobihanoch/Strong-Together-Backend/commit/20ea8f5158ef9b02d10be14088623689e4d3fceb))
* **Users:** Add route to get user username, name, id and profile picture by ID ([5873cbc](https://github.com/kobihanoch/Strong-Together-Backend/commit/5873cbcf52a0e1243d4c39c5a8d22d3a240a557b))
* **Workout:** Implement query for comprehensive workout stats and recent tracking; refactor exercise tracking logic ([4020a60](https://github.com/kobihanoch/Strong-Together-Backend/commit/4020a60f401c44286eb19a52ad5cca3542e04ea4))
* **Workouts:** Add endpoint to retrieve authenticated user's exercise tracking ([0bde465](https://github.com/kobihanoch/Strong-Together-Backend/commit/0bde465c0f22bcecc3c78ac390a7d6ddec125ebe))
* **Workouts:** Add route to get authenticated user's complete workout plan ([742ebc9](https://github.com/kobihanoch/Strong-Together-Backend/commit/742ebc9e7c776435b27d7125640b592e89b3db35))
* **Workouts:** Created new endpoints for creating/deleting workouts ([e5b2247](https://github.com/kobihanoch/Strong-Together-Backend/commit/e5b22475766328ef956f98f199783e0a675f12a9))


### Bug Fixes

* **Auth:** Correct error handling in protect middleware ([c5066f7](https://github.com/kobihanoch/Strong-Together-Backend/commit/c5066f7e3e843ff39ea1415f55bd2fe6dd5ea156))
* **Auth:** Correct gender enum values to match capitalization ([a780982](https://github.com/kobihanoch/Strong-Together-Backend/commit/a7809823470a295136a1764b967a55001d553d6d))
* **Auth:** Improve error handling in protect middleware ([b769641](https://github.com/kobihanoch/Strong-Together-Backend/commit/b76964170350e9d8fe428d6a68e5ab58ab6bcb19))
* **Auth:** Remove console error logging from protect middleware ([cb84614](https://github.com/kobihanoch/Strong-Together-Backend/commit/cb84614eb99dedf87f6e35752f57ea23be4d58ad))
* **Auth:** Update refresh token expiration to 4 hours for enhanced security ([ec63fb1](https://github.com/kobihanoch/Strong-Together-Backend/commit/ec63fb1e49c1ae7fc7843580b5789ea2e83c0dd2))
* **Messages:** Messages are rmitted correct now in web sockets ([e43f969](https://github.com/kobihanoch/Strong-Together-Backend/commit/e43f969f5117880a4811835fc923aa9fc66d23fd))
