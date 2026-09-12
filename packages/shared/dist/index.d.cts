import * as zod_v4 from 'zod/v4';
import { z } from 'zod/v4';
import * as drizzle_zod from 'drizzle-zod';
import * as drizzle_orm_pg_core from 'drizzle-orm/pg-core';
import * as zod_v4_core from 'zod/v4/core';

type RequestSchema = z.ZodObject<{
    body?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
}>;
type Contract = {
    request: RequestSchema;
    response?: z.ZodTypeAny;
} | {
    request?: RequestSchema;
    response: z.ZodTypeAny;
};
type RequestOf<TContract extends Contract> = TContract extends {
    request: infer TRequest extends RequestSchema;
} ? z.infer<TRequest> : never;
type BodyOf<TContract extends Contract> = RequestOf<TContract> extends {
    body: infer TBody;
} ? TBody : never;
type QueryOf<TContract extends Contract> = RequestOf<TContract> extends {
    query: infer TQuery;
} ? TQuery : never;
type ParamsOf<TContract extends Contract> = RequestOf<TContract> extends {
    params: infer TParams;
} ? TParams : never;
type ResponseOf<TContract extends Contract> = TContract extends {
    response: infer TResponse extends z.ZodTypeAny;
} ? z.infer<TResponse> : never;

