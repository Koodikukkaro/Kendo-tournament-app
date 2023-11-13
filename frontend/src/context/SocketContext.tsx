import React, {
  type ReactNode,
  createContext,
  useEffect,
  useState,
  type ReactElement
} from "react";
import { initSockets, socket } from "sockets";
import { type Match } from "types/models";

interface Props {
  children?: ReactNode;
}

export interface ISocketContext {
  matchInfo: Match | undefined;
}

const initialContextValue: ISocketContext = {
  matchInfo: undefined
};

const SocketContext = createContext<ISocketContext>(initialContextValue);

export const SocketProvider = (props: Props): ReactElement => {
  const [value, setValue] = useState<ISocketContext>(initialContextValue);

  useEffect(() => {
    socket.connect();
    if (socket.connected) {
      initSockets(setValue);
    }
  }, []);

  return (
    <SocketContext.Provider value={value}>
      {props.children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): ISocketContext => React.useContext(SocketContext);
