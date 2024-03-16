import './App.scss';
import agent, { getPrefs } from './api/agent';
import MainTopBar from './components/MainTopBar';
import Sidebar from './components/Sidebar';
import AuthProvider, { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Settings from './pages/Settings';
import ThemeProvider from './contexts/ThemeContext';
import { useEffect, useState } from 'react';
import ThreadView from './pages/ThreadView';
import PostProvider from './contexts/PostContext';
import HomeTabs from './components/HomeTabs';
import PrefsProvider, { usePrefs } from './contexts/PrefsContext';
import { type AppBskyFeedDefs } from '@atproto/api';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <PrefsProvider>
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
    </PrefsProvider>
  );
}

const AppLoggedIn: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('Following');
  const [tabs, setTabs] = useState<AppBskyFeedDefs.GeneratorView[]>([]);
  const { setPrefs } = usePrefs();

  const handleTabClick = (tabDisplayName: string): void => {
    setSelectedTab(tabDisplayName);
  };

  // get initial info we need
  useEffect(() => {
    const getUserPrefs = async (): Promise<void> => {
      const res = await getPrefs();
      setPrefs(res);
    }

    void getUserPrefs();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="current-route">
        <MainTopBar
          component={(currentPage == null) ? <HomeTabs tabs={tabs} setTabs={setTabs} selectedTab={selectedTab} onTabClick={handleTabClick} /> : null}
          title={(currentPage != null) ? `${currentPage?.[0].toUpperCase()}${currentPage?.substring(1)}` : null}/>
        <Routes>
          <Route path="/" element={<Home tabs={tabs} setCurrentPage={setCurrentPage} selectedTab={selectedTab} />} />
          <Route path="/profile/:username" element={<Profile setCurrentPage={setCurrentPage}/>} />
          <Route path="/profile/:username/post/:id" element={<ThreadView setCurrentPage={setCurrentPage} />} />
          <Route path="/settings" element={<Settings setCurrentPage={setCurrentPage} />} />
        </Routes>
      </div>
    </>
  )
}

const AppContent: React.FC = () => {
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
        <AppLoggedIn />
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