/** ISO or PostgreSQL-rendered timestamp transported as JSON text. */
declare const serializedDateSchema: z.ZodString;
/** Valid IANA timezone identifier accepted at API boundaries. */
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
        orderIndex: drizzle_orm_pg_core.PgColumn<{
            name: "order_index";
            tableName: "workout_split";
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
        updatedAt: drizzle_orm_pg_core.PgColumn<{
            name: "updated_at";
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
    orderIndex: drizzle_orm_pg_core.PgColumn<{
        name: "order_index";
        tableName: "workout_split";
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
    updatedAt: drizzle_orm_pg_core.PgColumn<{
        name: "updated_at";
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
declare const exerciseToWorkoutSplitSetExpandedViewDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "v_exercise_to_workout_split_set_expanded";
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
        tableName: "v_exercise_to_workout_split_set_expanded";
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
        tableName: "v_exercise_to_workout_split_set_expanded";
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
        tableName: "v_exercise_to_workout_split_set_expanded";
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
        tableName: "v_exercise_to_workout_split_set_expanded";
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
        tableName: "v_exercise_to_workout_split_set_expanded";
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
        tableName: "v_exercise_to_workout_split_set_expanded";
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
        tableName: "v_exercise_to_workout_split_set_expanded";
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
        tableName: "v_exercise_to_workout_split_set_expanded";
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
        tableName: "v_exercise_to_workout_split_set_expanded";
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
        tableName: "v_exercise_to_workout_split_set_expanded";
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
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "user_reminder_setting";
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
    reminderEnabled: drizzle_orm_pg_core.PgColumn<{
        name: "reminder_enabled";
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
    createdAt: drizzle_orm_pg_core.PgColumn<{
        name: "created_at";
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
    timeZone: drizzle_orm_pg_core.PgColumn<{
        name: "time_zone";
        tableName: "user_reminder_setting";
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
declare const workoutScheduleDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "workout_schedule";
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
        tableName: "workout_schedule";
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
        tableName: "workout_schedule";
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
    dayOfWeek: drizzle_orm_pg_core.PgColumn<{
        name: "day_of_week";
        tableName: "workout_schedule";
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
    startTime: drizzle_orm_pg_core.PgColumn<{
        name: "start_time";
        tableName: "workout_schedule";
        dataType: "string";
        columnType: "PgTime";
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
    createdAt: drizzle_orm_pg_core.PgColumn<{
        name: "created_at";
        tableName: "workout_schedule";
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
        tableName: "workout_schedule";
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
declare const exerciseTrackingSetExpandedViewDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "v_exercise_tracking_set_expanded";
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
        tableName: "v_exercise_tracking_set_expanded";
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
        tableName: "v_exercise_tracking_set_expanded";
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
        tableName: "v_exercise_tracking_set_expanded";
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
        tableName: "v_exercise_tracking_set_expanded";
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
        tableName: "v_exercise_tracking_set_expanded";
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
        tableName: "v_exercise_tracking_set_expanded";
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
        tableName: "v_exercise_tracking_set_expanded";
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
        tableName: "v_exercise_tracking_set_expanded";
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
        tableName: "v_exercise_tracking_set_expanded";
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
    targetMuscle: drizzle_orm_pg_core.PgColumn<{
        name: "target_muscle";
        tableName: "v_exercise_tracking_set_expanded";
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
    specificTargetMuscle: drizzle_orm_pg_core.PgColumn<{
        name: "specific_target_muscle";
        tableName: "v_exercise_tracking_set_expanded";
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
        tableName: "v_exercise_tracking_set_expanded";
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
        tableName: "v_exercise_tracking_set_expanded";
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
        tableName: "v_exercise_tracking_set_expanded";
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
        tableName: "v_exercise_tracking_set_expanded";
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
    isAssignedToSplit: drizzle_orm_pg_core.PgColumn<{
        name: "is_assigned_to_split";
        tableName: "v_exercise_tracking_set_expanded";
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
    setIndex: drizzle_orm_pg_core.PgColumn<{
        name: "set_index";
        tableName: "v_prs";
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
declare const crewDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "crew";
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
    leaderId: drizzle_orm_pg_core.PgColumn<{
        name: "leader_id";
        tableName: "crew";
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
    privacy: drizzle_orm_pg_core.PgColumn<{
        name: "privacy";
        tableName: "crew";
        dataType: "string";
        columnType: "PgEnumColumn";
        data: "public" | "private";
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: ["public", "private"];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: drizzle_orm_pg_core.PgColumn<{
        name: "created_at";
        tableName: "crew";
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
        tableName: "crew";
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
declare const crewMembershipDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "crew_membership";
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
    crewId: drizzle_orm_pg_core.PgColumn<{
        name: "crew_id";
        tableName: "crew_membership";
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
    userId: drizzle_orm_pg_core.PgColumn<{
        name: "user_id";
        tableName: "crew_membership";
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
    status: drizzle_orm_pg_core.PgColumn<{
        name: "status";
        tableName: "crew_membership";
        dataType: "string";
        columnType: "PgEnumColumn";
        data: "active" | "left" | "removed" | "banned";
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: ["active", "left", "removed", "banned"];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    role: drizzle_orm_pg_core.PgColumn<{
        name: "role";
        tableName: "crew_membership";
        dataType: "string";
        columnType: "PgEnumColumn";
        data: "leader" | "admin" | "member";
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: ["leader", "admin", "member"];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    joinedAt: drizzle_orm_pg_core.PgColumn<{
        name: "joined_at";
        tableName: "crew_membership";
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
        tableName: "crew_membership";
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
        tableName: "crew_membership";
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
declare const postDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "post";
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
    authorUserId: drizzle_orm_pg_core.PgColumn<{
        name: "author_user_id";
        tableName: "post";
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
    content: drizzle_orm_pg_core.PgColumn<{
        name: "content";
        tableName: "post";
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
    visibility: drizzle_orm_pg_core.PgColumn<{
        name: "visibility";
        tableName: "post";
        dataType: "string";
        columnType: "PgEnumColumn";
        data: "public" | "crews_only";
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: ["crews_only", "public"];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    publishedAt: drizzle_orm_pg_core.PgColumn<{
        name: "published_at";
        tableName: "post";
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
    updateddAt: drizzle_orm_pg_core.PgColumn<{
        name: "updated_at";
        tableName: "post";
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
declare const commentDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "comment";
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
    postId: drizzle_orm_pg_core.PgColumn<{
        name: "post_id";
        tableName: "comment";
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
    userId: drizzle_orm_pg_core.PgColumn<{
        name: "user_id";
        tableName: "comment";
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
    content: drizzle_orm_pg_core.PgColumn<{
        name: "content";
        tableName: "comment";
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
        tableName: "comment";
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
        tableName: "comment";
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
declare const reactionDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "reaction";
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
    postId: drizzle_orm_pg_core.PgColumn<{
        name: "post_id";
        tableName: "reaction";
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
    userId: drizzle_orm_pg_core.PgColumn<{
        name: "user_id";
        tableName: "reaction";
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
        tableName: "reaction";
        dataType: "string";
        columnType: "PgEnumColumn";
        data: "like" | "fire up" | "muscle";
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: ["like", "fire up", "muscle"];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    reactedAt: drizzle_orm_pg_core.PgColumn<{
        name: "reacted_at";
        tableName: "reaction";
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

declare const createAerobicEntryRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    body: z.ZodObject<{
        record: z.ZodObject<{
            durationMins: z.ZodNumber;
            durationSec: z.ZodInt;
            type: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const createAerobicEntryResponseSchema: z.ZodVoid;
declare const createAerobicEntryContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        body: z.ZodObject<{
            record: z.ZodObject<{
                durationMins: z.ZodNumber;
                durationSec: z.ZodInt;
                type: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
declare const getAerobicHistoryRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getAerobicHistoryResponseSchema: z.ZodObject<{
    daily: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
        id: z.ZodInt;
        type: z.ZodString;
        durationSec: z.ZodInt;
        durationMins: z.ZodInt;
    }, z.core.$strip>>>;
    weekly: z.ZodRecord<z.ZodString, z.ZodObject<{
        records: z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            type: z.ZodString;
            durationSec: z.ZodInt;
            durationMins: z.ZodInt;
            workoutTimeLocal: z.ZodString;
        }, z.core.$strip>>;
        totalDurationSec: z.ZodNumber;
        totalDurationMins: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const getAerobicHistoryContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        daily: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            type: z.ZodString;
            durationSec: z.ZodInt;
            durationMins: z.ZodInt;
        }, z.core.$strip>>>;
        weekly: z.ZodRecord<z.ZodString, z.ZodObject<{
            records: z.ZodArray<z.ZodObject<{
                id: z.ZodInt;
                type: z.ZodString;
                durationSec: z.ZodInt;
                durationMins: z.ZodInt;
                workoutTimeLocal: z.ZodString;
            }, z.core.$strip>>;
            totalDurationSec: z.ZodNumber;
            totalDurationMins: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
declare const updateAerobicEntryRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>;
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    body: z.ZodObject<{
        record: z.ZodObject<{
            durationMins: z.ZodNumber;
            durationSec: z.ZodInt;
            type: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const updateAerobicEntryContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodCoercedNumber<unknown>;
        }, z.core.$strip>;
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        body: z.ZodObject<{
            record: z.ZodObject<{
                durationMins: z.ZodNumber;
                durationSec: z.ZodInt;
                type: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
declare const deleteAerobicEntryRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>;
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const deleteAerobicEntryContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodCoercedNumber<unknown>;
        }, z.core.$strip>;
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
type CreateAerobicEntryBody = BodyOf<typeof createAerobicEntryContract>;
type CreateAerobicEntryQuery = QueryOf<typeof createAerobicEntryContract>;
type GetAerobicHistoryQuery = QueryOf<typeof getAerobicHistoryContract>;
type GetAerobicHistoryResponse = ResponseOf<typeof getAerobicHistoryContract>;
type UpdateAerobicEntryBody = BodyOf<typeof updateAerobicEntryContract>;
type UpdateAerobicEntryParams = ParamsOf<typeof updateAerobicEntryContract>;
type UpdateAerobicEntryQuery = QueryOf<typeof updateAerobicEntryContract>;
type UpdateAerobicEntryResponse = ResponseOf<typeof updateAerobicEntryContract>;
type DeleteAerobicEntryQuery = QueryOf<typeof deleteAerobicEntryContract>;
type DeleteAerobicEntryParams = ParamsOf<typeof deleteAerobicEntryContract>;
type DeleteAerobicEntryResponse = ResponseOf<typeof deleteAerobicEntryContract>;

/** Aerobic record accepted by the insert query. */
declare const addAerobicInputQueryDtoSchema: z.ZodObject<{
    durationMins: z.ZodNumber;
    durationSec: z.ZodInt;
    type: z.ZodString;
}, z.core.$strip>;
/** Daily aerobic record produced by the aerobics aggregation query. */
declare const aerobicsDailyRecordQueryDtoSchema: z.ZodObject<{
    id: z.ZodInt;
    type: z.ZodString;
    durationSec: z.ZodInt;
    durationMins: z.ZodInt;
}, z.core.$strip>;
/** Weekly aerobic record with its localized workout timestamp. */
declare const aerobicsWeeklyRecordQueryDtoSchema: z.ZodObject<{
    id: z.ZodInt;
    type: z.ZodString;
    durationSec: z.ZodInt;
    durationMins: z.ZodInt;
    workoutTimeLocal: z.ZodString;
}, z.core.$strip>;
/** Weekly aerobic aggregation containing records and duration totals. */
declare const weeklyDataQueryDtoSchema: z.ZodObject<{
    records: z.ZodArray<z.ZodObject<{
        id: z.ZodInt;
        type: z.ZodString;
        durationSec: z.ZodInt;
        durationMins: z.ZodInt;
        workoutTimeLocal: z.ZodString;
    }, z.core.$strip>>;
    totalDurationSec: z.ZodNumber;
    totalDurationMins: z.ZodNumber;
}, z.core.$strip>;
/** Complete aerobics aggregate returned by the history SQL query. */
declare const userAerobicsQueryDtoSchema: z.ZodObject<{
    daily: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
        id: z.ZodInt;
        type: z.ZodString;
        durationSec: z.ZodInt;
        durationMins: z.ZodInt;
    }, z.core.$strip>>>;
    weekly: z.ZodRecord<z.ZodString, z.ZodObject<{
        records: z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            type: z.ZodString;
            durationSec: z.ZodInt;
            durationMins: z.ZodInt;
            workoutTimeLocal: z.ZodString;
        }, z.core.$strip>>;
        totalDurationSec: z.ZodNumber;
        totalDurationMins: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** SQL row wrapping the aerobics aggregate under the selected `data` alias. */
declare const userAerobicsRowQueryDtoSchema: z.ZodObject<{
    data: z.ZodObject<{
        daily: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            type: z.ZodString;
            durationSec: z.ZodInt;
            durationMins: z.ZodInt;
        }, z.core.$strip>>>;
        weekly: z.ZodRecord<z.ZodString, z.ZodObject<{
            records: z.ZodArray<z.ZodObject<{
                id: z.ZodInt;
                type: z.ZodString;
                durationSec: z.ZodInt;
                durationMins: z.ZodInt;
                workoutTimeLocal: z.ZodString;
            }, z.core.$strip>>;
            totalDurationSec: z.ZodNumber;
            totalDurationMins: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Row returned after mutating an aerobic entry owned by a user. */
declare const aerobicMutationRowQueryDtoSchema: z.ZodObject<{
    id: z.ZodInt;
}, z.core.$strip>;
type AddAerobicInputQueryDto = z.infer<typeof addAerobicInputQueryDtoSchema>;
type AerobicsDailyRecordQueryDto = z.infer<typeof aerobicsDailyRecordQueryDtoSchema>;
type AerobicsWeeklyRecordQueryDto = z.infer<typeof aerobicsWeeklyRecordQueryDtoSchema>;
type WeeklyDataQueryDto = z.infer<typeof weeklyDataQueryDtoSchema>;
type UserAerobicsQueryDto = z.infer<typeof userAerobicsQueryDtoSchema>;
type UserAerobicsRowQueryDto = z.infer<typeof userAerobicsRowQueryDtoSchema>;
type AerobicMutationRowQueryDto = z.infer<typeof aerobicMutationRowQueryDtoSchema>;

declare const createPasswordResetRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        identifier: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const createPasswordResetRequestContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            identifier: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
declare const resetPasswordRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        newPassword: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodObject<{
        token: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const resetPasswordResponseSchema: z.ZodVoid;
declare const resetPasswordContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            newPassword: z.ZodString;
        }, z.core.$strip>;
        query: z.ZodObject<{
            token: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
type CreatePasswordResetRequestBody = BodyOf<typeof createPasswordResetRequestContract>;
type ResetPasswordBody = BodyOf<typeof resetPasswordContract>;
type ResetPasswordQuery = QueryOf<typeof resetPasswordContract>;
type ResetPasswordResponse = ResponseOf<typeof resetPasswordContract>;

/** Claims carried by a forgot-password token. */
declare const forgotPasswordPayloadDtoSchema: z.ZodObject<{
    sub: z.ZodUUID;
    jti: z.ZodString;
    exp: z.ZodNumber;
    iss: z.ZodString;
    typ: z.ZodString;
}, z.core.$strip>;
type ForgotPasswordPayloadDto = z.infer<typeof forgotPasswordPayloadDtoSchema>;

declare const loginRequestSchema: z.ZodObject<{
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
declare const loginContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            identifier: z.ZodString;
            password: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        message: z.ZodString;
        user: z.ZodUUID;
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
    }, z.core.$strip>;
};
declare const refreshTokenResponseSchema: z.ZodObject<{
    message: z.ZodString;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    userId: z.ZodUUID;
}, z.core.$strip>;
declare const refreshTokenContract: {
    response: z.ZodObject<{
        message: z.ZodString;
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
        userId: z.ZodUUID;
    }, z.core.$strip>;
};
declare const logoutResponseSchema: z.ZodObject<{
    message: z.ZodString;
}, z.core.$strip>;
declare const logoutContract: {
    response: z.ZodObject<{
        message: z.ZodString;
    }, z.core.$strip>;
};
type LoginRequestBody = BodyOf<typeof loginContract>;
type LoginResponse = ResponseOf<typeof loginContract>;
type RefreshTokenResponse = ResponseOf<typeof refreshTokenContract>;
type LogoutResponse = ResponseOf<typeof logoutContract>;

/** Claims carried by an issued access token. */
declare const accessTokenPayloadDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    role: z.ZodString;
    cnf: z.ZodOptional<z.ZodObject<{
        jkt: z.ZodString;
    }, z.core.$strip>>;
    iat: z.ZodOptional<z.ZodNumber>;
    exp: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/** Claims carried by an issued refresh token. */
declare const refreshTokenPayloadDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    role: z.ZodString;
    cnf: z.ZodOptional<z.ZodObject<{
        jkt: z.ZodString;
    }, z.core.$strip>>;
    iat: z.ZodOptional<z.ZodNumber>;
    exp: z.ZodOptional<z.ZodNumber>;
    tokenVer: z.ZodInt;
}, z.core.$strip>;
/** User data returned after atomically incrementing the token version. */
declare const userAfterBumpQueryDtoSchema: z.ZodObject<{
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
/** Current token-version row returned by authentication checks. */
declare const tokenVersionQueryDtoSchema: z.ZodObject<{
    tokenVersion: z.ZodInt;
}, z.core.$strip>;
/** Last-login row returned by the session lookup function. */
declare const lastLoginQueryDtoSchema: z.ZodObject<{
    lastLogin: z.ZodNullable<z.ZodDate>;
}, z.core.$strip>;
type AccessTokenPayloadDto = z.infer<typeof accessTokenPayloadDtoSchema>;
type RefreshTokenPayloadDto = z.infer<typeof refreshTokenPayloadDtoSchema>;
type UserAfterBumpQueryDto = z.infer<typeof userAfterBumpQueryDtoSchema>;
type TokenVersionQueryDto = z.infer<typeof tokenVersionQueryDtoSchema>;
type LastLoginQueryDto = z.infer<typeof lastLoginQueryDtoSchema>;

declare const verifyEmailRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        token: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const verifyEmailContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            token: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
declare const createVerificationEmailRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const createVerificationEmailContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
declare const updateUnverifiedAccountEmailRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodString;
        password: z.ZodString;
        newEmail: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const updateUnverifiedAccountEmailContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            username: z.ZodString;
            password: z.ZodString;
            newEmail: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
declare const getVerificationStatusRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        username: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getVerificationStatusContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            username: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
type VerifyEmailQuery = QueryOf<typeof verifyEmailContract>;
type CreateVerificationEmailBody = BodyOf<typeof createVerificationEmailContract>;
type UpdateUnverifiedAccountEmailBody = BodyOf<typeof updateUnverifiedAccountEmailContract>;
type GetVerificationStatusQuery = QueryOf<typeof getVerificationStatusContract>;

/** Claims carried by an email-verification token. */
declare const emailVerifyPayloadDtoSchema: z.ZodObject<{
    sub: z.ZodUUID;
    jti: z.ZodString;
    exp: z.ZodNumber;
    iss: z.ZodString;
    typ: z.ZodString;
}, z.core.$strip>;
type EmailVerifyPayloadDto = z.infer<typeof emailVerifyPayloadDtoSchema>;

/** Normalized user record returned by identifier-based authentication queries. */
declare const userByIdentifierQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    username: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    passwordHash: z.ZodNullable<z.ZodString>;
    role: z.ZodString;
    isVerified: z.ZodBoolean;
    lastLogin: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/** Raw database function payload before snake_case fields are normalized. */
declare const userByIdentifierRawQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    username: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodString;
    password_hash: z.ZodNullable<z.ZodString>;
    is_verified: z.ZodBoolean;
    last_login: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** SQL row wrapping an identifier lookup result under `userData`. */
declare const userByIdentifierRowQueryDtoSchema: z.ZodObject<{
    userData: z.ZodNullable<z.ZodObject<{
        id: z.ZodUUID;
        name: z.ZodString;
        username: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        role: z.ZodString;
        password_hash: z.ZodNullable<z.ZodString>;
        is_verified: z.ZodBoolean;
        last_login: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** Raw username lookup payload before `is_verified` is normalized. */
declare const userByUsernameRawQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    username: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodString;
    lastLogin: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    password_hash: z.ZodNullable<z.ZodString>;
    is_verified: z.ZodBoolean;
}, z.core.$strip>;
/** SQL row wrapping a username lookup result under `userData`. */
declare const userByUsernameRowQueryDtoSchema: z.ZodObject<{
    userData: z.ZodNullable<z.ZodObject<{
        id: z.ZodUUID;
        name: z.ZodString;
        username: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        role: z.ZodString;
        lastLogin: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        password_hash: z.ZodNullable<z.ZodString>;
        is_verified: z.ZodBoolean;
    }, z.core.$strip>>;
}, z.core.$strip>;
type UserByIdentifierQueryDto = z.infer<typeof userByIdentifierQueryDtoSchema>;
type UserByIdentifierRawQueryDto = z.infer<typeof userByIdentifierRawQueryDtoSchema>;
type UserByIdentifierRowQueryDto = z.infer<typeof userByIdentifierRowQueryDtoSchema>;
type UserByUsernameRawQueryDto = z.infer<typeof userByUsernameRawQueryDtoSchema>;
type UserByUsernameRowQueryDto = z.infer<typeof userByUsernameRowQueryDtoSchema>;

declare const listExercisesResponseSchema: zod_v4.ZodRecord<zod_v4.ZodString, zod_v4.ZodArray<zod_v4.ZodObject<{
    id: zod_v4.ZodInt;
    name: zod_v4.ZodString;
    specificTargetMuscle: zod_v4.ZodString;
}, zod_v4_core.$strip>>>;
declare const listExercisesContract: {
    response: zod_v4.ZodRecord<zod_v4.ZodString, zod_v4.ZodArray<zod_v4.ZodObject<{
        id: zod_v4.ZodInt;
        name: zod_v4.ZodString;
        specificTargetMuscle: zod_v4.ZodString;
    }, zod_v4_core.$strip>>>;
};
type ListExercisesResponse = ResponseOf<typeof listExercisesContract>;

/** Exercise row included in the muscle-grouped exercise query result. */
declare const getAllExercisesExerciseQueryDtoSchema: z.ZodObject<{
    id: z.ZodInt;
    name: z.ZodString;
    specificTargetMuscle: z.ZodString;
}, z.core.$strip>;
/** Exercise map grouped by target muscle. */
declare const exercisesMapByMuscleQueryDtoSchema: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
    id: z.ZodInt;
    name: z.ZodString;
    specificTargetMuscle: z.ZodString;
}, z.core.$strip>>>;
/** SQL row wrapping the exercise map under the `result` alias. */
declare const exerciseMapByMuscleRowQueryDtoSchema: z.ZodObject<{
    result: z.ZodNullable<z.ZodObject<{
        map: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodInt;
            name: z.ZodString;
            specificTargetMuscle: z.ZodString;
        }, z.core.$strip>>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type GetAllExercisesExerciseQueryDto = z.infer<typeof getAllExercisesExerciseQueryDtoSchema>;
type ExercisesMapByMuscleQueryDto = z.infer<typeof exercisesMapByMuscleQueryDtoSchema>;
type ExerciseMapByMuscleRowQueryDto = z.infer<typeof exerciseMapByMuscleRowQueryDtoSchema>;

declare const listMessagesRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const listMessagesResponseSchema: z.ZodObject<{
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
declare const listMessagesContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            tz: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
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
};
type ListMessagesQuery = QueryOf<typeof listMessagesContract>;
type ListMessagesResponse = ResponseOf<typeof listMessagesContract>;
declare const markMessageAsReadRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const markMessageAsReadResponseSchema: z.ZodVoid;
declare const markMessageAsReadContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodUUID;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
type MarkMessageAsReadParams = ParamsOf<typeof markMessageAsReadContract>;
type MarkMessageAsReadResponse = ResponseOf<typeof markMessageAsReadContract>;
declare const deleteMessageRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const deleteMessageResponseSchema: z.ZodVoid;
declare const deleteMessageContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodUUID;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
type DeleteMessageParams = ParamsOf<typeof deleteMessageContract>;
type DeleteMessageResponse = ResponseOf<typeof deleteMessageContract>;

/** SQL row returned when querying a user's inbox. */
declare const allUserMessageQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    subject: z.ZodString;
    msg: z.ZodString;
    sentAt: z.ZodString;
    isRead: z.ZodBoolean;
    senderFullName: z.ZodString;
    senderProfilePicPath: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** SQL row returned after marking a message as read. */
declare const messageAsReadQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    isRead: z.ZodBoolean;
}, z.core.$strip>;
/** SQL row returned after deleting a message. */
declare const deletedMessageQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.core.$strip>;
/** SQL row returned after inserting a message. */
declare const messageAfterSendQueryDtoSchema: z.ZodObject<{
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
type AllUserMessageQueryDto = z.infer<typeof allUserMessageQueryDtoSchema>;
type MessageAsReadQueryDto = z.infer<typeof messageAsReadQueryDtoSchema>;
type DeletedMessageQueryDto = z.infer<typeof deletedMessageQueryDtoSchema>;
type MessageAfterSendQueryDto = z.infer<typeof messageAfterSendQueryDtoSchema>;

declare const appleOAuthRequestSchema: z.ZodObject<{
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
declare const appleOAuthContract: {
    request: z.ZodObject<{
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
};
type AppleOAuthBody = BodyOf<typeof appleOAuthContract>;

/** Normalized verification result extracted from an Apple identity token. */
declare const appleTokenVerificationResultDtoSchema: z.ZodObject<{
    appleSub: z.ZodString;
    email: z.ZodNullable<z.ZodString>;
    emailVerified: z.ZodBoolean;
    fullName: z.ZodString;
}, z.core.$strip>;
type AppleTokenVerificationResultDto = z.infer<typeof appleTokenVerificationResultDtoSchema>;

declare const googleOAuthRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        idToken: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const googleOAuthContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            idToken: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
type GoogleOAuthBody = BodyOf<typeof googleOAuthContract>;

/** Normalized verification result extracted from a Google identity token. */
declare const googleTokenVerificationResultDtoSchema: z.ZodObject<{
    googleSub: z.ZodString;
    email: z.ZodNullable<z.ZodString>;
    emailVerified: z.ZodBoolean;
    fullName: z.ZodString;
}, z.core.$strip>;
type GoogleTokenVerificationResultDto = z.infer<typeof googleTokenVerificationResultDtoSchema>;

declare const oAuthLoginResponseSchema: z.ZodObject<{
    message: z.ZodString;
    user: z.ZodUUID;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
}, z.core.$strip>;
declare const proceedLoginResponseSchema: z.ZodObject<{
    message: z.ZodString;
    user: z.ZodUUID;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
}, z.core.$strip>;
declare const oAuthLoginContract: {
    response: z.ZodObject<{
        message: z.ZodString;
        user: z.ZodUUID;
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
    }, z.core.$strip>;
};
type OAuthLoginResponse = ResponseOf<typeof oAuthLoginContract>;

/** Normalized OAuth-account lookup result returned by query adapters. */
declare const oAuthLookupQueryDtoSchema: z.ZodObject<{
    userId: z.ZodNullable<z.ZodUUID>;
}, z.core.$strip>;
/** Raw OAuth lookup function payload using database column names. */
declare const oAuthLookupRawQueryDtoSchema: z.ZodObject<{
    user_id: z.ZodUUID;
}, z.core.$strip>;
/** SQL row wrapping the raw OAuth lookup payload under `oauth_data`. */
declare const oAuthLookupRowQueryDtoSchema: z.ZodObject<{
    oauth_data: z.ZodNullable<z.ZodObject<{
        user_id: z.ZodUUID;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** Normalized result of attempting to link an OAuth account by email. */
declare const oAuthLinkQueryDtoSchema: z.ZodObject<{
    userId: z.ZodNullable<z.ZodUUID>;
}, z.core.$strip>;
/** SQL row returned by the OAuth link-by-email function. */
declare const oAuthLinkRowQueryDtoSchema: z.ZodObject<{
    user_id: z.ZodNullable<z.ZodUUID>;
}, z.core.$strip>;
/** SQL row returned after creating a user through an OAuth provider. */
declare const oAuthCreatedUserRowQueryDtoSchema: z.ZodObject<{
    user_id: z.ZodUUID;
}, z.core.$strip>;
type OAuthLookupQueryDto = z.infer<typeof oAuthLookupQueryDtoSchema>;
type OAuthLookupRawQueryDto = z.infer<typeof oAuthLookupRawQueryDtoSchema>;
type OAuthLookupRowQueryDto = z.infer<typeof oAuthLookupRowQueryDtoSchema>;
type OAuthLinkQueryDto = z.infer<typeof oAuthLinkQueryDtoSchema>;
type OAuthLinkRowQueryDto = z.infer<typeof oAuthLinkRowQueryDtoSchema>;
type OAuthCreatedUserRowQueryDto = z.infer<typeof oAuthCreatedUserRowQueryDtoSchema>;

/** User row returned when selecting all users with push notifications enabled. */
declare const userWithNotificationsEnabledQueryDtoSchema: z.ZodObject<{
    pushToken: z.ZodNullable<z.ZodString>;
    name: z.ZodString;
}, z.core.$strip>;
type UserWithNotificationsEnabledQueryDto = z.infer<typeof userWithNotificationsEnabledQueryDtoSchema>;

declare const getReminderSettingsResponseSchema: z.ZodObject<{
    reminderSettings: z.ZodNullable<z.ZodObject<{
        id: z.ZodUUID;
        userId: z.ZodUUID;
        reminderEnabled: z.ZodBoolean;
        timeZone: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, {
        out: {};
        in: {};
    }>>;
}, z.core.$strip>;
declare const getReminderSettingsContract: {
    response: z.ZodObject<{
        reminderSettings: z.ZodNullable<z.ZodObject<{
            id: z.ZodUUID;
            userId: z.ZodUUID;
            reminderEnabled: z.ZodBoolean;
            timeZone: z.ZodString;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
        }, {
            out: {};
            in: {};
        }>>;
    }, z.core.$strip>;
};
declare const upsertReminderSettingsRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        reminderEnabled: z.ZodBoolean;
        timeZone: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const upsertReminderSettingsContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            reminderEnabled: z.ZodBoolean;
            timeZone: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
declare const updateReminderTimeZoneRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        timeZone: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const updateReminderTimeZoneContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            timeZone: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
type UpsertReminderSettingsBody = BodyOf<typeof upsertReminderSettingsContract>;
type UpsertReminderSettingsResponse = ResponseOf<typeof upsertReminderSettingsContract>;
type UpdateReminderTimeZoneBody = BodyOf<typeof updateReminderTimeZoneContract>;
type UpdateReminderTimeZoneResponse = ResponseOf<typeof updateReminderTimeZoneContract>;
type GetReminderSettingsResponse = ResponseOf<typeof getReminderSettingsContract>;

declare const createUserRequestSchema: z.ZodObject<{
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
declare const createUserResponseSchema: z.ZodVoid;
declare const createUserContract: {
    request: z.ZodObject<{
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
    response: z.ZodVoid;
};
type CreateUserBody = BodyOf<typeof createUserContract>;
type CreateUserResponse = ResponseOf<typeof createUserContract>;

/** Normalized user object returned after account creation. */
declare const createdUserQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    username: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    gender: z.ZodString;
    role: z.ZodString;
    createdAt: z.ZodString;
}, z.core.$strip>;
/** Raw account-creation function payload before `created_at` is normalized. */
declare const createdUserRawQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    username: z.ZodString;
    email: z.ZodString;
    gender: z.ZodString;
    role: z.ZodString;
    created_at: z.ZodString;
}, z.core.$strip>;
/** SQL row wrapping the raw created user under `userData`. */
declare const createdUserRowQueryDtoSchema: z.ZodObject<{
    userData: z.ZodObject<{
        id: z.ZodUUID;
        name: z.ZodString;
        username: z.ZodString;
        email: z.ZodString;
        gender: z.ZodString;
        role: z.ZodString;
        created_at: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** SQL row returned by the username/email existence function. */
declare const userExistsQueryDtoSchema: z.ZodObject<{
    id: z.ZodNullable<z.ZodUUID>;
}, z.core.$strip>;
type CreatedUserQueryDto = z.infer<typeof createdUserQueryDtoSchema>;
type CreatedUserRawQueryDto = z.infer<typeof createdUserRawQueryDtoSchema>;
type CreatedUserRowQueryDto = z.infer<typeof createdUserRowQueryDtoSchema>;
type UserExistsQueryDto = z.infer<typeof userExistsQueryDtoSchema>;

declare const replacePushTokenRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        token: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const replacePushTokenContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            token: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
type ReplacePushTokenBody = BodyOf<typeof replacePushTokenContract>;

declare const updateCurrentUserRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodOptional<z.ZodString>;
        fullName: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const updateCurrentUserResponseSchema: z.ZodVoid;
declare const updateCurrentUserContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            username: z.ZodOptional<z.ZodString>;
            fullName: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
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
declare const userDataContract: {
    response: z.ZodObject<{
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
};
declare const getCurrentUserResponseSchema: z.ZodObject<{
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
declare const getCurrentUserContract: {
    response: z.ZodObject<{
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
};
declare const deleteProfilePictureRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        profilePicPath: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const deleteProfilePictureContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            profilePicPath: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
declare const replaceProfilePictureResponseSchema: z.ZodObject<{
    profilePicPath: z.ZodString;
    url: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
declare const replaceProfilePictureContract: {
    response: z.ZodObject<{
        profilePicPath: z.ZodString;
        url: z.ZodString;
        message: z.ZodString;
    }, z.core.$strip>;
};
type UpdateCurrentUserBody = BodyOf<typeof updateCurrentUserContract>;
type UpdateCurrentUserResponse = ResponseOf<typeof updateCurrentUserContract>;
type UserDataResponse = ResponseOf<typeof userDataContract>;
type GetCurrentUserResponse = ResponseOf<typeof getCurrentUserContract>;
type DeleteProfilePictureBody = BodyOf<typeof deleteProfilePictureContract>;
type ReplaceProfilePictureResponse = ResponseOf<typeof replaceProfilePictureContract>;

/** Fields consumed by the authenticated-user update query. */
declare const authenticatedUserForUpdateQueryDtoSchema: z.ZodObject<{
    username: z.ZodOptional<z.ZodString>;
    fullName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/** User JSON object produced by authenticated-user SQL queries. */
declare const userDataQueryDtoSchema: z.ZodObject<{
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
/** SQL row wrapping authenticated-user JSON under `userData`. */
declare const userDataRowQueryDtoSchema: z.ZodObject<{
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
/** SQL row returned by the username/email conflict check. */
declare const userConflictQueryDtoSchema: z.ZodObject<{
    conflict: z.ZodBoolean;
}, z.core.$strip>;
/** Compact user row used when sending user-related messages. */
declare const userMessageIdentityQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    username: z.ZodString;
    name: z.ZodString;
    profilePicPath: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Profile-picture path returned by profile picture queries. */
declare const userProfilePicQueryDtoSchema: z.ZodObject<{
    profilePicPath: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Claims carried by an email-change token. */
declare const changeEmailTokenPayloadDtoSchema: z.ZodObject<{
    jti: z.ZodString;
    sub: z.ZodString;
    newEmail: z.ZodString;
    exp: z.ZodNumber;
    iss: z.ZodString;
    typ: z.ZodString;
}, z.core.$strip>;
type ChangeEmailTokenPayloadDto = z.infer<typeof changeEmailTokenPayloadDtoSchema>;
/** Input fields accepted by the authenticated-user update SQL query. */
type AuthenticatedUserForUpdateQueryDto = z.infer<typeof authenticatedUserForUpdateQueryDtoSchema>;
type UserDataQueryDto = z.infer<typeof userDataQueryDtoSchema>;
type UserDataRowQueryDto = z.infer<typeof userDataRowQueryDtoSchema>;
type UserConflictQueryDto = z.infer<typeof userConflictQueryDtoSchema>;
type UserMessageIdentityQueryDto = z.infer<typeof userMessageIdentityQueryDtoSchema>;
type UserProfilePicQueryDto = z.infer<typeof userProfilePicQueryDtoSchema>;

declare const createVideoUploadUrlRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        exercise: z.ZodString;
        fileType: z.ZodString;
        jobId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const createVideoUploadUrlResponseSchema: z.ZodObject<{
    uploadUrl: z.ZodString;
    fileKey: z.ZodString;
    requestId: z.ZodString;
}, z.core.$strip>;
declare const createVideoUploadUrlContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            exercise: z.ZodString;
            fileType: z.ZodString;
            jobId: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        uploadUrl: z.ZodString;
        fileKey: z.ZodString;
        requestId: z.ZodString;
    }, z.core.$strip>;
};
type CreateVideoUploadUrlBody = BodyOf<typeof createVideoUploadUrlContract>;
type CreateVideoUploadUrlResponse = ResponseOf<typeof createVideoUploadUrlContract>;

/** Parameters used to enqueue a video-analysis job. */
declare const enqueueAnalyzeVideoParamsDtoSchema: z.ZodObject<{
    fileKey: z.ZodString;
    exercise: z.ZodString;
    userId: z.ZodUUID;
    requestId: z.ZodString;
    sentryTrace: z.ZodOptional<z.ZodString>;
    baggage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/** Queue payload containing video-analysis parameters and expiration. */
declare const analyzeVideoPayloadDtoSchema: z.ZodObject<{
    fileKey: z.ZodString;
    exercise: z.ZodString;
    userId: z.ZodUUID;
    requestId: z.ZodString;
    sentryTrace: z.ZodOptional<z.ZodString>;
    baggage: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodNumber;
}, z.core.$strip>;
/** Analysis result for one detected squat repetition. */
declare const squatRepetitionDtoSchema: z.ZodObject<{
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
/** Completed-or-failed result payload emitted by a video-analysis worker. */
declare const analyzeVideoResultPayloadDtoSchema: <TResultSchema extends z.ZodType>(resultSchema: TResultSchema) => z.ZodIntersection<z.ZodObject<{
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
type EnqueueAnalyzeVideoParamsDto = z.infer<typeof enqueueAnalyzeVideoParamsDtoSchema>;
type AnalyzeVideoPayloadDto = z.infer<typeof analyzeVideoPayloadDtoSchema>;
type SquatRepetitionDto = z.infer<typeof squatRepetitionDtoSchema>;
type AnalyzeVideoResultPayloadDto<TResult> = z.infer<ReturnType<typeof analyzeVideoResultPayloadDtoSchema<z.ZodType<TResult>>>>;

declare const createWebSocketTicketRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const createWebSocketTicketResponseSchema: z.ZodObject<{
    ticket: z.ZodString;
}, z.core.$strip>;
declare const createWebSocketTicketContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            username: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        ticket: z.ZodString;
    }, z.core.$strip>;
};
type CreateWebSocketTicketBody = BodyOf<typeof createWebSocketTicketContract>;
type CreateWebSocketTicketResponse = ResponseOf<typeof createWebSocketTicketContract>;

declare const getWorkoutPlanRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getWorkoutPlanResponseSchema: z.ZodObject<{
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
            orderIndex: z.ZodInt;
            createdAt: z.ZodString;
            muscleGroup: z.ZodNullable<z.ZodString>;
            estimatedDurationMinutes: z.ZodNullable<z.ZodNumber>;
            isActive: z.ZodBoolean;
            exercises: z.ZodArray<z.ZodObject<{
                exerciseToSplitId: z.ZodInt;
                exerciseId: z.ZodInt;
                name: z.ZodString;
                sets: z.ZodArray<z.ZodObject<{
                    orderIndex: z.ZodInt;
                    reps: z.ZodInt;
                }, z.core.$strip>>;
                orderIndex: z.ZodInt;
                isActive: z.ZodBoolean;
                targetMuscle: z.ZodString;
                specificTargetMuscle: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const getWorkoutPlanContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
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
                orderIndex: z.ZodInt;
                createdAt: z.ZodString;
                muscleGroup: z.ZodNullable<z.ZodString>;
                estimatedDurationMinutes: z.ZodNullable<z.ZodNumber>;
                isActive: z.ZodBoolean;
                exercises: z.ZodArray<z.ZodObject<{
                    exerciseToSplitId: z.ZodInt;
                    exerciseId: z.ZodInt;
                    name: z.ZodString;
                    sets: z.ZodArray<z.ZodObject<{
                        orderIndex: z.ZodInt;
                        reps: z.ZodInt;
                    }, z.core.$strip>>;
                    orderIndex: z.ZodInt;
                    isActive: z.ZodBoolean;
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
declare const replaceWorkoutPlanRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        workoutData: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            orderIndex: z.ZodNumber;
            exercises: z.ZodArray<z.ZodObject<{
                exerciseId: z.ZodInt;
                sets: z.ZodArray<z.ZodInt>;
                orderIndex: z.ZodInt;
            }, z.core.$strip>>;
            id: z.ZodOptional<z.ZodInt>;
        }, z.core.$strip>>;
        workoutName: z.ZodOptional<z.ZodString>;
        tz: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const replaceWorkoutPlanResponseSchema: z.ZodVoid;
declare const replaceWorkoutPlanContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            workoutData: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                orderIndex: z.ZodNumber;
                exercises: z.ZodArray<z.ZodObject<{
                    exerciseId: z.ZodInt;
                    sets: z.ZodArray<z.ZodInt>;
                    orderIndex: z.ZodInt;
                }, z.core.$strip>>;
                id: z.ZodOptional<z.ZodInt>;
            }, z.core.$strip>>;
            workoutName: z.ZodOptional<z.ZodString>;
            tz: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
type GetWorkoutPlanQuery = QueryOf<typeof getWorkoutPlanContract>;
type GetWorkoutPlanResponse = ResponseOf<typeof getWorkoutPlanContract>;
type ReplaceWorkoutPlanBody = BodyOf<typeof replaceWorkoutPlanContract>;
type ReplaceWorkoutPlanResponse = ResponseOf<typeof replaceWorkoutPlanContract>;

/** Exercise input stored while adding a workout plan. */
declare const workoutExerciseInputQueryDtoSchema: z.ZodObject<{
    exerciseId: z.ZodInt;
    sets: z.ZodArray<z.ZodInt>;
    orderIndex: z.ZodInt;
}, z.core.$strip>;
/** Split input used while saving a plan. An omitted ID creates a new split. */
declare const saveWorkoutSplitInputQueryDtoSchema: z.ZodObject<{
    name: z.ZodString;
    orderIndex: z.ZodNumber;
    exercises: z.ZodArray<z.ZodObject<{
        exerciseId: z.ZodInt;
        sets: z.ZodArray<z.ZodInt>;
        orderIndex: z.ZodInt;
    }, z.core.$strip>>;
    id: z.ZodOptional<z.ZodInt>;
}, z.core.$strip>;
declare const saveWorkoutSplitPayloadQueryDtoSchema: z.ZodArray<z.ZodObject<{
    name: z.ZodString;
    orderIndex: z.ZodNumber;
    exercises: z.ZodArray<z.ZodObject<{
        exerciseId: z.ZodInt;
        sets: z.ZodArray<z.ZodInt>;
        orderIndex: z.ZodInt;
    }, z.core.$strip>>;
    id: z.ZodOptional<z.ZodInt>;
}, z.core.$strip>>;
/** Exercise assignment included in a complete workout-plan query. */
declare const exerciseInPlanQueryDtoSchema: z.ZodObject<{
    exerciseToSplitId: z.ZodInt;
    exerciseId: z.ZodInt;
    name: z.ZodString;
    sets: z.ZodArray<z.ZodObject<{
        orderIndex: z.ZodInt;
        reps: z.ZodInt;
    }, z.core.$strip>>;
    orderIndex: z.ZodInt;
    isActive: z.ZodBoolean;
    targetMuscle: z.ZodString;
    specificTargetMuscle: z.ZodString;
}, z.core.$strip>;
/** Workout split included in a complete workout-plan query. */
declare const workoutSplitQueryDtoSchema: z.ZodObject<{
    id: z.ZodInt;
    workoutId: z.ZodInt;
    name: z.ZodString;
    orderIndex: z.ZodInt;
    createdAt: z.ZodString;
    muscleGroup: z.ZodNullable<z.ZodString>;
    estimatedDurationMinutes: z.ZodNullable<z.ZodNumber>;
    isActive: z.ZodBoolean;
    exercises: z.ZodArray<z.ZodObject<{
        exerciseToSplitId: z.ZodInt;
        exerciseId: z.ZodInt;
        name: z.ZodString;
        sets: z.ZodArray<z.ZodObject<{
            orderIndex: z.ZodInt;
            reps: z.ZodInt;
        }, z.core.$strip>>;
        orderIndex: z.ZodInt;
        isActive: z.ZodBoolean;
        targetMuscle: z.ZodString;
        specificTargetMuscle: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** Complete active workout plan returned for a user. */
declare const wholeUserWorkoutPlanQueryDtoSchema: z.ZodObject<{
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
        orderIndex: z.ZodInt;
        createdAt: z.ZodString;
        muscleGroup: z.ZodNullable<z.ZodString>;
        estimatedDurationMinutes: z.ZodNullable<z.ZodNumber>;
        isActive: z.ZodBoolean;
        exercises: z.ZodArray<z.ZodObject<{
            exerciseToSplitId: z.ZodInt;
            exerciseId: z.ZodInt;
            name: z.ZodString;
            sets: z.ZodArray<z.ZodObject<{
                orderIndex: z.ZodInt;
                reps: z.ZodInt;
            }, z.core.$strip>>;
            orderIndex: z.ZodInt;
            isActive: z.ZodBoolean;
            targetMuscle: z.ZodString;
            specificTargetMuscle: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
/** SQL row returned when inserting or retrieving a workout plan. */
declare const workoutPlanIdQueryDtoSchema: z.ZodObject<{
    id: z.ZodInt;
}, z.core.$strip>;
/** SQL row returned when inserting or reactivating a workout split. */
declare const workoutSplitIdQueryDtoSchema: z.ZodObject<{
    id: z.ZodInt;
}, z.core.$strip>;
/** SQL row returned when inserting or reactivating an exercise assignment. */
declare const exerciseAssignmentIdQueryDtoSchema: z.ZodObject<{
    id: z.ZodInt;
}, z.core.$strip>;
type WorkoutExerciseInputQueryDto = z.infer<typeof workoutExerciseInputQueryDtoSchema>;
type SaveWorkoutSplitInputQueryDto = z.infer<typeof saveWorkoutSplitInputQueryDtoSchema>;
type ExerciseInPlanQueryDto = z.infer<typeof exerciseInPlanQueryDtoSchema>;
type WorkoutSplitQueryDto = z.infer<typeof workoutSplitQueryDtoSchema>;
type WholeUserWorkoutPlanQueryDto = z.infer<typeof wholeUserWorkoutPlanQueryDtoSchema>;
type SaveWorkoutSplitPayloadQueryDto = z.infer<typeof saveWorkoutSplitPayloadQueryDtoSchema>;
type WorkoutPlanIdQueryDto = z.infer<typeof workoutPlanIdQueryDtoSchema>;
type WorkoutSplitIdQueryDto = z.infer<typeof workoutSplitIdQueryDtoSchema>;
type ExerciseAssignmentIdQueryDto = z.infer<typeof exerciseAssignmentIdQueryDtoSchema>;

declare const getWorkoutHistoryRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getWorkoutHistoryResponseSchema: z.ZodObject<{
    byDate: z.ZodRecord<z.ZodString, z.ZodObject<{
        durationMins: z.ZodNumber;
        exerciseTracked: z.ZodArray<z.ZodObject<{
            exerciseTracking: z.ZodObject<{
                exerciseTrackingId: z.ZodInt;
                sets: z.ZodArray<z.ZodObject<{
                    setIndex: z.ZodInt;
                    weight: z.ZodNumber;
                    reps: z.ZodInt;
                }, z.core.$strip>>;
                notes: z.ZodNullable<z.ZodString>;
                exerciseAssignment: z.ZodObject<{
                    exerciseToSplitId: z.ZodNullable<z.ZodInt>;
                    orderIndex: z.ZodNullable<z.ZodInt>;
                    exerciseId: z.ZodInt;
                    workoutSplitId: z.ZodInt;
                    workoutSplitName: z.ZodString;
                    exerciseName: z.ZodString;
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const getWorkoutHistoryContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        byDate: z.ZodRecord<z.ZodString, z.ZodObject<{
            durationMins: z.ZodNumber;
            exerciseTracked: z.ZodArray<z.ZodObject<{
                exerciseTracking: z.ZodObject<{
                    exerciseTrackingId: z.ZodInt;
                    sets: z.ZodArray<z.ZodObject<{
                        setIndex: z.ZodInt;
                        weight: z.ZodNumber;
                        reps: z.ZodInt;
                    }, z.core.$strip>>;
                    notes: z.ZodNullable<z.ZodString>;
                    exerciseAssignment: z.ZodObject<{
                        exerciseToSplitId: z.ZodNullable<z.ZodInt>;
                        orderIndex: z.ZodNullable<z.ZodInt>;
                        exerciseId: z.ZodInt;
                        workoutSplitId: z.ZodInt;
                        workoutSplitName: z.ZodString;
                        exerciseName: z.ZodString;
                        targetMuscle: z.ZodString;
                        specificTargetMuscle: z.ZodString;
                    }, z.core.$strip>;
                }, z.core.$strip>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
declare const getExerciseHistoryRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getExerciseHistoryResponseSchema: z.ZodObject<{
    byExerciseToSplitId: z.ZodRecord<z.ZodString, z.ZodObject<{
        exerciseTracked: z.ZodArray<z.ZodObject<{
            exerciseTrackingId: z.ZodInt;
            sets: z.ZodArray<z.ZodObject<{
                setIndex: z.ZodInt;
                weight: z.ZodNumber;
                reps: z.ZodInt;
            }, z.core.$strip>>;
            exerciseAssignment: z.ZodObject<{
                exerciseToSplitId: z.ZodNullable<z.ZodInt>;
                orderIndex: z.ZodNullable<z.ZodInt>;
                exerciseId: z.ZodInt;
                workoutSplitId: z.ZodInt;
                workoutSplitName: z.ZodString;
                exerciseName: z.ZodString;
                targetMuscle: z.ZodString;
                specificTargetMuscle: z.ZodString;
            }, z.core.$strip>;
            workoutStartLocal: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const getExerciseHistoryContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        byExerciseToSplitId: z.ZodRecord<z.ZodString, z.ZodObject<{
            exerciseTracked: z.ZodArray<z.ZodObject<{
                exerciseTrackingId: z.ZodInt;
                sets: z.ZodArray<z.ZodObject<{
                    setIndex: z.ZodInt;
                    weight: z.ZodNumber;
                    reps: z.ZodInt;
                }, z.core.$strip>>;
                exerciseAssignment: z.ZodObject<{
                    exerciseToSplitId: z.ZodNullable<z.ZodInt>;
                    orderIndex: z.ZodNullable<z.ZodInt>;
                    exerciseId: z.ZodInt;
                    workoutSplitId: z.ZodInt;
                    workoutSplitName: z.ZodString;
                    exerciseName: z.ZodString;
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>;
                workoutStartLocal: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
declare const getWorkoutStatisticsResponseSchema: z.ZodObject<{
    workoutCount: z.ZodCoercedNumber<unknown>;
    hasExerciseTracking: z.ZodBoolean;
    nextSplitByOrderIndex: z.ZodNullable<z.ZodObject<{
        id: z.ZodInt;
        name: z.ZodString;
        orderIndex: z.ZodInt;
        muscleGroup: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    workoutTargets: z.ZodObject<{
        workoutCountThisWeek: z.ZodCoercedNumber<unknown>;
        workoutCountScheduledPerWeek: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>;
    lastWorkoutStats: z.ZodObject<{
        workoutDate: z.ZodNullable<z.ZodString>;
        workoutSplitName: z.ZodNullable<z.ZodString>;
        exerciseTrackedCount: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
        setTrackedCount: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
    }, z.core.$strip>;
    latestPr: z.ZodArray<z.ZodObject<{
        exerciseToSplitId: z.ZodNullable<z.ZodInt>;
        exerciseId: z.ZodInt;
        exerciseName: z.ZodString;
        prWeight: z.ZodNumber;
        prReps: z.ZodInt;
        prSetIndex: z.ZodInt;
        estimatedOneRepMax: z.ZodNullable<z.ZodNumber>;
        workoutStartLocal: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const getWorkoutStatisticsContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        workoutCount: z.ZodCoercedNumber<unknown>;
        hasExerciseTracking: z.ZodBoolean;
        nextSplitByOrderIndex: z.ZodNullable<z.ZodObject<{
            id: z.ZodInt;
            name: z.ZodString;
            orderIndex: z.ZodInt;
            muscleGroup: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
        workoutTargets: z.ZodObject<{
            workoutCountThisWeek: z.ZodCoercedNumber<unknown>;
            workoutCountScheduledPerWeek: z.ZodCoercedNumber<unknown>;
        }, z.core.$strip>;
        lastWorkoutStats: z.ZodObject<{
            workoutDate: z.ZodNullable<z.ZodString>;
            workoutSplitName: z.ZodNullable<z.ZodString>;
            exerciseTrackedCount: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
            setTrackedCount: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
        }, z.core.$strip>;
        latestPr: z.ZodArray<z.ZodObject<{
            exerciseToSplitId: z.ZodNullable<z.ZodInt>;
            exerciseId: z.ZodInt;
            exerciseName: z.ZodString;
            prWeight: z.ZodNumber;
            prReps: z.ZodInt;
            prSetIndex: z.ZodInt;
            estimatedOneRepMax: z.ZodNullable<z.ZodNumber>;
            workoutStartLocal: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
declare const createWorkoutSessionRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        workout: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            trackedSets: z.ZodArray<z.ZodObject<{
                reps: z.ZodInt;
                weight: z.ZodNumber;
                setIndex: z.ZodInt;
            }, z.core.$strip>>;
            notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            isExerciseAssignedToSplit: z.ZodLiteral<true>;
            exerciseToSplitId: z.ZodInt;
            exerciseId: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
        }, z.core.$strip>, z.ZodObject<{
            trackedSets: z.ZodArray<z.ZodObject<{
                reps: z.ZodInt;
                weight: z.ZodNumber;
                setIndex: z.ZodInt;
            }, z.core.$strip>>;
            notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            isExerciseAssignedToSplit: z.ZodLiteral<false>;
            exerciseToSplitId: z.ZodOptional<z.ZodNull>;
            exerciseId: z.ZodInt;
        }, z.core.$strip>]>>;
        tz: z.ZodOptional<z.ZodString>;
        workoutStartUtc: z.ZodString;
        workoutEndUtc: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const createWorkoutSessionResponseSchema: z.ZodVoid;
declare const createWorkoutSessionContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            workout: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                trackedSets: z.ZodArray<z.ZodObject<{
                    reps: z.ZodInt;
                    weight: z.ZodNumber;
                    setIndex: z.ZodInt;
                }, z.core.$strip>>;
                notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                isExerciseAssignedToSplit: z.ZodLiteral<true>;
                exerciseToSplitId: z.ZodInt;
                exerciseId: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
            }, z.core.$strip>, z.ZodObject<{
                trackedSets: z.ZodArray<z.ZodObject<{
                    reps: z.ZodInt;
                    weight: z.ZodNumber;
                    setIndex: z.ZodInt;
                }, z.core.$strip>>;
                notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                isExerciseAssignedToSplit: z.ZodLiteral<false>;
                exerciseToSplitId: z.ZodOptional<z.ZodNull>;
                exerciseId: z.ZodInt;
            }, z.core.$strip>]>>;
            tz: z.ZodOptional<z.ZodString>;
            workoutStartUtc: z.ZodString;
            workoutEndUtc: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
declare const getPersonalRecordsResponseSchema: z.ZodObject<{
    prs: z.ZodRecord<z.ZodString, z.ZodObject<{
        exerciseToSplitId: z.ZodNullable<z.ZodInt>;
        exerciseName: z.ZodString;
        workoutStartLocal: z.ZodString;
        prWeight: z.ZodNumber;
        prReps: z.ZodInt;
        prSetIndex: z.ZodInt;
        estimatedOneRepMax: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const getPersonalRecordsRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getPersonalRecordsContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            tz: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        prs: z.ZodRecord<z.ZodString, z.ZodObject<{
            exerciseToSplitId: z.ZodNullable<z.ZodInt>;
            exerciseName: z.ZodString;
            workoutStartLocal: z.ZodString;
            prWeight: z.ZodNumber;
            prReps: z.ZodInt;
            prSetIndex: z.ZodInt;
            estimatedOneRepMax: z.ZodNullable<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
type GetWorkoutHistoryQuery = QueryOf<typeof getWorkoutHistoryContract>;
type GetExerciseHistoryQuery = QueryOf<typeof getExerciseHistoryContract>;
type GetPersonalRecordsQuery = QueryOf<typeof getPersonalRecordsContract>;
type GetWorkoutHistoryResponse = ResponseOf<typeof getWorkoutHistoryContract>;
type GetExerciseHistoryResponse = ResponseOf<typeof getExerciseHistoryContract>;
type GetWorkoutStatisticsResponse = ResponseOf<typeof getWorkoutStatisticsContract>;
type GetPersonalRecordsResponse = ResponseOf<typeof getPersonalRecordsContract>;
type CreateWorkoutSessionBody = BodyOf<typeof createWorkoutSessionContract>;
type CreateWorkoutSessionResponse = ResponseOf<typeof createWorkoutSessionContract>;

declare const finishedWorkoutEntryQueryDtoSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    trackedSets: z.ZodArray<z.ZodObject<{
        reps: z.ZodInt;
        weight: z.ZodNumber;
        setIndex: z.ZodInt;
    }, z.core.$strip>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isExerciseAssignedToSplit: z.ZodLiteral<true>;
    exerciseToSplitId: z.ZodInt;
    exerciseId: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
}, z.core.$strip>, z.ZodObject<{
    trackedSets: z.ZodArray<z.ZodObject<{
        reps: z.ZodInt;
        weight: z.ZodNumber;
        setIndex: z.ZodInt;
    }, z.core.$strip>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isExerciseAssignedToSplit: z.ZodLiteral<false>;
    exerciseToSplitId: z.ZodOptional<z.ZodNull>;
    exerciseId: z.ZodInt;
}, z.core.$strip>]>;
/** Target-muscle metadata nested in a tracking-map item. */
declare const exerciseMetadataQueryDtoSchema: z.ZodObject<{
    targetMuscle: z.ZodString;
    specificTargetMuscle: z.ZodString;
}, z.core.$strip>;
/** Personal-record maximum returned by the tracking analysis query. */
declare const exerciseTrackingPrMaxQueryDtoSchema: z.ZodObject<{
    exercise: z.ZodString;
    weight: z.ZodNumber;
    reps: z.ZodInt;
    workoutTimeUtc: z.ZodString;
}, z.core.$strip>;
/** Aggregate workout-frequency and personal-record analysis. */
declare const exerciseTrackingAnalysisQueryDtoSchema: z.ZodObject<{
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
/** Detailed exercise-tracking item used by each tracking map. */
declare const trackingMapItemQueryDtoSchema: z.ZodObject<{
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
/** Tracking item used in maps already grouped by workout date. */
declare const trackingByDateItemQueryDtoSchema: z.ZodObject<{
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
/** Tracking item used in maps already grouped by workout split name. */
declare const trackingBySplitNameItemQueryDtoSchema: z.ZodObject<{
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
declare const personalRecordQueryDtoSchema: z.ZodObject<{
    exerciseToSplitId: z.ZodNullable<z.ZodInt>;
    exerciseId: z.ZodInt;
    exerciseName: z.ZodString;
    prWeight: z.ZodNumber;
    prReps: z.ZodInt;
    prSetIndex: z.ZodInt;
    estimatedOneRepMax: z.ZodNullable<z.ZodNumber>;
    workoutStartLocal: z.ZodString;
}, z.core.$strip>;
declare const personalRecordsQueryDtoSchema: z.ZodObject<{
    prs: z.ZodRecord<z.ZodString, z.ZodObject<{
        exerciseToSplitId: z.ZodNullable<z.ZodInt>;
        exerciseName: z.ZodString;
        workoutStartLocal: z.ZodString;
        prWeight: z.ZodNumber;
        prReps: z.ZodInt;
        prSetIndex: z.ZodInt;
        estimatedOneRepMax: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const exerciseTrackingStatsQueryDtoSchema: z.ZodObject<{
    workoutCount: z.ZodCoercedNumber<unknown>;
    hasExerciseTracking: z.ZodBoolean;
    nextSplitByOrderIndex: z.ZodNullable<z.ZodObject<{
        id: z.ZodInt;
        name: z.ZodString;
        orderIndex: z.ZodInt;
        muscleGroup: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    workoutTargets: z.ZodObject<{
        workoutCountThisWeek: z.ZodCoercedNumber<unknown>;
        workoutCountScheduledPerWeek: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>;
    lastWorkoutStats: z.ZodObject<{
        workoutDate: z.ZodNullable<z.ZodString>;
        workoutSplitName: z.ZodNullable<z.ZodString>;
        exerciseTrackedCount: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
        setTrackedCount: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
    }, z.core.$strip>;
    latestPr: z.ZodArray<z.ZodObject<{
        exerciseToSplitId: z.ZodNullable<z.ZodInt>;
        exerciseId: z.ZodInt;
        exerciseName: z.ZodString;
        prWeight: z.ZodNumber;
        prReps: z.ZodInt;
        prSetIndex: z.ZodInt;
        estimatedOneRepMax: z.ZodNullable<z.ZodNumber>;
        workoutStartLocal: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const exerciseTrackingMapsQueryDtoSchema: z.ZodObject<{
    byDate: z.ZodRecord<z.ZodString, z.ZodObject<{
        durationMins: z.ZodNumber;
        exerciseTracked: z.ZodArray<z.ZodObject<{
            exerciseTracking: z.ZodObject<{
                exerciseTrackingId: z.ZodInt;
                sets: z.ZodArray<z.ZodObject<{
                    setIndex: z.ZodInt;
                    weight: z.ZodNumber;
                    reps: z.ZodInt;
                }, z.core.$strip>>;
                notes: z.ZodNullable<z.ZodString>;
                exerciseAssignment: z.ZodObject<{
                    exerciseToSplitId: z.ZodNullable<z.ZodInt>;
                    orderIndex: z.ZodNullable<z.ZodInt>;
                    exerciseId: z.ZodInt;
                    workoutSplitId: z.ZodInt;
                    workoutSplitName: z.ZodString;
                    exerciseName: z.ZodString;
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const exerciseHistoryQueryDtoSchema: z.ZodObject<{
    byExerciseToSplitId: z.ZodRecord<z.ZodString, z.ZodObject<{
        exerciseTracked: z.ZodArray<z.ZodObject<{
            exerciseTrackingId: z.ZodInt;
            sets: z.ZodArray<z.ZodObject<{
                setIndex: z.ZodInt;
                weight: z.ZodNumber;
                reps: z.ZodInt;
            }, z.core.$strip>>;
            exerciseAssignment: z.ZodObject<{
                exerciseToSplitId: z.ZodNullable<z.ZodInt>;
                orderIndex: z.ZodNullable<z.ZodInt>;
                exerciseId: z.ZodInt;
                workoutSplitId: z.ZodInt;
                workoutSplitName: z.ZodString;
                exerciseName: z.ZodString;
                targetMuscle: z.ZodString;
                specificTargetMuscle: z.ZodString;
            }, z.core.$strip>;
            workoutStartLocal: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const exerciseTrackingAndStatsQueryDtoSchema: z.ZodObject<{
    trackingStats: z.ZodObject<{
        workoutCount: z.ZodCoercedNumber<unknown>;
        hasExerciseTracking: z.ZodBoolean;
        nextSplitByOrderIndex: z.ZodNullable<z.ZodObject<{
            id: z.ZodInt;
            name: z.ZodString;
            orderIndex: z.ZodInt;
            muscleGroup: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
        workoutTargets: z.ZodObject<{
            workoutCountThisWeek: z.ZodCoercedNumber<unknown>;
            workoutCountScheduledPerWeek: z.ZodCoercedNumber<unknown>;
        }, z.core.$strip>;
        lastWorkoutStats: z.ZodObject<{
            workoutDate: z.ZodNullable<z.ZodString>;
            workoutSplitName: z.ZodNullable<z.ZodString>;
            exerciseTrackedCount: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
            setTrackedCount: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
        }, z.core.$strip>;
        latestPr: z.ZodArray<z.ZodObject<{
            exerciseToSplitId: z.ZodNullable<z.ZodInt>;
            exerciseId: z.ZodInt;
            exerciseName: z.ZodString;
            prWeight: z.ZodNumber;
            prReps: z.ZodInt;
            prSetIndex: z.ZodInt;
            estimatedOneRepMax: z.ZodNullable<z.ZodNumber>;
            workoutStartLocal: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    trackingMaps: z.ZodObject<{
        byDate: z.ZodRecord<z.ZodString, z.ZodObject<{
            durationMins: z.ZodNumber;
            exerciseTracked: z.ZodArray<z.ZodObject<{
                exerciseTracking: z.ZodObject<{
                    exerciseTrackingId: z.ZodInt;
                    sets: z.ZodArray<z.ZodObject<{
                        setIndex: z.ZodInt;
                        weight: z.ZodNumber;
                        reps: z.ZodInt;
                    }, z.core.$strip>>;
                    notes: z.ZodNullable<z.ZodString>;
                    exerciseAssignment: z.ZodObject<{
                        exerciseToSplitId: z.ZodNullable<z.ZodInt>;
                        orderIndex: z.ZodNullable<z.ZodInt>;
                        exerciseId: z.ZodInt;
                        workoutSplitId: z.ZodInt;
                        workoutSplitName: z.ZodString;
                        exerciseName: z.ZodString;
                        targetMuscle: z.ZodString;
                        specificTargetMuscle: z.ZodString;
                    }, z.core.$strip>;
                }, z.core.$strip>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** SQL row wrapping the complete tracking aggregate under `data`. */
declare const exerciseTrackingAndStatsRowQueryDtoSchema: z.ZodObject<{
    data: z.ZodObject<{
        trackingStats: z.ZodObject<{
            workoutCount: z.ZodCoercedNumber<unknown>;
            hasExerciseTracking: z.ZodBoolean;
            nextSplitByOrderIndex: z.ZodNullable<z.ZodObject<{
                id: z.ZodInt;
                name: z.ZodString;
                orderIndex: z.ZodInt;
                muscleGroup: z.ZodNullable<z.ZodString>;
            }, z.core.$strip>>;
            workoutTargets: z.ZodObject<{
                workoutCountThisWeek: z.ZodCoercedNumber<unknown>;
                workoutCountScheduledPerWeek: z.ZodCoercedNumber<unknown>;
            }, z.core.$strip>;
            lastWorkoutStats: z.ZodObject<{
                workoutDate: z.ZodNullable<z.ZodString>;
                workoutSplitName: z.ZodNullable<z.ZodString>;
                exerciseTrackedCount: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
                setTrackedCount: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
            }, z.core.$strip>;
            latestPr: z.ZodArray<z.ZodObject<{
                exerciseToSplitId: z.ZodNullable<z.ZodInt>;
                exerciseId: z.ZodInt;
                exerciseName: z.ZodString;
                prWeight: z.ZodNumber;
                prReps: z.ZodInt;
                prSetIndex: z.ZodInt;
                estimatedOneRepMax: z.ZodNullable<z.ZodNumber>;
                workoutStartLocal: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>;
        trackingMaps: z.ZodObject<{
            byDate: z.ZodRecord<z.ZodString, z.ZodObject<{
                durationMins: z.ZodNumber;
                exerciseTracked: z.ZodArray<z.ZodObject<{
                    exerciseTracking: z.ZodObject<{
                        exerciseTrackingId: z.ZodInt;
                        sets: z.ZodArray<z.ZodObject<{
                            setIndex: z.ZodInt;
                            weight: z.ZodNumber;
                            reps: z.ZodInt;
                        }, z.core.$strip>>;
                        notes: z.ZodNullable<z.ZodString>;
                        exerciseAssignment: z.ZodObject<{
                            exerciseToSplitId: z.ZodNullable<z.ZodInt>;
                            orderIndex: z.ZodNullable<z.ZodInt>;
                            exerciseId: z.ZodInt;
                            workoutSplitId: z.ZodInt;
                            workoutSplitName: z.ZodString;
                            exerciseName: z.ZodString;
                            targetMuscle: z.ZodString;
                            specificTargetMuscle: z.ZodString;
                        }, z.core.$strip>;
                    }, z.core.$strip>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const exerciseTrackingStatsRowQueryDtoSchema: z.ZodObject<{
    data: z.ZodObject<{
        workoutCount: z.ZodCoercedNumber<unknown>;
        hasExerciseTracking: z.ZodBoolean;
        nextSplitByOrderIndex: z.ZodNullable<z.ZodObject<{
            id: z.ZodInt;
            name: z.ZodString;
            orderIndex: z.ZodInt;
            muscleGroup: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
        workoutTargets: z.ZodObject<{
            workoutCountThisWeek: z.ZodCoercedNumber<unknown>;
            workoutCountScheduledPerWeek: z.ZodCoercedNumber<unknown>;
        }, z.core.$strip>;
        lastWorkoutStats: z.ZodObject<{
            workoutDate: z.ZodNullable<z.ZodString>;
            workoutSplitName: z.ZodNullable<z.ZodString>;
            exerciseTrackedCount: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
            setTrackedCount: z.ZodNullable<z.ZodCoercedNumber<unknown>>;
        }, z.core.$strip>;
        latestPr: z.ZodArray<z.ZodObject<{
            exerciseToSplitId: z.ZodNullable<z.ZodInt>;
            exerciseId: z.ZodInt;
            exerciseName: z.ZodString;
            prWeight: z.ZodNumber;
            prReps: z.ZodInt;
            prSetIndex: z.ZodInt;
            estimatedOneRepMax: z.ZodNullable<z.ZodNumber>;
            workoutStartLocal: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const exerciseTrackingMapsRowQueryDtoSchema: z.ZodObject<{
    data: z.ZodObject<{
        byDate: z.ZodRecord<z.ZodString, z.ZodObject<{
            durationMins: z.ZodNumber;
            exerciseTracked: z.ZodArray<z.ZodObject<{
                exerciseTracking: z.ZodObject<{
                    exerciseTrackingId: z.ZodInt;
                    sets: z.ZodArray<z.ZodObject<{
                        setIndex: z.ZodInt;
                        weight: z.ZodNumber;
                        reps: z.ZodInt;
                    }, z.core.$strip>>;
                    notes: z.ZodNullable<z.ZodString>;
                    exerciseAssignment: z.ZodObject<{
                        exerciseToSplitId: z.ZodNullable<z.ZodInt>;
                        orderIndex: z.ZodNullable<z.ZodInt>;
                        exerciseId: z.ZodInt;
                        workoutSplitId: z.ZodInt;
                        workoutSplitName: z.ZodString;
                        exerciseName: z.ZodString;
                        targetMuscle: z.ZodString;
                        specificTargetMuscle: z.ZodString;
                    }, z.core.$strip>;
                }, z.core.$strip>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const exerciseHistoryRowQueryDtoSchema: z.ZodObject<{
    data: z.ZodObject<{
        byExerciseToSplitId: z.ZodRecord<z.ZodString, z.ZodObject<{
            exerciseTracked: z.ZodArray<z.ZodObject<{
                exerciseTrackingId: z.ZodInt;
                sets: z.ZodArray<z.ZodObject<{
                    setIndex: z.ZodInt;
                    weight: z.ZodNumber;
                    reps: z.ZodInt;
                }, z.core.$strip>>;
                exerciseAssignment: z.ZodObject<{
                    exerciseToSplitId: z.ZodNullable<z.ZodInt>;
                    orderIndex: z.ZodNullable<z.ZodInt>;
                    exerciseId: z.ZodInt;
                    workoutSplitId: z.ZodInt;
                    workoutSplitName: z.ZodString;
                    exerciseName: z.ZodString;
                    targetMuscle: z.ZodString;
                    specificTargetMuscle: z.ZodString;
                }, z.core.$strip>;
                workoutStartLocal: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const personalRecordsRowQueryDtoSchema: z.ZodObject<{
    data: z.ZodObject<{
        prs: z.ZodRecord<z.ZodString, z.ZodObject<{
            exerciseToSplitId: z.ZodNullable<z.ZodInt>;
            exerciseName: z.ZodString;
            workoutStartLocal: z.ZodString;
            prWeight: z.ZodNumber;
            prReps: z.ZodInt;
            prSetIndex: z.ZodInt;
            estimatedOneRepMax: z.ZodNullable<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** SQL row resolving the workout split for an exercise assignment. */
declare const workoutSplitLookupQueryDtoSchema: z.ZodObject<{
    workoutSplitId: z.ZodInt;
}, z.core.$strip>;
/** SQL row returned after inserting a workout summary. */
declare const workoutSummaryIdQueryDtoSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
/** SQL row returned after inserting an exercise-tracking record. */
declare const exerciseTrackingIdQueryDtoSchema: z.ZodObject<{
    id: z.ZodInt;
}, z.core.$strip>;
type ExerciseTrackingAnalysisQueryDto = z.infer<typeof exerciseTrackingAnalysisQueryDtoSchema>;
type ExerciseMetadataQueryDto = z.infer<typeof exerciseMetadataQueryDtoSchema>;
type ExerciseTrackingPrMaxQueryDto = z.infer<typeof exerciseTrackingPrMaxQueryDtoSchema>;
type TrackingMapItemQueryDto = z.infer<typeof trackingMapItemQueryDtoSchema>;
type TrackingByDateItemQueryDto = z.infer<typeof trackingByDateItemQueryDtoSchema>;
type TrackingBySplitNameItemQueryDto = z.infer<typeof trackingBySplitNameItemQueryDtoSchema>;
type ExerciseTrackingAndStatsQueryDto = z.infer<typeof exerciseTrackingAndStatsQueryDtoSchema>;
type ExerciseTrackingAndStatsRowQueryDto = z.infer<typeof exerciseTrackingAndStatsRowQueryDtoSchema>;
type ExerciseTrackingStatsQueryDto = z.infer<typeof exerciseTrackingStatsQueryDtoSchema>;
type ExerciseTrackingStatsRowQueryDto = z.infer<typeof exerciseTrackingStatsRowQueryDtoSchema>;
type ExerciseTrackingMapsQueryDto = z.infer<typeof exerciseTrackingMapsQueryDtoSchema>;
type ExerciseTrackingMapsRowQueryDto = z.infer<typeof exerciseTrackingMapsRowQueryDtoSchema>;
type ExerciseHistoryQueryDto = z.infer<typeof exerciseHistoryQueryDtoSchema>;
type ExerciseHistoryRowQueryDto = z.infer<typeof exerciseHistoryRowQueryDtoSchema>;
type PersonalRecordsQueryDto = z.infer<typeof personalRecordsQueryDtoSchema>;
type PersonalRecordsRowQueryDto = z.infer<typeof personalRecordsRowQueryDtoSchema>;
type WorkoutSplitLookupQueryDto = z.infer<typeof workoutSplitLookupQueryDtoSchema>;
type WorkoutSummaryIdQueryDto = z.infer<typeof workoutSummaryIdQueryDtoSchema>;
type ExerciseTrackingIdQueryDto = z.infer<typeof exerciseTrackingIdQueryDtoSchema>;
type FinishedWorkoutEntryQueryDto = z.infer<typeof finishedWorkoutEntryQueryDtoSchema>;

declare const getWorkoutSchedulesResponseSchema: z.ZodObject<{
    schedules: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        userId: z.ZodUUID;
        workoutSplitId: z.ZodInt;
        dayOfWeek: z.ZodInt;
        startTime: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, {
        out: {};
        in: {};
    }>>;
}, z.core.$strip>;
declare const getWorkoutSchedulesContract: {
    response: z.ZodObject<{
        schedules: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            userId: z.ZodUUID;
            workoutSplitId: z.ZodInt;
            dayOfWeek: z.ZodInt;
            startTime: z.ZodString;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
        }, {
            out: {};
            in: {};
        }>>;
    }, z.core.$strip>;
};
declare const replaceWorkoutSchedulesRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        schedules: z.ZodArray<z.ZodObject<{
            workoutSplitId: z.ZodInt;
            dayOfWeek: z.ZodInt;
            startTime: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const replaceWorkoutSchedulesContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            schedules: z.ZodArray<z.ZodObject<{
                workoutSplitId: z.ZodInt;
                dayOfWeek: z.ZodInt;
                startTime: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
type GetWorkoutSchedulesResponse = ResponseOf<typeof getWorkoutSchedulesContract>;
type ReplaceWorkoutSchedulesBody = BodyOf<typeof replaceWorkoutSchedulesContract>;
type ReplaceWorkoutSchedulesResponse = ResponseOf<typeof replaceWorkoutSchedulesContract>;

declare const workoutScheduleInputDtoSchema: z.ZodObject<{
    workoutSplitId: z.ZodInt;
    dayOfWeek: z.ZodInt;
    startTime: z.ZodString;
}, z.core.$strip>;
declare const workoutScheduleQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    userId: z.ZodUUID;
    workoutSplitId: z.ZodInt;
    dayOfWeek: z.ZodInt;
    startTime: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, {
    out: {};
    in: {};
}>;
type WorkoutScheduleInputDto = z.infer<typeof workoutScheduleInputDtoSchema>;
type WorkoutScheduleQueryDto = z.infer<typeof workoutScheduleQueryDtoSchema>;

/** Validates a request to list crews visible to the authenticated user. */
declare const listCrewsRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the collection returned by the list-crews endpoint. */
declare const listCrewsResponseSchema: z.ZodObject<{
    crews: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        leaderId: z.ZodUUID;
        privacy: z.ZodEnum<{
            public: "public";
            private: "private";
        }>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        top5Participants: z.ZodArray<z.ZodObject<{
            username: z.ZodString;
            fullName: z.ZodString;
            profilePicPath: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
    }, {
        out: {};
        in: {};
    }>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the request and response contract for listing visible crews. */
declare const listCrewsContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        crews: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            leaderId: z.ZodUUID;
            privacy: z.ZodEnum<{
                public: "public";
                private: "private";
            }>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            top5Participants: z.ZodArray<z.ZodObject<{
                username: z.ZodString;
                fullName: z.ZodString;
                profilePicPath: z.ZodNullable<z.ZodString>;
            }, z.core.$strip>>;
        }, {
            out: {};
            in: {};
        }>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Pagination query accepted by the list-crews endpoint. */
type ListCrewsQuery = QueryOf<typeof listCrewsContract>;
/** Response returned when listing crews visible to the caller. */
type ListCrewsResponse = ResponseOf<typeof listCrewsContract>;
/** Validates the crew identifier and pagination for listing participants. */
declare const listCrewParticipantsRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        crewId: z.ZodUUID;
    }, z.core.$strip>;
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the participant collection returned by the endpoint. */
declare const listCrewParticipantsResponseSchema: z.ZodObject<{
    participants: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        crewId: z.ZodUUID;
        userId: z.ZodUUID;
        status: z.ZodEnum<{
            active: "active";
            left: "left";
            removed: "removed";
            banned: "banned";
        }>;
        role: z.ZodEnum<{
            leader: "leader";
            admin: "admin";
            member: "member";
        }>;
        joinedAt: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, {
        out: {};
        in: {};
    }>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the request and response contract for listing crew participants. */
declare const listCrewParticipantsContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            crewId: z.ZodUUID;
        }, z.core.$strip>;
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        participants: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            crewId: z.ZodUUID;
            userId: z.ZodUUID;
            status: z.ZodEnum<{
                active: "active";
                left: "left";
                removed: "removed";
                banned: "banned";
            }>;
            role: z.ZodEnum<{
                leader: "leader";
                admin: "admin";
                member: "member";
            }>;
            joinedAt: z.ZodString;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
        }, {
            out: {};
            in: {};
        }>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Route parameters accepted by the list-crew-participants endpoint. */
type ListCrewParticipantsParams = ParamsOf<typeof listCrewParticipantsContract>;
/** Pagination query accepted by the list-crew-participants endpoint. */
type ListCrewParticipantsQuery = QueryOf<typeof listCrewParticipantsContract>;
/** Response returned after listing authorized crew participants. */
type ListCrewParticipantsResponse = ResponseOf<typeof listCrewParticipantsContract>;
/** Validates the route parameters used to retrieve one crew. */
declare const getCrewRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the crew returned by the get-crew endpoint. */
declare const getCrewResponseSchema: z.ZodObject<{
    id: z.ZodUUID;
    leaderId: z.ZodUUID;
    privacy: z.ZodEnum<{
        public: "public";
        private: "private";
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, {
    out: {};
    in: {};
}>;
/** Defines the request and response contract for retrieving one crew. */
declare const getCrewContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodUUID;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        id: z.ZodUUID;
        leaderId: z.ZodUUID;
        privacy: z.ZodEnum<{
            public: "public";
            private: "private";
        }>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, {
        out: {};
        in: {};
    }>;
};
/** Route parameters accepted by the get-crew endpoint. */
type GetCrewParams = ParamsOf<typeof getCrewContract>;
/** Response returned after retrieving one crew. */
type GetCrewResponse = ResponseOf<typeof getCrewContract>;
/** Validates the body used to create a crew. */
declare const createCrewRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        privacy: z.ZodEnum<{
            public: "public";
            private: "private";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after crew creation. */
declare const createCrewResponseSchema: z.ZodVoid;
/** Defines the request and response contract for creating a crew. */
declare const createCrewContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            privacy: z.ZodEnum<{
                public: "public";
                private: "private";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Request body accepted by the create-crew endpoint. */
type CreateCrewBody = BodyOf<typeof createCrewContract>;
/** Empty response returned after creating a crew. */
type CreateCrewResponse = ResponseOf<typeof createCrewContract>;
/** Validates the route parameters and body used to update a crew. */
declare const updateCrewRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
    body: z.ZodObject<{
        privacy: z.ZodEnum<{
            public: "public";
            private: "private";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after updating a crew. */
declare const updateCrewResponseSchema: z.ZodVoid;
/** Defines the request and response contract for updating a crew. */
declare const updateCrewContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodUUID;
        }, z.core.$strip>;
        body: z.ZodObject<{
            privacy: z.ZodEnum<{
                public: "public";
                private: "private";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the update-crew endpoint. */
type UpdateCrewParams = ParamsOf<typeof updateCrewContract>;
/** Request body accepted by the update-crew endpoint. */
type UpdateCrewBody = BodyOf<typeof updateCrewContract>;
/** Empty response returned after updating a crew. */
type UpdateCrewResponse = ResponseOf<typeof updateCrewContract>;
/** Validates the crew identifier used by the authenticated user leaving a crew. */
declare const leaveCrewRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after leaving a crew. */
declare const leaveCrewResponseSchema: z.ZodVoid;
/** Defines the request and response contract for leaving a crew. */
declare const leaveCrewContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodUUID;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the leave-crew endpoint. */
type LeaveCrewParams = ParamsOf<typeof leaveCrewContract>;
/** Empty response returned after leaving a crew. */
type LeaveCrewResponse = ResponseOf<typeof leaveCrewContract>;
/** Validates the route parameters used to delete a crew. */
declare const deleteCrewRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after deleting a crew. */
declare const deleteCrewResponseSchema: z.ZodVoid;
/** Defines the request and response contract for deleting a crew. */
declare const deleteCrewContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodUUID;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the delete-crew endpoint. */
type DeleteCrewParams = ParamsOf<typeof deleteCrewContract>;
/** Response returned after deleting a crew. */
type DeleteCrewResponse = ResponseOf<typeof deleteCrewContract>;

/** Runtime schema for a crew row returned by the social crew queries. */
declare const crewQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    leaderId: z.ZodUUID;
    privacy: z.ZodEnum<{
        public: "public";
        private: "private";
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, {
    out: {};
    in: {};
}>;
/** Runtime schema for the limited participant preview shown during crew discovery. */
declare const crewParticipantPreviewQueryDtoSchema: z.ZodObject<{
    username: z.ZodString;
    fullName: z.ZodString;
    profilePicPath: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Runtime schema for a discoverable crew and its five-participant preview. */
declare const discoverableCrewQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    leaderId: z.ZodUUID;
    privacy: z.ZodEnum<{
        public: "public";
        private: "private";
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    top5Participants: z.ZodArray<z.ZodObject<{
        username: z.ZodString;
        fullName: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, {
    out: {};
    in: {};
}>;
/** Runtime schema for an active crew participant and their public profile data. */
declare const crewParticipantQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    crewId: z.ZodUUID;
    userId: z.ZodUUID;
    status: z.ZodEnum<{
        active: "active";
        left: "left";
        removed: "removed";
        banned: "banned";
    }>;
    role: z.ZodEnum<{
        leader: "leader";
        admin: "admin";
        member: "member";
    }>;
    joinedAt: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, {
    out: {};
    in: {};
}>;
/** Runtime schema for a crew deletion result. */
declare const deletedCrewQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.core.$strip>;
/** Runtime schema for the outcome returned by the leave-crew query. */
declare const leaveCrewResultQueryDtoSchema: z.ZodObject<{
    result: z.ZodEnum<{
        left: "left";
        not_member: "not_member";
    }>;
}, z.core.$strip>;
/** Runtime schema for the locked active membership being left. */
declare const leaveCrewContextQueryDtoSchema: z.ZodObject<{
    membershipId: z.ZodUUID;
}, z.core.$strip>;
/** Runtime schema for the participant selected to succeed a leaving leader. */
declare const crewSuccessorQueryDtoSchema: z.ZodObject<{
    membershipId: z.ZodUUID;
    userId: z.ZodUUID;
}, z.core.$strip>;
/** Typed crew row returned by crew SELECT, INSERT, and UPDATE queries. */
type CrewQueryDto = typeof crewQueryDtoSchema._output;
/** Public participant information included in a crew discovery result. */
type CrewParticipantPreviewQueryDto = typeof crewParticipantPreviewQueryDtoSchema._output;
/** Typed crew discovery row returned by the security-definer function. */
type DiscoverableCrewQueryDto = typeof discoverableCrewQueryDtoSchema._output;
/** Typed active participant returned by the crew-participants query. */
type CrewParticipantQueryDto = typeof crewParticipantQueryDtoSchema._output;
/** Typed result used to verify that a crew was deleted. */
type DeletedCrewQueryDto = typeof deletedCrewQueryDtoSchema._output;
/** Typed outcome returned after attempting to leave a crew. */
type LeaveCrewResultQueryDto = typeof leaveCrewResultQueryDtoSchema._output;
/** Typed locked membership used by the leave workflow. */
type LeaveCrewContextQueryDto = typeof leaveCrewContextQueryDtoSchema._output;
/** Typed active participant selected as the next crew leader. */
type CrewSuccessorQueryDto = typeof crewSuccessorQueryDtoSchema._output;

/** Validates a request to list posts visible to the authenticated user. */
declare const listVisiblePostsRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the collection returned by the list-posts endpoint. */
declare const listVisiblePostsResponseSchema: z.ZodObject<{
    posts: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        authorUserId: z.ZodUUID;
        content: z.ZodString;
        visibility: z.ZodEnum<{
            public: "public";
            crews_only: "crews_only";
        }>;
        publishedAt: z.ZodString;
        updatedAt: z.ZodString;
    }, {
        out: {};
        in: {};
    }>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the request and response contract for listing visible posts. */
declare const listVisiblePostsContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        posts: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            authorUserId: z.ZodUUID;
            content: z.ZodString;
            visibility: z.ZodEnum<{
                public: "public";
                crews_only: "crews_only";
            }>;
            publishedAt: z.ZodString;
            updatedAt: z.ZodString;
        }, {
            out: {};
            in: {};
        }>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Pagination query accepted by the list-visible-posts endpoint. */
type ListVisiblePostsQuery = QueryOf<typeof listVisiblePostsContract>;
/** Response containing each visible post once, regardless of its crew placements. */
type ListVisiblePostsResponse = ResponseOf<typeof listVisiblePostsContract>;
/** Validates the crew identifier and pagination used to list a crew's posts. */
declare const listCrewPostsRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        crewId: z.ZodUUID;
    }, z.core.$strip>;
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the collection returned by the list-crew-posts endpoint. */
declare const listCrewPostsResponseSchema: z.ZodObject<{
    posts: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        authorUserId: z.ZodUUID;
        content: z.ZodString;
        visibility: z.ZodEnum<{
            public: "public";
            crews_only: "crews_only";
        }>;
        publishedAt: z.ZodString;
        updatedAt: z.ZodString;
    }, {
        out: {};
        in: {};
    }>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the request and response contract for listing posts from one crew. */
declare const listCrewPostsContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            crewId: z.ZodUUID;
        }, z.core.$strip>;
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        posts: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            authorUserId: z.ZodUUID;
            content: z.ZodString;
            visibility: z.ZodEnum<{
                public: "public";
                crews_only: "crews_only";
            }>;
            publishedAt: z.ZodString;
            updatedAt: z.ZodString;
        }, {
            out: {};
            in: {};
        }>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Route parameters accepted by the list-crew-posts endpoint. */
type ListCrewPostsParams = ParamsOf<typeof listCrewPostsContract>;
/** Pagination query accepted by the list-crew-posts endpoint. */
type ListCrewPostsQuery = QueryOf<typeof listCrewPostsContract>;
/** Response containing posts from the requested accessible crew. */
type ListCrewPostsResponse = ResponseOf<typeof listCrewPostsContract>;
/** Validates a public or crew-only post and all requested crew placements. */
declare const createPostRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        content: z.ZodString;
        visibility: z.ZodEnum<{
            public: "public";
            crews_only: "crews_only";
        }>;
        crewIds: z.ZodDefault<z.ZodArray<z.ZodUUID>>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after post creation. */
declare const createPostResponseSchema: z.ZodVoid;
/** Defines the request and response contract for creating a post. */
declare const createPostContract: {
    request: z.ZodObject<{
        body: z.ZodObject<{
            content: z.ZodString;
            visibility: z.ZodEnum<{
                public: "public";
                crews_only: "crews_only";
            }>;
            crewIds: z.ZodDefault<z.ZodArray<z.ZodUUID>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Request body accepted by the create-post endpoint. */
type CreatePostBody = BodyOf<typeof createPostContract>;
/** Empty response returned after creating a post. */
type CreatePostResponse = ResponseOf<typeof createPostContract>;
/** Validates the route parameters and body used to update a post. */
declare const updatePostRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
    body: z.ZodObject<{
        content: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after updating a post. */
declare const updatePostResponseSchema: z.ZodVoid;
/** Defines the request and response contract for updating a post. */
declare const updatePostContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodUUID;
        }, z.core.$strip>;
        body: z.ZodObject<{
            content: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the update-post endpoint. */
type UpdatePostParams = ParamsOf<typeof updatePostContract>;
/** Request body accepted by the update-post endpoint. */
type UpdatePostBody = BodyOf<typeof updatePostContract>;
/** Empty response returned after updating a post. */
type UpdatePostResponse = ResponseOf<typeof updatePostContract>;
/** Validates the route parameters used to delete a post. */
declare const deletePostRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after deleting a post. */
declare const deletePostResponseSchema: z.ZodVoid;
/** Defines the request and response contract for deleting a post. */
declare const deletePostContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodUUID;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the delete-post endpoint. */
type DeletePostParams = ParamsOf<typeof deletePostContract>;
/** Response returned after deleting a post. */
type DeletePostResponse = ResponseOf<typeof deletePostContract>;

/** Runtime schema for a post row and its audience visibility. */
declare const postQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    authorUserId: z.ZodUUID;
    content: z.ZodString;
    visibility: z.ZodEnum<{
        public: "public";
        crews_only: "crews_only";
    }>;
    publishedAt: z.ZodString;
    updatedAt: z.ZodString;
}, {
    out: {};
    in: {};
}>;
/** Runtime schema for a post deletion result. */
declare const deletedPostQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.core.$strip>;
/** Typed post row returned by the social post endpoints. */
type PostQueryDto = z.infer<typeof postQueryDtoSchema>;
/** Typed result used to verify that a post was deleted. */
type DeletedPostQueryDto = z.infer<typeof deletedPostQueryDtoSchema>;

/** Validates cursor pagination for comments on a visible post. */
declare const listPostCommentsRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        postId: z.ZodUUID;
    }, z.core.$strip>;
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates a page of comments and its continuation cursor. */
declare const listPostCommentsResponseSchema: z.ZodObject<{
    comments: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        postId: z.ZodUUID;
        userId: z.ZodUUID;
        content: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, {
        out: {};
        in: {};
    }>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the contract for listing comments on a post. */
declare const listPostCommentsContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            postId: z.ZodUUID;
        }, z.core.$strip>;
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        comments: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            postId: z.ZodUUID;
            userId: z.ZodUUID;
            content: z.ZodString;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
        }, {
            out: {};
            in: {};
        }>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Route parameters accepted by the list-post-comments endpoint. */
type ListPostCommentsParams = ParamsOf<typeof listPostCommentsContract>;
/** Cursor pagination accepted by the list-post-comments endpoint. */
type ListPostCommentsQuery = QueryOf<typeof listPostCommentsContract>;
/** Paginated comments returned for a visible post. */
type ListPostCommentsResponse = ResponseOf<typeof listPostCommentsContract>;
/** Validates a comment to add to a post. */
declare const addCommentRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        postId: z.ZodUUID;
    }, z.core.$strip>;
    body: z.ZodObject<{
        content: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Defines the contract for adding a comment. */
declare const addCommentResponseSchema: z.ZodVoid;
/** Defines the contract for adding a comment. */
declare const addCommentContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            postId: z.ZodUUID;
        }, z.core.$strip>;
        body: z.ZodObject<{
            content: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the add-comment endpoint. */
type AddCommentParams = ParamsOf<typeof addCommentContract>;
/** Request body accepted by the add-comment endpoint. */
type AddCommentBody = BodyOf<typeof addCommentContract>;
/** Empty response returned after adding a comment. */
type AddCommentResponse = ResponseOf<typeof addCommentContract>;
/** Validates a comment identifier and its replacement content. */
declare const editCommentRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
    body: z.ZodObject<{
        content: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Defines the contract for editing an authored comment. */
declare const editCommentResponseSchema: z.ZodVoid;
/** Defines the contract for editing an authored comment. */
declare const editCommentContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodUUID;
        }, z.core.$strip>;
        body: z.ZodObject<{
            content: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the edit-comment endpoint. */
type EditCommentParams = ParamsOf<typeof editCommentContract>;
/** Request body accepted by the edit-comment endpoint. */
type EditCommentBody = BodyOf<typeof editCommentContract>;
/** Empty response returned after editing a comment. */
type EditCommentResponse = ResponseOf<typeof editCommentContract>;
/** Validates the identifier of a comment to delete. */
declare const deleteCommentRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Defines the contract for deleting an authored comment. */
declare const deleteCommentResponseSchema: z.ZodVoid;
/** Defines the contract for deleting an authored comment. */
declare const deleteCommentContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodUUID;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the delete-comment endpoint. */
type DeleteCommentParams = ParamsOf<typeof deleteCommentContract>;
/** Empty response returned after deleting a comment. */
type DeleteCommentResponse = ResponseOf<typeof deleteCommentContract>;

/** Runtime schema for a comment returned by a social query. */
declare const commentQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    postId: z.ZodUUID;
    userId: z.ZodUUID;
    content: z.ZodString;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, {
    out: {};
    in: {};
}>;
/** Runtime schema for the identifier returned after a comment write. */
declare const commentWriteResultQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.core.$strip>;
/** Typed comment returned by social comment queries. */
type CommentQueryDto = z.infer<typeof commentQueryDtoSchema>;
/** Typed identifier returned after creating, editing, or deleting a comment. */
type CommentWriteResultQueryDto = z.infer<typeof commentWriteResultQueryDtoSchema>;

/** Validates cursor pagination for reactions on a visible post. */
declare const listPostReactionsRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        postId: z.ZodUUID;
    }, z.core.$strip>;
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates a page of reactions and its continuation cursor. */
declare const listPostReactionsResponseSchema: z.ZodObject<{
    reactions: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        postId: z.ZodUUID;
        userId: z.ZodUUID;
        type: z.ZodEnum<{
            like: "like";
            "fire up": "fire up";
            muscle: "muscle";
        }>;
        reactedAt: z.ZodString;
    }, {
        out: {};
        in: {};
    }>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the contract for listing reactions on a post. */
declare const listPostReactionsContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            postId: z.ZodUUID;
        }, z.core.$strip>;
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        reactions: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            postId: z.ZodUUID;
            userId: z.ZodUUID;
            type: z.ZodEnum<{
                like: "like";
                "fire up": "fire up";
                muscle: "muscle";
            }>;
            reactedAt: z.ZodString;
        }, {
            out: {};
            in: {};
        }>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Route parameters accepted by the list-post-reactions endpoint. */
type ListPostReactionsParams = ParamsOf<typeof listPostReactionsContract>;
/** Cursor pagination accepted by the list-post-reactions endpoint. */
type ListPostReactionsQuery = QueryOf<typeof listPostReactionsContract>;
/** Paginated reactions returned for a visible post. */
type ListPostReactionsResponse = ResponseOf<typeof listPostReactionsContract>;
/** Validates a request that creates or replaces the caller's reaction to a post. */
declare const reactToPostRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        postId: z.ZodUUID;
    }, z.core.$strip>;
    body: z.ZodObject<{
        type: z.ZodEnum<{
            like: "like";
            "fire up": "fire up";
            muscle: "muscle";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Defines the empty response returned after reacting to a post. */
declare const reactToPostResponseSchema: z.ZodVoid;
/** Defines the contract for creating or replacing a reaction. */
declare const reactToPostContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            postId: z.ZodUUID;
        }, z.core.$strip>;
        body: z.ZodObject<{
            type: z.ZodEnum<{
                like: "like";
                "fire up": "fire up";
                muscle: "muscle";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the react-to-post endpoint. */
type ReactToPostParams = ParamsOf<typeof reactToPostContract>;
/** Request body accepted by the react-to-post endpoint. */
type ReactToPostBody = BodyOf<typeof reactToPostContract>;
/** Empty response returned after reacting to a post. */
type ReactToPostResponse = ResponseOf<typeof reactToPostContract>;
/** Validates the post whose reaction the caller wants to remove. */
declare const deleteReactionRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        postId: z.ZodUUID;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Defines the empty response returned after deleting a reaction. */
declare const deleteReactionResponseSchema: z.ZodVoid;
/** Defines the contract for deleting the caller's reaction from a post. */
declare const deleteReactionContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            postId: z.ZodUUID;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the delete-reaction endpoint. */
type DeleteReactionParams = ParamsOf<typeof deleteReactionContract>;
/** Empty response returned after deleting a reaction. */
type DeleteReactionResponse = ResponseOf<typeof deleteReactionContract>;

/** Runtime schema for a reaction returned by a social query. */
declare const reactionQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    postId: z.ZodUUID;
    userId: z.ZodUUID;
    type: z.ZodEnum<{
        like: "like";
        "fire up": "fire up";
        muscle: "muscle";
    }>;
    reactedAt: z.ZodString;
}, {
    out: {};
    in: {};
}>;
/** Runtime schema for the identifier returned after a reaction write. */
declare const reactionWriteResultQueryDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.core.$strip>;
/** Typed reaction returned by social reaction queries. */
type ReactionQueryDto = z.infer<typeof reactionQueryDtoSchema>;
/** Typed identifier returned after creating, changing, or deleting a reaction. */
type ReactionWriteResultQueryDto = z.infer<typeof reactionWriteResultQueryDtoSchema>;

export { type AccessTokenPayloadDto, type AddAerobicInputQueryDto, type AddCommentBody, type AddCommentParams, type AddCommentResponse, type AerobicMutationRowQueryDto, type AerobicTrackingRow, type AerobicsDailyRecordQueryDto, type AerobicsWeeklyRecordQueryDto, type AllUserMessageQueryDto, type AnalyzeVideoPayloadDto, type AnalyzeVideoResultPayloadDto, type AppleOAuthBody, type AppleTokenVerificationResultDto, type AuthenticatedUserForUpdateQueryDto, type BodyOf, type ChangeEmailTokenPayloadDto, type CommentQueryDto, type CommentWriteResultQueryDto, type Contract, type CreateAerobicEntryBody, type CreateAerobicEntryQuery, type CreateCrewBody, type CreateCrewResponse, type CreatePasswordResetRequestBody, type CreatePostBody, type CreatePostResponse, type CreateUserBody, type CreateUserResponse, type CreateVerificationEmailBody, type CreateVideoUploadUrlBody, type CreateVideoUploadUrlResponse, type CreateWebSocketTicketBody, type CreateWebSocketTicketResponse, type CreateWorkoutSessionBody, type CreateWorkoutSessionResponse, type CreatedUserQueryDto, type CreatedUserRawQueryDto, type CreatedUserRowQueryDto, type CrewParticipantPreviewQueryDto, type CrewParticipantQueryDto, type CrewQueryDto, type CrewSuccessorQueryDto, type DeleteAerobicEntryParams, type DeleteAerobicEntryQuery, type DeleteAerobicEntryResponse, type DeleteCommentParams, type DeleteCommentResponse, type DeleteCrewParams, type DeleteCrewResponse, type DeleteMessageParams, type DeleteMessageResponse, type DeletePostParams, type DeletePostResponse, type DeleteProfilePictureBody, type DeleteReactionParams, type DeleteReactionResponse, type DeletedCrewQueryDto, type DeletedMessageQueryDto, type DeletedPostQueryDto, type DiscoverableCrewQueryDto, type EditCommentBody, type EditCommentParams, type EditCommentResponse, type EmailVerifyPayloadDto, type EnqueueAnalyzeVideoParamsDto, type ExerciseAssignmentIdQueryDto, type ExerciseHistoryQueryDto, type ExerciseHistoryRowQueryDto, type ExerciseInPlanQueryDto, type ExerciseMapByMuscleRowQueryDto, type ExerciseMetadataQueryDto, type ExerciseRow, type ExerciseToWorkoutSplitRow, type ExerciseTrackingAnalysisQueryDto, type ExerciseTrackingAndStatsQueryDto, type ExerciseTrackingAndStatsRowQueryDto, type ExerciseTrackingIdQueryDto, type ExerciseTrackingMapsQueryDto, type ExerciseTrackingMapsRowQueryDto, type ExerciseTrackingPrMaxQueryDto, type ExerciseTrackingRow, type ExerciseTrackingStatsQueryDto, type ExerciseTrackingStatsRowQueryDto, type ExercisesMapByMuscleQueryDto, type FinishedWorkoutEntryQueryDto, type ForgotPasswordPayloadDto, type GetAerobicHistoryQuery, type GetAerobicHistoryResponse, type GetAllExercisesExerciseQueryDto, type GetCrewParams, type GetCrewResponse, type GetCurrentUserResponse, type GetExerciseHistoryQuery, type GetExerciseHistoryResponse, type GetPersonalRecordsQuery, type GetPersonalRecordsResponse, type GetReminderSettingsResponse, type GetVerificationStatusQuery, type GetWorkoutHistoryQuery, type GetWorkoutHistoryResponse, type GetWorkoutPlanQuery, type GetWorkoutPlanResponse, type GetWorkoutSchedulesResponse, type GetWorkoutStatisticsResponse, type GoogleOAuthBody, type GoogleTokenVerificationResultDto, type LastLoginQueryDto, type LeaveCrewContextQueryDto, type LeaveCrewParams, type LeaveCrewResponse, type LeaveCrewResultQueryDto, type ListCrewParticipantsParams, type ListCrewParticipantsQuery, type ListCrewParticipantsResponse, type ListCrewPostsParams, type ListCrewPostsQuery, type ListCrewPostsResponse, type ListCrewsQuery, type ListCrewsResponse, type ListExercisesResponse, type ListMessagesQuery, type ListMessagesResponse, type ListPostCommentsParams, type ListPostCommentsQuery, type ListPostCommentsResponse, type ListPostReactionsParams, type ListPostReactionsQuery, type ListPostReactionsResponse, type ListVisiblePostsQuery, type ListVisiblePostsResponse, type LoginRequestBody, type LoginResponse, type LogoutResponse, type MarkMessageAsReadParams, type MarkMessageAsReadResponse, type MessageAfterSendQueryDto, type MessageAsReadQueryDto, type MessageRow, type OAuthCreatedUserRowQueryDto, type OAuthLinkQueryDto, type OAuthLinkRowQueryDto, type OAuthLoginResponse, type OAuthLookupQueryDto, type OAuthLookupRawQueryDto, type OAuthLookupRowQueryDto, type ParamsOf, type PersonalRecordsQueryDto, type PersonalRecordsRowQueryDto, type PostQueryDto, type QueryOf, type ReactToPostBody, type ReactToPostParams, type ReactToPostResponse, type ReactionQueryDto, type ReactionWriteResultQueryDto, type RefreshTokenPayloadDto, type RefreshTokenResponse, type ReplaceProfilePictureResponse, type ReplacePushTokenBody, type ReplaceWorkoutPlanBody, type ReplaceWorkoutPlanResponse, type ReplaceWorkoutSchedulesBody, type ReplaceWorkoutSchedulesResponse, type RequestOf, type RequestSchema, type ResetPasswordBody, type ResetPasswordQuery, type ResetPasswordResponse, type ResponseOf, type SaveWorkoutSplitInputQueryDto, type SaveWorkoutSplitPayloadQueryDto, type SquatRepetitionDto, type TokenVersionQueryDto, type TrackingByDateItemQueryDto, type TrackingBySplitNameItemQueryDto, type TrackingMapItemQueryDto, type UpdateAerobicEntryBody, type UpdateAerobicEntryParams, type UpdateAerobicEntryQuery, type UpdateAerobicEntryResponse, type UpdateCrewBody, type UpdateCrewParams, type UpdateCrewResponse, type UpdateCurrentUserBody, type UpdateCurrentUserResponse, type UpdatePostBody, type UpdatePostParams, type UpdatePostResponse, type UpdateReminderTimeZoneBody, type UpdateReminderTimeZoneResponse, type UpdateUnverifiedAccountEmailBody, type UpsertReminderSettingsBody, type UpsertReminderSettingsResponse, type UserAerobicsQueryDto, type UserAerobicsRowQueryDto, type UserAfterBumpQueryDto, type UserByIdentifierQueryDto, type UserByIdentifierRawQueryDto, type UserByIdentifierRowQueryDto, type UserByUsernameRawQueryDto, type UserByUsernameRowQueryDto, type UserConflictQueryDto, type UserDataQueryDto, type UserDataResponse, type UserDataRowQueryDto, type UserExistsQueryDto, type UserInsert, type UserMessageIdentityQueryDto, type UserProfilePicQueryDto, type UserRow, type UserWithNotificationsEnabledQueryDto, type VerifyEmailQuery, type WeeklyDataQueryDto, type WholeUserWorkoutPlanQueryDto, type WorkoutExerciseInputQueryDto, type WorkoutPlanIdQueryDto, type WorkoutPlanRow, type WorkoutScheduleInputDto, type WorkoutScheduleQueryDto, type WorkoutSplitIdQueryDto, type WorkoutSplitLookupQueryDto, type WorkoutSplitQueryDto, type WorkoutSplitRow, type WorkoutSummaryIdQueryDto, type WorkoutSummaryRow, accessTokenPayloadDtoSchema, addAerobicInputQueryDtoSchema, addCommentContract, addCommentRequestSchema, addCommentResponseSchema, aerobicMutationRowQueryDtoSchema, aerobicTrackingDbSchema, aerobicsDailyRecordQueryDtoSchema, aerobicsWeeklyRecordQueryDtoSchema, allUserMessageQueryDtoSchema, analyzeVideoPayloadDtoSchema, analyzeVideoResultPayloadDtoSchema, appleOAuthContract, appleOAuthRequestSchema, appleTokenVerificationResultDtoSchema, authenticatedUserForUpdateQueryDtoSchema, changeEmailTokenPayloadDtoSchema, commentDbSchema, commentQueryDtoSchema, commentWriteResultQueryDtoSchema, createAerobicEntryContract, createAerobicEntryRequestSchema, createAerobicEntryResponseSchema, createCrewContract, createCrewRequestSchema, createCrewResponseSchema, createPasswordResetRequestContract, createPasswordResetRequestSchema, createPostContract, createPostRequestSchema, createPostResponseSchema, createUserContract, createUserRequestSchema, createUserResponseSchema, createUserUserSchema, createVerificationEmailContract, createVerificationEmailRequestSchema, createVideoUploadUrlContract, createVideoUploadUrlRequestSchema, createVideoUploadUrlResponseSchema, createWebSocketTicketContract, createWebSocketTicketRequestSchema, createWebSocketTicketResponseSchema, createWorkoutSessionContract, createWorkoutSessionRequestSchema, createWorkoutSessionResponseSchema, createdUserQueryDtoSchema, createdUserRawQueryDtoSchema, createdUserRowQueryDtoSchema, crewDbSchema, crewMembershipDbSchema, crewParticipantPreviewQueryDtoSchema, crewParticipantQueryDtoSchema, crewQueryDtoSchema, crewSuccessorQueryDtoSchema, deleteAerobicEntryContract, deleteAerobicEntryRequestSchema, deleteCommentContract, deleteCommentRequestSchema, deleteCommentResponseSchema, deleteCrewContract, deleteCrewRequestSchema, deleteCrewResponseSchema, deleteMessageContract, deleteMessageRequestSchema, deleteMessageResponseSchema, deletePostContract, deletePostRequestSchema, deletePostResponseSchema, deleteProfilePictureContract, deleteProfilePictureRequestSchema, deleteReactionContract, deleteReactionRequestSchema, deleteReactionResponseSchema, deletedCrewQueryDtoSchema, deletedMessageQueryDtoSchema, deletedPostQueryDtoSchema, discoverableCrewQueryDtoSchema, editCommentContract, editCommentRequestSchema, editCommentResponseSchema, emailVerifyPayloadDtoSchema, enqueueAnalyzeVideoParamsDtoSchema, exerciseAssignmentIdQueryDtoSchema, exerciseDbSchema, exerciseHistoryQueryDtoSchema, exerciseHistoryRowQueryDtoSchema, exerciseInPlanQueryDtoSchema, exerciseMapByMuscleRowQueryDtoSchema, exerciseMetadataQueryDtoSchema, exerciseToWorkoutSplitDbSchema, exerciseToWorkoutSplitSetExpandedViewDbSchema, exerciseTrackingAnalysisQueryDtoSchema, exerciseTrackingAndStatsQueryDtoSchema, exerciseTrackingAndStatsRowQueryDtoSchema, exerciseTrackingDbSchema, exerciseTrackingIdQueryDtoSchema, exerciseTrackingMapsQueryDtoSchema, exerciseTrackingMapsRowQueryDtoSchema, exerciseTrackingPrMaxQueryDtoSchema, exerciseTrackingSetExpandedViewDbSchema, exerciseTrackingStatsQueryDtoSchema, exerciseTrackingStatsRowQueryDtoSchema, exercisesMapByMuscleQueryDtoSchema, finishedWorkoutEntryQueryDtoSchema, forgotPasswordPayloadDtoSchema, getAerobicHistoryContract, getAerobicHistoryRequestSchema, getAerobicHistoryResponseSchema, getAllExercisesExerciseQueryDtoSchema, getCrewContract, getCrewRequestSchema, getCrewResponseSchema, getCurrentUserContract, getCurrentUserResponseSchema, getExerciseHistoryContract, getExerciseHistoryRequestSchema, getExerciseHistoryResponseSchema, getPersonalRecordsContract, getPersonalRecordsRequestSchema, getPersonalRecordsResponseSchema, getReminderSettingsContract, getReminderSettingsResponseSchema, getVerificationStatusContract, getVerificationStatusRequestSchema, getWorkoutHistoryContract, getWorkoutHistoryRequestSchema, getWorkoutHistoryResponseSchema, getWorkoutPlanContract, getWorkoutPlanRequestSchema, getWorkoutPlanResponseSchema, getWorkoutSchedulesContract, getWorkoutSchedulesResponseSchema, getWorkoutStatisticsContract, getWorkoutStatisticsResponseSchema, googleOAuthContract, googleOAuthRequestSchema, googleTokenVerificationResultDtoSchema, lastLoginQueryDtoSchema, leaveCrewContextQueryDtoSchema, leaveCrewContract, leaveCrewRequestSchema, leaveCrewResponseSchema, leaveCrewResultQueryDtoSchema, listCrewParticipantsContract, listCrewParticipantsRequestSchema, listCrewParticipantsResponseSchema, listCrewPostsContract, listCrewPostsRequestSchema, listCrewPostsResponseSchema, listCrewsContract, listCrewsRequestSchema, listCrewsResponseSchema, listExercisesContract, listExercisesResponseSchema, listMessagesContract, listMessagesRequestSchema, listMessagesResponseSchema, listPostCommentsContract, listPostCommentsRequestSchema, listPostCommentsResponseSchema, listPostReactionsContract, listPostReactionsRequestSchema, listPostReactionsResponseSchema, listVisiblePostsContract, listVisiblePostsRequestSchema, listVisiblePostsResponseSchema, loginContract, loginRequestSchema, loginResponseSchema, logoutContract, logoutResponseSchema, markMessageAsReadContract, markMessageAsReadRequestSchema, markMessageAsReadResponseSchema, messageAfterSendQueryDtoSchema, messageAsReadQueryDtoSchema, messageDbSchema, oAuthCreatedUserRowQueryDtoSchema, oAuthLinkQueryDtoSchema, oAuthLinkRowQueryDtoSchema, oAuthLoginContract, oAuthLoginResponseSchema, oAuthLookupQueryDtoSchema, oAuthLookupRawQueryDtoSchema, oAuthLookupRowQueryDtoSchema, oauthAccountDbSchema, personalRecordQueryDtoSchema, personalRecordsQueryDtoSchema, personalRecordsRowQueryDtoSchema, postDbSchema, postQueryDtoSchema, proceedLoginResponseSchema, prsViewDbSchema, reactToPostContract, reactToPostRequestSchema, reactToPostResponseSchema, reactionDbSchema, reactionQueryDtoSchema, reactionWriteResultQueryDtoSchema, refreshTokenContract, refreshTokenPayloadDtoSchema, refreshTokenResponseSchema, replaceProfilePictureContract, replaceProfilePictureResponseSchema, replacePushTokenContract, replacePushTokenRequestSchema, replaceWorkoutPlanContract, replaceWorkoutPlanRequestSchema, replaceWorkoutPlanResponseSchema, replaceWorkoutSchedulesContract, replaceWorkoutSchedulesRequestSchema, resetPasswordContract, resetPasswordRequestSchema, resetPasswordResponseSchema, saveWorkoutSplitInputQueryDtoSchema, saveWorkoutSplitPayloadQueryDtoSchema, serializedDateSchema, squatRepetitionDtoSchema, timezoneSchema, tokenVersionQueryDtoSchema, trackingByDateItemQueryDtoSchema, trackingBySplitNameItemQueryDtoSchema, trackingMapItemQueryDtoSchema, trackingSetDbSchema, updateAerobicEntryContract, updateAerobicEntryRequestSchema, updateCrewContract, updateCrewRequestSchema, updateCrewResponseSchema, updateCurrentUserContract, updateCurrentUserRequestSchema, updateCurrentUserResponseSchema, updatePostContract, updatePostRequestSchema, updatePostResponseSchema, updateReminderTimeZoneContract, updateReminderTimeZoneRequestSchema, updateUnverifiedAccountEmailContract, updateUnverifiedAccountEmailRequestSchema, upsertReminderSettingsContract, upsertReminderSettingsRequestSchema, userAerobicsQueryDtoSchema, userAerobicsRowQueryDtoSchema, userAfterBumpQueryDtoSchema, userByIdentifierQueryDtoSchema, userByIdentifierRawQueryDtoSchema, userByIdentifierRowQueryDtoSchema, userByUsernameRawQueryDtoSchema, userByUsernameRowQueryDtoSchema, userConflictQueryDtoSchema, userDataContract, userDataQueryDtoSchema, userDataResponseSchema, userDataRowQueryDtoSchema, userDbSchema, userExistsQueryDtoSchema, userInsertDbSchema, userMessageIdentityQueryDtoSchema, userProfilePicQueryDtoSchema, userReminderSettingDbSchema, userUpdateDbSchema, userWithNotificationsEnabledQueryDtoSchema, verifyEmailContract, verifyEmailRequestSchema, weeklyDataQueryDtoSchema, wholeUserWorkoutPlanQueryDtoSchema, workoutExerciseInputQueryDtoSchema, workoutPlanDbSchema, workoutPlanIdQueryDtoSchema, workoutScheduleDbSchema, workoutScheduleInputDtoSchema, workoutScheduleQueryDtoSchema, workoutSetDbSchema, workoutSplitDbSchema, workoutSplitIdQueryDtoSchema, workoutSplitLookupQueryDtoSchema, workoutSplitQueryDtoSchema, workoutSummaryDbSchema, workoutSummaryIdQueryDtoSchema };
