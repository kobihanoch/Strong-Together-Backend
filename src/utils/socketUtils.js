import { getIO } from "../config/webSocket.js";

export const emitNewMessage = (userId, msg) => {
  getIO().to(userId).emit("new_message", msg);
};
