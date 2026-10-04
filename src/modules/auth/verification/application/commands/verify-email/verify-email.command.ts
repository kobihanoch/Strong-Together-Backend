import { Command, type ICommand } from '@nestjs/cqrs';

import type { EmailVerificationOutcome } from '../../../../core/application/models/auth.models';
export class VerifyEmailCommand extends Command<EmailVerificationOutcome> implements ICommand {
  public constructor(
    public readonly token: string | undefined,
  ) {
    super();
  }
}
