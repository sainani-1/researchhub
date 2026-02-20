import React, { createContext, useContext } from 'react';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Demo users: username: admin, password: admin | username: user, password: user
export const DEMO_USERS = [
  { username: 'admin', password: 'admin', role: 'admin' },
  { username: 'user', password: 'user', role: 'user' },
];