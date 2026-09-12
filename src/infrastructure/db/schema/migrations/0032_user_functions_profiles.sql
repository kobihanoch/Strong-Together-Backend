CREATE OR REPLACE FUNCTION identity.get_user_profile (user_id_in UUID) RETURNS TABLE (
  "userId" UUID,
  "username" TEXT,
  "name" TEXT,
  "profilePicPath" TEXT
) LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path = pg_catalog,
  identity,
  pg_temp AS $function$
  SELECT 
    u.id AS "userId", 
    u.username AS "username", 
    u.name AS "name", 
    u.profile_pic_path AS "profilePicPath"
  FROM identity."user" u
  WHERE u.id = user_id_in
  LIMIT 1;
$function$;

REVOKE ALL ON FUNCTION identity.get_user_profile (UUID)
FROM
  PUBLIC;

GRANT
EXECUTE ON FUNCTION identity.get_user_profile (UUID) TO authenticated;
