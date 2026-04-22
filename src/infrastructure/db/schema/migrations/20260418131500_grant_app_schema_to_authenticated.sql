GRANT USAGE ON SCHEMA app TO authenticated;

GRANT EXECUTE ON FUNCTION app.current_user_id() TO authenticated;
