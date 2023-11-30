import api from "api/axios";
import Loader from "components/common/Loader";
import React, {
  type ReactNode,
  createContext,
  type ReactElement,
  useMemo,
  useEffect,
  useState
} from "react";
import { type LoginRequest } from "types/requests";

interface Props {
  children?: ReactNode;
}

interface IAuthContext {
  userId: string | undefined;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({
  userId: undefined,
  isAuthenticated: false,
  login: async (_payload: LoginRequest) => {},
  logout: async () => {}
});

export const AuthProvider = ({ children }: Props): ReactElement => {
  const [userId, setUserId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      if (userId === undefined) {
        try {
          const { userId } = await api.auth.checkAuth();
          setUserId(userId);
        } catch (error) {
          setUserId(undefined);
        } finally {
          setLoading(false);
        }
      }
    };

    void checkAuth();
  }, []);

  const login = async (payload: LoginRequest): Promise<void> => {
    const { userId } = await api.auth.login(payload);
    setUserId(userId);
  };

  const logout = async (): Promise<void> => {
    await api.auth.logout();
    setUserId(undefined);
  };

  const contextValue = useMemo(
    () => ({ userId, login, logout, isAuthenticated: userId !== undefined }),
    [userId]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? (
        <Loader
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}
        />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => React.useContext(AuthContext);
