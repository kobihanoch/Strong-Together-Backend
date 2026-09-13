# Social Module And Authorization

## Scope And Security Model

The social module stores crews, memberships, participation requests, posts, crew placements, comments, and reactions in the PostgreSQL `social` schema. Every HTTP route requires a DPoP-authenticated application user and executes inside an RLS-aware transaction. PostgreSQL row-level security is the final authorization boundary.

In this document:

- **Authenticated user** means a signed-in user with no active membership in the relevant crew.
- **Crew member** means a user whose membership has `status = 'active'`; this includes active admins where a policy checks crew access.
- **Leader** means the crew's `leader_id` user who also has an active membership. Merely remaining in `leader_id` without an active membership does not grant management access.
- **Author** means the user referenced by a post or comment's author column.

All social tables have RLS enabled. Application grants allow only the columns needed by the API; a grant does not bypass the row policies described below.

## RLS Matrix

`Member` means a user with an active membership in the relevant crew. `Author` means the user who created the post or comment. A leader must also have an active membership.

| Table | Read | Create | Update/delete |
| --- | --- | --- | --- |
| `crew` | Any signed-in user | Self as leader | Active leader |
| `crew_membership` | Public crew or active member | Leader, accepted joiner, or initial leader | Leader may manage/remove memberships; a member may leave or delete their own membership |
| `crew_participation_request` | Initiator, invitee, or leader | Self join; leader invite | Leader answers joins; invitee answers invites |
| `crew_shared_post` | Member | Member + post author | Member + post author (delete only) |
| `post` | Public, author, or member of a placed crew | Self as author | Author |
| `comment` | Parent post visible | Self + parent visible | Author; update also needs visible parent |
| `reaction` | Parent post visible | Self + parent visible | Reacting user; update also needs visible parent |

### Audit note

The table policies and column-scoped update grants generally match the API queries, but the overall boundary is **not fully correct**: `social.list_discoverable_crews` runs as its privileged owner and always returns `top5Participants`. It therefore exposes profile previews from private crews to every authenticated user, bypassing the narrower `crew_membership` SELECT policy. Until that function conditionally omits private participants (or runs with the caller's RLS), private membership is not private through the discovery endpoint.

All seven tables have RLS enabled, but not forced. This is appropriate for the current design only while requests always switch to the non-owner `authenticated` role; table owners and roles with `BYPASSRLS` remain trusted infrastructure.

## HTTP Endpoints

All routes require DPoP authentication and the `user` role.

| Area | Endpoints | Supported behavior |
| --- | --- | --- |
| Crews | `GET/POST /api/social/crews`; `GET/PATCH/DELETE /api/social/crews/:id`; `GET /api/social/crews/:crewId/participants`; `POST /api/social/crews/:id/leave` | Discover, inspect, create, edit/delete as leader, list allowed participants, leave with automatic leader succession |
| Membership requests | `POST /api/social/crews/:crewId/invitations`; `POST/GET /api/social/crews/:crewId/join-requests`; `GET /api/social/crews/invitations`; `PATCH /api/social/crews/participation-requests/:requestId` | Public instant join, private join approval, leader invites, accept/decline |
| Posts | `GET/POST /api/social/posts`; `GET /api/social/posts/crew/:crewId`; `PATCH/DELETE /api/social/posts/:id` | Public and crew-only feeds, multi-crew placement, author edit/delete, cursor pagination |
| Comments | `GET/POST /api/social/posts/:postId/comments`; `PATCH/DELETE /api/social/posts/comments/:id` | List/add on visible posts; author edit/delete |
| Reactions | `GET/POST/DELETE /api/social/posts/:postId/reactions` | List, add/replace one reaction per user, remove own reaction |

## Authorization Helpers

Policies use narrow SQL functions to avoid recursive RLS checks:

- `is_crew_public(crew_id)` checks crew privacy.
- `is_crew_leader(crew_id)` checks the current `leader_id` value.
- `is_active_crew_member(crew_id)` checks active membership.
- `is_crew_admin(crew_id)` checks active admin membership.
- `can_access_crew(crew_id)` requires an active membership, including the active leader membership.
- `can_manage_crew(crew_id)` requires the current leader and an active leader membership.
- `can_view_crew_participants(crew_id)` permits public visibility or active crew access.
- `can_publish_to_crew(crew_id)` requires active crew access.
- `is_public_post(post_id)` and `is_post_author(post_id)` perform narrow post checks.
- `can_view_post(post_id)` permits public posts, authored posts, or crew-only posts placed in an accessible crew.

The helper functions expose authorization booleans rather than row data. Functions that must inspect RLS-protected tables use controlled `SECURITY DEFINER` behavior and constrained search paths; public execution is revoked, and the application role receives only the required execution privileges.

## Main Social Flows

### Crew discovery and participants

Crew discovery uses `list_discoverable_crews(limit, cursor_created_at, cursor_id)`. Results use stable cursor pagination ordered by creation time and UUID. Crew records themselves are discoverable by every authenticated user. Participant visibility is narrower: public crew participants are visible to authenticated users, while private crew participants require active crew access.

### Crew creation

The API inserts the crew with the caller as `leader_id`, then inserts the caller's active `leader` membership in the same transaction. Both operations must succeed or both roll back. The special initial-membership policy permits only this caller-owned active leader row.

### Joining, requesting, and invitations

A public self-join request is created in `accepted` state. A private self-request starts as `pending` and must be accepted or declined by the active leader. A leader invitation targets another user and starts as `pending`; the invitee accepts or declines it. Cancellation is not currently exposed by the API or permitted by an RLS delete policy.

### Leaving and leadership transfer

A normal member leaves by transitioning their own membership from `active` to `left`. When the active leader leaves, the service locks the relevant rows and promotes the next participant according to the established participant ordering before marking the old leader as left. If no successor exists, the final-member crew is deleted.

### Crew deletion and posts

Only an active leader can delete a crew. Before deletion, `delete_exclusive_crew_posts` removes a `crews_only` post when the deleted crew is its sole placement. Public posts and posts also placed in another crew remain. Foreign-key cascades remove the deleted crew's memberships, requests, and placements.

### Post creation and feeds

A post is either `public` or `crews_only`. A crew-only post must target at least one crew. Post creation and all requested crew placements happen in one transaction, so an unauthorized target crew rolls back the complete operation. A post may be placed in multiple authorized crews.

The general feed returns public posts, the caller's own posts, and crew-only posts reachable through active crew access. A crew feed requires access to that crew. Feed pagination uses the post publication timestamp and UUID as a stable cursor.

### Comments and reactions

Comments and reactions inherit visibility from their parent post. Users can add them only as themselves and only on visible posts. Comment authors own comment edits and deletion. Reaction upsert changes the caller's existing reaction type and refreshes `reacted_at`; the `(post_id, user_id)` constraint guarantees one reaction per user per post. Both collections use cursor pagination.

## Migration Ownership

The squashed social history is intentionally separated into:

1. `0029_social_schema.sql`: Drizzle-derived final structural state plus schema/table/type privileges.
2. `0030_social_functions.sql`: final SQL helper functions, discovery function, trigger function, trigger, and function privileges.
3. `0031_social_policies.sql`: Drizzle-derived final policy state.

The `0031_snapshot.json` snapshot represents the complete Drizzle model after all three files and points directly to `0028_snapshot.json`. Future schema changes should continue to be generated from the TypeScript Drizzle definitions.
