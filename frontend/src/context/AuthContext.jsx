import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!api.getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user: profile } = await api.getProfile();
      setUser(profile);
    } catch {
      api.clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const login = async (email, password) => {
    const { token, user: loggedInUser } = await api.login({ email, password });
    api.setToken(token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const signup = async (name, email, password, role) => {
    const { token, user: newUser } = await api.signup({ name, email, password, role });
    api.setToken(token);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  const refreshProfile = loadProfile;

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
