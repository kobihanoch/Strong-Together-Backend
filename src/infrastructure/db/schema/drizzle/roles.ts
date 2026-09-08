import { pgRole } from 'drizzle-orm/pg-core';

export const anonRole = pgRole('anon');
export const authenticatedRole = pgRole('authenticated');
export const guestRole = pgRole('guest');
export const serviceRole = pgRole('service_role');
export const appUserRole = pgRole('app_user');
export const appRuntimeUserRole = pgRole('app_runtime_user', {
  createDb: false,
  createRole: false,
  inherit: false,
});
