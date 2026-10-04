import { DomainValidationError } from '../../../../../common/domain/errors/domain.errors';

export class UnsupportedOAuthProviderError extends DomainValidationError {
  constructor() {
    super('OAuth provider is not supported');
  }
}
export class OAuthProviderUserIdRequiredError extends DomainValidationError {
  constructor() {
    super('OAuth provider user ID is required');
  }
}
