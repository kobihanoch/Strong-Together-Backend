import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';

/** Creates a new plan or refreshes the existing plan timestamp. */
@Injectable()
export class SavePlanSql {
  constructor(private readonly dbService: DBService) {}

  async execute(planId: number | undefined): Promise<number> {
    if (planId !== undefined) {
      // Existing plan: mark the complete plan snapshot as updated.
      await this.dbService.sql`
        UPDATE workout.workout_plan
        SET updated_at = NOW()
        WHERE id = ${planId}::BIGINT AND user_id = identity.current_user_id () AND is_active = TRUE
      `;
      return planId;
    }

    // New plan: insert it and return the database-generated ID needed by its splits.
    const [createdPlan] = await this.dbService.sql<Array<{ id: number }>>`
      INSERT INTO workout.workout_plan (user_id, is_active, updated_at)
      VALUES (identity.current_user_id (), TRUE, NOW())
      RETURNING id::INT
    `;
    if (!createdPlan) throw new Error('Workout plan was not persisted');
    return createdPlan.id;
  }
}
