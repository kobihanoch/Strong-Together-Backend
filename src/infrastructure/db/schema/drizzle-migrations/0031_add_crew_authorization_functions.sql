-- Returns whether the referenced crew is public.
CREATE FUNCTION "social"."is_crew_public"("crew_id_in" UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = pg_catalog
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM social.crew c
    WHERE c.id = crew_id_in
      AND c.privacy = 'public'
  )
$function$;

--> statement-breakpoint
-- Returns whether the current application user leads the referenced crew.
CREATE FUNCTION "social"."is_crew_leader"("crew_id_in" UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = pg_catalog
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM social.crew c
    WHERE c.id = crew_id_in
      AND c.leader_id = identity.current_user_id()
  )
$function$;

--> statement-breakpoint
-- SECURITY DEFINER avoids recursive RLS evaluation when this helper is called
-- from a policy on social.crew_membership itself.
CREATE FUNCTION "social"."is_active_crew_member"("crew_id_in" UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM social.crew_membership cm
    WHERE cm.crew_id = crew_id_in
      AND cm.user_id = identity.current_user_id()
      AND cm.status = 'active'
  )
$function$;

--> statement-breakpoint
-- PostgreSQL functions use EXECUTE rather than USAGE privileges.
REVOKE ALL ON FUNCTION "social"."is_crew_public"(UUID) FROM PUBLIC;

--> statement-breakpoint
REVOKE ALL ON FUNCTION "social"."is_crew_leader"(UUID) FROM PUBLIC;

--> statement-breakpoint
REVOKE ALL ON FUNCTION "social"."is_active_crew_member"(UUID) FROM PUBLIC;

--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "social"."is_crew_public"(UUID) TO "authenticated";

--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "social"."is_crew_leader"(UUID) TO "authenticated";

--> statement-breakpoint
GRANT EXECUTE ON FUNCTION "social"."is_active_crew_member"(UUID) TO "authenticated";
