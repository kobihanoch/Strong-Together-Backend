export interface WorkoutPlanEntity {
  id: number;
  name: string;
  numberofsplits: number;
  created_at: string; // ISO Timestamp
  is_deleted: boolean;
  level: string;
  user_id: string; // UUID
  trainer_id: string; // UUID
  is_active: boolean;
  updated_at: string; // ISO Timestamp
}
