
import { createContext, useContext, useState, ReactNode } from 'react';
import { saveAdminLogin } from '../utils/dataManager';

interface AuthContextType {
  isAdminLoggedIn: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const login = (email: string, password: string): boolean => {
    // Simple authentication - only allow admin@ngo.org
    if (email === 'admin@ngo.org' && password === 'admin123') {
      setIsAdminLoggedIn(true);
      setAdminEmail(email);

      // Save admin login to JSON
      saveAdminLogin(email);

      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    setAdminEmail(null);
  };

  return (
    <AuthContext.Provider value={{
      isAdminLoggedIn,
      adminEmail,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
