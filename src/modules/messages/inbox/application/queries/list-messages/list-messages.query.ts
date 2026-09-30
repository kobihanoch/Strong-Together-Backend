import { Query, type IQuery } from '@nestjs/cqrs';

import type { MessageInbox } from '../../models/messages.models';
export class ListMessagesQuery extends Query<MessageInbox> implements IQuery {
  public constructor(
    public readonly userId: string,
    public readonly timezone: string,
  ) {
    super();
  }
}
