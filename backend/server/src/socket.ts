import { type Socket, Server } from "socket.io";
import type http from "http";

let isTimerRunning = false;

export const io = new Server();

export function initSocket(server: http.Server): Server {
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

    socket.on("toggle-timer", () => {
      const currentTime = 200; // Get real time from API?
      isTimerRunning = !isTimerRunning;
      io.emit("timer-state", { isTimerRunning, currentTime });
    });
  });

  return io;
}
