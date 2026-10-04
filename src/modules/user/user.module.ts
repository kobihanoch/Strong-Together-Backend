import { Module } from '@nestjs/common';
import { CreateUserModule } from './create/create-user.module';
import { PushTokensModule } from './push-tokens/push-tokens.module';
import { UpdateUserModule } from './update/update-user.module';

@Module({
  imports: [CreateUserModule, PushTokensModule, UpdateUserModule],
  exports: [CreateUserModule, PushTokensModule, UpdateUserModule],
})
/** Composes and re-exports the independent user capabilities. */
export class UserModule {}
