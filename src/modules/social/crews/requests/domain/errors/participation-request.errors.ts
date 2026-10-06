import { DomainConflictError } from '../../../../../../common/domain/errors/domain.errors';

export class ParticipationRequestNotPendingError extends DomainConflictError {
  public constructor() {
    super('Participation request is not pending');
  }
}
