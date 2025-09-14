let io = null;

export const initSocket = (serverIo) => {
  io = serverIo;
};

export const emitToUser = (userId, event, payload) => {
  if (!io) return;
  io.to(`user_${userId}`).emit(event, payload);
};

export const emitToAdmin = (event, payload) => {
  if (!io) return;
  io.to("admins").emit(event, payload);
};
