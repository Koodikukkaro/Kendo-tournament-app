import { type Socket, Server } from "socket.io";

export const io = new Server();

export function initSocket(server: any): Server {
  io.attach(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true
    }
  });

  io.on("connection", async (socket: Socket) => {
    socket.on("join-match", async (matchId: string) => {
      await socket.join(matchId);
    });

    socket.on("leave-match", async (matchId: string) => {
      await socket.leave(matchId);
    });
  });

  return io;
}
