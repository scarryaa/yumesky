import { useState } from 'react';
import './Modal.scss';
import agent from '../../../api/agent';
import * as persisted from '../../../state/persisted';
import { useSession } from '../../../state/session';
import { addAccountToSessionIfNeeded } from '../../../utils';

export const Component = (): JSX.Element => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const { setSession } = useSession();

  const handleLogin = async (username: string, password: string): Promise<void> => {
    try {
      const res = (await agent.login({ identifier: username, password }));
      if (res.success) {
        const newAccount = {
          accessJwt: res.data.accessJwt,
          did: res.data.did,
          email: res.data.email ?? '',
          emailConfirmed: res.data.emailConfirmed ?? false,
          handle: res.data.handle,
          refreshJwt: res.data.refreshJwt,
          service: 'https://public.api.bsky.app'
        };

        addAccountToSessionIfNeeded(persisted.get('session'), newAccount);
        setSession({ accounts: [...persisted.get('session').accounts, newAccount], currentAccount: newAccount });
      }
    } catch (error) {
      console.error('Failed to login. ', error);
    }
  };

  return (
    <div className='add-account-modal'>
        <h1>Add Account</h1>
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
            <button onClick={async e => { await handleLogin(username ?? '', password ?? ''); location.reload(); }}>Login</button>
    </div>
  )
}
