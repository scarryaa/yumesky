import './App.scss';
import agent from './api/agent';
import MainTopBar from './components/MainTopBar';
import Sidebar from './components/Sidebar';
import AuthProvider, { useAuth } from './contexts/AuthContext';
import Home from './screens/Home';
import Login from './screens/Login';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Settings from './screens/Settings';
import ThemeProvider from './contexts/ThemeContext';
import { useEffect, useState } from 'react';
import { mapCurrentPageFromPathName } from './utils';
import ThreadView from './screens/ThreadView';
import PostProvider from './contexts/PostContext';

const App = (): JSX.Element => {
  return (
    <PostProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="app">
              <AppContent />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </PostProvider>
  );
}

const AppContent = (): JSX.Element => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<string | null>();
  const location = useLocation();

  useEffect(() => {
    setCurrentPage(mapCurrentPageFromPathName(location.pathname));
  }, [location.pathname]);

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
            <MainTopBar title={(currentPage != null) ? `${currentPage?.[0].toUpperCase()}${currentPage?.substring(1)}` : null}/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile/:username/post/:id" element={<ThreadView />} />
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
