env "local" {
  url = "postgresql://postgres:postgres@localhost:5434/strongtogether_dev?sslmode=disable"
  dev = "docker://postgres/16/dev"

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
