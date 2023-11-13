import { socket } from "sockets";

export const joinMatch = (matchId: string): void => {
  socket.emit("join-match", matchId);
};

export const leaveMatch = (matchId: string): void => {
  socket.emit("leave-match", matchId);
};
