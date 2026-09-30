import { Command, type ICommand } from '@nestjs/cqrs';

import type { LoginResult } from '../../../../core/application/models/auth.models';
export class LoginCommand extends Command<LoginResult> implements ICommand {
  public constructor(
    public readonly identifier: string,
    public readonly password: string,
    public readonly jkt: string | undefined,
  ) {
    super();
  }
}
