import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '@workspace/api-client-react';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('eauc_auth_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setUser(parsed.user);
      } catch (e) {
        localStorage.removeItem('eauc_auth_session');
      }
    }
  }, []);

  const login = (newUser: AuthUser, token: string) => {
    localStorage.setItem('eauc_auth_session', JSON.stringify({ user: newUser, token }));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('eauc_auth_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
