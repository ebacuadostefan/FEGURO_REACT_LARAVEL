import axios from "axios";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextProps {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  justLoggedOut: boolean;                      
  setJustLoggedOut: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const BASE_API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${BASE_API_URL}/login`, {
      email,
      password,
    });

    const { token, user } = response.data;
    setToken(token);
    setUser(user);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = async () => {
    if (!token) return;

    await axios.post(`${BASE_API_URL}/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    setJustLoggedOut(true);
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete axios.defaults.headers.common["Authorization"];
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoggedIn,
        justLoggedOut,
        setJustLoggedOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};