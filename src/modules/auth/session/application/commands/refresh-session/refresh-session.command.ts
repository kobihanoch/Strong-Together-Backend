import { Command, type ICommand } from '@nestjs/cqrs';

import type { RefreshSessionResult } from '../../../../core/application/models/auth.models';
export class RefreshSessionCommand extends Command<RefreshSessionResult> implements ICommand {
  public constructor(
    public readonly refreshToken: string | null | undefined,
    public readonly dpopJkt: string | null | undefined,
  ) {
    super();
  }
}
