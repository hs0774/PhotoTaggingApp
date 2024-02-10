import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  SetStateAction,
  Dispatch,
} from "react";

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  token: string | null;
  username: string | null;
}

interface AuthContextValue {
  setUser: Dispatch<SetStateAction<User | null>>;
  user: User | null;
  userCreated: (userData: User) => void;
  setSeconds: Dispatch<SetStateAction<number>>;
  setMinutes: Dispatch<SetStateAction<number>>;
  minutes: number;
  seconds: number;
  timeStart: boolean;
  setTimeStart: Dispatch<SetStateAction<boolean>>;
  onGamePage: boolean;
  setOnGamePage: Dispatch<SetStateAction<boolean>>;
}

const initialAuthContextValue: AuthContextValue = {
  setUser: () => {},
  user: null,
  userCreated: () => {},
  setSeconds: () => {},
  setMinutes: () => {},
  minutes: 0,
  seconds: 0,
  timeStart: false,
  setTimeStart: () => {},
  onGamePage: false,
  setOnGamePage: () => {},
};

const AuthContext = createContext<AuthContextValue>(initialAuthContextValue);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [timeStart, setTimeStart] = useState(false);
  const [onGamePage, setOnGamePage] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setUser({ token, username });
    } else {
      setUser(null);
    }
  }, []);

  const userCreated = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        setUser,
        user,
        userCreated,
        setSeconds,
        setMinutes,
        minutes,
        seconds,
        timeStart,
        setTimeStart,
        onGamePage,
        setOnGamePage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
