/** Public participant preview included in a social summary. */
export type SocialSummaryParticipant = {
  userId: string;
  username: string;
  fullName: string;
  profilePicPath: string | null;
};

/** Compact overview of the authenticated user's social activity. */
export type SocialSummary = {
  activeCrewCount: number;
  participantPreviews: SocialSummaryParticipant[];
};
