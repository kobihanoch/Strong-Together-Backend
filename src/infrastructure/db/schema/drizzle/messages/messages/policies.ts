import { sql as drizzleSql } from 'drizzle-orm';
import { type AnyPgColumn, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';
const uid = drizzleSql`"identity"."current_user_id"()`;
export function messagesPolicies(t: { senderId: AnyPgColumn; receiverId: AnyPgColumn }) { const participant = drizzleSql`${uid} = ${t.senderId} or ${uid} = ${t.receiverId}`; return [
  // Lets authenticated message participants read their sent or received messages.
  pgPolicy('Enable read access for auth users on messages', { for: 'select', to: authenticatedRole, using: participant }),
  // Lets authenticated users send as themselves or as the existing system sender.
  pgPolicy('Enable insert for auth users on messages', { for: 'insert', to: authenticatedRole, withCheck: drizzleSql`${uid} = ${t.senderId} or ${t.senderId} = '8dedd0e0-8c25-4c84-a05b-4ae5f5c48f3a'::uuid` }),
  // Lets authenticated message participants update a message while remaining participants.
  pgPolicy('Enable update for auth users on messages', { for: 'update', to: authenticatedRole, using: participant, withCheck: participant }),
  // Lets authenticated message participants delete their sent or received messages.
  pgPolicy('Enable delete for auth users on messages', { for: 'delete', to: authenticatedRole, using: participant }),
]; }
