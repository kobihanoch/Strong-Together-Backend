export interface WorkoutPlanEntity {
  id: number;
  name: string | null;
  numberofsplits: number | null;
  created_at: string; // ISO Timestamp
  is_deleted: boolean;
  level: string;
  user_id: string | null; // UUID
  trainer_id: string | null; // UUID
  is_active: boolean;
  updated_at: string | null; // ISO Timestamp
}
