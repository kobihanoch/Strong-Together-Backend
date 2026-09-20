import { z } from 'zod/v4';
import * as drizzle_zod from 'drizzle-zod';
import * as drizzle_orm_pg_core from 'drizzle-orm/pg-core';

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
    name: drizzle_orm_pg_core.PgColumn<{
        name: "name";
        tableName: "crew";
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
    createdBy: drizzle_orm_pg_core.PgColumn<{
        name: "created_by";
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
    profilePicPath: drizzle_orm_pg_core.PgColumn<{
        name: "profile_pic_path";
        tableName: "crew";
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
declare const crewParticipationRequestDbSchema: drizzle_zod.BuildSchema<"select", {
    id: drizzle_orm_pg_core.PgColumn<{
        name: "id";
        tableName: "crew_participation_request";
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
        tableName: "crew_participation_request";
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
    initiatorUserId: drizzle_orm_pg_core.PgColumn<{
        name: "initiator_user_id";
        tableName: "crew_participation_request";
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
    participantUserId: drizzle_orm_pg_core.PgColumn<{
        name: "participant_user_id";
        tableName: "crew_participation_request";
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
        tableName: "crew_participation_request";
        dataType: "string";
        columnType: "PgEnumColumn";
        data: "pending" | "accepted" | "declined" | "cancelled" | "expired";
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: ["pending", "accepted", "declined", "cancelled", "expired"];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: drizzle_orm_pg_core.PgColumn<{
        name: "created_at";
        tableName: "crew_participation_request";
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
        tableName: "crew_participation_request";
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
    respondedAt: drizzle_orm_pg_core.PgColumn<{
        name: "responded_at";
        tableName: "crew_participation_request";
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
    workoutSummaryId: drizzle_orm_pg_core.PgColumn<{
        name: "workout_summary_id";
        tableName: "post";
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
            durationSec: z.ZodNumber;
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
                durationSec: z.ZodNumber;
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
        id: z.ZodNumber;
        type: z.ZodString;
        durationSec: z.ZodNumber;
        durationMins: z.ZodNumber;
    }, z.core.$strip>>>;
    weekly: z.ZodRecord<z.ZodString, z.ZodObject<{
        records: z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
            type: z.ZodString;
            durationSec: z.ZodNumber;
            durationMins: z.ZodNumber;
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
            id: z.ZodNumber;
            type: z.ZodString;
            durationSec: z.ZodNumber;
            durationMins: z.ZodNumber;
        }, z.core.$strip>>>;
        weekly: z.ZodRecord<z.ZodString, z.ZodObject<{
            records: z.ZodArray<z.ZodObject<{
                id: z.ZodNumber;
                type: z.ZodString;
                durationSec: z.ZodNumber;
                durationMins: z.ZodNumber;
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
            durationSec: z.ZodNumber;
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
                durationSec: z.ZodNumber;
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

declare const loginRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        identifier: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const loginResponseSchema: z.ZodObject<{
    message: z.ZodString;
    user: z.ZodString;
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
        user: z.ZodString;
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
    }, z.core.$strip>;
};
declare const refreshTokenResponseSchema: z.ZodObject<{
    message: z.ZodString;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
    userId: z.ZodString;
}, z.core.$strip>;
declare const refreshTokenContract: {
    response: z.ZodObject<{
        message: z.ZodString;
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
        userId: z.ZodString;
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

declare const listExercisesResponseSchema: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    specificTargetMuscle: z.ZodString;
}, z.core.$strip>>>;
declare const listExercisesContract: {
    response: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        specificTargetMuscle: z.ZodString;
    }, z.core.$strip>>>;
};
type ListExercisesResponse = ResponseOf<typeof listExercisesContract>;

declare const listMessagesRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        tz: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const listMessagesResponseSchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
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
            id: z.ZodString;
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
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const markMessageAsReadResponseSchema: z.ZodVoid;
declare const markMessageAsReadContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
type MarkMessageAsReadParams = ParamsOf<typeof markMessageAsReadContract>;
type MarkMessageAsReadResponse = ResponseOf<typeof markMessageAsReadContract>;
declare const deleteMessageRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const deleteMessageResponseSchema: z.ZodVoid;
declare const deleteMessageContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
type DeleteMessageParams = ParamsOf<typeof deleteMessageContract>;
type DeleteMessageResponse = ResponseOf<typeof deleteMessageContract>;

declare const appleOAuthRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        idToken: z.ZodString;
        rawNonce: z.ZodString;
        name: z.ZodOptional<z.ZodObject<{
            givenName: z.ZodNullable<z.ZodString>;
            familyName: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
        email: z.ZodNullable<z.ZodEmail>;
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
            email: z.ZodNullable<z.ZodEmail>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
type AppleOAuthBody = BodyOf<typeof appleOAuthContract>;

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

declare const oAuthLoginResponseSchema: z.ZodObject<{
    message: z.ZodString;
    user: z.ZodString;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
}, z.core.$strip>;
declare const proceedLoginResponseSchema: z.ZodObject<{
    message: z.ZodString;
    user: z.ZodString;
    accessToken: z.ZodString;
    refreshToken: z.ZodString;
}, z.core.$strip>;
declare const oAuthLoginContract: {
    response: z.ZodObject<{
        message: z.ZodString;
        user: z.ZodString;
        accessToken: z.ZodString;
        refreshToken: z.ZodString;
    }, z.core.$strip>;
};
type OAuthLoginResponse = ResponseOf<typeof oAuthLoginContract>;

declare const getReminderSettingsResponseSchema: z.ZodObject<{
    reminderSettings: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        reminderEnabled: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        timeZone: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const getReminderSettingsContract: {
    response: z.ZodObject<{
        reminderSettings: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            userId: z.ZodString;
            reminderEnabled: z.ZodBoolean;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            timeZone: z.ZodString;
        }, z.core.$strip>>;
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
    id: z.ZodString;
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
        id: z.ZodString;
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
        tokenVersion: z.ZodNumber;
        isVerified: z.ZodBoolean;
        authProvider: z.ZodString;
        lastLogin: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const userDataContract: {
    response: z.ZodObject<{
        userData: z.ZodObject<{
            id: z.ZodString;
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
            tokenVersion: z.ZodNumber;
            isVerified: z.ZodBoolean;
            authProvider: z.ZodString;
            lastLogin: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
declare const getCurrentUserResponseSchema: z.ZodObject<{
    id: z.ZodString;
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
    tokenVersion: z.ZodNumber;
    isVerified: z.ZodBoolean;
    authProvider: z.ZodString;
    lastLogin: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
declare const getCurrentUserContract: {
    response: z.ZodObject<{
        id: z.ZodString;
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
        tokenVersion: z.ZodNumber;
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
    userId: z.ZodString;
    requestId: z.ZodString;
    sentryTrace: z.ZodOptional<z.ZodString>;
    baggage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/** Queue payload containing video-analysis parameters and expiration. */
declare const analyzeVideoPayloadDtoSchema: z.ZodObject<{
    fileKey: z.ZodString;
    exercise: z.ZodString;
    userId: z.ZodString;
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
/** Completed-or-failed result emitted by a video-analysis worker. */
declare const analyzeVideoResultPayloadDtoSchema: <TResultSchema extends z.ZodType>(resultSchema: TResultSchema) => z.ZodIntersection<z.ZodObject<{
    jobId: z.ZodString;
    userId: z.ZodString;
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
        id: z.ZodNumber;
        numberOfSplits: z.ZodNumber;
        createdAt: z.ZodString;
        userId: z.ZodString;
        isActive: z.ZodBoolean;
        updatedAt: z.ZodString;
        workoutSplits: z.ZodNullable<z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
            workoutId: z.ZodNumber;
            name: z.ZodString;
            orderIndex: z.ZodNumber;
            createdAt: z.ZodString;
            muscleGroup: z.ZodNullable<z.ZodString>;
            estimatedDurationMinutes: z.ZodNullable<z.ZodNumber>;
            isActive: z.ZodBoolean;
            exercises: z.ZodArray<z.ZodObject<{
                exerciseToSplitId: z.ZodNumber;
                exerciseId: z.ZodNumber;
                name: z.ZodString;
                sets: z.ZodArray<z.ZodObject<{
                    orderIndex: z.ZodNumber;
                    reps: z.ZodNumber;
                }, z.core.$strip>>;
                orderIndex: z.ZodNumber;
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
            id: z.ZodNumber;
            numberOfSplits: z.ZodNumber;
            createdAt: z.ZodString;
            userId: z.ZodString;
            isActive: z.ZodBoolean;
            updatedAt: z.ZodString;
            workoutSplits: z.ZodNullable<z.ZodArray<z.ZodObject<{
                id: z.ZodNumber;
                workoutId: z.ZodNumber;
                name: z.ZodString;
                orderIndex: z.ZodNumber;
                createdAt: z.ZodString;
                muscleGroup: z.ZodNullable<z.ZodString>;
                estimatedDurationMinutes: z.ZodNullable<z.ZodNumber>;
                isActive: z.ZodBoolean;
                exercises: z.ZodArray<z.ZodObject<{
                    exerciseToSplitId: z.ZodNumber;
                    exerciseId: z.ZodNumber;
                    name: z.ZodString;
                    sets: z.ZodArray<z.ZodObject<{
                        orderIndex: z.ZodNumber;
                        reps: z.ZodNumber;
                    }, z.core.$strip>>;
                    orderIndex: z.ZodNumber;
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
                exerciseId: z.ZodNumber;
                sets: z.ZodArray<z.ZodNumber>;
                orderIndex: z.ZodNumber;
            }, z.core.$strip>>;
            id: z.ZodOptional<z.ZodNumber>;
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
                    exerciseId: z.ZodNumber;
                    sets: z.ZodArray<z.ZodNumber>;
                    orderIndex: z.ZodNumber;
                }, z.core.$strip>>;
                id: z.ZodOptional<z.ZodNumber>;
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
                exerciseTrackingId: z.ZodNumber;
                sets: z.ZodArray<z.ZodObject<{
                    setIndex: z.ZodNumber;
                    weight: z.ZodNumber;
                    reps: z.ZodNumber;
                }, z.core.$strip>>;
                notes: z.ZodNullable<z.ZodString>;
                exerciseAssignment: z.ZodObject<{
                    exerciseToSplitId: z.ZodNullable<z.ZodNumber>;
                    orderIndex: z.ZodNullable<z.ZodNumber>;
                    exerciseId: z.ZodNumber;
                    workoutSplitId: z.ZodNumber;
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
                    exerciseTrackingId: z.ZodNumber;
                    sets: z.ZodArray<z.ZodObject<{
                        setIndex: z.ZodNumber;
                        weight: z.ZodNumber;
                        reps: z.ZodNumber;
                    }, z.core.$strip>>;
                    notes: z.ZodNullable<z.ZodString>;
                    exerciseAssignment: z.ZodObject<{
                        exerciseToSplitId: z.ZodNullable<z.ZodNumber>;
                        orderIndex: z.ZodNullable<z.ZodNumber>;
                        exerciseId: z.ZodNumber;
                        workoutSplitId: z.ZodNumber;
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
            exerciseTrackingId: z.ZodNumber;
            sets: z.ZodArray<z.ZodObject<{
                setIndex: z.ZodNumber;
                weight: z.ZodNumber;
                reps: z.ZodNumber;
            }, z.core.$strip>>;
            exerciseAssignment: z.ZodObject<{
                exerciseToSplitId: z.ZodNullable<z.ZodNumber>;
                orderIndex: z.ZodNullable<z.ZodNumber>;
                exerciseId: z.ZodNumber;
                workoutSplitId: z.ZodNumber;
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
                exerciseTrackingId: z.ZodNumber;
                sets: z.ZodArray<z.ZodObject<{
                    setIndex: z.ZodNumber;
                    weight: z.ZodNumber;
                    reps: z.ZodNumber;
                }, z.core.$strip>>;
                exerciseAssignment: z.ZodObject<{
                    exerciseToSplitId: z.ZodNullable<z.ZodNumber>;
                    orderIndex: z.ZodNullable<z.ZodNumber>;
                    exerciseId: z.ZodNumber;
                    workoutSplitId: z.ZodNumber;
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
        id: z.ZodNumber;
        name: z.ZodString;
        orderIndex: z.ZodNumber;
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
        exerciseToSplitId: z.ZodNullable<z.ZodNumber>;
        exerciseId: z.ZodNumber;
        exerciseName: z.ZodString;
        prWeight: z.ZodNumber;
        prReps: z.ZodNumber;
        prSetIndex: z.ZodNumber;
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
            id: z.ZodNumber;
            name: z.ZodString;
            orderIndex: z.ZodNumber;
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
            exerciseToSplitId: z.ZodNullable<z.ZodNumber>;
            exerciseId: z.ZodNumber;
            exerciseName: z.ZodString;
            prWeight: z.ZodNumber;
            prReps: z.ZodNumber;
            prSetIndex: z.ZodNumber;
            estimatedOneRepMax: z.ZodNullable<z.ZodNumber>;
            workoutStartLocal: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
declare const createWorkoutSessionRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        workout: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            trackedSets: z.ZodArray<z.ZodObject<{
                reps: z.ZodNumber;
                weight: z.ZodNumber;
                setIndex: z.ZodNumber;
            }, z.core.$strip>>;
            notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            isExerciseAssignedToSplit: z.ZodLiteral<true>;
            exerciseToSplitId: z.ZodNumber;
            exerciseId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>, z.ZodObject<{
            trackedSets: z.ZodArray<z.ZodObject<{
                reps: z.ZodNumber;
                weight: z.ZodNumber;
                setIndex: z.ZodNumber;
            }, z.core.$strip>>;
            notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            isExerciseAssignedToSplit: z.ZodLiteral<false>;
            exerciseToSplitId: z.ZodOptional<z.ZodNull>;
            exerciseId: z.ZodNumber;
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
                    reps: z.ZodNumber;
                    weight: z.ZodNumber;
                    setIndex: z.ZodNumber;
                }, z.core.$strip>>;
                notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                isExerciseAssignedToSplit: z.ZodLiteral<true>;
                exerciseToSplitId: z.ZodNumber;
                exerciseId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>, z.ZodObject<{
                trackedSets: z.ZodArray<z.ZodObject<{
                    reps: z.ZodNumber;
                    weight: z.ZodNumber;
                    setIndex: z.ZodNumber;
                }, z.core.$strip>>;
                notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                isExerciseAssignedToSplit: z.ZodLiteral<false>;
                exerciseToSplitId: z.ZodOptional<z.ZodNull>;
                exerciseId: z.ZodNumber;
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
        exerciseToSplitId: z.ZodNullable<z.ZodNumber>;
        exerciseName: z.ZodString;
        workoutStartLocal: z.ZodString;
        prWeight: z.ZodNumber;
        prReps: z.ZodNumber;
        prSetIndex: z.ZodNumber;
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
            exerciseToSplitId: z.ZodNullable<z.ZodNumber>;
            exerciseName: z.ZodString;
            workoutStartLocal: z.ZodString;
            prWeight: z.ZodNumber;
            prReps: z.ZodNumber;
            prSetIndex: z.ZodNumber;
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
        search: z.ZodOptional<z.ZodString>;
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the collection returned by the list-crews endpoint. */
declare const listCrewsResponseSchema: z.ZodObject<{
    crews: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        createdBy: z.ZodString;
        privacy: z.ZodEnum<{
            public: "public";
            private: "private";
        }>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        participantCount: z.ZodNumber;
        top5Participants: z.ZodArray<z.ZodObject<{
            username: z.ZodString;
            fullName: z.ZodString;
            profilePicPath: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the request and response contract for listing visible crews. */
declare const listCrewsContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            search: z.ZodOptional<z.ZodString>;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        crews: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            createdBy: z.ZodString;
            privacy: z.ZodEnum<{
                public: "public";
                private: "private";
            }>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            participantCount: z.ZodNumber;
            top5Participants: z.ZodArray<z.ZodObject<{
                username: z.ZodString;
                fullName: z.ZodString;
                profilePicPath: z.ZodNullable<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Pagination query accepted by the list-crews endpoint. */
type ListCrewsQuery = QueryOf<typeof listCrewsContract>;
/** Response returned when listing crews visible to the caller. */
type ListCrewsResponse = ResponseOf<typeof listCrewsContract>;
/** Validates pagination for crews in which the authenticated user is an active member. */
declare const listMyCrewsRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the authenticated user's crew collection. */
declare const listMyCrewsResponseSchema: z.ZodObject<{
    crews: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        createdBy: z.ZodString;
        privacy: z.ZodEnum<{
            public: "public";
            private: "private";
        }>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        participantCount: z.ZodNumber;
        top5Participants: z.ZodArray<z.ZodObject<{
            username: z.ZodString;
            fullName: z.ZodString;
            profilePicPath: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the request and response contract for listing the authenticated user's crews. */
declare const listMyCrewsContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        crews: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            createdBy: z.ZodString;
            privacy: z.ZodEnum<{
                public: "public";
                private: "private";
            }>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            participantCount: z.ZodNumber;
            top5Participants: z.ZodArray<z.ZodObject<{
                username: z.ZodString;
                fullName: z.ZodString;
                profilePicPath: z.ZodNullable<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Pagination query accepted by the list-my-crews endpoint. */
type ListMyCrewsQuery = QueryOf<typeof listMyCrewsContract>;
/** Response containing crews in which the authenticated user is an active member. */
type ListMyCrewsResponse = ResponseOf<typeof listMyCrewsContract>;
/** Validates the crew identifier and pagination for listing participants. */
declare const listCrewParticipantsRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        crewId: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the participant collection returned by the endpoint. */
declare const listCrewParticipantsResponseSchema: z.ZodObject<{
    participants: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        crewId: z.ZodString;
        userId: z.ZodString;
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
        fullName: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
        username: z.ZodString;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the request and response contract for listing crew participants. */
declare const listCrewParticipantsContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            crewId: z.ZodString;
        }, z.core.$strip>;
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        participants: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            crewId: z.ZodString;
            userId: z.ZodString;
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
            fullName: z.ZodString;
            profilePicPath: z.ZodNullable<z.ZodString>;
            username: z.ZodString;
        }, z.core.$strip>>;
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
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the crew returned by the get-crew endpoint. */
declare const getCrewResponseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    createdBy: z.ZodString;
    privacy: z.ZodEnum<{
        public: "public";
        private: "private";
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    participantCount: z.ZodNumber;
}, z.core.$strip>;
/** Defines the request and response contract for retrieving one crew. */
declare const getCrewContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        createdBy: z.ZodString;
        privacy: z.ZodEnum<{
            public: "public";
            private: "private";
        }>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        participantCount: z.ZodNumber;
    }, z.core.$strip>;
};
/** Route parameters accepted by the get-crew endpoint. */
type GetCrewParams = ParamsOf<typeof getCrewContract>;
/** Response returned after retrieving one crew. */
type GetCrewResponse = ResponseOf<typeof getCrewContract>;
/** Validates the body used to create a crew. */
declare const createCrewRequestSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
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
            name: z.ZodString;
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
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        name: z.ZodString;
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
            id: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            name: z.ZodString;
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
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after leaving a crew. */
declare const leaveCrewResponseSchema: z.ZodVoid;
/** Defines the request and response contract for leaving a crew. */
declare const leaveCrewContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
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
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after deleting a crew. */
declare const deleteCrewResponseSchema: z.ZodVoid;
/** Defines the request and response contract for deleting a crew. */
declare const deleteCrewContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the delete-crew endpoint. */
type DeleteCrewParams = ParamsOf<typeof deleteCrewContract>;
/** Response returned after deleting a crew. */
type DeleteCrewResponse = ResponseOf<typeof deleteCrewContract>;
/** Validates the crew ID used when replacing its profile picture. */
declare const replaceCrewProfilePictureRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the stored path and public URL returned after upload. */
declare const replaceCrewProfilePictureResponseSchema: z.ZodObject<{
    profilePicPath: z.ZodString;
    url: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
/** Defines the replace-crew-profile-picture request and response. */
declare const replaceCrewProfilePictureContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        profilePicPath: z.ZodString;
        url: z.ZodString;
        message: z.ZodString;
    }, z.core.$strip>;
};
/** Route parameters accepted when replacing a crew profile picture. */
type ReplaceCrewProfilePictureParams = ParamsOf<typeof replaceCrewProfilePictureContract>;
/** Response returned after replacing a crew profile picture. */
type ReplaceCrewProfilePictureResponse = ResponseOf<typeof replaceCrewProfilePictureContract>;
/** Validates the crew ID used when deleting its profile picture. */
declare const deleteCrewProfilePictureRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Defines the delete-crew-profile-picture request and empty response. */
declare const deleteCrewProfilePictureContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted when deleting a crew profile picture. */
type DeleteCrewProfilePictureParams = ParamsOf<typeof deleteCrewProfilePictureContract>;
/** Empty response returned after deleting a crew profile picture. */
type DeleteCrewProfilePictureResponse = ResponseOf<typeof deleteCrewProfilePictureContract>;

/** Validates a crew invitation creation request. */
declare const inviteCrewUserRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        crewId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        userId: z.ZodUUID;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const inviteCrewUserContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            crewId: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            userId: z.ZodUUID;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
type InviteCrewUserParams = ParamsOf<typeof inviteCrewUserContract>;
type InviteCrewUserBody = BodyOf<typeof inviteCrewUserContract>;
type InviteCrewUserResponse = ResponseOf<typeof inviteCrewUserContract>;
/** Validates a request by the authenticated user to join a crew. */
declare const requestToJoinCrewRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        crewId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const requestToJoinCrewContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            crewId: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
type RequestToJoinCrewParams = ParamsOf<typeof requestToJoinCrewContract>;
type RequestToJoinCrewResponse = ResponseOf<typeof requestToJoinCrewContract>;
/** Validates an accepted or declined participation-request status update. */
declare const updateCrewParticipationRequestStatusRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        requestId: z.ZodUUID;
    }, z.core.$strip>;
    body: z.ZodObject<{
        status: z.ZodEnum<{
            accepted: "accepted";
            declined: "declined";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const updateCrewParticipationRequestStatusContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            requestId: z.ZodUUID;
        }, z.core.$strip>;
        body: z.ZodObject<{
            status: z.ZodEnum<{
                accepted: "accepted";
                declined: "declined";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
type UpdateCrewParticipationRequestStatusParams = ParamsOf<typeof updateCrewParticipationRequestStatusContract>;
type UpdateCrewParticipationRequestStatusBody = BodyOf<typeof updateCrewParticipationRequestStatusContract>;
type UpdateCrewParticipationRequestStatusResponse = ResponseOf<typeof updateCrewParticipationRequestStatusContract>;
/** Validates a request to list invitations addressed to the authenticated user. */
declare const listCrewInvitationsRequestSchema: z.ZodObject<{}, z.core.$strip>;
declare const listCrewInvitationsResponseSchema: z.ZodObject<{
    invitations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        crewId: z.ZodString;
        initiatorUserId: z.ZodString;
        participantUserId: z.ZodString;
        status: z.ZodEnum<{
            pending: "pending";
            accepted: "accepted";
            declined: "declined";
            cancelled: "cancelled";
            expired: "expired";
        }>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        respondedAt: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const listCrewInvitationsContract: {
    request: z.ZodObject<{}, z.core.$strip>;
    response: z.ZodObject<{
        invitations: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            crewId: z.ZodString;
            initiatorUserId: z.ZodString;
            participantUserId: z.ZodString;
            status: z.ZodEnum<{
                pending: "pending";
                accepted: "accepted";
                declined: "declined";
                cancelled: "cancelled";
                expired: "expired";
            }>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            respondedAt: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
type ListCrewInvitationsResponse = ResponseOf<typeof listCrewInvitationsContract>;
/** Validates a request to list pending join requests for a crew. */
declare const listPendingCrewJoinRequestsRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        crewId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const listPendingCrewJoinRequestsResponseSchema: z.ZodObject<{
    requests: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        crewId: z.ZodString;
        initiatorUserId: z.ZodString;
        participantUserId: z.ZodString;
        status: z.ZodEnum<{
            pending: "pending";
            accepted: "accepted";
            declined: "declined";
            cancelled: "cancelled";
            expired: "expired";
        }>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        respondedAt: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const listPendingCrewJoinRequestsContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            crewId: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        requests: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            crewId: z.ZodString;
            initiatorUserId: z.ZodString;
            participantUserId: z.ZodString;
            status: z.ZodEnum<{
                pending: "pending";
                accepted: "accepted";
                declined: "declined";
                cancelled: "cancelled";
                expired: "expired";
            }>;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            respondedAt: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
type ListPendingCrewJoinRequestsParams = ParamsOf<typeof listPendingCrewJoinRequestsContract>;
type ListPendingCrewJoinRequestsResponse = ResponseOf<typeof listPendingCrewJoinRequestsContract>;

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
        id: z.ZodString;
        authorUserId: z.ZodString;
        workoutSummaryId: z.ZodNullable<z.ZodString>;
        content: z.ZodString;
        visibility: z.ZodEnum<{
            public: "public";
            crews_only: "crews_only";
        }>;
        publishedAt: z.ZodString;
        updatedAt: z.ZodString;
        username: z.ZodString;
        fullName: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
        interactions: z.ZodObject<{
            reactionsCount: z.ZodObject<{
                likesCount: z.ZodNumber;
                fireUpCount: z.ZodNumber;
                muscleCount: z.ZodNumber;
            }, z.core.$strip>;
            commentsCount: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>>;
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
            id: z.ZodString;
            authorUserId: z.ZodString;
            workoutSummaryId: z.ZodNullable<z.ZodString>;
            content: z.ZodString;
            visibility: z.ZodEnum<{
                public: "public";
                crews_only: "crews_only";
            }>;
            publishedAt: z.ZodString;
            updatedAt: z.ZodString;
            username: z.ZodString;
            fullName: z.ZodString;
            profilePicPath: z.ZodNullable<z.ZodString>;
            interactions: z.ZodObject<{
                reactionsCount: z.ZodObject<{
                    likesCount: z.ZodNumber;
                    fireUpCount: z.ZodNumber;
                    muscleCount: z.ZodNumber;
                }, z.core.$strip>;
                commentsCount: z.ZodNumber;
            }, z.core.$strip>;
        }, z.core.$strip>>;
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
        id: z.ZodString;
        authorUserId: z.ZodString;
        workoutSummaryId: z.ZodNullable<z.ZodString>;
        content: z.ZodString;
        visibility: z.ZodEnum<{
            public: "public";
            crews_only: "crews_only";
        }>;
        publishedAt: z.ZodString;
        updatedAt: z.ZodString;
        username: z.ZodString;
        fullName: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
        interactions: z.ZodObject<{
            reactionsCount: z.ZodObject<{
                likesCount: z.ZodNumber;
                fireUpCount: z.ZodNumber;
                muscleCount: z.ZodNumber;
            }, z.core.$strip>;
            commentsCount: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>>;
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
            id: z.ZodString;
            authorUserId: z.ZodString;
            workoutSummaryId: z.ZodNullable<z.ZodString>;
            content: z.ZodString;
            visibility: z.ZodEnum<{
                public: "public";
                crews_only: "crews_only";
            }>;
            publishedAt: z.ZodString;
            updatedAt: z.ZodString;
            username: z.ZodString;
            fullName: z.ZodString;
            profilePicPath: z.ZodNullable<z.ZodString>;
            interactions: z.ZodObject<{
                reactionsCount: z.ZodObject<{
                    likesCount: z.ZodNumber;
                    fireUpCount: z.ZodNumber;
                    muscleCount: z.ZodNumber;
                }, z.core.$strip>;
                commentsCount: z.ZodNumber;
            }, z.core.$strip>;
        }, z.core.$strip>>;
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
        workoutSummaryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
            workoutSummaryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
        id: z.ZodString;
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
            id: z.ZodString;
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
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the empty response returned after deleting a post. */
declare const deletePostResponseSchema: z.ZodVoid;
/** Defines the request and response contract for deleting a post. */
declare const deletePostContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the delete-post endpoint. */
type DeletePostParams = ParamsOf<typeof deletePostContract>;
/** Response returned after deleting a post. */
type DeletePostResponse = ResponseOf<typeof deletePostContract>;

/** Validates cursor pagination for comments on a visible post. */
declare const listPostCommentsRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        postId: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates a page of comments and its continuation cursor. */
declare const listPostCommentsResponseSchema: z.ZodObject<{
    comments: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        postId: z.ZodString;
        userId: z.ZodString;
        content: z.ZodString;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        authorFullName: z.ZodString;
        authorProfilePicPath: z.ZodNullable<z.ZodString>;
        authorUsername: z.ZodString;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the contract for listing comments on a post. */
declare const listPostCommentsContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            postId: z.ZodString;
        }, z.core.$strip>;
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        comments: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            postId: z.ZodString;
            userId: z.ZodString;
            content: z.ZodString;
            createdAt: z.ZodString;
            updatedAt: z.ZodString;
            authorFullName: z.ZodString;
            authorProfilePicPath: z.ZodNullable<z.ZodString>;
            authorUsername: z.ZodString;
        }, z.core.$strip>>;
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
        postId: z.ZodString;
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
            postId: z.ZodString;
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
        id: z.ZodString;
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
            id: z.ZodString;
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
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Defines the contract for deleting an authored comment. */
declare const deleteCommentResponseSchema: z.ZodVoid;
/** Defines the contract for deleting an authored comment. */
declare const deleteCommentContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the delete-comment endpoint. */
type DeleteCommentParams = ParamsOf<typeof deleteCommentContract>;
/** Empty response returned after deleting a comment. */
type DeleteCommentResponse = ResponseOf<typeof deleteCommentContract>;

/** Validates cursor pagination for reactions on a visible post. */
declare const listPostReactionsRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        postId: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodObject<{
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates a page of reactions and its continuation cursor. */
declare const listPostReactionsResponseSchema: z.ZodObject<{
    reactions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        postId: z.ZodString;
        userId: z.ZodString;
        type: z.ZodEnum<{
            like: "like";
            "fire up": "fire up";
            muscle: "muscle";
        }>;
        reactedAt: z.ZodString;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the contract for listing reactions on a post. */
declare const listPostReactionsContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            postId: z.ZodString;
        }, z.core.$strip>;
        query: z.ZodObject<{
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        reactions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            postId: z.ZodString;
            userId: z.ZodString;
            type: z.ZodEnum<{
                like: "like";
                "fire up": "fire up";
                muscle: "muscle";
            }>;
            reactedAt: z.ZodString;
        }, z.core.$strip>>;
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
        postId: z.ZodString;
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
            postId: z.ZodString;
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
        postId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Defines the empty response returned after deleting a reaction. */
declare const deleteReactionResponseSchema: z.ZodVoid;
/** Defines the contract for deleting the caller's reaction from a post. */
declare const deleteReactionContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            postId: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodVoid;
};
/** Route parameters accepted by the delete-reaction endpoint. */
type DeleteReactionParams = ParamsOf<typeof deleteReactionContract>;
/** Empty response returned after deleting a reaction. */
type DeleteReactionResponse = ResponseOf<typeof deleteReactionContract>;

/** Validates the public profile fields shown in the social summary. */
declare const socialSummaryParticipantPreviewSchema: z.ZodObject<{
    userId: z.ZodString;
    username: z.ZodString;
    fullName: z.ZodString;
    profilePicPath: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Validates the authenticated user's social summary. */
declare const getSocialSummaryResponseSchema: z.ZodObject<{
    activeCrewCount: z.ZodNumber;
    participantPreviews: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        username: z.ZodString;
        fullName: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** Defines the response contract for retrieving the authenticated user's social summary. */
declare const getSocialSummaryContract: {
    response: z.ZodObject<{
        activeCrewCount: z.ZodNumber;
        participantPreviews: z.ZodArray<z.ZodObject<{
            userId: z.ZodString;
            username: z.ZodString;
            fullName: z.ZodString;
            profilePicPath: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
};
/** Social summary containing the caller's active crew total and up to three unique co-members. */
type GetSocialSummaryResponse = ResponseOf<typeof getSocialSummaryContract>;

/** Validates user-search text and cursor pagination. */
declare const searchSocialUsersRequestSchema: z.ZodObject<{
    query: z.ZodObject<{
        search: z.ZodString;
        limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
        cursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates a page of public user search results. */
declare const searchSocialUsersResponseSchema: z.ZodObject<{
    users: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        username: z.ZodString;
        fullName: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
    nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
/** Defines the social user-search request and response. */
declare const searchSocialUsersContract: {
    request: z.ZodObject<{
        query: z.ZodObject<{
            search: z.ZodString;
            limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
            cursor: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        users: z.ZodArray<z.ZodObject<{
            userId: z.ZodString;
            username: z.ZodString;
            fullName: z.ZodString;
            profilePicPath: z.ZodNullable<z.ZodString>;
            createdAt: z.ZodString;
        }, z.core.$strip>>;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
};
/** Query accepted by social user search. */
type SearchSocialUsersQuery = QueryOf<typeof searchSocialUsersContract>;
/** Response returned by social user search. */
type SearchSocialUsersResponse = ResponseOf<typeof searchSocialUsersContract>;
/** Validates the user ID used to retrieve one public profile. */
declare const getSocialUserRequestSchema: z.ZodObject<{
    params: z.ZodObject<{
        userId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/** Validates the public profile returned for one user. */
declare const getSocialUserResponseSchema: z.ZodObject<{
    username: z.ZodString;
    profilePicPath: z.ZodNullable<z.ZodString>;
    userId: z.ZodString;
    fullName: z.ZodString;
}, z.core.$strip>;
/** Defines the get-social-user request and response. */
declare const getSocialUserContract: {
    request: z.ZodObject<{
        params: z.ZodObject<{
            userId: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    response: z.ZodObject<{
        username: z.ZodString;
        profilePicPath: z.ZodNullable<z.ZodString>;
        userId: z.ZodString;
        fullName: z.ZodString;
    }, z.core.$strip>;
};
/** Route parameters accepted by the get-social-user endpoint. */
type GetSocialUserParams = ParamsOf<typeof getSocialUserContract>;
/** Public profile returned by the get-social-user endpoint. */
type GetSocialUserResponse = ResponseOf<typeof getSocialUserContract>;

export { type AddCommentBody, type AddCommentParams, type AddCommentResponse, type AerobicTrackingRow, type AnalyzeVideoPayloadDto, type AnalyzeVideoResultPayloadDto, type AppleOAuthBody, type BodyOf, type Contract, type CreateAerobicEntryBody, type CreateAerobicEntryQuery, type CreateCrewBody, type CreateCrewResponse, type CreatePasswordResetRequestBody, type CreatePostBody, type CreatePostResponse, type CreateUserBody, type CreateUserResponse, type CreateVerificationEmailBody, type CreateVideoUploadUrlBody, type CreateVideoUploadUrlResponse, type CreateWebSocketTicketBody, type CreateWebSocketTicketResponse, type CreateWorkoutSessionBody, type CreateWorkoutSessionResponse, type DeleteAerobicEntryParams, type DeleteAerobicEntryQuery, type DeleteAerobicEntryResponse, type DeleteCommentParams, type DeleteCommentResponse, type DeleteCrewParams, type DeleteCrewProfilePictureParams, type DeleteCrewProfilePictureResponse, type DeleteCrewResponse, type DeleteMessageParams, type DeleteMessageResponse, type DeletePostParams, type DeletePostResponse, type DeleteProfilePictureBody, type DeleteReactionParams, type DeleteReactionResponse, type EditCommentBody, type EditCommentParams, type EditCommentResponse, type EnqueueAnalyzeVideoParamsDto, type ExerciseRow, type ExerciseToWorkoutSplitRow, type ExerciseTrackingRow, type GetAerobicHistoryQuery, type GetAerobicHistoryResponse, type GetCrewParams, type GetCrewResponse, type GetCurrentUserResponse, type GetExerciseHistoryQuery, type GetExerciseHistoryResponse, type GetPersonalRecordsQuery, type GetPersonalRecordsResponse, type GetReminderSettingsResponse, type GetSocialSummaryResponse, type GetSocialUserParams, type GetSocialUserResponse, type GetVerificationStatusQuery, type GetWorkoutHistoryQuery, type GetWorkoutHistoryResponse, type GetWorkoutPlanQuery, type GetWorkoutPlanResponse, type GetWorkoutSchedulesResponse, type GetWorkoutStatisticsResponse, type GoogleOAuthBody, type InviteCrewUserBody, type InviteCrewUserParams, type InviteCrewUserResponse, type LeaveCrewParams, type LeaveCrewResponse, type ListCrewInvitationsResponse, type ListCrewParticipantsParams, type ListCrewParticipantsQuery, type ListCrewParticipantsResponse, type ListCrewPostsParams, type ListCrewPostsQuery, type ListCrewPostsResponse, type ListCrewsQuery, type ListCrewsResponse, type ListExercisesResponse, type ListMessagesQuery, type ListMessagesResponse, type ListMyCrewsQuery, type ListMyCrewsResponse, type ListPendingCrewJoinRequestsParams, type ListPendingCrewJoinRequestsResponse, type ListPostCommentsParams, type ListPostCommentsQuery, type ListPostCommentsResponse, type ListPostReactionsParams, type ListPostReactionsQuery, type ListPostReactionsResponse, type ListVisiblePostsQuery, type ListVisiblePostsResponse, type LoginRequestBody, type LoginResponse, type LogoutResponse, type MarkMessageAsReadParams, type MarkMessageAsReadResponse, type MessageRow, type OAuthLoginResponse, type ParamsOf, type QueryOf, type ReactToPostBody, type ReactToPostParams, type ReactToPostResponse, type RefreshTokenResponse, type ReplaceCrewProfilePictureParams, type ReplaceCrewProfilePictureResponse, type ReplaceProfilePictureResponse, type ReplacePushTokenBody, type ReplaceWorkoutPlanBody, type ReplaceWorkoutPlanResponse, type ReplaceWorkoutSchedulesBody, type ReplaceWorkoutSchedulesResponse, type RequestOf, type RequestSchema, type RequestToJoinCrewParams, type RequestToJoinCrewResponse, type ResetPasswordBody, type ResetPasswordQuery, type ResetPasswordResponse, type ResponseOf, type SearchSocialUsersQuery, type SearchSocialUsersResponse, type SquatRepetitionDto, type UpdateAerobicEntryBody, type UpdateAerobicEntryParams, type UpdateAerobicEntryQuery, type UpdateAerobicEntryResponse, type UpdateCrewBody, type UpdateCrewParams, type UpdateCrewParticipationRequestStatusBody, type UpdateCrewParticipationRequestStatusParams, type UpdateCrewParticipationRequestStatusResponse, type UpdateCrewResponse, type UpdateCurrentUserBody, type UpdateCurrentUserResponse, type UpdatePostBody, type UpdatePostParams, type UpdatePostResponse, type UpdateReminderTimeZoneBody, type UpdateReminderTimeZoneResponse, type UpdateUnverifiedAccountEmailBody, type UpsertReminderSettingsBody, type UpsertReminderSettingsResponse, type UserDataResponse, type UserInsert, type UserRow, type VerifyEmailQuery, type WorkoutPlanRow, type WorkoutScheduleInputDto, type WorkoutScheduleQueryDto, type WorkoutSplitRow, type WorkoutSummaryRow, addCommentContract, addCommentRequestSchema, addCommentResponseSchema, aerobicTrackingDbSchema, analyzeVideoPayloadDtoSchema, analyzeVideoResultPayloadDtoSchema, appleOAuthContract, appleOAuthRequestSchema, commentDbSchema, createAerobicEntryContract, createAerobicEntryRequestSchema, createAerobicEntryResponseSchema, createCrewContract, createCrewRequestSchema, createCrewResponseSchema, createPasswordResetRequestContract, createPasswordResetRequestSchema, createPostContract, createPostRequestSchema, createPostResponseSchema, createUserContract, createUserRequestSchema, createUserResponseSchema, createUserUserSchema, createVerificationEmailContract, createVerificationEmailRequestSchema, createVideoUploadUrlContract, createVideoUploadUrlRequestSchema, createVideoUploadUrlResponseSchema, createWebSocketTicketContract, createWebSocketTicketRequestSchema, createWebSocketTicketResponseSchema, createWorkoutSessionContract, createWorkoutSessionRequestSchema, createWorkoutSessionResponseSchema, crewDbSchema, crewMembershipDbSchema, crewParticipationRequestDbSchema, deleteAerobicEntryContract, deleteAerobicEntryRequestSchema, deleteCommentContract, deleteCommentRequestSchema, deleteCommentResponseSchema, deleteCrewContract, deleteCrewProfilePictureContract, deleteCrewProfilePictureRequestSchema, deleteCrewRequestSchema, deleteCrewResponseSchema, deleteMessageContract, deleteMessageRequestSchema, deleteMessageResponseSchema, deletePostContract, deletePostRequestSchema, deletePostResponseSchema, deleteProfilePictureContract, deleteProfilePictureRequestSchema, deleteReactionContract, deleteReactionRequestSchema, deleteReactionResponseSchema, editCommentContract, editCommentRequestSchema, editCommentResponseSchema, enqueueAnalyzeVideoParamsDtoSchema, exerciseDbSchema, exerciseToWorkoutSplitDbSchema, exerciseToWorkoutSplitSetExpandedViewDbSchema, exerciseTrackingDbSchema, exerciseTrackingSetExpandedViewDbSchema, getAerobicHistoryContract, getAerobicHistoryRequestSchema, getAerobicHistoryResponseSchema, getCrewContract, getCrewRequestSchema, getCrewResponseSchema, getCurrentUserContract, getCurrentUserResponseSchema, getExerciseHistoryContract, getExerciseHistoryRequestSchema, getExerciseHistoryResponseSchema, getPersonalRecordsContract, getPersonalRecordsRequestSchema, getPersonalRecordsResponseSchema, getReminderSettingsContract, getReminderSettingsResponseSchema, getSocialSummaryContract, getSocialSummaryResponseSchema, getSocialUserContract, getSocialUserRequestSchema, getSocialUserResponseSchema, getVerificationStatusContract, getVerificationStatusRequestSchema, getWorkoutHistoryContract, getWorkoutHistoryRequestSchema, getWorkoutHistoryResponseSchema, getWorkoutPlanContract, getWorkoutPlanRequestSchema, getWorkoutPlanResponseSchema, getWorkoutSchedulesContract, getWorkoutSchedulesResponseSchema, getWorkoutStatisticsContract, getWorkoutStatisticsResponseSchema, googleOAuthContract, googleOAuthRequestSchema, inviteCrewUserContract, inviteCrewUserRequestSchema, leaveCrewContract, leaveCrewRequestSchema, leaveCrewResponseSchema, listCrewInvitationsContract, listCrewInvitationsRequestSchema, listCrewInvitationsResponseSchema, listCrewParticipantsContract, listCrewParticipantsRequestSchema, listCrewParticipantsResponseSchema, listCrewPostsContract, listCrewPostsRequestSchema, listCrewPostsResponseSchema, listCrewsContract, listCrewsRequestSchema, listCrewsResponseSchema, listExercisesContract, listExercisesResponseSchema, listMessagesContract, listMessagesRequestSchema, listMessagesResponseSchema, listMyCrewsContract, listMyCrewsRequestSchema, listMyCrewsResponseSchema, listPendingCrewJoinRequestsContract, listPendingCrewJoinRequestsRequestSchema, listPendingCrewJoinRequestsResponseSchema, listPostCommentsContract, listPostCommentsRequestSchema, listPostCommentsResponseSchema, listPostReactionsContract, listPostReactionsRequestSchema, listPostReactionsResponseSchema, listVisiblePostsContract, listVisiblePostsRequestSchema, listVisiblePostsResponseSchema, loginContract, loginRequestSchema, loginResponseSchema, logoutContract, logoutResponseSchema, markMessageAsReadContract, markMessageAsReadRequestSchema, markMessageAsReadResponseSchema, messageDbSchema, oAuthLoginContract, oAuthLoginResponseSchema, oauthAccountDbSchema, postDbSchema, proceedLoginResponseSchema, prsViewDbSchema, reactToPostContract, reactToPostRequestSchema, reactToPostResponseSchema, reactionDbSchema, refreshTokenContract, refreshTokenResponseSchema, replaceCrewProfilePictureContract, replaceCrewProfilePictureRequestSchema, replaceCrewProfilePictureResponseSchema, replaceProfilePictureContract, replaceProfilePictureResponseSchema, replacePushTokenContract, replacePushTokenRequestSchema, replaceWorkoutPlanContract, replaceWorkoutPlanRequestSchema, replaceWorkoutPlanResponseSchema, replaceWorkoutSchedulesContract, replaceWorkoutSchedulesRequestSchema, requestToJoinCrewContract, requestToJoinCrewRequestSchema, resetPasswordContract, resetPasswordRequestSchema, resetPasswordResponseSchema, searchSocialUsersContract, searchSocialUsersRequestSchema, searchSocialUsersResponseSchema, serializedDateSchema, socialSummaryParticipantPreviewSchema, squatRepetitionDtoSchema, timezoneSchema, trackingSetDbSchema, updateAerobicEntryContract, updateAerobicEntryRequestSchema, updateCrewContract, updateCrewParticipationRequestStatusContract, updateCrewParticipationRequestStatusRequestSchema, updateCrewRequestSchema, updateCrewResponseSchema, updateCurrentUserContract, updateCurrentUserRequestSchema, updateCurrentUserResponseSchema, updatePostContract, updatePostRequestSchema, updatePostResponseSchema, updateReminderTimeZoneContract, updateReminderTimeZoneRequestSchema, updateUnverifiedAccountEmailContract, updateUnverifiedAccountEmailRequestSchema, upsertReminderSettingsContract, upsertReminderSettingsRequestSchema, userDataContract, userDataResponseSchema, userDbSchema, userInsertDbSchema, userReminderSettingDbSchema, userUpdateDbSchema, verifyEmailContract, verifyEmailRequestSchema, workoutPlanDbSchema, workoutScheduleDbSchema, workoutScheduleInputDtoSchema, workoutScheduleQueryDtoSchema, workoutSetDbSchema, workoutSplitDbSchema, workoutSummaryDbSchema };
