# WebSocket Realtime Delivery

The realtime layer uses **Socket.IO** for authenticated, user-targeted delivery. It is designed for events that should reach a connected mobile client without polling, such as **new messages** and **video-analysis results**.

## Connection Model

The client does not connect with the normal access token directly. It first requests a short-lived socket ticket from the authenticated HTTP API:

```text
Client
  -> POST /api/ws/generateticket
  -> signed socket ticket
  -> Socket.IO connection with auth.ticket
  -> server verifies ticket
  -> socket joins per-user room
```

This keeps the WebSocket connection flow separate from the normal HTTP token lifecycle while still requiring the user to pass the same protected API boundary before obtaining a ticket.

## Ticket Generation

`WebSocketsController` exposes:

```text
POST /api/ws/generateticket
```

The route is protected by:

- **`DpopGuard`**
- **`AuthenticationGuard`**
- **`AuthorizationGuard`**
- **`@Roles('user')`**
- **`ValidateRequestPipe(generateTicketRequest)`**

`WebSocketsService` signs a JWT ticket with:

- `id`: authenticated user id
- `username`: client-provided username
- `jti`: unique ticket id
- `issuer`: `strong-together`
- `audience`: `socket`
- expiration: `5400s`

The response body matches the shared `generateTicketResponseSchema` contract from **`@strong-together/shared`**.

## Socket.IO Server

`SocketIOService` attaches Socket.IO to the same HTTP server at:

```text
/socket.io
```

It enables:

- **WebSocket** and **polling** transports
- **Redis adapter** support through `@socket.io/redis-adapter`
- authenticated connection middleware
- structured connection and disconnect logging
- user-targeted emission through `emitToUser(userId, event, data)`

The Redis adapter allows Socket.IO events to fan out correctly when the API is scaled across multiple server processes.

## Authentication Flow

During Socket.IO connection, the server expects:

```ts
auth: {
  ticket: "signed-socket-ticket"
}
```

The ticket is verified by `decodeSocketToken` using the socket JWT secret, issuer, and audience. If the ticket is missing, invalid, or expired, the connection is rejected before it can subscribe to user-specific events.

After verification, the socket receives an authenticated user context:

```ts
{
  id: "user-id",
  username: "username"
}
```

The socket then joins a room named by the authenticated `userId`.

## User-Targeted Events

The realtime layer avoids broadcasting sensitive data. Application services emit to a specific authenticated user room:

```ts
this.socketIOService.emitToUser(userId, eventName, payload);
```

Current user-targeted events include:

| Event | Producer | Purpose |
| --- | --- | --- |
| `new_message` | `MessagesService` | Delivers new user/system message payloads |
| `video_analysis_results` | `VideoAnalysisService` | Delivers completed or failed video-analysis results |

This design keeps realtime delivery aligned with the backend authorization model: events are addressed to a user, not broadcast globally.

## Middleware Exemptions

The HTTP middleware layer explicitly allows the Socket.IO transport path:

- `CheckAppVersionMiddleware` exempts `/socket.io`
- `BotBlockerMiddleware` allows `/socket.io`

The actual socket connection is still authenticated by the Socket.IO ticket middleware.

## Testing

The WebSocket ticket route has integration coverage in:

```text
src/modules/web-sockets/web-sockets.controller.test.ts
```

Run it with:

```bash
npm run test:websockets
```

The tests verify that the route returns a signed ticket with the expected socket claims, rejects invalid request bodies, and rejects unauthenticated requests.
