/** Issues short-lived WebSocket connection tickets. */
export abstract class WebSocketTicketIssuer {
  abstract issue(userId: string, username?: string): string;
}
