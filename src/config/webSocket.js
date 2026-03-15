import { createServer } from "http";
import { Server } from "socket.io";
import { decodeSocketToken } from "../utils/tokenUtils.js";
import createError from "http-errors";
import { createRedisAdapterClients } from "./redisClient.js";

let io = null;
export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
};
export const setIO = (val) => {
  io = val;
};

export const createIOServer = async (app) => {
  const server = createServer(app);
  io = new Server(server, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
    cors: {
      origin: "*", // e.g., your app origin
      credentials: true,
    },
  });

  if (process.env.ENABLE_SOCKET_REDIS_ADAPTER === "true") {
    try {
      const { createAdapter } = await import("@socket.io/redis-adapter");
      const { pubClient, subClient } = await createRedisAdapterClients();
      io.adapter(createAdapter(pubClient, subClient));
      console.log("[Web Socket]: Redis adapter enabled");
    } catch (e) {
      console.warn(
        `[Web Socket]: Redis adapter unavailable, continuing without it: ${e.message}`,
      );
    }
  }

  // --- Authenticate before connection is accepted ---
  io.use(async (socket, next) => {
    try {
      const ticket = socket.handshake?.auth?.ticket;
      if (!ticket) return next(createError(400, "Missing ticket"));

      const payload = decodeSocketToken(ticket);
      if (!payload) return next(createError(401, "Invalid or expired ticket"));

      // Optional: extra checks (e.g., jti in Redis, deviceId binding)
      socket.user = { id: payload.id, username: payload.username };
      return next();
    } catch (e) {
      return next(createError(401, "Unauthorized"));
    }
  });

  // --- Connection is authenticated here ---
  io.on("connection", (socket) => {
    const { id: userId, username } = socket.user || {};
    // Join per-user room
    socket.join(userId);

    console.log("[Web Socket]: User connected:", username);

    socket.on("user_loggedin", () => {
      // Optional: handle post-login init
    });

    socket.on("disconnect", (reason) => {
      console.log("[Web Socket]:", username, "disconnected:", reason);
    });
  });

  setIO(io);
  return { io, server };
};
