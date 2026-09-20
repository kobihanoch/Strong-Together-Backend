/** Public participant preview included with a discoverable crew. */
export type CrewParticipantPreview = { username: string; fullName: string; profilePicPath: string | null };

/** Crew data exposed by crew discovery operations. */
export type Crew = {
  id: string;
  name: string;
  createdBy: string;
  privacy: 'public' | 'private';
  createdAt: string;
  updatedAt: string;
};

/** Crew data enriched with its active participant count. */
export type CrewWithParticipantCount = Crew & { participantCount: number };

/** Crew item returned by discovery and membership listings. */
export type DiscoverableCrew = CrewWithParticipantCount & { top5Participants: CrewParticipantPreview[] };

/** Active crew member with public profile information. */
export type CrewParticipant = {
  id: string;
  crewId: string;
  userId: string;
  status: 'active' | 'left' | 'removed' | 'banned';
  role: 'leader' | 'admin' | 'member';
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  profilePicPath: string | null;
  username: string;
};

/** Cursor-paginated crew collection. */
export type CrewsPage = { crews: DiscoverableCrew[]; nextCursor: string | null };

/** Cursor-paginated crew participant collection. */
export type CrewParticipantsPage = { participants: CrewParticipant[]; nextCursor: string | null };

/** Input used to create or update a crew. */
export type CrewInput = { name: string; privacy: 'public' | 'private' };

/** Result of replacing a crew profile image. */
export type CrewProfilePictureResult = { profilePicPath: string; url: string; message: string };

/** Uploaded image data consumed by the crew application layer. */
export type CrewImageUpload = { originalname: string; mimetype: string; buffer: Buffer };
