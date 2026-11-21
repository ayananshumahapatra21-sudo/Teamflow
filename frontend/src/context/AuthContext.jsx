import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('teamflow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('teamflow_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('teamflow_token');
      if (storedToken) {
        try {
          const res = await api.get('/users/me');
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('teamflow_user', JSON.stringify(res.data));
          }
        } catch (err) {
          localStorage.removeItem('teamflow_token');
          localStorage.removeItem('teamflow_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data) {
      const { accessToken, user: userData } = res.data;
      localStorage.setItem('teamflow_token', accessToken);
      localStorage.setItem('teamflow_user', JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);
      return userData;
    }
  };

  const register = async (fullName, email, password) => {
    const res = await api.post('/auth/register', { fullName, email, password });
    if (res.data) {
      const { accessToken, user: userData } = res.data;
      localStorage.setItem('teamflow_token', accessToken);
      localStorage.setItem('teamflow_user', JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);
      return userData;
    }
  };

  const logout = () => {
    localStorage.removeItem('teamflow_token');
    localStorage.removeItem('teamflow_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
