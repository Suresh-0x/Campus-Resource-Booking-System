import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('campus_token') || '');
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        console.error('Failed to load user:', err);
        localStorage.removeItem('campus_token');
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('campus_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    localStorage.setItem('campus_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('campus_token');
    setToken('');
    setUser(null);
  };

  // Quick switcher for demo purposes
  const switchDemoUser = async (role) => {
    let email = 'student@campus.edu';
    let password = 'student123';
    if (role === 'admin') {
      email = 'admin@campus.edu';
      password = 'admin123';
    } else if (role === 'faculty') {
      email = 'faculty@campus.edu';
      password = 'faculty123';
    }
    return await login(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
