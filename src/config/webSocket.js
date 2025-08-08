import { createServer } from "http";
import { Server } from "socket.io";

let io = null;
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
};
export const setIO = (val) => {
  io = val;
};

export const createIOServer = (app) => {
  const server = createServer(app);
  io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === "development" ? "*" : "<FrontDomainURL>",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  setIO(io);
  return { io, server };
};

export const startSocket = async () => {
  io.on("connection", (socket) => {
    console.log("New connection:", Date());

    socket.on("user_loggedin", (userId) => {
      socket.join(String(userId));
      console.log("User joined room:", userId);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected.");
    });
  });
};
