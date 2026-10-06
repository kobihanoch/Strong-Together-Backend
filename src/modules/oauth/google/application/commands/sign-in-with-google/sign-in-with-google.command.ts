import { Command, type ICommand } from '@nestjs/cqrs';
import type { GoogleOAuthInput } from '../../models/google-oauth.models';
import type { OAuthLoginResult } from '../../../../core/application/models/oauth.models';

export class SignInWithGoogleCommand extends Command<OAuthLoginResult> implements ICommand {
  public constructor(
    public readonly body: GoogleOAuthInput,
    public readonly jkt: string,
  ) {
    super();
  }
}
