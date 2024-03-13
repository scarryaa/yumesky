import './App.scss';
import agent from './api/agent';
import AuthProvider, { useAuth } from './contexts/AuthContext';
import Login from './screens/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = (): JSX.Element => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <AppContent />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

const AppContent = (): JSX.Element => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogin = async (username: string, password: string): Promise<void> => {
    try {
      const res = await agent.login({ identifier: username, password });

      if (res.success) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to login. ', error);
    }
  };

  return (
    <>
      {isAuthenticated
        ? (
        <Routes>
          <Route path="/" element={<div>Woo you made it!!</div>} />
        </Routes>
          )
        : (
        <Routes>
          <Route path="/" element={<Login onSubmit={handleLogin} />} />
        </Routes>
          )}
    </>
  );
}

export default App;
