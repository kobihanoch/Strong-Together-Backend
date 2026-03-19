import { MessageAsRead } from "./../../dto/messages.dto.ts";
import { AllUserMessages } from "../../dto/messages.dto.ts";
import { MessageEntity } from "../../entities/message.entity.ts";

export type GetAllUserMessagesResponse = {
  messages: AllUserMessages[];
};

export type MarkMessageAsReadResponse = Pick<MessageAsRead, "id" | "is_read">;

export type DeleteMessageResponse = Pick<MessageEntity, "id">;
