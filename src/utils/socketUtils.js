import { getIO } from "../config/webSocket";

let io = getIO();
export const emitNewMessage = (userId, msg) => {
  io.to(userId).emit("new_message", msg);
};
