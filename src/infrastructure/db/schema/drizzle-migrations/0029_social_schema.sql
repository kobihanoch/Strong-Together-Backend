CREATE SCHEMA "social";

--> statement-breakpoint
CREATE TYPE "social"."Crew Membership Role" AS ENUM('leader', 'admin', 'member');

--> statement-breakpoint
CREATE TYPE "social"."Crew Membership Status" AS ENUM('active', 'left', 'removed', 'banned');

--> statement-breakpoint
CREATE TYPE "social"."Crew Participation Request Status" AS ENUM('pending', 'accepted', 'declined', 'cancelled', 'expired');

--> statement-breakpoint
CREATE TYPE "social"."Crew Privacy" AS ENUM('public', 'private');

--> statement-breakpoint
CREATE TYPE "social"."Post Visibility" AS ENUM('crews_only', 'public');

--> statement-breakpoint
CREATE TYPE "social"."Reaction Type" AS ENUM('like', 'fire up', 'muscle');

--> statement-breakpoint
CREATE TABLE "social"."comment" (
  "id" UUID DEFAULT GEN_RANDOM_UUID() NOT NULL,
  "post_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

--> statement-breakpoint
ALTER TABLE "social"."comment" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint
CREATE TABLE "social"."crew_membership" (
  "id" UUID DEFAULT GEN_RANDOM_UUID() NOT NULL,
  "crew_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "status" "social"."Crew Membership Status" DEFAULT 'active' NOT NULL,
  "role" "social"."Crew Membership Role" DEFAULT 'member' NOT NULL,
  "joined_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT "crew_membership_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "crew_membership_crew_user_unique" UNIQUE ("crew_id", "user_id")
);

--> statement-breakpoint
ALTER TABLE "social"."crew_membership" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint
CREATE TABLE "social"."crew_participation_request" (
  "id" UUID DEFAULT GEN_RANDOM_UUID() NOT NULL,
  "crew_id" UUID NOT NULL,
  "initiator_user_id" UUID NOT NULL,
  "participant_user_id" UUID NOT NULL,
  "status" "social"."Crew Participation Request Status" DEFAULT 'pending' NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "responded_at" TIMESTAMP WITH TIME ZONE,
  CONSTRAINT "crew_participation_request_pkey" PRIMARY KEY ("id")
);

--> statement-breakpoint
ALTER TABLE "social"."crew_participation_request" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint
CREATE TABLE "social"."crew_shared_post" (
  "id" UUID DEFAULT GEN_RANDOM_UUID() NOT NULL,
  "crew_id" UUID NOT NULL,
  "post_id" UUID NOT NULL,
  CONSTRAINT "crew_shared_post_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "crew_shared_post_post_id_crew_id_unique" UNIQUE ("post_id", "crew_id")
);

--> statement-breakpoint
ALTER TABLE "social"."crew_shared_post" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint
CREATE TABLE "social"."crew" (
  "id" UUID DEFAULT GEN_RANDOM_UUID() NOT NULL,
  "leader_id" UUID NOT NULL,
  "privacy" "social"."Crew Privacy" NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT "crew_pkey" PRIMARY KEY ("id")
);

--> statement-breakpoint
ALTER TABLE "social"."crew" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint
CREATE TABLE "social"."post" (
  "id" UUID DEFAULT GEN_RANDOM_UUID() NOT NULL,
  "author_user_id" UUID NOT NULL,
  "content" TEXT NOT NULL,
  "visibility" "social"."Post Visibility" NOT NULL,
  "published_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

--> statement-breakpoint
ALTER TABLE "social"."post" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint
CREATE TABLE "social"."reaction" (
  "id" UUID DEFAULT GEN_RANDOM_UUID() NOT NULL,
  "post_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "type" "social"."Reaction Type" NOT NULL,
  "reacted_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT "reaction_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "reaction_post_user_unique" UNIQUE ("post_id", "user_id")
);

--> statement-breakpoint
ALTER TABLE "social"."reaction" ENABLE ROW LEVEL SECURITY;

--> statement-breakpoint
ALTER TABLE "social"."comment"
ADD CONSTRAINT "comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "social"."post" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "social"."comment"
ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "social"."crew_membership"
ADD CONSTRAINT "crew_membership_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "social"."crew" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "social"."crew_membership"
ADD CONSTRAINT "crew_membership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "social"."crew_participation_request"
ADD CONSTRAINT "crew_participation_request_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "social"."crew" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "social"."crew_participation_request"
ADD CONSTRAINT "crew_participation_request_initiator_fkey" FOREIGN KEY ("initiator_user_id") REFERENCES "identity"."user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "social"."crew_participation_request"
ADD CONSTRAINT "crew_participation_request_participant_fkey" FOREIGN KEY ("participant_user_id") REFERENCES "identity"."user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "social"."crew_shared_post"
ADD CONSTRAINT "crew_shared_post_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "social"."crew" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "social"."crew_shared_post"
ADD CONSTRAINT "crew_shared_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "social"."post" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "social"."crew"
ADD CONSTRAINT "crew_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "identity"."user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "social"."post"
ADD CONSTRAINT "post_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "identity"."user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "social"."reaction"
ADD CONSTRAINT "reaction_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "social"."post" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "social"."reaction"
ADD CONSTRAINT "reaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
CREATE INDEX "comment_post_created_at_idx" ON "social"."comment" USING btree ("post_id", "created_at");

--> statement-breakpoint
CREATE INDEX "comment_user_id_idx" ON "social"."comment" USING btree ("user_id");

--> statement-breakpoint
CREATE INDEX "crew_membership_user_id_idx" ON "social"."crew_membership" USING btree ("user_id");

--> statement-breakpoint
CREATE INDEX "crew_membership_crew_status_idx" ON "social"."crew_membership" USING btree ("crew_id", "status");

--> statement-breakpoint
CREATE UNIQUE INDEX "crew_participation_request_pending_participant_unique" ON "social"."crew_participation_request" USING btree ("crew_id", "participant_user_id")
WHERE
  "social"."crew_participation_request"."status" = 'pending';

--> statement-breakpoint
CREATE INDEX "crew_participation_request_crew_id_idx" ON "social"."crew_participation_request" USING btree ("crew_id");

--> statement-breakpoint
CREATE INDEX "crew_participation_request_participant_idx" ON "social"."crew_participation_request" USING btree ("participant_user_id");

--> statement-breakpoint
CREATE INDEX "crew_shared_post_crew_id_idx" ON "social"."crew_shared_post" USING btree ("crew_id");

--> statement-breakpoint
CREATE INDEX "post_author_user_id_idx" ON "social"."post" USING btree ("author_user_id");

--> statement-breakpoint
CREATE INDEX "post_published_at_idx" ON "social"."post" USING btree ("published_at");

--> statement-breakpoint
CREATE INDEX "reaction_user_id_idx" ON "social"."reaction" USING btree ("user_id");

--> statement-breakpoint
--> statement-breakpoint
REVOKE ALL ON SCHEMA "social"
FROM
  PUBLIC,
  "anon",
  "app_user",
  "guest",
  "authenticated",
  "app_runtime_user";

--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA "social"
FROM
  PUBLIC,
  "anon",
  "app_user",
  "guest",
  "authenticated",
  "app_runtime_user";

--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA "social"
FROM
  PUBLIC,
  "anon",
  "app_user",
  "guest",
  "authenticated",
  "app_runtime_user";

--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TYPE "social"."Crew Membership Role",
"social"."Crew Membership Status",
"social"."Crew Participation Request Status",
"social"."Crew Privacy",
"social"."Reaction Type"
FROM
  PUBLIC,
  "anon",
  "app_user",
  "guest",
  "authenticated",
  "app_runtime_user";

--> statement-breakpoint
GRANT USAGE ON SCHEMA "social" TO "authenticated";

--> statement-breakpoint
GRANT USAGE ON TYPE "social"."Crew Membership Role",
"social"."Crew Membership Status",
"social"."Crew Participation Request Status",
"social"."Crew Privacy",
"social"."Reaction Type" TO "authenticated";

--> statement-breakpoint
-- RLS determines which rows may be accessed. Column-scoped UPDATE grants keep
-- identity, ownership, placement, and publication columns immutable.
GRANT
SELECT
,
  INSERT,
  DELETE ON TABLE "social"."comment",
  "social"."crew_membership",
  "social"."crew_participation_request",
  "social"."crew_shared_post",
  "social"."crew",
  "social"."post",
  "social"."reaction" TO "authenticated";

--> statement-breakpoint
GRANT
UPDATE ("content", "updated_at") ON TABLE "social"."comment" TO "authenticated";

--> statement-breakpoint
GRANT
UPDATE ("status", "role", "updated_at") ON TABLE "social"."crew_membership" TO "authenticated";

--> statement-breakpoint
GRANT
UPDATE ("status", "updated_at", "responded_at") ON TABLE "social"."crew_participation_request" TO "authenticated";

--> statement-breakpoint
GRANT
UPDATE ("privacy", "updated_at") ON TABLE "social"."crew" TO "authenticated";

--> statement-breakpoint
GRANT
UPDATE ("content", "updated_at") ON TABLE "social"."post" TO "authenticated";

--> statement-breakpoint
GRANT
UPDATE ("type") ON TABLE "social"."reaction" TO "authenticated";

--> statement-breakpoint
-- Future objects receive no implicit application privileges; each migration
-- must grant only what its new objects require.
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "social"
REVOKE ALL ON TABLES
FROM
  PUBLIC,
  "authenticated";

--> statement-breakpoint
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "social"
REVOKE ALL ON SEQUENCES
FROM
  PUBLIC,
  "authenticated";

--> statement-breakpoint
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "social"
REVOKE ALL ON FUNCTIONS
FROM
  PUBLIC,
  "authenticated";

--> statement-breakpoint
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "social"
REVOKE ALL ON TYPES
FROM
  PUBLIC,
  "authenticated";

--> statement-breakpoint
-- The application role needs enum usage to insert visibility values.
GRANT USAGE ON TYPE "social"."Post Visibility" TO "authenticated";

--> statement-breakpoint
-- The update policy limits this column to the current active leader and keeps
-- the caller active until the leadership transfer is complete.
GRANT
UPDATE ("leader_id") ON TABLE "social"."crew" TO "authenticated";

--> statement-breakpoint
-- Reaction upserts refresh the reaction timestamp together with its type.
GRANT
UPDATE ("reacted_at") ON TABLE "social"."reaction" TO "authenticated";
