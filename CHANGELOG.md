# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
