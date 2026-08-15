import { pgRole } from 'drizzle-orm/pg-core';

// These roles are created by the existing SQL migration history.
export const authenticatedRole = pgRole('authenticated');
