env "local" {
  url = "postgresql://postgres:postgres@postgres_dev:5432/strongtogether_dev?sslmode=disable"
  dev = "postgresql://postgres:postgres@postgres_dev:5432/postgres?sslmode=disable"

  // Ignore Atlas's own revision schema when inspecting the desired database state.
  exclude = [
    "atlas_schema_revisions",
    "atlas_schema_revisions.*",
  ]

  migration {
    dir = "file://src/infrastructure/db/schema/migrations"
    revisions_schema = "atlas_schema_revisions"
  }
}
