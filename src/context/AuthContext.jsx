import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('ef_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ef_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token;

  // Fetch user profile on initial load if token exists but user is missing
  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      localStorage.setItem('ef_user', JSON.stringify(userData));
    } catch {
      // Token might be expired
      logout();
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const jwt = await authService.login(email, password);
      localStorage.setItem('ef_token', jwt);
      setToken(jwt);

      // Fetch user profile
      const userData = await authService.getCurrentUser();
      setUser(userData);
      localStorage.setItem('ef_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        'Login failed. Please check your credentials.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      await authService.register(name, email, password);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        'Registration failed.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ef_token');
    localStorage.removeItem('ef_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
