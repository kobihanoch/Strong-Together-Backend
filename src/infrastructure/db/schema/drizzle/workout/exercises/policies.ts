import { sql as drizzleSql } from 'drizzle-orm';
import { pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole } from '../../roles';

export const exercisePolicies = () => [
  // Makes the shared exercise catalog readable to every authenticated user.
  pgPolicy('Allow all authenticated users to read exercises', { for: 'select', to: authenticatedRole, using: drizzleSql`true` }),
];
