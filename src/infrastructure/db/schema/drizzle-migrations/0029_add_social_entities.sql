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
  CONSTRAINT "crew_shared_post_post_id_unique" UNIQUE ("post_id")
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
CREATE POLICY "Allow users to read comments on visible posts" ON "social"."comment" AS PERMISSIVE FOR
SELECT
  TO "authenticated" USING (
    EXISTS (
      SELECT
        1
      FROM
        "social"."post" p
      WHERE
        p."id" = "social"."comment"."post_id"
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow users to create their own comments on visible posts" ON "social"."comment" AS PERMISSIVE FOR INSERT TO "authenticated"
WITH
  CHECK (
    "social"."comment"."user_id" = "identity"."current_user_id" ()
    AND EXISTS (
      SELECT
        1
      FROM
        "social"."post" p
      WHERE
        p."id" = "social"."comment"."post_id"
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow authors to update their comments on visible posts" ON "social"."comment" AS PERMISSIVE
FOR UPDATE
  TO "authenticated" USING (
    "social"."comment"."user_id" = "identity"."current_user_id" ()
  )
WITH
  CHECK (
    "social"."comment"."user_id" = "identity"."current_user_id" ()
    AND EXISTS (
      SELECT
        1
      FROM
        "social"."post" p
      WHERE
        p."id" = "social"."comment"."post_id"
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow authors to delete their comments" ON "social"."comment" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
  "social"."comment"."user_id" = "identity"."current_user_id" ()
);

--> statement-breakpoint
CREATE POLICY "Allow members and crew leaders to read memberships" ON "social"."crew_membership" AS PERMISSIVE FOR
SELECT
  TO "authenticated" USING (
    "social"."crew_membership"."user_id" = "identity"."current_user_id" ()
    OR EXISTS (
      SELECT
        1
      FROM
        "social"."crew" c
      WHERE
        c."id" = "social"."crew_membership"."crew_id"
        AND c."leader_id" = "identity"."current_user_id" ()
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow crew leaders to create memberships" ON "social"."crew_membership" AS PERMISSIVE FOR INSERT TO "authenticated"
WITH
  CHECK (
    EXISTS (
      SELECT
        1
      FROM
        "social"."crew" c
      WHERE
        c."id" = "social"."crew_membership"."crew_id"
        AND c."leader_id" = "identity"."current_user_id" ()
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow crew leaders to update memberships" ON "social"."crew_membership" AS PERMISSIVE
FOR UPDATE
  TO "authenticated" USING (
    EXISTS (
      SELECT
        1
      FROM
        "social"."crew" c
      WHERE
        c."id" = "social"."crew_membership"."crew_id"
        AND c."leader_id" = "identity"."current_user_id" ()
    )
  )
WITH
  CHECK (
    EXISTS (
      SELECT
        1
      FROM
        "social"."crew" c
      WHERE
        c."id" = "social"."crew_membership"."crew_id"
        AND c."leader_id" = "identity"."current_user_id" ()
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow members and crew leaders to delete memberships" ON "social"."crew_membership" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
  "social"."crew_membership"."user_id" = "identity"."current_user_id" ()
  OR EXISTS (
    SELECT
      1
    FROM
      "social"."crew" c
    WHERE
      c."id" = "social"."crew_membership"."crew_id"
      AND c."leader_id" = "identity"."current_user_id" ()
  )
);

--> statement-breakpoint
CREATE POLICY "Allow involved users and leaders to read crew requests" ON "social"."crew_participation_request" AS PERMISSIVE FOR
SELECT
  TO "authenticated" USING (
    "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
    OR "social"."crew_participation_request"."participant_user_id" = "identity"."current_user_id" ()
    OR EXISTS (
      SELECT
        1
      FROM
        "social"."crew" c
      WHERE
        c."id" = "social"."crew_participation_request"."crew_id"
        AND c."leader_id" = "identity"."current_user_id" ()
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow users to request public crews and leaders to invite users" ON "social"."crew_participation_request" AS PERMISSIVE FOR INSERT TO "authenticated"
WITH
  CHECK (
    "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
    AND "social"."crew_participation_request"."status" = 'pending'
    AND (
      (
        "social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id"
        AND EXISTS (
          SELECT
            1
          FROM
            "social"."crew" c
          WHERE
            c."id" = "social"."crew_participation_request"."crew_id"
            AND c."privacy" = 'public'
        )
      )
      OR EXISTS (
        SELECT
          1
        FROM
          "social"."crew" c
        WHERE
          c."id" = "social"."crew_participation_request"."crew_id"
          AND c."leader_id" = "social"."crew_participation_request"."initiator_user_id"
      )
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow authorized users to resolve pending crew requests" ON "social"."crew_participation_request" AS PERMISSIVE
FOR UPDATE
  TO "authenticated" USING (
    (
      ("social"."crew_participation_request"."status" = 'pending')
      AND (
        (
          (
            (
              (
                (
                  "social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id"
                )
              )
              AND (
                EXISTS (
                  SELECT
                    1
                  FROM
                    "social"."crew" c
                  WHERE
                    c."id" = "social"."crew_participation_request"."crew_id"
                    AND c."leader_id" = "identity"."current_user_id" ()
                )
              )
            )
            OR (
              (
                (
                  "social"."crew_participation_request"."initiator_user_id" <> "social"."crew_participation_request"."participant_user_id"
                )
              )
              AND (
                "social"."crew_participation_request"."participant_user_id" = "identity"."current_user_id" ()
              )
            )
          )
        )
        OR (
          (
            "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
          )
        )
      )
    )
  )
WITH
  CHECK (
    (
      (
        (
          (
            (
              "social"."crew_participation_request"."status" = 'cancelled'
            )
            AND (
              (
                "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
              )
            )
          )
          OR (
            (
              "social"."crew_participation_request"."status" IN ('accepted', 'declined')
            )
            AND (
              (
                (
                  (
                    (
                      "social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id"
                    )
                  )
                  AND (
                    EXISTS (
                      SELECT
                        1
                      FROM
                        "social"."crew" c
                      WHERE
                        c."id" = "social"."crew_participation_request"."crew_id"
                        AND c."leader_id" = "identity"."current_user_id" ()
                    )
                  )
                )
                OR (
                  (
                    (
                      "social"."crew_participation_request"."initiator_user_id" <> "social"."crew_participation_request"."participant_user_id"
                    )
                  )
                  AND (
                    "social"."crew_participation_request"."participant_user_id" = "identity"."current_user_id" ()
                  )
                )
              )
            )
          )
        )
      )
      AND (
        "social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id"
        OR EXISTS (
          SELECT
            1
          FROM
            "social"."crew" c
          WHERE
            c."id" = "social"."crew_participation_request"."crew_id"
            AND c."leader_id" = "social"."crew_participation_request"."initiator_user_id"
        )
      )
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow initiators to delete participation requests" ON "social"."crew_participation_request" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
  "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
);

--> statement-breakpoint
CREATE POLICY "Allow authenticated users to read crew post placements" ON "social"."crew_shared_post" AS PERMISSIVE FOR
SELECT
  TO "authenticated" USING (TRUE);

--> statement-breakpoint
CREATE POLICY "Allow member authors to share posts with crews" ON "social"."crew_shared_post" AS PERMISSIVE FOR INSERT TO "authenticated"
WITH
  CHECK (
    EXISTS (
      SELECT
        1
      FROM
        "social"."crew" c
        LEFT JOIN "social"."crew_membership" cm ON cm."crew_id" = c."id"
        AND cm."user_id" = "identity"."current_user_id" ()
        AND cm."status" = 'active'
      WHERE
        c."id" = "social"."crew_shared_post"."crew_id"
        AND (
          c."leader_id" = "identity"."current_user_id" ()
          OR cm."id" IS NOT NULL
        )
    )
    AND EXISTS (
      SELECT
        1
      FROM
        "social"."post" p
      WHERE
        p."id" = "social"."crew_shared_post"."post_id"
        AND p."author_user_id" = "identity"."current_user_id" ()
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow member authors to remove posts from crews" ON "social"."crew_shared_post" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
  EXISTS (
    SELECT
      1
    FROM
      "social"."crew" c
      LEFT JOIN "social"."crew_membership" cm ON cm."crew_id" = c."id"
      AND cm."user_id" = "identity"."current_user_id" ()
      AND cm."status" = 'active'
    WHERE
      c."id" = "social"."crew_shared_post"."crew_id"
      AND (
        c."leader_id" = "identity"."current_user_id" ()
        OR cm."id" IS NOT NULL
      )
  )
  AND EXISTS (
    SELECT
      1
    FROM
      "social"."post" p
    WHERE
      p."id" = "social"."crew_shared_post"."post_id"
      AND p."author_user_id" = "identity"."current_user_id" ()
  )
);

--> statement-breakpoint
CREATE POLICY "Allow authenticated users to read crews" ON "social"."crew" AS PERMISSIVE FOR
SELECT
  TO "authenticated" USING (TRUE);

--> statement-breakpoint
CREATE POLICY "Allow users to create crews they lead" ON "social"."crew" AS PERMISSIVE FOR INSERT TO "authenticated"
WITH
  CHECK (
    "social"."crew"."leader_id" = "identity"."current_user_id" ()
  );

--> statement-breakpoint
CREATE POLICY "Allow crew leaders to update their crews" ON "social"."crew" AS PERMISSIVE
FOR UPDATE
  TO "authenticated" USING (
    "social"."crew"."leader_id" = "identity"."current_user_id" ()
  )
WITH
  CHECK (
    "social"."crew"."leader_id" = "identity"."current_user_id" ()
  );

--> statement-breakpoint
CREATE POLICY "Allow crew leaders to delete their crews" ON "social"."crew" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
  "social"."crew"."leader_id" = "identity"."current_user_id" ()
);

--> statement-breakpoint
CREATE POLICY "Allow users to read global or accessible crew posts" ON "social"."post" AS PERMISSIVE FOR
SELECT
  TO "authenticated" USING (
    "social"."post"."author_user_id" = "identity"."current_user_id" ()
    OR NOT EXISTS (
      SELECT
        1
      FROM
        "social"."crew_shared_post" csp
      WHERE
        csp."post_id" = "social"."post"."id"
    )
    OR EXISTS (
      SELECT
        1
      FROM
        "social"."crew_shared_post" csp
        JOIN "social"."crew" c ON c."id" = csp."crew_id"
        LEFT JOIN "social"."crew_membership" cm ON cm."crew_id" = c."id"
        AND cm."user_id" = "identity"."current_user_id" ()
        AND cm."status" = 'active'
      WHERE
        csp."post_id" = "social"."post"."id"
        AND (
          c."leader_id" = "identity"."current_user_id" ()
          OR cm."id" IS NOT NULL
        )
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow users to create their own posts" ON "social"."post" AS PERMISSIVE FOR INSERT TO "authenticated"
WITH
  CHECK (
    "social"."post"."author_user_id" = "identity"."current_user_id" ()
  );

--> statement-breakpoint
CREATE POLICY "Allow authors to update their posts" ON "social"."post" AS PERMISSIVE
FOR UPDATE
  TO "authenticated" USING (
    "social"."post"."author_user_id" = "identity"."current_user_id" ()
  )
WITH
  CHECK (
    "social"."post"."author_user_id" = "identity"."current_user_id" ()
  );

--> statement-breakpoint
CREATE POLICY "Allow authors to delete their posts" ON "social"."post" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
  "social"."post"."author_user_id" = "identity"."current_user_id" ()
);

--> statement-breakpoint
CREATE POLICY "Allow users to read reactions on visible posts" ON "social"."reaction" AS PERMISSIVE FOR
SELECT
  TO "authenticated" USING (
    EXISTS (
      SELECT
        1
      FROM
        "social"."post" p
      WHERE
        p."id" = "social"."reaction"."post_id"
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow users to create their own reactions on visible posts" ON "social"."reaction" AS PERMISSIVE FOR INSERT TO "authenticated"
WITH
  CHECK (
    "social"."reaction"."user_id" = "identity"."current_user_id" ()
    AND EXISTS (
      SELECT
        1
      FROM
        "social"."post" p
      WHERE
        p."id" = "social"."reaction"."post_id"
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow users to update their reactions on visible posts" ON "social"."reaction" AS PERMISSIVE
FOR UPDATE
  TO "authenticated" USING (
    "social"."reaction"."user_id" = "identity"."current_user_id" ()
  )
WITH
  CHECK (
    "social"."reaction"."user_id" = "identity"."current_user_id" ()
    AND EXISTS (
      SELECT
        1
      FROM
        "social"."post" p
      WHERE
        p."id" = "social"."reaction"."post_id"
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow users to delete their own reactions" ON "social"."reaction" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
  "social"."reaction"."user_id" = "identity"."current_user_id" ()
);

--> statement-breakpoint
-- Keep the social schema private by default. Application access is granted only
-- through the authenticated role and remains constrained by the RLS policies above.
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
