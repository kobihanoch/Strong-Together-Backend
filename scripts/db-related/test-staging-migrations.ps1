$ErrorActionPreference = 'Stop'

Get-Content .env.staging | ForEach-Object {
  if ($_ -match '^\s*([^#][^=]+?)\s*=\s*(.*)$') { Set-Item "env:$($matches[1])" $matches[2].Trim().Trim('"').Trim("'") }
}
if (!$env:PROD_DATABASE_URL -or !$env:STAGING_DATABASE_URL) { throw 'Missing database URL in .env.staging' }
if ($env:PROD_DATABASE_URL -eq $env:STAGING_DATABASE_URL) { throw 'Production and staging URLs are identical' }
$stagingUri = [Uri]$env:STAGING_DATABASE_URL
if ($stagingUri.Host -like '*.pooler.supabase.com' -and $stagingUri.UserInfo.Split(':')[0] -eq 'postgres') {
  throw 'Invalid staging pooler URL: username must be postgres.<PROJECT_REF>. Copy the Session pooler URL from Supabase Dashboard > Connect.'
}
$credentials = $stagingUri.UserInfo.Split(':', 2)
$env:PGHOST = $stagingUri.Host
$env:PGPORT = $stagingUri.Port
$env:PGUSER = [Uri]::UnescapeDataString($credentials[0])
$env:PGPASSWORD = [Uri]::UnescapeDataString($credentials[1])
$env:PGDATABASE = $stagingUri.AbsolutePath.Trim('/')
$env:PGSSLMODE = 'require'

$dump = (New-Item -ItemType Directory -Force '.tmp/staging-snapshot').FullName
$appSchemas = 'public,analytics,identity,messages,reminders,tracking,workout'
npx --yes supabase db dump --db-url $env:PROD_DATABASE_URL -f "$dump/roles.sql" --role-only
if ($LASTEXITCODE) { throw 'Role dump failed' }
# Supabase staging already contains this application role. Make its creation
# idempotent while retaining the dumped role attributes that follow it.
$rolesSql = Get-Content "$dump/roles.sql" -Raw
$rolesSql = $rolesSql.Replace(
  'CREATE ROLE "app_user";',
  'DO $role$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = ''app_user'') THEN CREATE ROLE "app_user"; END IF; END $role$;'
)
Set-Content "$dump/roles.sql" $rolesSql -NoNewline
npx --yes supabase db dump --db-url $env:PROD_DATABASE_URL -f "$dump/schema.sql" --schema $appSchemas
if ($LASTEXITCODE) { throw 'Schema dump failed' }
npx --yes supabase db dump --db-url $env:PROD_DATABASE_URL -f "$dump/data.sql" --use-copy --data-only --schema $appSchemas
if ($LASTEXITCODE) { throw 'Data dump failed' }

# Remove the previous application snapshot, but preserve Supabase-managed schemas
# such as auth, storage, extensions, realtime, and vault.
$resetSql = @'
DROP SCHEMA IF EXISTS analytics CASCADE;
DROP SCHEMA IF EXISTS identity CASCADE;
DROP SCHEMA IF EXISTS messages CASCADE;
DROP SCHEMA IF EXISTS reminders CASCADE;
DROP SCHEMA IF EXISTS tracking CASCADE;
DROP SCHEMA IF EXISTS workout CASCADE;
DROP SCHEMA IF EXISTS drizzle CASCADE;
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
'@
$resetSql | docker run --rm -i --env PGHOST --env PGPORT --env PGUSER --env PGPASSWORD --env PGDATABASE --env PGSSLMODE public.ecr.aws/supabase/postgres:17.6.1.159 psql --variable ON_ERROR_STOP=1
if ($LASTEXITCODE) { throw 'Failed to reset staging application schemas' }

docker run --rm --volume "${dump}:/dump:ro" --env PGHOST --env PGPORT --env PGUSER --env PGPASSWORD --env PGDATABASE --env PGSSLMODE public.ecr.aws/supabase/postgres:17.6.1.159 psql --single-transaction --variable ON_ERROR_STOP=1 --file /dump/roles.sql --file /dump/schema.sql --command 'SET session_replication_role = replica' --file /dump/data.sql
if ($LASTEXITCODE) { throw 'Staging restore failed' }

# The restored production snapshot is the state represented by 0000_baseline.
# Record only that migration so Drizzle starts execution at 0001.
$baseline = (Get-Content 'src/infrastructure/db/schema/drizzle-migrations/meta/_journal.json' -Raw | ConvertFrom-Json).entries | Where-Object { $_.idx -eq 0 }
if (!$baseline) { throw 'Migration journal has no baseline (idx 0)' }
$baselineHash = (Get-FileHash 'src/infrastructure/db/schema/drizzle-migrations/0000_baseline.sql' -Algorithm SHA256).Hash.ToLowerInvariant()
$baselineSql = @"
CREATE SCHEMA IF NOT EXISTS drizzle;
CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
  id SERIAL PRIMARY KEY,
  hash text NOT NULL,
  created_at bigint
);
TRUNCATE TABLE drizzle.__drizzle_migrations RESTART IDENTITY;
INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ('$baselineHash', $($baseline.when));
"@
$baselineSql | docker run --rm -i --env PGHOST --env PGPORT --env PGUSER --env PGPASSWORD --env PGDATABASE --env PGSSLMODE public.ecr.aws/supabase/postgres:17.6.1.159 psql --variable ON_ERROR_STOP=1
if ($LASTEXITCODE) { throw 'Failed to mark baseline migration as applied' }

npx drizzle-kit migrate --config=drizzle.staging.config.ts
if ($LASTEXITCODE) { throw 'Staging migrations failed' }
