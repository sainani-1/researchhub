import React, { useState } from 'react';
import { useAuth } from '../authUtils';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = login(username, password);
    if (ok) {
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <div style={{ color: 'red', marginTop: '1em' }}>{error}</div>}
      </form>
      <div style={{marginTop:'1em',fontSize:'0.95em',color:'#888'}}>Demo: admin/admin or user/user</div>
    </div>
  );
};

export default Login;
