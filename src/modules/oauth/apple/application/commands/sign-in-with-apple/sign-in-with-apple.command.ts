import { Command, type ICommand } from '@nestjs/cqrs';
import type { AppleOAuthInput } from '../../models/apple-oauth.models';
import type { OAuthLoginResult } from '../../../../core/application/models/oauth.models';

export class SignInWithAppleCommand extends Command<OAuthLoginResult> implements ICommand {
  public constructor(
    public readonly body: AppleOAuthInput,
    public readonly jkt: string,
  ) {
    super();
  }
}
