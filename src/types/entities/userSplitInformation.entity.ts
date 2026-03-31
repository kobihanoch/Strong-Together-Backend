export interface UserSplitInformationEntity {
  id: number;
  user_id: string;
  split_id: number;
  estimated_time_utc: string;
  confidence: number;
  last_computed_at: string;
  preferred_weekday: number | null;
}
