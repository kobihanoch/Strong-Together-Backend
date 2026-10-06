import { Injectable } from '@nestjs/common';
import { appConfig } from '../../../../config/app.config';
import { AuthPolicy } from '../application/ports/auth-policy.port';

/** Shared runtime-configured authentication policy. */
@Injectable()
export class ConfiguredAuthPolicy implements AuthPolicy {
  readonly dpopEnabled = appConfig.dpopEnabled;
}
