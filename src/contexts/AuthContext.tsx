import React, { createContext, useState, useContext } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  cpf: string;
  phone: string;
  status: boolean;
  profile: {
    id: number;
    name: string;
    status: boolean;
  };
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });

  const isAuthenticated = !!user;

  const login = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
