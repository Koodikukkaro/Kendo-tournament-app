import { type ISocketContext } from "context/SocketContext";
import { type Dispatch, type SetStateAction } from "react";
import io from "socket.io-client";
import { socketEvents } from "./events";
import { API_BASE_URL } from "api/axios";

export const socket = io(API_BASE_URL, {
  withCredentials: true,
  autoConnect: false
});

export const initSockets = (
  setValue: Dispatch<SetStateAction<ISocketContext>>
): void => {
  socketEvents(setValue);
};
