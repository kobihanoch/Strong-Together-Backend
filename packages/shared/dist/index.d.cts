import z$1, { z } from 'zod/v4';
import * as drizzle_zod from 'drizzle-zod';
import * as drizzle_orm_pg_core from 'drizzle-orm/pg-core';

type RequestSchema = z.ZodObject<{
    body?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
}>;
type Contract = {
    request: RequestSchema;
    response: z.ZodTypeAny;
};
type RequestOf<TContract extends Contract> = z.infer<TContract['request']>;
type BodyOf<TContract extends Contract> = RequestOf<TContract> extends {
    body: infer TBody;
} ? TBody : never;
type QueryOf<TContract extends Contract> = RequestOf<TContract> extends {
    query: infer TQuery;
} ? TQuery : never;
type ParamsOf<TContract extends Contract> = RequestOf<TContract> extends {
    params: infer TParams;
} ? TParams : never;
type ResponseOf<TContract extends Contract> = z.infer<TContract['response']>;

/** ISO or PostgreSQL-rendered timestamp transported as JSON text. */
declare const serializedDateSchema: z.ZodString;
declare const timezoneSchema: z.ZodString;

declare const user: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "user";
    schema: "identity";
    columns: {
        username: drizzle_orm_pg_core.PgColumn<{
            name: "username";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        email: drizzle_orm_pg_core.PgColumn<{
            name: "email";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        name: drizzle_orm_pg_core.PgColumn<{
            name: "name";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        gender: drizzle_orm_pg_core.PgColumn<{
            name: "gender";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "user";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        updatedAt: drizzle_orm_pg_core.PgColumn<{
            name: "updated_at";
            tableName: "user";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        profilePicPath: drizzle_orm_pg_core.PgColumn<{
            name: "profile_pic_path";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "user";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        pushToken: drizzle_orm_pg_core.PgColumn<{
            name: "push_token";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        passwordHash: drizzle_orm_pg_core.PgColumn<{
            name: "password_hash";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        role: drizzle_orm_pg_core.PgColumn<{
            name: "role";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        tokenVersion: drizzle_orm_pg_core.PgColumn<{
            name: "token_version";
            tableName: "user";
            dataType: "number";
            columnType: "PgBigInt53";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        isVerified: drizzle_orm_pg_core.PgColumn<{
            name: "is_verified";
            tableName: "user";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        authProvider: drizzle_orm_pg_core.PgColumn<{
            name: "auth_provider";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        lastLogin: drizzle_orm_pg_core.PgColumn<{
            name: "last_login";
            tableName: "user";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;

declare const exercise: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "exercise";
    schema: "workout";
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "exercise";
            dataType: "number";
            columnType: "PgBigInt53";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: "byDefault";
            generated: undefined;
        }, {}, {}>;
        name: drizzle_orm_pg_core.PgColumn<{
            name: "name";
            tableName: "exercise";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        description: drizzle_orm_pg_core.PgColumn<{
            name: "description";
            tableName: "exercise";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        targetMuscle: drizzle_orm_pg_core.PgColumn<{
            name: "target_muscle";
            tableName: "exercise";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        specificTargetMuscle: drizzle_orm_pg_core.PgColumn<{
            name: "specific_target_muscle";
            tableName: "exercise";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;

declare const workoutPlan: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "workout_plan";
    schema: "workout";
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "workout_plan";
            dataType: "number";
            columnType: "PgBigInt53";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: "byDefault";
            generated: undefined;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "workout_plan";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        isActive: drizzle_orm_pg_core.PgColumn<{
            name: "is_active";
            tableName: "workout_plan";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        updatedAt: drizzle_orm_pg_core.PgColumn<{
            name: "updated_at";
            tableName: "workout_plan";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "workout_plan";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;

declare const workoutSplit: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "workout_split";
    schema: "workout";
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "workout_split";
            dataType: "number";
            columnType: "PgBigInt53";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: "byDefault";
            generated: undefined;
        }, {}, {}>;
        workoutId: drizzle_orm_pg_core.PgColumn<{
            name: "workout_id";
            tableName: "workout_split";
            dataType: "number";
            columnType: "PgBigInt53";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        name: drizzle_orm_pg_core.PgColumn<{
            name: "name";
            tableName: "workout_split";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "workout_split";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        isActive: drizzle_orm_pg_core.PgColumn<{
            name: "is_active";
            tableName: "workout_split";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;

declare const exerciseToWorkoutSplit: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "exercise_to_workout_split";
    schema: "workout";
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "exercise_to_workout_split";
            dataType: "number";
            columnType: "PgBigInt53";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: "byDefault";
            generated: undefined;
        }, {}, {}>;
        workoutSplitId: drizzle_orm_pg_core.PgColumn<{
            name: "workout_split_id";
            tableName: "exercise_to_workout_split";
            dataType: "number";
            columnType: "PgBigInt53";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        exerciseId: drizzle_orm_pg_core.PgColumn<{
            name: "exercise_id";
            tableName: "exercise_to_workout_split";
            dataType: "number";
            columnType: "PgBigInt53";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "exercise_to_workout_split";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        orderIndex: drizzle_orm_pg_core.PgColumn<{
            name: "order_index";
            tableName: "exercise_to_workout_split";
            dataType: "number";
            columnType: "PgBigInt53";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        isActive: drizzle_orm_pg_core.PgColumn<{
            name: "is_active";
            tableName: "exercise_to_workout_split";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;

declare const workoutSummary: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "workout_summary";
    schema: "tracking";
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "workout_summary";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "workout_summary";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        workoutSplitId: drizzle_orm_pg_core.PgColumn<{
            name: "workout_split_id";
            tableName: "workout_summary";
            dataType: "number";
            columnType: "PgBigInt53";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        workoutStartUtc: drizzle_orm_pg_core.PgColumn<{
            name: "workout_start_utc";
            tableName: "workout_summary";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        workoutEndUtc: drizzle_orm_pg_core.PgColumn<{
            name: "workout_end_utc";
            tableName: "workout_summary";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "workout_summary";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;

declare const exerciseTracking: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "exercise_tracking";
    schema: "tracking";
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "exercise_tracking";
            dataType: "number";
            columnType: "PgBigInt53";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: "byDefault";
            generated: undefined;
        }, {}, {}>;
        workoutSummaryId: drizzle_orm_pg_core.PgColumn<{
            name: "workout_summary_id";
            tableName: "exercise_tracking";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        exerciseToSplitId: drizzle_orm_pg_core.PgColumn<{
            name: "exercise_to_split_id";
            tableName: "exercise_tracking";
            dataType: "number";
            columnType: "PgBigInt53";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        exerciseId: drizzle_orm_pg_core.PgColumn<{
            name: "exercise_id";
            tableName: "exercise_tracking";
            dataType: "number";
            columnType: "PgBigInt53";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        notes: drizzle_orm_pg_core.PgColumn<{
            name: "notes";
            tableName: "exercise_tracking";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;

declare const aerobicTracking: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "aerobic_tracking";
    schema: "tracking";
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "aerobic_tracking";
            dataType: "number";
            columnType: "PgBigInt53";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: "byDefault";
            generated: undefined;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "aerobic_tracking";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        type: drizzle_orm_pg_core.PgColumn<{
            name: "type";
            tableName: "aerobic_tracking";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        durationSec: drizzle_orm_pg_core.PgColumn<{
            name: "duration_sec";
            tableName: "aerobic_tracking";
            dataType: "number";
            columnType: "PgBigInt53";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        workoutTimeUtc: drizzle_orm_pg_core.PgColumn<{
            name: "workout_time_utc";
            tableName: "aerobic_tracking";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;

declare const message: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "message";
    schema: "messages";
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "message";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        senderId: drizzle_orm_pg_core.PgColumn<{
            name: "sender_id";
            tableName: "message";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        receiverId: drizzle_orm_pg_core.PgColumn<{
            name: "receiver_id";
            tableName: "message";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        subject: drizzle_orm_pg_core.PgColumn<{
            name: "subject";
            tableName: "message";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        msg: drizzle_orm_pg_core.PgColumn<{
            name: "msg";
            tableName: "message";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        sentAt: drizzle_orm_pg_core.PgColumn<{
            name: "sent_at";
            tableName: "message";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        isRead: drizzle_orm_pg_core.PgColumn<{
            name: "is_read";
            tableName: "message";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;

declare const userDbSchema: drizzle_zod.BuildSchema<"select", {
    username: drizzle_orm_pg_core.PgColumn<{
        name: "username";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    email: drizzle_orm_pg_core.PgColumn<{
        name: "email";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    name: drizzle_orm_pg_core.PgColumn<{
        name: "name";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    gender: drizzle_orm_pg_core.PgColumn<{
        name: "gender";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: drizzle_orm_pg_core.PgColumn<{
        name: "created_at";
        tableName: "user";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    updatedAt: drizzle_orm_pg_core.PgColumn<{
        name: "updated_at";
        tableName: "user";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    profilePicPath: drizzle_orm_pg_core.PgColumn<{
        name: "profile_pic_path";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "user";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    pushToken: drizzle_orm_pg_core.PgColumn<{
        name: "push_token";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    passwordHash: drizzle_orm_pg_core.PgColumn<{
        name: "password_hash";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    role: drizzle_orm_pg_core.PgColumn<{
        name: "role";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    tokenVersion: drizzle_orm_pg_core.PgColumn<{
        name: "token_version";
        tableName: "user";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    isVerified: drizzle_orm_pg_core.PgColumn<{
        name: "is_verified";
        tableName: "user";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    authProvider: drizzle_orm_pg_core.PgColumn<{
        name: "auth_provider";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    lastLogin: drizzle_orm_pg_core.PgColumn<{
        name: "last_login";
        tableName: "user";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const userInsertDbSchema: drizzle_zod.BuildSchema<"insert", {
    username: drizzle_orm_pg_core.PgColumn<{
        name: "username";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    email: drizzle_orm_pg_core.PgColumn<{
        name: "email";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    name: drizzle_orm_pg_core.PgColumn<{
        name: "name";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    gender: drizzle_orm_pg_core.PgColumn<{
        name: "gender";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: drizzle_orm_pg_core.PgColumn<{
        name: "created_at";
        tableName: "user";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    updatedAt: drizzle_orm_pg_core.PgColumn<{
        name: "updated_at";
        tableName: "user";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    profilePicPath: drizzle_orm_pg_core.PgColumn<{
        name: "profile_pic_path";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "user";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    pushToken: drizzle_orm_pg_core.PgColumn<{
        name: "push_token";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    passwordHash: drizzle_orm_pg_core.PgColumn<{
        name: "password_hash";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    role: drizzle_orm_pg_core.PgColumn<{
        name: "role";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    tokenVersion: drizzle_orm_pg_core.PgColumn<{
        name: "token_version";
        tableName: "user";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    isVerified: drizzle_orm_pg_core.PgColumn<{
        name: "is_verified";
        tableName: "user";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    authProvider: drizzle_orm_pg_core.PgColumn<{
        name: "auth_provider";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    lastLogin: drizzle_orm_pg_core.PgColumn<{
        name: "last_login";
        tableName: "user";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const userUpdateDbSchema: drizzle_zod.BuildSchema<"update", {
    username: drizzle_orm_pg_core.PgColumn<{
        name: "username";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    email: drizzle_orm_pg_core.PgColumn<{
        name: "email";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    name: drizzle_orm_pg_core.PgColumn<{
        name: "name";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    gender: drizzle_orm_pg_core.PgColumn<{
        name: "gender";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: drizzle_orm_pg_core.PgColumn<{
        name: "created_at";
        tableName: "user";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    updatedAt: drizzle_orm_pg_core.PgColumn<{
        name: "updated_at";
        tableName: "user";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    profilePicPath: drizzle_orm_pg_core.PgColumn<{
        name: "profile_pic_path";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "user";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    pushToken: drizzle_orm_pg_core.PgColumn<{
        name: "push_token";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    passwordHash: drizzle_orm_pg_core.PgColumn<{
        name: "password_hash";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    role: drizzle_orm_pg_core.PgColumn<{
        name: "role";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    tokenVersion: drizzle_orm_pg_core.PgColumn<{
        name: "token_version";
        tableName: "user";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    isVerified: drizzle_orm_pg_core.PgColumn<{
        name: "is_verified";
        tableName: "user";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    authProvider: drizzle_orm_pg_core.PgColumn<{
        name: "auth_provider";
        tableName: "user";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    lastLogin: drizzle_orm_pg_core.PgColumn<{
        name: "last_login";
        tableName: "user";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const oauthAccountDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "oauth_account";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    userId: drizzle_orm_pg_core.PgColumn<{
        name: "user_id";
        tableName: "oauth_account";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    provider: drizzle_orm_pg_core.PgColumn<{
        name: "provider";
        tableName: "oauth_account";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    providerUserId: drizzle_orm_pg_core.PgColumn<{
        name: "provider_user_id";
        tableName: "oauth_account";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    providerEmail: drizzle_orm_pg_core.PgColumn<{
        name: "provider_email";
        tableName: "oauth_account";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    linkedAt: drizzle_orm_pg_core.PgColumn<{
        name: "linked_at";
        tableName: "oauth_account";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    missingFields: drizzle_orm_pg_core.PgColumn<{
        name: "missing_fields";
        tableName: "oauth_account";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const exerciseDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "exercise";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: "byDefault";
        generated: undefined;
    }, {}, {}>;
    name: drizzle_orm_pg_core.PgColumn<{
        name: "name";
        tableName: "exercise";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    description: drizzle_orm_pg_core.PgColumn<{
        name: "description";
        tableName: "exercise";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    targetMuscle: drizzle_orm_pg_core.PgColumn<{
        name: "target_muscle";
        tableName: "exercise";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    specificTargetMuscle: drizzle_orm_pg_core.PgColumn<{
        name: "specific_target_muscle";
        tableName: "exercise";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const workoutPlanDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "workout_plan";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: "byDefault";
        generated: undefined;
    }, {}, {}>;
    userId: drizzle_orm_pg_core.PgColumn<{
        name: "user_id";
        tableName: "workout_plan";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    isActive: drizzle_orm_pg_core.PgColumn<{
        name: "is_active";
        tableName: "workout_plan";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    updatedAt: drizzle_orm_pg_core.PgColumn<{
        name: "updated_at";
        tableName: "workout_plan";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: drizzle_orm_pg_core.PgColumn<{
        name: "created_at";
        tableName: "workout_plan";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const workoutSplitDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "workout_split";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: "byDefault";
        generated: undefined;
    }, {}, {}>;
    workoutId: drizzle_orm_pg_core.PgColumn<{
        name: "workout_id";
        tableName: "workout_split";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    name: drizzle_orm_pg_core.PgColumn<{
        name: "name";
        tableName: "workout_split";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: drizzle_orm_pg_core.PgColumn<{
        name: "created_at";
        tableName: "workout_split";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    isActive: drizzle_orm_pg_core.PgColumn<{
        name: "is_active";
        tableName: "workout_split";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const exerciseToWorkoutSplitDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "exercise_to_workout_split";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: "byDefault";
        generated: undefined;
    }, {}, {}>;
    workoutSplitId: drizzle_orm_pg_core.PgColumn<{
        name: "workout_split_id";
        tableName: "exercise_to_workout_split";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    exerciseId: drizzle_orm_pg_core.PgColumn<{
        name: "exercise_id";
        tableName: "exercise_to_workout_split";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: drizzle_orm_pg_core.PgColumn<{
        name: "created_at";
        tableName: "exercise_to_workout_split";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    orderIndex: drizzle_orm_pg_core.PgColumn<{
        name: "order_index";
        tableName: "exercise_to_workout_split";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    isActive: drizzle_orm_pg_core.PgColumn<{
        name: "is_active";
        tableName: "exercise_to_workout_split";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const exerciseToWorkoutSplitExpandedViewDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "v_exercise_to_workout_split_expanded";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    workoutSplitId: drizzle_orm_pg_core.PgColumn<{
        name: "workout_split_id";
        tableName: "v_exercise_to_workout_split_expanded";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    workoutId: drizzle_orm_pg_core.PgColumn<{
        name: "workout_id";
        tableName: "v_exercise_to_workout_split_expanded";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    exerciseId: drizzle_orm_pg_core.PgColumn<{
        name: "exercise_id";
        tableName: "v_exercise_to_workout_split_expanded";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    exercise: drizzle_orm_pg_core.PgColumn<{
        name: "exercise";
        tableName: "v_exercise_to_workout_split_expanded";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    workoutSplit: drizzle_orm_pg_core.PgColumn<{
        name: "workout_split";
        tableName: "v_exercise_to_workout_split_expanded";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    reps: drizzle_orm_pg_core.PgColumn<{
        name: "reps";
        tableName: "v_exercise_to_workout_split_expanded";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    orderIndex: drizzle_orm_pg_core.PgColumn<{
        name: "order_index";
        tableName: "v_exercise_to_workout_split_expanded";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    setOrderIndex: drizzle_orm_pg_core.PgColumn<{
        name: "set_order_index";
        tableName: "v_exercise_to_workout_split_expanded";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: drizzle_orm_pg_core.PgColumn<{
        name: "created_at";
        tableName: "v_exercise_to_workout_split_expanded";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    isActive: drizzle_orm_pg_core.PgColumn<{
        name: "is_active";
        tableName: "v_exercise_to_workout_split_expanded";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const workoutSetDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "workout_set";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    exerciseToSplitId: drizzle_orm_pg_core.PgColumn<{
        name: "exercise_to_split_id";
        tableName: "workout_set";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    orderIndex: drizzle_orm_pg_core.PgColumn<{
        name: "order_index";
        tableName: "workout_set";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    reps: drizzle_orm_pg_core.PgColumn<{
        name: "reps";
        tableName: "workout_set";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const workoutSummaryDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "workout_summary";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    userId: drizzle_orm_pg_core.PgColumn<{
        name: "user_id";
        tableName: "workout_summary";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    workoutSplitId: drizzle_orm_pg_core.PgColumn<{
        name: "workout_split_id";
        tableName: "workout_summary";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    workoutStartUtc: drizzle_orm_pg_core.PgColumn<{
        name: "workout_start_utc";
        tableName: "workout_summary";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    workoutEndUtc: drizzle_orm_pg_core.PgColumn<{
        name: "workout_end_utc";
        tableName: "workout_summary";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: drizzle_orm_pg_core.PgColumn<{
        name: "created_at";
        tableName: "workout_summary";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const exerciseTrackingDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "exercise_tracking";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: "byDefault";
        generated: undefined;
    }, {}, {}>;
    workoutSummaryId: drizzle_orm_pg_core.PgColumn<{
        name: "workout_summary_id";
        tableName: "exercise_tracking";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    exerciseToSplitId: drizzle_orm_pg_core.PgColumn<{
        name: "exercise_to_split_id";
        tableName: "exercise_tracking";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    exerciseId: drizzle_orm_pg_core.PgColumn<{
        name: "exercise_id";
        tableName: "exercise_tracking";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    notes: drizzle_orm_pg_core.PgColumn<{
        name: "notes";
        tableName: "exercise_tracking";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const trackingSetDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "tracking_set";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    exerciseTrackingId: drizzle_orm_pg_core.PgColumn<{
        name: "exercise_tracking_id";
        tableName: "tracking_set";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    setIndex: drizzle_orm_pg_core.PgColumn<{
        name: "set_index";
        tableName: "tracking_set";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    reps: drizzle_orm_pg_core.PgColumn<{
        name: "reps";
        tableName: "tracking_set";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    weight: drizzle_orm_pg_core.PgColumn<{
        name: "weight";
        tableName: "tracking_set";
        dataType: "number";
        columnType: "PgReal";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const aerobicTrackingDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "aerobic_tracking";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: "byDefault";
        generated: undefined;
    }, {}, {}>;
    userId: drizzle_orm_pg_core.PgColumn<{
        name: "user_id";
        tableName: "aerobic_tracking";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    type: drizzle_orm_pg_core.PgColumn<{
        name: "type";
        tableName: "aerobic_tracking";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    durationSec: drizzle_orm_pg_core.PgColumn<{
        name: "duration_sec";
        tableName: "aerobic_tracking";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    workoutTimeUtc: drizzle_orm_pg_core.PgColumn<{
        name: "workout_time_utc";
        tableName: "aerobic_tracking";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const messageDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "message";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    senderId: drizzle_orm_pg_core.PgColumn<{
        name: "sender_id";
        tableName: "message";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    receiverId: drizzle_orm_pg_core.PgColumn<{
        name: "receiver_id";
        tableName: "message";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    subject: drizzle_orm_pg_core.PgColumn<{
        name: "subject";
        tableName: "message";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    msg: drizzle_orm_pg_core.PgColumn<{
        name: "msg";
        tableName: "message";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    sentAt: drizzle_orm_pg_core.PgColumn<{
        name: "sent_at";
        tableName: "message";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    isRead: drizzle_orm_pg_core.PgColumn<{
        name: "is_read";
        tableName: "message";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const userReminderSettingDbSchema: drizzle_zod.BuildSchema<"select", {
    userId: drizzle_orm_pg_core.PgColumn<{
        name: "user_id";
        tableName: "user_reminder_setting";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    workoutRemindersEnabled: drizzle_orm_pg_core.PgColumn<{
        name: "workout_reminders_enabled";
        tableName: "user_reminder_setting";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    reminderOffsetMinutes: drizzle_orm_pg_core.PgColumn<{
        name: "reminder_offset_minutes";
        tableName: "user_reminder_setting";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    updatedAt: drizzle_orm_pg_core.PgColumn<{
        name: "updated_at";
        tableName: "user_reminder_setting";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    timezone: drizzle_orm_pg_core.PgColumn<{
        name: "timezone";
        tableName: "user_reminder_setting";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const userSplitInformationDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "user_split_information";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: "byDefault";
        generated: undefined;
    }, {}, {}>;
    userId: drizzle_orm_pg_core.PgColumn<{
        name: "user_id";
        tableName: "user_split_information";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    workoutSplitId: drizzle_orm_pg_core.PgColumn<{
        name: "workout_split_id";
        tableName: "user_split_information";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    estimatedTimeUtc: drizzle_orm_pg_core.PgColumn<{
        name: "estimated_time_utc";
        tableName: "user_split_information";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    confidence: drizzle_orm_pg_core.PgColumn<{
        name: "confidence";
        tableName: "user_split_information";
        dataType: "string";
        columnType: "PgNumeric";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    lastComputedAt: drizzle_orm_pg_core.PgColumn<{
        name: "last_computed_at";
        tableName: "user_split_information";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    preferredWeekday: drizzle_orm_pg_core.PgColumn<{
        name: "preferred_weekday";
        tableName: "user_split_information";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const exerciseTrackingExpandedViewDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "v_exercise_tracking_expanded";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    exerciseToSplitId: drizzle_orm_pg_core.PgColumn<{
        name: "exercise_to_split_id";
        tableName: "v_exercise_tracking_expanded";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    weight: drizzle_orm_pg_core.PgColumn<{
        name: "weight";
        tableName: "v_exercise_tracking_expanded";
        dataType: "number";
        columnType: "PgReal";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    reps: drizzle_orm_pg_core.PgColumn<{
        name: "reps";
        tableName: "v_exercise_tracking_expanded";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    setIndex: drizzle_orm_pg_core.PgColumn<{
        name: "set_index";
        tableName: "v_exercise_tracking_expanded";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    exerciseId: drizzle_orm_pg_core.PgColumn<{
        name: "exercise_id";
        tableName: "v_exercise_tracking_expanded";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    workoutSplitId: drizzle_orm_pg_core.PgColumn<{
        name: "workout_split_id";
        tableName: "v_exercise_tracking_expanded";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    splitName: drizzle_orm_pg_core.PgColumn<{
        name: "split_name";
        tableName: "v_exercise_tracking_expanded";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    exercise: drizzle_orm_pg_core.PgColumn<{
        name: "exercise";
        tableName: "v_exercise_tracking_expanded";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    notes: drizzle_orm_pg_core.PgColumn<{
        name: "notes";
        tableName: "v_exercise_tracking_expanded";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    workoutSummaryId: drizzle_orm_pg_core.PgColumn<{
        name: "workout_summary_id";
        tableName: "v_exercise_tracking_expanded";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    workoutStartUtc: drizzle_orm_pg_core.PgColumn<{
        name: "workout_start_utc";
        tableName: "v_exercise_tracking_expanded";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    workoutEndUtc: drizzle_orm_pg_core.PgColumn<{
        name: "workout_end_utc";
        tableName: "v_exercise_tracking_expanded";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
declare const prsViewDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "v_prs";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    exerciseToSplitId: drizzle_orm_pg_core.PgColumn<{
        name: "exercise_to_split_id";
        tableName: "v_prs";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    exerciseId: drizzle_orm_pg_core.PgColumn<{
        name: "exercise_id";
        tableName: "v_prs";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    exercise: drizzle_orm_pg_core.PgColumn<{
        name: "exercise";
        tableName: "v_prs";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    weight: drizzle_orm_pg_core.PgColumn<{
        name: "weight";
        tableName: "v_prs";
        dataType: "number";
        columnType: "PgReal";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    reps: drizzle_orm_pg_core.PgColumn<{
        name: "reps";
        tableName: "v_prs";
        dataType: "number";
        columnType: "PgBigInt53";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    workoutSummaryId: drizzle_orm_pg_core.PgColumn<{
        name: "workout_summary_id";
        tableName: "v_prs";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    workoutStartUtc: drizzle_orm_pg_core.PgColumn<{
        name: "workout_start_utc";
        tableName: "v_prs";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    workoutEndUtc: drizzle_orm_pg_core.PgColumn<{
        name: "workout_end_utc";
        tableName: "v_prs";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined, undefined>;
type UserRow = typeof user.$inferSelect;
type UserInsert = typeof user.$inferInsert;
type AerobicTrackingRow = typeof aerobicTracking.$inferSelect;
type MessageRow = typeof message.$inferSelect;
type ExerciseRow = typeof exercise.$inferSelect;
type WorkoutPlanRow = typeof workoutPlan.$inferSelect;
type WorkoutSplitRow = typeof workoutSplit.$inferSelect;
type ExerciseToWorkoutSplitRow = typeof exerciseToWorkoutSplit.$inferSelect;
type WorkoutSummaryRow = typeof workoutSummary.$inferSelect;
type ExerciseTrackingRow = typeof exerciseTracking.$inferSelect;

declare const addAerobicsRequest: z$1.ZodObject<{
    body: z$1.ZodObject<{
        tz: z$1.ZodString;
        record: z$1.ZodObject<{
            durationMins: z$1.ZodNumber;
            durationSec: z$1.ZodInt;
            type: z$1.ZodString;
        }, z$1.core.$strip>;
    }, z$1.core.$strip>;
}, z$1.core.$strip>;
declare const getAerobicsRequest: z$1.ZodObject<{
    query: z$1.ZodObject<{
        tz: z$1.ZodOptional<z$1.ZodString>;
    }, z$1.core.$strip>;
}, z$1.core.$strip>;
declare const aerobicsDailyRecordSchema: z$1.ZodObject<{
    type: z$1.ZodString;
    durationSec: z$1.ZodInt;
    durationMins: z$1.ZodInt;
}, z$1.core.$strip>;
declare const aerobicsWeeklyRecordSchema: z$1.ZodObject<{
    type: z$1.ZodString;
    durationSec: z$1.ZodInt;
    durationMins: z$1.ZodInt;
    workoutTimeUtc: z$1.ZodString;
}, z$1.core.$strip>;
declare const weeklyDataSchema: z$1.ZodObject<{
    records: z$1.ZodArray<z$1.ZodObject<{
        type: z$1.ZodString;
        durationSec: z$1.ZodInt;
        durationMins: z$1.ZodInt;
        workoutTimeUtc: z$1.ZodString;
    }, z$1.core.$strip>>;
    totalDurationSec: z$1.ZodNumber;
    totalDurationMins: z$1.ZodNumber;
}, z$1.core.$strip>;
declare const userAerobicsResponseSchema: z$1.ZodObject<{
    daily: z$1.ZodRecord<z$1.ZodString, z$1.ZodArray<z$1.ZodObject<{
        type: z$1.ZodString;
        durationSec: z$1.ZodInt;
        durationMins: z$1.ZodInt;
    }, z$1.core.$strip>>>;
    weekly: z$1.ZodRecord<z$1.ZodString, z$1.ZodObject<{
        records: z$1.ZodArray<z$1.ZodObject<{
            type: z$1.ZodString;
            durationSec: z$1.ZodInt;
            durationMins: z$1.ZodInt;
            workoutTimeUtc: z$1.ZodString;
        }, z$1.core.$strip>>;
        totalDurationSec: z$1.ZodNumber;
        totalDurationMins: z$1.ZodNumber;
    }, z$1.core.$strip>>;
}, z$1.core.$strip>;

type AddUserAerobicsBody = z$1.infer<typeof addAerobicsRequest.shape.body>;
type GetUserAerobicsQuery = z$1.infer<typeof getAerobicsRequest.shape.query>;
type UserAerobicsResponse = z$1.infer<typeof userAerobicsResponseSchema>;

type AddAerobicInput = AddUserAerobicsBody['record'];
type AerobicsDailyRecord = z.infer<typeof aerobicsDailyRecordSchema>;
type AerobicsWeeklyRecord = z.infer<typeof aerobicsWeeklyRecordSchema>;
type WeeklyData = z.infer<typeof weeklyDataSchema>;

declare const workoutRmRecordSchema: z.ZodObject<{
    exercise: z.ZodString;
    prWeight: z.ZodNullable<z.ZodNumber>;
    prReps: z.ZodNullable<z.ZodInt>;
    max1Rm: z.ZodNumber;
}, z.core.$strip>;
declare const adherenceExerciseStatsSchema: z.ZodObject<{
    planned: z.ZodNumber;
    actual: z.ZodNumber;
    adherencePct: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
declare const getAnalyticsResponseSchema: z.ZodObject<{
    oneRepMaxes: z.ZodRecord<z.ZodString, z.ZodObject<{
        exercise: z.ZodString;
        prWeight: z.ZodNullable<z.ZodNumber>;
        prReps: z.ZodNullable<z.ZodInt>;
        max1Rm: z.ZodNumber;
    }, z.core.$strip>>;
    goals: z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodObject<{
        planned: z.ZodNumber;
        actual: z.ZodNumber;
        adherencePct: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>>;
}, z.core.$strip>;

type GetAnalyticsResponse = z$1.infer<typeof getAnalyticsResponseSchema>;

type WorkoutRMRecord = z.infer<typeof workoutRmRecordSchema>;
type WorkoutRMsResponse = z.infer<typeof getAnalyticsResponseSchema.shape.oneRepMaxes>;
type AdherenceExerciseStats = z.infer<typeof adherenceExerciseStatsSchema>;
type GoalAdherenceResponse = z.infer<typeof getAnalyticsResponseSchema.shape.goals>;

declare const sendChangePassEmailRequest: z.ZodObject<{
    body: z.ZodObject<{
        identifier: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const resetPasswordRequest: z.ZodObject<{
    body: z.ZodObject<{
        newPassword: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodObject<{
        token: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const resetPasswordResponseSchema: z.ZodObject<{
    ok: z.ZodBoolean;
}, z.core.$strip>;

type SendChangePassEmailBody = z$1.infer<typeof sendChangePassEmailRequest.shape.body>;
type ResetPasswordBody = z$1.infer<typeof resetPasswordRequest.shape.body>;
type ResetPasswordQuery = z$1.infer<typeof resetPasswordRequest.shape.query>;
type ResetPasswordResponse = z$1.infer<typeof resetPasswordResponseSchema>;

declare const forgotPasswordPayloadSchema: z.ZodObject<{
    sub: z.ZodUUID;
    jti: z.ZodString;
    exp: z.ZodNumber;
    iss: z.ZodString;
    typ: z.ZodString;
}, z.core.$strip>;
type ForgotPasswordPayload = z.infer<typeof forgotPasswordPayloadSchema>;

declare const loginRequest: z.ZodObject<{
    body: z.ZodObject<{
        identifier: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const loginResponseSchema: z.ZodObject<{
    message: z.ZodString;
    user: z.ZodUUID;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
}, z.core.$strip>;
declare const logoutResponseSchema: z.ZodObject<{
    message: z.ZodString;
}, z.core.$strip>;
declare const refreshTokenResponseSchema: z.ZodObject<{
    message: z.ZodString;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    userId: z.ZodUUID;
}, z.core.$strip>;

type LoginRequestBody = z$1.infer<typeof loginRequest.shape.body>;
type LoginResponse = z$1.infer<typeof loginResponseSchema>;
type RefreshTokenResponse = z$1.infer<typeof refreshTokenResponseSchema>;
type LogOutResponse = z$1.infer<typeof logoutResponseSchema>;

declare const accessTokenPayloadSchema: z.ZodObject<{
    id: z.ZodUUID;
    role: z.ZodString;
    tokenVer: z.ZodInt;
    cnf: z.ZodOptional<z.ZodObject<{
        jkt: z.ZodString;
    }, z.core.$strip>>;
    iat: z.ZodOptional<z.ZodNumber>;
    exp: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
declare const userAfterBumpSchema: z.ZodObject<{
    tokenVersion: z.ZodInt;
    userData: z.ZodObject<{
        id: z.ZodUUID;
        username: z.ZodString;
        email: z.ZodString;
        name: z.ZodString;
        gender: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
        pushToken: z.ZodNullable<z.ZodString>;
        role: z.ZodString;
        isFirstLogin: z.ZodBoolean;
        tokenVersion: z.ZodInt;
        isVerified: z.ZodBoolean;
        authProvider: z.ZodString;
        lastLogin: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const tokenVersionResultSchema: z.ZodObject<{
    tokenVersion: z.ZodInt;
}, z.core.$strip>;
type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;
type UserAfterBump = z.infer<typeof userAfterBumpSchema>;
type TokenVersionResult = z.infer<typeof tokenVersionResultSchema>;

declare const verifyAccountRequest: z$1.ZodObject<{
    query: z$1.ZodObject<{
        token: z$1.ZodOptional<z$1.ZodString>;
    }, z$1.core.$strip>;
}, z$1.core.$strip>;
declare const sendVerificationMailRequest: z$1.ZodObject<{
    body: z$1.ZodObject<{
        email: z$1.ZodString;
    }, z$1.core.$strip>;
}, z$1.core.$strip>;
declare const changeEmailAndVerifyRequest: z$1.ZodObject<{
    body: z$1.ZodObject<{
        username: z$1.ZodString;
        password: z$1.ZodString;
        newEmail: z$1.ZodString;
    }, z$1.core.$strip>;
}, z$1.core.$strip>;
declare const checkUserVerifyRequest: z$1.ZodObject<{
    query: z$1.ZodObject<{
        username: z$1.ZodString;
    }, z$1.core.$strip>;
}, z$1.core.$strip>;

type VerifyUserAccountQuery = z$1.infer<typeof verifyAccountRequest.shape.query>;
type SendVerifcationMailBody = z$1.infer<typeof sendVerificationMailRequest.shape.body>;
type ChangeEmailAndVerifyBody = z$1.infer<typeof changeEmailAndVerifyRequest.shape.body>;
type CheckUserVerifyQuery = z$1.infer<typeof checkUserVerifyRequest.shape.query>;

declare const emailVerifyPayloadSchema: z.ZodObject<{
    sub: z.ZodUUID;
    jti: z.ZodString;
    exp: z.ZodNumber;
    iss: z.ZodString;
    typ: z.ZodString;
}, z.core.$strip>;
type EmailVerifyPayload = z.infer<typeof emailVerifyPayloadSchema>;

declare const userByIndetifierSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    username: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodNullable<z.ZodString>;
    role: z.ZodString;
    isVerified: z.ZodBoolean;
    lastLogin: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/** Compatibility name retained for existing backend imports. */
type UserByIndetifier = z.infer<typeof userByIndetifierSchema>;

declare const bootstrapRequest: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const bootstrapResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodUUID;
        username: z.ZodString;
        email: z.ZodString;
        name: z.ZodString;
        gender: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
        pushToken: z.ZodNullable<z.ZodString>;
        role: z.ZodString;
        isFirstLogin: z.ZodBoolean;
        tokenVersion: z.ZodInt;
        isVerified: z.ZodBoolean;
        authProvider: z.ZodString;
        lastLogin: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
    workout: z.ZodObject<{
        workoutPlan: z.ZodNullable<z.ZodObject<{
            id: z.ZodInt;
            numberOfSplits: z.ZodNumber;
            createdAt: z.ZodString;
            userId: z.ZodUUID;
            isActive: z.ZodBoolean;
            updatedAt: z.ZodString;
            workoutSplits: z.ZodNullable<z.ZodArray<z.ZodObject<{
                id: z.ZodInt;
                workoutId: z.ZodInt;
                name: z.ZodString;
                createdAt: z.ZodString;
                muscleGroup: z.ZodNullable<z.ZodString>;
                isActive: z.ZodBoolean;
                exerciseToWorkoutSplit: z.ZodArray<z.ZodObject<{
                    id: z.ZodInt;
                    sets: z.ZodArray<z.ZodInt>;
                    isActive: z.ZodBoolean;
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                    exercise: z.ZodString;
                    workoutSplit: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
        workoutPlanForEditWorkout: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            name: z.ZodString;
            sets: z.ZodArray<z.ZodInt>;
            orderIndex: z.ZodInt;
            targetMuscle: z.ZodString;
            specificTargetMuscle: z.ZodString;
        }, z.core.$strip>>>>;
    }, z.core.$strip>;
    tracking: z.ZodObject<{
        exerciseTrackingAnalysis: z.ZodObject<{
            uniqueDays: z.ZodNumber;
            mostFrequentSplit: z.ZodNullable<z.ZodString>;
            mostFrequentSplitDays: z.ZodNullable<z.ZodNumber>;
            lastWorkoutDate: z.ZodNullable<z.ZodString>;
            splitDaysByName: z.ZodRecord<z.ZodString, z.ZodNumber>;
            prs: z.ZodObject<{
                prMax: z.ZodNullable<z.ZodObject<{
                    exercise: z.ZodString;
                    weight: z.ZodNumber;
                    reps: z.ZodInt;
                    workoutTimeUtc: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>;
        }, z.core.$strip>;
        exerciseTrackingMaps: z.ZodObject<{
            byDate: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
                id: z.ZodInt;
                exerciseToSplitId: z.ZodInt;
                orderIndex: z.ZodInt;
                reps: z.ZodArray<z.ZodInt>;
                workoutSplitId: z.ZodInt;
                exerciseId: z.ZodInt;
                exercise: z.ZodString;
                exerciseToWorkoutSplit: z.ZodObject<{
                    sets: z.ZodArray<z.ZodInt>;
                    exercises: z.ZodObject<{
                        targetMuscle: z.ZodString;
                        specificTargetMuscle: z.ZodString;
                    }, z.core.$strip>;
                }, z.core.$strip>;
                notes: z.ZodNullable<z.ZodString>;
                weight: z.ZodArray<z.ZodNumber>;
                splitName: z.ZodString;
            }, z.core.$strip>>>;
            byExerciseToSplitId: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
                id: z.ZodInt;
                exerciseToSplitId: z.ZodInt;
                weight: z.ZodArray<z.ZodNumber>;
                reps: z.ZodArray<z.ZodInt>;
                notes: z.ZodNullable<z.ZodString>;
                exerciseId: z.ZodInt;
                workoutSplitId: z.ZodInt;
                splitName: z.ZodString;
                exercise: z.ZodString;
                workoutDate: z.ZodString;
                orderIndex: z.ZodInt;
                exerciseToWorkoutSplit: z.ZodObject<{
                    sets: z.ZodArray<z.ZodInt>;
                    exercises: z.ZodObject<{
                        targetMuscle: z.ZodString;
                        specificTargetMuscle: z.ZodString;
                    }, z.core.$strip>;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            bySplitName: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
                id: z.ZodInt;
                exerciseToSplitId: z.ZodInt;
                orderIndex: z.ZodInt;
                reps: z.ZodArray<z.ZodInt>;
                workoutSplitId: z.ZodInt;
                exerciseId: z.ZodInt;
                exercise: z.ZodString;
                exerciseToWorkoutSplit: z.ZodObject<{
                    sets: z.ZodArray<z.ZodInt>;
                    exercises: z.ZodObject<{
                        targetMuscle: z.ZodString;
                        specificTargetMuscle: z.ZodString;
                    }, z.core.$strip>;
                }, z.core.$strip>;
                notes: z.ZodNullable<z.ZodString>;
                weight: z.ZodArray<z.ZodNumber>;
                workoutDate: z.ZodString;
            }, z.core.$strip>>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    messages: z.ZodObject<{
        messages: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            subject: z.ZodString;
            msg: z.ZodString;
            sentAt: z.ZodString;
            isRead: z.ZodBoolean;
            senderFullName: z.ZodString;
            senderProfilePicPath: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    aerobics: z.ZodObject<{
        daily: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            durationSec: z.ZodInt;
            durationMins: z.ZodInt;
        }, z.core.$strip>>>;
        weekly: z.ZodRecord<z.ZodString, z.ZodObject<{
            records: z.ZodArray<z.ZodObject<{
                type: z.ZodString;
                durationSec: z.ZodInt;
                durationMins: z.ZodInt;
                workoutTimeUtc: z.ZodString;
            }, z.core.$strip>>;
            totalDurationSec: z.ZodNumber;
            totalDurationMins: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;

type BootstrapRequestQuery = z$1.infer<typeof bootstrapRequest.shape.query>;
type BootstrapResponse = z$1.infer<typeof bootstrapResponseSchema>;

declare const getAllExercisesExerciseSchema: z.ZodObject<{
    id: z.ZodInt;
    name: z.ZodString;
    specificTargetMuscle: z.ZodString;
}, z.core.$strip>;
declare const getAllExercisesResponseSchema: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
    id: z.ZodInt;
    name: z.ZodString;
    specificTargetMuscle: z.ZodString;
}, z.core.$strip>>>;
declare const queryGetExerciseMapByMuscleRowSchema: z.ZodObject<{
    result: z.ZodNullable<z.ZodObject<{
        map: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            name: z.ZodString;
            specificTargetMuscle: z.ZodString;
        }, z.core.$strip>>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;

type GetAllExercisesResponse = z$1.infer<typeof getAllExercisesResponseSchema>;

type GetAllExercisesExercise = z.infer<typeof getAllExercisesExerciseSchema>;
type ExercisesMapByMuscle = z.infer<typeof getAllExercisesResponseSchema>;
type QueryGetExerciseMapByMuscleRow = z.infer<typeof queryGetExerciseMapByMuscleRowSchema>;

declare const getAllMessagesRequest: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const allUserMessageSchema: z.ZodObject<{
    id: z.ZodUUID;
    subject: z.ZodString;
    msg: z.ZodString;
    sentAt: z.ZodString;
    isRead: z.ZodBoolean;
    senderFullName: z.ZodString;
    senderProfilePicPath: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
declare const getAllUserMessagesResponseSchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        subject: z.ZodString;
        msg: z.ZodString;
        sentAt: z.ZodString;
        isRead: z.ZodBoolean;
        senderFullName: z.ZodString;
        senderProfilePicPath: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const markMessageAsReadRequest: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const messageAsReadSchema: z.ZodObject<{
    id: z.ZodUUID;
    isRead: z.ZodBoolean;
}, z.core.$strip>;
declare const markMessageAsReadResponseSchema: z.ZodObject<{
    id: z.ZodUUID;
    isRead: z.ZodBoolean;
}, z.core.$strip>;
declare const deleteMessageRequest: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const deletedMessageSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.core.$strip>;
declare const messageAfterSendResponseSchema: z.ZodObject<{
    id: z.ZodUUID;
    senderId: z.ZodUUID;
    receiverId: z.ZodUUID;
    subject: z.ZodString;
    msg: z.ZodString;
    sentAt: z.ZodString;
    isRead: z.ZodBoolean;
    senderUsername: z.ZodString;
    senderFullName: z.ZodString;
    senderProfilePicPath: z.ZodNullable<z.ZodString>;
    senderGender: z.ZodString;
}, z.core.$strip>;
declare const deleteMessageResponseSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.core.$strip>;

type GetAllUserMessagesQuery = z$1.infer<typeof getAllMessagesRequest.shape.query>;
type GetAllUserMessagesResponse = z$1.infer<typeof getAllUserMessagesResponseSchema>;
type MarkMessageAsReadParams = z$1.infer<typeof markMessageAsReadRequest.shape.params>;
type MarkMessageAsReadResponse = z$1.infer<typeof markMessageAsReadResponseSchema>;
type DeleteMessageParams = z$1.infer<typeof deleteMessageRequest.shape.params>;
type DeleteMessageResponse = z$1.infer<typeof deleteMessageResponseSchema>;

type AllUserMessages = z.infer<typeof allUserMessageSchema>;
type MessageAfterSendResponse = z.infer<typeof messageAfterSendResponseSchema>;
type MessageAsRead = z.infer<typeof messageAsReadSchema>;
type DeletedMessage = z.infer<typeof deletedMessageSchema>;

declare const appleOAuthRequest: z.ZodObject<{
    body: z.ZodObject<{
        idToken: z.ZodString;
        rawNonce: z.ZodString;
        name: z.ZodOptional<z.ZodObject<{
            givenName: z.ZodNullable<z.ZodString>;
            familyName: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
        email: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;

type AppleOAuthBody = z$1.infer<typeof appleOAuthRequest.shape.body>;

declare const appleTokenVerificationResultSchema: z.ZodObject<{
    appleSub: z.ZodString;
    email: z.ZodNullable<z.ZodString>;
    emailVerified: z.ZodBoolean;
    fullName: z.ZodString;
}, z.core.$strip>;
type AppleTokenVerificationResult = z.infer<typeof appleTokenVerificationResultSchema>;

declare const googleOAuthRequest: z.ZodObject<{
    body: z.ZodObject<{
        idToken: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;

type GoogleOAuthBody = z$1.infer<typeof googleOAuthRequest.shape.body>;

declare const googleTokenVerificationResultSchema: z.ZodObject<{
    googleSub: z.ZodString;
    email: z.ZodNullable<z.ZodString>;
    emailVerified: z.ZodBoolean;
    fullName: z.ZodString;
}, z.core.$strip>;
type GoogleTokenVerificationResult = z.infer<typeof googleTokenVerificationResultSchema>;

declare const oAuthLoginResponseSchema: z.ZodObject<{
    message: z.ZodString;
    user: z.ZodUUID;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    missingFields: z.ZodNullable<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
declare const proceedLoginResponseSchema: z.ZodObject<{
    message: z.ZodString;
    user: z.ZodUUID;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
}, z.core.$strip>;

type OAuthLoginResponse = z$1.infer<typeof oAuthLoginResponseSchema>;

declare const createUserRequest: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodString;
        fullName: z.ZodPipe<z.ZodTransform<{}, unknown>, z.ZodString>;
        email: z.ZodString;
        password: z.ZodString;
        gender: z.ZodPipe<z.ZodTransform<{}, unknown>, z.ZodEnum<{
            Unknown: "Unknown";
            Male: "Male";
            Female: "Female";
            Other: "Other";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const createUserUserSchema: z.ZodObject<{
    id: z.ZodUUID;
    username: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    gender: z.ZodString;
    role: z.ZodString;
    createdAt: z.ZodString;
}, z.core.$strip>;
declare const createUserResponseSchema: z.ZodObject<{
    message: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodUUID;
        username: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        gender: z.ZodString;
        role: z.ZodString;
        createdAt: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;

type CreateUserBody = z$1.infer<typeof createUserRequest.shape.body>;
type CreateUserResponse = z$1.infer<typeof createUserResponseSchema>;

declare const saveUserPushTokenRequest: z.ZodObject<{
    body: z.ZodObject<{
        token: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;

type SaveUserPushTokenBody = z$1.infer<typeof saveUserPushTokenRequest.shape.body>;

declare const updateUserRequest: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodOptional<z.ZodString>;
        fullName: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const deleteProfilePicRequest: z.ZodObject<{
    body: z.ZodObject<{
        profilePicPath: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const userDataSchema: z.ZodObject<{
    id: z.ZodUUID;
    username: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    gender: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    profilePicPath: z.ZodNullable<z.ZodString>;
    pushToken: z.ZodNullable<z.ZodString>;
    role: z.ZodString;
    isFirstLogin: z.ZodBoolean;
    tokenVersion: z.ZodInt;
    isVerified: z.ZodBoolean;
    authProvider: z.ZodString;
    lastLogin: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
declare const userDataResponseSchema: z.ZodObject<{
    userData: z.ZodObject<{
        id: z.ZodUUID;
        username: z.ZodString;
        email: z.ZodString;
        name: z.ZodString;
        gender: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
        pushToken: z.ZodNullable<z.ZodString>;
        role: z.ZodString;
        isFirstLogin: z.ZodBoolean;
        tokenVersion: z.ZodInt;
        isVerified: z.ZodBoolean;
        authProvider: z.ZodString;
        lastLogin: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getAuthenticatedUserByIdResponseSchema: z.ZodObject<{
    id: z.ZodUUID;
    username: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    gender: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    profilePicPath: z.ZodNullable<z.ZodString>;
    pushToken: z.ZodNullable<z.ZodString>;
    role: z.ZodString;
    isFirstLogin: z.ZodBoolean;
    tokenVersion: z.ZodInt;
    isVerified: z.ZodBoolean;
    authProvider: z.ZodString;
    lastLogin: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
declare const updateAuthenticatedUserResponseSchema: z.ZodObject<{
    message: z.ZodString;
    emailChanged: z.ZodBoolean;
    user: z.ZodObject<{
        id: z.ZodUUID;
        username: z.ZodString;
        email: z.ZodString;
        name: z.ZodString;
        gender: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
        pushToken: z.ZodNullable<z.ZodString>;
        role: z.ZodString;
        isFirstLogin: z.ZodBoolean;
        tokenVersion: z.ZodInt;
        isVerified: z.ZodBoolean;
        authProvider: z.ZodString;
        lastLogin: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const setProfilePicAndUpdateDBResponseSchema: z.ZodObject<{
    profilePicPath: z.ZodString;
    url: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;

type UpdateUserBody = z$1.infer<typeof updateUserRequest.shape.body>;
type UpdateAuthenticatedUserResponse = z$1.infer<typeof updateAuthenticatedUserResponseSchema>;
type UserDataResponse = z$1.infer<typeof userDataResponseSchema>;
type GetAuthenticatedUserByIdResponse = z$1.infer<typeof getAuthenticatedUserByIdResponseSchema>;
type DeleteUserProfilePicBody = z$1.infer<typeof deleteProfilePicRequest.shape.body>;
type SetProfilePicAndUpdateDBResponse = z$1.infer<typeof setProfilePicAndUpdateDBResponseSchema>;

declare const changeEmailTokenPayloadSchema: z.ZodObject<{
    jti: z.ZodString;
    sub: z.ZodString;
    newEmail: z.ZodString;
    exp: z.ZodNumber;
    iss: z.ZodString;
    typ: z.ZodString;
}, z.core.$strip>;
type ChangeEmailTokenPayload = z.infer<typeof changeEmailTokenPayloadSchema>;
type AuthenticatedUserForUpdate = z.infer<typeof updateUserRequest.shape.body>;

declare const getPresignedUrlS3Request: z.ZodObject<{
    body: z.ZodObject<{
        exercise: z.ZodString;
        fileType: z.ZodString;
        jobId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getPresignedUrlFromS3ResponseSchema: z.ZodObject<{
    uploadUrl: z.ZodString;
    fileKey: z.ZodString;
    requestId: z.ZodString;
}, z.core.$strip>;

type GetPresignedUrlFromS3Body = z$1.infer<typeof getPresignedUrlS3Request.shape.body>;
type GetPresignedUrlFromS3Response = z$1.infer<typeof getPresignedUrlFromS3ResponseSchema>;

declare const enqueueAanalyzeVideoParamsSchema: z.ZodObject<{
    fileKey: z.ZodString;
    exercise: z.ZodString;
    userId: z.ZodUUID;
    requestId: z.ZodString;
    sentryTrace: z.ZodOptional<z.ZodString>;
    baggage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const analyzeVideoPayloadSchema: z.ZodObject<{
    fileKey: z.ZodString;
    exercise: z.ZodString;
    userId: z.ZodUUID;
    requestId: z.ZodString;
    sentryTrace: z.ZodOptional<z.ZodString>;
    baggage: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodNumber;
}, z.core.$strip>;
declare const squatRepetitionSchema: z.ZodObject<{
    depth: z.ZodObject<{
        value: z.ZodNumber;
        status: z.ZodString;
        confidence: z.ZodNumber;
    }, z.core.$strip>;
    backLean: z.ZodObject<{
        value: z.ZodNumber;
        excessive: z.ZodBoolean;
        confidence: z.ZodNumber;
    }, z.core.$strip>;
    audit: z.ZodObject<{
        framesAnalyzed: z.ZodNumber;
        validFrames: z.ZodNumber;
        cameraAngle: z.ZodString;
        rawBottomAngle: z.ZodNumber;
        samplingRate: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const analyzeVideoResultPayloadSchema: <TResultSchema extends z.ZodType>(resultSchema: TResultSchema) => z.ZodIntersection<z.ZodObject<{
    jobId: z.ZodString;
    userId: z.ZodUUID;
    exercise: z.ZodString;
    requestId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodDiscriminatedUnion<[z.ZodObject<{
    status: z.ZodLiteral<"completed">;
    result: z.ZodArray<TResultSchema>;
    error: z.ZodNull;
}, z.core.$strip>, z.ZodObject<{
    status: z.ZodLiteral<"failed">;
    result: z.ZodNull;
    error: z.ZodString;
}, z.core.$strip>]>>;
type EnqueueAanalyzeVideoParams = z.infer<typeof enqueueAanalyzeVideoParamsSchema>;
type AnalyzeVideoPayload = z.infer<typeof analyzeVideoPayloadSchema>;
type SquatRepetition = z.infer<typeof squatRepetitionSchema>;
type AnalyzeVideoResultPayload<TResult> = z.infer<ReturnType<typeof analyzeVideoResultPayloadSchema<z.ZodType<TResult>>>>;

declare const generateTicketRequest: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const generateTicketResponseSchema: z.ZodObject<{
    ticket: z.ZodString;
}, z.core.$strip>;

type GenerateTicketBody = z$1.infer<typeof generateTicketRequest.shape.body>;
type GenerateTicketResponse = z$1.infer<typeof generateTicketResponseSchema>;

declare const exerciseInPlanSchema: z.ZodObject<{
    id: z.ZodInt;
    sets: z.ZodArray<z.ZodInt>;
    isActive: z.ZodBoolean;
    targetMuscle: z.ZodString;
    specificTargetMuscle: z.ZodString;
    exercise: z.ZodString;
    workoutSplit: z.ZodString;
}, z.core.$strip>;
declare const workoutSplitSchema: z.ZodObject<{
    id: z.ZodInt;
    workoutId: z.ZodInt;
    name: z.ZodString;
    createdAt: z.ZodString;
    muscleGroup: z.ZodNullable<z.ZodString>;
    isActive: z.ZodBoolean;
    exerciseToWorkoutSplit: z.ZodArray<z.ZodObject<{
        id: z.ZodInt;
        sets: z.ZodArray<z.ZodInt>;
        isActive: z.ZodBoolean;
        targetMuscle: z.ZodString;
        specificTargetMuscle: z.ZodString;
        exercise: z.ZodString;
        workoutSplit: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const wholeUserWorkoutPlanSchema: z.ZodObject<{
    id: z.ZodInt;
    numberOfSplits: z.ZodNumber;
    createdAt: z.ZodString;
    userId: z.ZodUUID;
    isActive: z.ZodBoolean;
    updatedAt: z.ZodString;
    workoutSplits: z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodInt;
        workoutId: z.ZodInt;
        name: z.ZodString;
        createdAt: z.ZodString;
        muscleGroup: z.ZodNullable<z.ZodString>;
        isActive: z.ZodBoolean;
        exerciseToWorkoutSplit: z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            sets: z.ZodArray<z.ZodInt>;
            isActive: z.ZodBoolean;
            targetMuscle: z.ZodString;
            specificTargetMuscle: z.ZodString;
            exercise: z.ZodString;
            workoutSplit: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
declare const workoutSplitsMapItemSchema: z.ZodObject<{
    id: z.ZodInt;
    name: z.ZodString;
    sets: z.ZodArray<z.ZodInt>;
    orderIndex: z.ZodInt;
    targetMuscle: z.ZodString;
    specificTargetMuscle: z.ZodString;
}, z.core.$strip>;
declare const workoutSplitsMapSchema: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
    id: z.ZodInt;
    name: z.ZodString;
    sets: z.ZodArray<z.ZodInt>;
    orderIndex: z.ZodInt;
    targetMuscle: z.ZodString;
    specificTargetMuscle: z.ZodString;
}, z.core.$strip>>>;
declare const addWorkoutRequest: z.ZodObject<{
    body: z.ZodObject<{
        workoutData: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            sets: z.ZodArray<z.ZodInt>;
            orderIndex: z.ZodInt;
        }, z.core.$strip>>>;
        workoutName: z.ZodOptional<z.ZodString>;
        tz: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const addWorkoutResponseSchema: z.ZodObject<{
    message: z.ZodString;
    workoutPlan: z.ZodObject<{
        id: z.ZodInt;
        numberOfSplits: z.ZodNumber;
        createdAt: z.ZodString;
        userId: z.ZodUUID;
        isActive: z.ZodBoolean;
        updatedAt: z.ZodString;
        workoutSplits: z.ZodNullable<z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            workoutId: z.ZodInt;
            name: z.ZodString;
            createdAt: z.ZodString;
            muscleGroup: z.ZodNullable<z.ZodString>;
            isActive: z.ZodBoolean;
            exerciseToWorkoutSplit: z.ZodArray<z.ZodObject<{
                id: z.ZodInt;
                sets: z.ZodArray<z.ZodInt>;
                isActive: z.ZodBoolean;
                targetMuscle: z.ZodString;
                specificTargetMuscle: z.ZodString;
                exercise: z.ZodString;
                workoutSplit: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
    workoutPlanForEditWorkout: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
        id: z.ZodInt;
        name: z.ZodString;
        sets: z.ZodArray<z.ZodInt>;
        orderIndex: z.ZodInt;
        targetMuscle: z.ZodString;
        specificTargetMuscle: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
declare const getWholeWorkoutPlanRequest: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getWholeUserWorkoutPlanResponseSchema: z.ZodObject<{
    workoutPlan: z.ZodNullable<z.ZodObject<{
        id: z.ZodInt;
        numberOfSplits: z.ZodNumber;
        createdAt: z.ZodString;
        userId: z.ZodUUID;
        isActive: z.ZodBoolean;
        updatedAt: z.ZodString;
        workoutSplits: z.ZodNullable<z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            workoutId: z.ZodInt;
            name: z.ZodString;
            createdAt: z.ZodString;
            muscleGroup: z.ZodNullable<z.ZodString>;
            isActive: z.ZodBoolean;
            exerciseToWorkoutSplit: z.ZodArray<z.ZodObject<{
                id: z.ZodInt;
                sets: z.ZodArray<z.ZodInt>;
                isActive: z.ZodBoolean;
                targetMuscle: z.ZodString;
                specificTargetMuscle: z.ZodString;
                exercise: z.ZodString;
                workoutSplit: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    workoutPlanForEditWorkout: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
        id: z.ZodInt;
        name: z.ZodString;
        sets: z.ZodArray<z.ZodInt>;
        orderIndex: z.ZodInt;
        targetMuscle: z.ZodString;
        specificTargetMuscle: z.ZodString;
    }, z.core.$strip>>>>;
}, z.core.$strip>;

type GetWholeUserWorkoutPlanQuery = z$1.infer<typeof getWholeWorkoutPlanRequest.shape.query>;
type GetWholeUserWorkoutPlanResponse = z$1.infer<typeof getWholeUserWorkoutPlanResponseSchema>;
type AddWorkoutBody = z$1.infer<typeof addWorkoutRequest.shape.body>;
type AddWorkoutResponse = z$1.infer<typeof addWorkoutResponseSchema>;

type ExerciseInPlan = z.infer<typeof exerciseInPlanSchema>;
type ExerciseMetadata = Pick<z.infer<typeof workoutSplitsMapItemSchema>, 'targetMuscle' | 'specificTargetMuscle'>;
type WholeUserWorkoutPlan = z.infer<typeof wholeUserWorkoutPlanSchema>;
type AddWorkoutSplitPayload = z.infer<typeof addWorkoutRequest.shape.body.shape.workoutData>;
type WorkoutSplitsMap = z.infer<typeof workoutSplitsMapSchema>;

declare const exerciseMetadataSchema: z.ZodObject<{
    targetMuscle: z.ZodString;
    specificTargetMuscle: z.ZodString;
}, z.core.$strip>;
declare const exerciseTrackingPrMaxSchema: z.ZodObject<{
    exercise: z.ZodString;
    weight: z.ZodNumber;
    reps: z.ZodInt;
    workoutTimeUtc: z.ZodString;
}, z.core.$strip>;
declare const exerciseTrackingAnalysisSchema: z.ZodObject<{
    uniqueDays: z.ZodNumber;
    mostFrequentSplit: z.ZodNullable<z.ZodString>;
    mostFrequentSplitDays: z.ZodNullable<z.ZodNumber>;
    lastWorkoutDate: z.ZodNullable<z.ZodString>;
    splitDaysByName: z.ZodRecord<z.ZodString, z.ZodNumber>;
    prs: z.ZodObject<{
        prMax: z.ZodNullable<z.ZodObject<{
            exercise: z.ZodString;
            weight: z.ZodNumber;
            reps: z.ZodInt;
            workoutTimeUtc: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const trackingMapItemSchema: z.ZodObject<{
    id: z.ZodInt;
    exerciseToSplitId: z.ZodInt;
    weight: z.ZodArray<z.ZodNumber>;
    reps: z.ZodArray<z.ZodInt>;
    notes: z.ZodNullable<z.ZodString>;
    exerciseId: z.ZodInt;
    workoutSplitId: z.ZodInt;
    splitName: z.ZodString;
    exercise: z.ZodString;
    workoutDate: z.ZodString;
    orderIndex: z.ZodInt;
    exerciseToWorkoutSplit: z.ZodObject<{
        sets: z.ZodArray<z.ZodInt>;
        exercises: z.ZodObject<{
            targetMuscle: z.ZodString;
            specificTargetMuscle: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const trackingByDateItemSchema: z.ZodObject<{
    id: z.ZodInt;
    exerciseToSplitId: z.ZodInt;
    orderIndex: z.ZodInt;
    reps: z.ZodArray<z.ZodInt>;
    workoutSplitId: z.ZodInt;
    exerciseId: z.ZodInt;
    exercise: z.ZodString;
    exerciseToWorkoutSplit: z.ZodObject<{
        sets: z.ZodArray<z.ZodInt>;
        exercises: z.ZodObject<{
            targetMuscle: z.ZodString;
            specificTargetMuscle: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    notes: z.ZodNullable<z.ZodString>;
    weight: z.ZodArray<z.ZodNumber>;
    splitName: z.ZodString;
}, z.core.$strip>;
declare const trackingBySplitNameItemSchema: z.ZodObject<{
    id: z.ZodInt;
    exerciseToSplitId: z.ZodInt;
    orderIndex: z.ZodInt;
    reps: z.ZodArray<z.ZodInt>;
    workoutSplitId: z.ZodInt;
    exerciseId: z.ZodInt;
    exercise: z.ZodString;
    exerciseToWorkoutSplit: z.ZodObject<{
        sets: z.ZodArray<z.ZodInt>;
        exercises: z.ZodObject<{
            targetMuscle: z.ZodString;
            specificTargetMuscle: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    notes: z.ZodNullable<z.ZodString>;
    weight: z.ZodArray<z.ZodNumber>;
    workoutDate: z.ZodString;
}, z.core.$strip>;
declare const exerciseTrackingAndStatsSchema: z.ZodObject<{
    exerciseTrackingAnalysis: z.ZodObject<{
        uniqueDays: z.ZodNumber;
        mostFrequentSplit: z.ZodNullable<z.ZodString>;
        mostFrequentSplitDays: z.ZodNullable<z.ZodNumber>;
        lastWorkoutDate: z.ZodNullable<z.ZodString>;
        splitDaysByName: z.ZodRecord<z.ZodString, z.ZodNumber>;
        prs: z.ZodObject<{
            prMax: z.ZodNullable<z.ZodObject<{
                exercise: z.ZodString;
                weight: z.ZodNumber;
                reps: z.ZodInt;
                workoutTimeUtc: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    exerciseTrackingMaps: z.ZodObject<{
        byDate: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            exerciseToSplitId: z.ZodInt;
            orderIndex: z.ZodInt;
            reps: z.ZodArray<z.ZodInt>;
            workoutSplitId: z.ZodInt;
            exerciseId: z.ZodInt;
            exercise: z.ZodString;
            exerciseToWorkoutSplit: z.ZodObject<{
                sets: z.ZodArray<z.ZodInt>;
                exercises: z.ZodObject<{
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
            notes: z.ZodNullable<z.ZodString>;
            weight: z.ZodArray<z.ZodNumber>;
            splitName: z.ZodString;
        }, z.core.$strip>>>;
        byExerciseToSplitId: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            exerciseToSplitId: z.ZodInt;
            weight: z.ZodArray<z.ZodNumber>;
            reps: z.ZodArray<z.ZodInt>;
            notes: z.ZodNullable<z.ZodString>;
            exerciseId: z.ZodInt;
            workoutSplitId: z.ZodInt;
            splitName: z.ZodString;
            exercise: z.ZodString;
            workoutDate: z.ZodString;
            orderIndex: z.ZodInt;
            exerciseToWorkoutSplit: z.ZodObject<{
                sets: z.ZodArray<z.ZodInt>;
                exercises: z.ZodObject<{
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        bySplitName: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            exerciseToSplitId: z.ZodInt;
            orderIndex: z.ZodInt;
            reps: z.ZodArray<z.ZodInt>;
            workoutSplitId: z.ZodInt;
            exerciseId: z.ZodInt;
            exercise: z.ZodString;
            exerciseToWorkoutSplit: z.ZodObject<{
                sets: z.ZodArray<z.ZodInt>;
                exercises: z.ZodObject<{
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
            notes: z.ZodNullable<z.ZodString>;
            weight: z.ZodArray<z.ZodNumber>;
            workoutDate: z.ZodString;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const finishWorkoutRequest: z.ZodObject<{
    body: z.ZodObject<{
        workout: z.ZodArray<z.ZodObject<{
            exerciseToSplitId: z.ZodInt;
            weight: z.ZodArray<z.ZodNumber>;
            reps: z.ZodArray<z.ZodInt>;
            notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>;
        tz: z.ZodOptional<z.ZodString>;
        workoutStartUtc: z.ZodString;
        workoutEndUtc: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const finishUserWorkoutResponseSchema: z.ZodObject<{
    exerciseTrackingAnalysis: z.ZodObject<{
        uniqueDays: z.ZodNumber;
        mostFrequentSplit: z.ZodNullable<z.ZodString>;
        mostFrequentSplitDays: z.ZodNullable<z.ZodNumber>;
        lastWorkoutDate: z.ZodNullable<z.ZodString>;
        splitDaysByName: z.ZodRecord<z.ZodString, z.ZodNumber>;
        prs: z.ZodObject<{
            prMax: z.ZodNullable<z.ZodObject<{
                exercise: z.ZodString;
                weight: z.ZodNumber;
                reps: z.ZodInt;
                workoutTimeUtc: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    exerciseTrackingMaps: z.ZodObject<{
        byDate: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            exerciseToSplitId: z.ZodInt;
            orderIndex: z.ZodInt;
            reps: z.ZodArray<z.ZodInt>;
            workoutSplitId: z.ZodInt;
            exerciseId: z.ZodInt;
            exercise: z.ZodString;
            exerciseToWorkoutSplit: z.ZodObject<{
                sets: z.ZodArray<z.ZodInt>;
                exercises: z.ZodObject<{
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
            notes: z.ZodNullable<z.ZodString>;
            weight: z.ZodArray<z.ZodNumber>;
            splitName: z.ZodString;
        }, z.core.$strip>>>;
        byExerciseToSplitId: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            exerciseToSplitId: z.ZodInt;
            weight: z.ZodArray<z.ZodNumber>;
            reps: z.ZodArray<z.ZodInt>;
            notes: z.ZodNullable<z.ZodString>;
            exerciseId: z.ZodInt;
            workoutSplitId: z.ZodInt;
            splitName: z.ZodString;
            exercise: z.ZodString;
            workoutDate: z.ZodString;
            orderIndex: z.ZodInt;
            exerciseToWorkoutSplit: z.ZodObject<{
                sets: z.ZodArray<z.ZodInt>;
                exercises: z.ZodObject<{
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        bySplitName: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            exerciseToSplitId: z.ZodInt;
            orderIndex: z.ZodInt;
            reps: z.ZodArray<z.ZodInt>;
            workoutSplitId: z.ZodInt;
            exerciseId: z.ZodInt;
            exercise: z.ZodString;
            exerciseToWorkoutSplit: z.ZodObject<{
                sets: z.ZodArray<z.ZodInt>;
                exercises: z.ZodObject<{
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
            notes: z.ZodNullable<z.ZodString>;
            weight: z.ZodArray<z.ZodNumber>;
            workoutDate: z.ZodString;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getExerciseTrackingRequest: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getExerciseTrackingResponseSchema: z.ZodObject<{
    exerciseTrackingAnalysis: z.ZodObject<{
        uniqueDays: z.ZodNumber;
        mostFrequentSplit: z.ZodNullable<z.ZodString>;
        mostFrequentSplitDays: z.ZodNullable<z.ZodNumber>;
        lastWorkoutDate: z.ZodNullable<z.ZodString>;
        splitDaysByName: z.ZodRecord<z.ZodString, z.ZodNumber>;
        prs: z.ZodObject<{
            prMax: z.ZodNullable<z.ZodObject<{
                exercise: z.ZodString;
                weight: z.ZodNumber;
                reps: z.ZodInt;
                workoutTimeUtc: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    exerciseTrackingMaps: z.ZodObject<{
        byDate: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            exerciseToSplitId: z.ZodInt;
            orderIndex: z.ZodInt;
            reps: z.ZodArray<z.ZodInt>;
            workoutSplitId: z.ZodInt;
            exerciseId: z.ZodInt;
            exercise: z.ZodString;
            exerciseToWorkoutSplit: z.ZodObject<{
                sets: z.ZodArray<z.ZodInt>;
                exercises: z.ZodObject<{
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
            notes: z.ZodNullable<z.ZodString>;
            weight: z.ZodArray<z.ZodNumber>;
            splitName: z.ZodString;
        }, z.core.$strip>>>;
        byExerciseToSplitId: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            exerciseToSplitId: z.ZodInt;
            weight: z.ZodArray<z.ZodNumber>;
            reps: z.ZodArray<z.ZodInt>;
            notes: z.ZodNullable<z.ZodString>;
            exerciseId: z.ZodInt;
            workoutSplitId: z.ZodInt;
            splitName: z.ZodString;
            exercise: z.ZodString;
            workoutDate: z.ZodString;
            orderIndex: z.ZodInt;
            exerciseToWorkoutSplit: z.ZodObject<{
                sets: z.ZodArray<z.ZodInt>;
                exercises: z.ZodObject<{
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        bySplitName: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            exerciseToSplitId: z.ZodInt;
            orderIndex: z.ZodInt;
            reps: z.ZodArray<z.ZodInt>;
            workoutSplitId: z.ZodInt;
            exerciseId: z.ZodInt;
            exercise: z.ZodString;
            exerciseToWorkoutSplit: z.ZodObject<{
                sets: z.ZodArray<z.ZodInt>;
                exercises: z.ZodObject<{
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
            notes: z.ZodNullable<z.ZodString>;
            weight: z.ZodArray<z.ZodNumber>;
            workoutDate: z.ZodString;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
}, z.core.$strip>;

type GetExerciseTrackingQuery = z$1.infer<typeof getExerciseTrackingRequest.shape.query>;
type GetExerciseTrackingResponse = z$1.infer<typeof getExerciseTrackingResponseSchema>;
type FinishUserWorkoutBody = z$1.infer<typeof finishWorkoutRequest.shape.body>;
type FinishUserWorkoutResponse = z$1.infer<typeof finishUserWorkoutResponseSchema>;

type ExerciseTrackingAnalysis = z.infer<typeof exerciseTrackingAnalysisSchema>;
type TrackingMapItem = z.infer<typeof trackingMapItemSchema>;
type ExerciseTrackingAndStats = z.infer<typeof exerciseTrackingAndStatsSchema>;
type FinishedWorkoutEntry = z.infer<typeof finishWorkoutRequest.shape.body.shape.workout.element>;

export { type AccessTokenPayload, type AddAerobicInput, type AddUserAerobicsBody, type AddWorkoutBody, type AddWorkoutResponse, type AddWorkoutSplitPayload, type AdherenceExerciseStats, type AerobicTrackingRow, type AerobicsDailyRecord, type AerobicsWeeklyRecord, type AllUserMessages, type AnalyzeVideoPayload, type AnalyzeVideoResultPayload, type AppleOAuthBody, type AppleTokenVerificationResult, type AuthenticatedUserForUpdate, type BodyOf, type BootstrapRequestQuery, type BootstrapResponse, type ChangeEmailAndVerifyBody, type ChangeEmailTokenPayload, type CheckUserVerifyQuery, type Contract, type CreateUserBody, type CreateUserResponse, type DeleteMessageParams, type DeleteMessageResponse, type DeleteUserProfilePicBody, type DeletedMessage, type EmailVerifyPayload, type EnqueueAanalyzeVideoParams, type ExerciseInPlan, type ExerciseMetadata, type ExerciseRow, type ExerciseToWorkoutSplitRow, type ExerciseTrackingAnalysis, type ExerciseTrackingAndStats, type ExerciseTrackingRow, type ExercisesMapByMuscle, type FinishUserWorkoutBody, type FinishUserWorkoutResponse, type FinishedWorkoutEntry, type ForgotPasswordPayload, type GenerateTicketBody, type GenerateTicketResponse, type GetAllExercisesExercise, type GetAllExercisesResponse, type GetAllUserMessagesQuery, type GetAllUserMessagesResponse, type GetAnalyticsResponse, type GetAuthenticatedUserByIdResponse, type GetExerciseTrackingQuery, type GetExerciseTrackingResponse, type GetPresignedUrlFromS3Body, type GetPresignedUrlFromS3Response, type GetUserAerobicsQuery, type GetWholeUserWorkoutPlanQuery, type GetWholeUserWorkoutPlanResponse, type GoalAdherenceResponse, type GoogleOAuthBody, type GoogleTokenVerificationResult, type LogOutResponse, type LoginRequestBody, type LoginResponse, type MarkMessageAsReadParams, type MarkMessageAsReadResponse, type MessageAfterSendResponse, type MessageAsRead, type MessageRow, type OAuthLoginResponse, type ParamsOf, type QueryGetExerciseMapByMuscleRow, type QueryOf, type RefreshTokenResponse, type RequestOf, type RequestSchema, type ResetPasswordBody, type ResetPasswordQuery, type ResetPasswordResponse, type ResponseOf, type SaveUserPushTokenBody, type SendChangePassEmailBody, type SendVerifcationMailBody, type SetProfilePicAndUpdateDBResponse, type SquatRepetition, type TokenVersionResult, type TrackingMapItem, type UpdateAuthenticatedUserResponse, type UpdateUserBody, type UserAerobicsResponse, type UserAfterBump, type UserByIndetifier, type UserDataResponse, type UserInsert, type UserRow, type VerifyUserAccountQuery, type WeeklyData, type WholeUserWorkoutPlan, type WorkoutPlanRow, type WorkoutRMRecord, type WorkoutRMsResponse, type WorkoutSplitRow, type WorkoutSplitsMap, type WorkoutSummaryRow, accessTokenPayloadSchema, addAerobicsRequest, addWorkoutRequest, addWorkoutResponseSchema, adherenceExerciseStatsSchema, aerobicTrackingDbSchema, aerobicsDailyRecordSchema, aerobicsWeeklyRecordSchema, allUserMessageSchema, analyzeVideoPayloadSchema, analyzeVideoResultPayloadSchema, appleOAuthRequest, appleTokenVerificationResultSchema, bootstrapRequest, bootstrapResponseSchema, changeEmailAndVerifyRequest, changeEmailTokenPayloadSchema, checkUserVerifyRequest, createUserRequest, createUserResponseSchema, createUserUserSchema, deleteMessageRequest, deleteMessageResponseSchema, deleteProfilePicRequest, deletedMessageSchema, emailVerifyPayloadSchema, enqueueAanalyzeVideoParamsSchema, exerciseDbSchema, exerciseInPlanSchema, exerciseMetadataSchema, exerciseToWorkoutSplitDbSchema, exerciseToWorkoutSplitExpandedViewDbSchema, exerciseTrackingAnalysisSchema, exerciseTrackingAndStatsSchema, exerciseTrackingDbSchema, exerciseTrackingExpandedViewDbSchema, exerciseTrackingPrMaxSchema, finishUserWorkoutResponseSchema, finishWorkoutRequest, forgotPasswordPayloadSchema, generateTicketRequest, generateTicketResponseSchema, getAerobicsRequest, getAllExercisesExerciseSchema, getAllExercisesResponseSchema, getAllMessagesRequest, getAllUserMessagesResponseSchema, getAnalyticsResponseSchema, getAuthenticatedUserByIdResponseSchema, getExerciseTrackingRequest, getExerciseTrackingResponseSchema, getPresignedUrlFromS3ResponseSchema, getPresignedUrlS3Request, getWholeUserWorkoutPlanResponseSchema, getWholeWorkoutPlanRequest, googleOAuthRequest, googleTokenVerificationResultSchema, loginRequest, loginResponseSchema, logoutResponseSchema, markMessageAsReadRequest, markMessageAsReadResponseSchema, messageAfterSendResponseSchema, messageAsReadSchema, messageDbSchema, oAuthLoginResponseSchema, oauthAccountDbSchema, proceedLoginResponseSchema, prsViewDbSchema, queryGetExerciseMapByMuscleRowSchema, refreshTokenResponseSchema, resetPasswordRequest, resetPasswordResponseSchema, saveUserPushTokenRequest, sendChangePassEmailRequest, sendVerificationMailRequest, serializedDateSchema, setProfilePicAndUpdateDBResponseSchema, squatRepetitionSchema, timezoneSchema, tokenVersionResultSchema, trackingByDateItemSchema, trackingBySplitNameItemSchema, trackingMapItemSchema, trackingSetDbSchema, updateAuthenticatedUserResponseSchema, updateUserRequest, userAerobicsResponseSchema, userAfterBumpSchema, userByIndetifierSchema, userDataResponseSchema, userDataSchema, userDbSchema, userInsertDbSchema, userReminderSettingDbSchema, userSplitInformationDbSchema, userUpdateDbSchema, verifyAccountRequest, weeklyDataSchema, wholeUserWorkoutPlanSchema, workoutPlanDbSchema, workoutRmRecordSchema, workoutSetDbSchema, workoutSplitDbSchema, workoutSplitSchema, workoutSplitsMapItemSchema, workoutSplitsMapSchema, workoutSummaryDbSchema };
