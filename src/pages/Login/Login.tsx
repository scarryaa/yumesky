import React, { useEffect, useState } from 'react';
import './Login.scss';
import * as persisted from '../../state/persisted';
import agent from '../../api/agent';
import { useAuth } from '../../contexts/AuthContext';

interface LoginProps {
  onSubmit: (username: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    // attempt to login from saved session
    const resumeSession = async (): Promise<void> => {
      const session = persisted.get('session');

      if (session.accounts[0].refreshJwt !== undefined) {
        const res = await agent.resumeSession({
          ...session.currentAccount,
          refreshJwt: session.currentAccount?.refreshJwt ?? session.accounts[0].refreshJwt,
          accessJwt: session.currentAccount?.accessJwt ?? session.accounts[0].accessJwt ?? '',
          handle: session.currentAccount?.handle ?? session.accounts[0].handle,
          did: session.currentAccount?.did ?? session.accounts[0].did
        });

        if (res.success) {
          setIsAuthenticated(true);
        }
      }
    }

    void resumeSession();
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit(username, password);
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
