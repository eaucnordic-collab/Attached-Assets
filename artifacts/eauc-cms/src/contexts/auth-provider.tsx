import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '@workspace/api-client-react';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleExpired = () => setUser(null);
    window.addEventListener('eauc-auth-expired', handleExpired);
    fetch('/api/auth/me', { credentials: 'include' })
      .then(response => response.ok ? response.json() as Promise<AuthUser> : null)
      .then(currentUser => setUser(currentUser))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
    return () => window.removeEventListener('eauc-auth-expired', handleExpired);
  }, []);

  const login = (newUser: AuthUser) => {
    setUser(newUser);
  };

  const logout = () => {
    void fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => undefined);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
