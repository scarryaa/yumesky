import './App.scss';
import agent from './api/agent';
import MainTopBar from './components/MainTopBar';
import Sidebar from './components/Sidebar';
import AuthProvider, { useAuth } from './contexts/AuthContext';
import Home from './screens/Home';
import Login from './screens/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Settings from './screens/Settings';

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
    <div className="content-container">
      {isAuthenticated
        ? (
        <>
          <Sidebar />
          <div className="current-route">
            <MainTopBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </>
          )
        : (
        <Routes>
          <Route path="/" element={<Login onSubmit={handleLogin} />} />
        </Routes>
          )}
    </div>
  );
}

export default App;
