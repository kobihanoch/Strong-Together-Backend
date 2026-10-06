/** Sends confirmation emails for pending address changes. */
export abstract class UpdateEmailSender {
  abstract send(email: string, userId: string, fullName: string, requestId?: string): Promise<void>;
}
