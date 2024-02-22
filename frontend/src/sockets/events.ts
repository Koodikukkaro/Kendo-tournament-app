import { type Dispatch, type SetStateAction } from "react";
import { socket } from "./index";
import { type ISocketContext } from "context/SocketContext";
import { type Match } from "types/models";

export const socketEvents = (
  setValue: Dispatch<SetStateAction<ISocketContext>>
): void => {
  socket.on("start-timer", (matchInfo: Match) => {
    setValue((state) => {
      return { ...state, matchInfo };
    });
  });

  socket.on("stop-timer", (matchInfo: Match) => {
    setValue((state) => {
      return { ...state, matchInfo };
    });
  });

  socket.on("add-point", (matchInfo: Match) => {
    setValue((state) => {
      return { ...state, matchInfo };
    });
  });

  socket.on("add-timekeeper", (matchInfo: Match) => {
    setValue((state) => {
      return { ...state, matchInfo };
    });
  });

  socket.on("remove-timekeeper", (matchInfo: Match) => {
    setValue((state) => {
      return { ...state, matchInfo };
    });
  });

  socket.on("add-pointmaker", (matchInfo: Match) => {
    setValue((state) => {
      return { ...state, matchInfo };
    });
  });

  socket.on("remove-pointmaker", (matchInfo: Match) => {
    setValue((state) => {
      return { ...state, matchInfo };
    });
  });
};
