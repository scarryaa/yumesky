import React, { useState } from 'react';
import './Login.scss';

interface LoginProps {
  onSubmit: (username: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit(username, password)
  };

  return (
    <div className='login-container'>
        <div className='login-logo'>
            <span>yumesky</span>
        </div>
        <form onSubmit={handleSubmit} className='login-form'>
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); }}
            />
            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); }}
            />
            <button type="submit">Login</button>
        </form>
    </div>
  );
};

export default Login;
