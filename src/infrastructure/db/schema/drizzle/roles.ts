import { pgRole } from 'drizzle-orm/pg-core';

// These roles are created by the existing SQL migration history.
export const anonRole = pgRole('anon').existing();
export const authenticatedRole = pgRole('authenticated').existing();
export const serviceRole = pgRole('service_role').existing();
export const appUserRole = pgRole('app_user').existing();

