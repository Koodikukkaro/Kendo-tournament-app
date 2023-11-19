import { type ISocketContext } from "context/SocketContext";
import { type Dispatch, type SetStateAction } from "react";
import io from "socket.io-client";
import { socketEvents } from "./events";

// TODO: Store the URL as an env variable.
export const socket = io("http://localhost:8080", {
  withCredentials: true,
  autoConnect: false
});

export const initSockets = (
  setValue: Dispatch<SetStateAction<ISocketContext>>
): void => {
  socketEvents(setValue);
};
