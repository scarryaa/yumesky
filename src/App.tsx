import './App.scss';
import agent from './api/agent';
import Login from './screens/Login';

const App = (): JSX.Element => {
  const handleLogin = async (username: string, password: string): Promise<void> => {
    await agent.login({ identifier: username, password })
  };

  return (
    <div className="app">
      <Login onSubmit={handleLogin} />
    </div>
  );
}

export default App;
