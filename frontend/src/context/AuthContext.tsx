import { createContext, useContext, useState, type ReactNode } from 'react';
import * as authApi from '../api/auth';

interface AuthContextValue {
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('accessToken'),
  );

  async function login(email: string, password: string) {
    const { accessToken } = await authApi.login(email, password);
    localStorage.setItem('accessToken', accessToken);
    setAccessToken(accessToken);
  }

  function logout() {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
  }

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
