# Social Module And Authorization

## Scope And Security Model

The social module stores crews, memberships, participation requests, posts, crew placements, comments, and reactions in the PostgreSQL `social` schema. Every HTTP route requires a DPoP-authenticated application user and executes inside an RLS-aware transaction. PostgreSQL row-level security is the final authorization boundary.

In this document:

- **Authenticated user** means a signed-in user with no active membership in the relevant crew.
- **Crew member** means a user whose membership has `status = 'active'`; this includes active admins where a policy checks crew access.
- **Leader** means the crew's `leader_id` user who also has an active membership. Merely remaining in `leader_id` without an active membership does not grant management access.
- **Author** means the user referenced by a post or comment's author column.

All social tables have RLS enabled. Application grants allow only the columns needed by the API; a grant does not bypass the row policies described below.

## Authorization By Table

| Table                        | Authenticated user                                                                                                                                                                                                                         | Active crew member/admin                                                                                                     | Active leader                                                                                                                                                                               | Owner/author-specific behavior                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `crew`                       | Can discover and read all crew records. Can create a crew only with themselves as leader.                                                                                                                                                  | Same read access; membership by itself does not permit crew updates or deletion.                                             | Can update or delete the crew while actively leading it. An update may transfer leadership as long as the caller still has crew access during the transaction.                              | The creator receives an active leader membership in the same transaction.                                                                           |
| `crew_membership`            | Can read participants of public crews. Cannot read participants of a private crew without active access.                                                                                                                                   | Can read participants of their private crew. Can mark their own active membership as `left`, or delete their own membership. | Can read participants, create memberships, update membership roles/statuses, and delete memberships. Can create their own initial active leader membership immediately after crew creation. | Self-leave is restricted to the transition from the caller's own `active` row to `left`.                                                            |
| `crew_participation_request` | Can read requests they initiated or received. A user may self-join a public crew with an immediately `accepted` request, or submit a `pending` request to a private crew. Initiators may cancel a pending request or delete their request. | Membership adds no general request-management permission. Invitees can accept or decline invitations addressed to them.      | Can read requests for their crew, send pending invitations, and accept or decline pending self-join requests.                                                                               | A request must remain a valid self-request or a leader-originated invitation after an update.                                                       |
| `crew_shared_post`           | Cannot read placements for crews they cannot access.                                                                                                                                                                                       | Can read placements in accessible crews. May place or remove their own post while they retain publish access to that crew.   | Has the same placement behavior as an active member; leadership alone without active membership is insufficient.                                                                            | Placement writes additionally require the caller to be the post author. A post can be placed in multiple crews, once per `(post_id, crew_id)` pair. |
| `post`                       | Can read public posts. Can create a post only as themselves.                                                                                                                                                                               | Can also read crew-only posts placed in any crew they can access.                                                            | Same as an active member unless the leader lacks an active membership.                                                                                                                      | Authors can always read, update, and delete their own posts. Authorship cannot be reassigned through an update.                                     |
| `comment`                    | Can read and create comments only when the parent post is visible.                                                                                                                                                                         | Same rule, with crew membership potentially making a crew-only parent post visible.                                          | Same as a member when actively participating.                                                                                                                                               | Comment authors can update their own comment only while its post remains visible, and can delete their own comment.                                 |
| `reaction`                   | Can read and create reactions only when the parent post is visible.                                                                                                                                                                        | Same rule, with crew membership potentially making a crew-only parent post visible.                                          | Same as a member when actively participating.                                                                                                                                               | A user has at most one reaction per post. They can replace its type/timestamp or delete it themselves.                                              |

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

A public self-join request is created in `accepted` state. A private self-request starts as `pending` and must be accepted or declined by the active leader. A leader invitation targets another user and starts as `pending`; the invitee accepts or declines it. The initiator may cancel a still-pending request. The current module defines these database rules even where an HTTP workflow has not yet been exposed.

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
