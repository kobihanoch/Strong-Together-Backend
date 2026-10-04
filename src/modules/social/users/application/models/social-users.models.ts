/** Public social profile returned by user discovery operations. */
export type SocialUserProfile = {
  userId: string;
  username: string;
  fullName: string;
  profilePicPath: string | null;
};

/** Search result item with the creation value required for cursor pagination. */
export type SocialUserSearchItem = SocialUserProfile & { createdAt: string };

/** Paginated public social-user search result. */
export type SocialUsersSearchResult = { users: SocialUserSearchItem[]; nextCursor: string | null };
