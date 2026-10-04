import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import type { MessageInbox } from '../../models/messages.models';
import { MessagesQueries } from '../../ports/messages.queries';
import { ListMessagesQuery } from './list-messages.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Retrieves the message inbox visible to a user. */
@QueryHandler(ListMessagesQuery)
export class ListMessagesHandler implements IQueryHandler<ListMessagesQuery> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: MessagesQueries,
  ) {}

  /**
   * Retrieves a user's inbox in newest-first order.
   *
   * @param userId - The user whose inbox is requested.
   * @param timezone - The IANA time zone used to localize timestamps.
   * @returns The user's messages.
   */
  async execute(query: ListMessagesQuery): Promise<MessageInbox> {
    const { userId, timezone } = query;
    return this.unitOfWork.executeReadOnly(userId, async () => {
      return { messages: await this.query.findByUser(timezone) };
    });
  }
}
