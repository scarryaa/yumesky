import './App.scss';
import agent, { getPrefs } from './api/agent';
import MainTopBar from './components/MainTopBar/MainTopBar';
import Sidebar from './components/Sidebar/Sidebar';
import AuthProvider, { useAuth } from './contexts/AuthContext';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import { Routes, Route, HashRouter } from 'react-router-dom';
import Settings from './pages/Settings/Settings';
import ThemeProvider from './contexts/ThemeContext';
import { useEffect, useState } from 'react';
import ThreadView from './pages/ThreadView/ThreadView';
import PostProvider from './contexts/PostContext';
import TabList from './components/TabList/TabList';
import PrefsProvider, { usePrefs } from './contexts/PrefsContext';
import { type AppBskyFeedDefs } from '@atproto/api';
import Profile from './pages/Profile/Profile';
import FeedService from './api/feed';
import config from './config';
import { convertStringArrayToGeneratorViewArray } from './utils';

const App: React.FC = () => {
  return (
    <PrefsProvider>
      <PostProvider>
        <ThemeProvider>
          <AuthProvider>
            <HashRouter>
              <div className="app">
                <AppContent />
              </div>
            </HashRouter>
          </AuthProvider>
        </ThemeProvider>
      </PostProvider>
    </PrefsProvider>
  );
}

const AppLoggedIn: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>(config.DEFAULT_HOME_TABS.TABS[0]);
  const [tabs, setTabs] = useState<string[]>(config.DEFAULT_HOME_TABS.TABS);
  const { setPrefs } = usePrefs();
  const [generators, setGenerators] = useState<AppBskyFeedDefs.GeneratorView[]>(
    convertStringArrayToGeneratorViewArray(config.DEFAULT_HOME_TABS.TABS, config.DEFAULT_HOME_TABS.GENERATORS));

  const handleTabClick = (tabDisplayName: string): void => {
    setSelectedTab(tabDisplayName);
  };

  // get initial info we need
  useEffect(() => {
    const getUserPrefs = async (): Promise<void> => {
      const res = await getPrefs();
      setPrefs(res);

      const gens = await FeedService.getUserFeeds(res);
      setGenerators(gens);
    }

    void getUserPrefs();
  }, []);

  useEffect(() => {
    setTabs(generators.map(generator => generator.displayName));
  }, [generators]);

  return (
    <>
      <Sidebar />
      <div className="current-route">
        <MainTopBar
          component={(currentPage == null) ? <TabList tabs={tabs} selectedTab={selectedTab} onTabClick={handleTabClick} /> : null}
          title={(currentPage != null) ? `${currentPage?.[0].toUpperCase()}${currentPage?.substring(1)}` : null}/>
        <Routes>
          <Route path="/" element={<Home tabs={generators} setCurrentPage={setCurrentPage} selectedTab={selectedTab} />} />
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
