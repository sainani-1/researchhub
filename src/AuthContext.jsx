import React, { useState, useEffect } from 'react';

import { DEMO_USERS, AuthContext } from './authUtils';

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const saved = JSON.parse(localStorage.getItem('authUser'));
    if (saved && saved.user && saved.role) {
      setTimeout(() => {
        setUser(saved.user);
        setRole(saved.role);
        setLoading(false);
      }, 0);
    } else {
      setTimeout(() => setLoading(false), 0);
    }
  }, []);

  const login = (username, password) => {
    // Check demo users
    let found = DEMO_USERS.find(u => u.username === username && u.password === password);
    // Check registered users in localStorage
    if (!found) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      found = users.find(u => u.username === username && u.password === password);
    }
    if (found) {
      setUser(found.username);
      setRole(found.role || 'user');
      localStorage.setItem('authUser', JSON.stringify({ user: found.username, role: found.role || 'user' }));
      return true;
    }
    return false;
  };
  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
