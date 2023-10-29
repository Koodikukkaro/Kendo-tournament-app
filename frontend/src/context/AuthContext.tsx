import React, {
  type ReactNode,
  createContext,
  type ReactElement,
  useMemo
} from "react";
import type { User } from "types/models";

interface Props {
  children?: ReactNode;
}

interface IAuthContext {
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
}

const initialContextValue: IAuthContext = {
  user: null,
  login: async () => {},
  logout: () => {}
};

const AuthContext = createContext<IAuthContext>(initialContextValue);

export const AuthProvider = ({ children }: Props): ReactElement => {
  const [user, setUser] = React.useState<User | null>(null);

  const login = async (): Promise<void> => {
    const user = null; // TODO: Handle the login request here.
    setUser(user);
  };

  const logout = (): void => {
    setUser(null);
  };

  const contextValue = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => React.useContext(AuthContext);
