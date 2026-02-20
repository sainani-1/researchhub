import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../authUtils';

const Navbar = () => {
  const { role, user, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <nav className="navbar">
      <Link to="/">ResearchHub</Link>
      {role && (
        <>
          <span>Welcome, {user} ({role})</span>
          <Link to="/">Dashboard</Link>
          {role === 'admin' && <Link to="/admin">Admin Panel</Link>}
          <button onClick={logout}>Logout</button>
        </>
      )}
      {!role && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
      <button className={`theme-toggle${theme === 'dark' ? ' active' : ''}`} onClick={toggleTheme} title="Toggle dark/light mode">
        {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </nav>
  );
};

export default Navbar;
