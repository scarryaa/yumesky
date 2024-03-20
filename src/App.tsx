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
import getConfig, { type DefaultHomeTabs } from './config';
import { convertStringArrayToGeneratorViewArray } from './utils';
import { Provider as MutedThreadsProvider } from './state/muted-threads';
import { Provider as HiddenPostsProvider } from './state/hidden-posts';
import { Provider as ModalProvider } from './state/modals/index';
import { Provider as PromptProvider } from './state/prompts/index';
import { Provider as LightboxProvider, useLightbox } from './state/lightbox';
import { Provider as ToastProvider } from './state/toasts';
import { ModalsContainer } from './components/Modal/Modal';
import Hashtag from './pages/Hashtag/Hashtag';
import Feeds from './pages/Feeds/Feeds';
import { LightboxContainer } from './components/Lightbox/Lightbox';
import { PromptContainer } from './components/Prompt/Prompt';
import Notifications from './pages/Notifications/Notifications';

const App: React.FC = () => {
  return (
    <PrefsProvider>
      <HiddenPostsProvider>
        <MutedThreadsProvider>
          <LightboxProvider>
            <PromptProvider>
              <ModalProvider>
                <ToastProvider>
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
                </ToastProvider>
              </ModalProvider>
            </PromptProvider>
          </LightboxProvider>
        </MutedThreadsProvider>
      </HiddenPostsProvider>
    </PrefsProvider>
  );
}

const AppLoggedIn: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>(getConfig().DEFAULT_HOME_TABS.TABS[0]);
  const [tabs, setTabs] = useState<DefaultHomeTabs>(getConfig().DEFAULT_HOME_TABS.TABS);
  const { setPrefs } = usePrefs();
  const [generators, setGenerators] = useState<AppBskyFeedDefs.GeneratorView[]>(
    convertStringArrayToGeneratorViewArray(getConfig().DEFAULT_HOME_TABS.TABS, getConfig().DEFAULT_HOME_TABS.GENERATORS));

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
    setTabs(generators.map(generator => generator.displayName) as DefaultHomeTabs);
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
          <Route path='/hashtag/:hashtag' element={<Hashtag setCurrentPage={setCurrentPage} />} />
          <Route path='/feeds' element={<Feeds setCurrentPage={setCurrentPage} />} />
          <Route path="/settings" element={<Settings setCurrentPage={setCurrentPage} />} />
          <Route path='/notifications' element={<Notifications setCurrentPage={setCurrentPage} />} />
        </Routes>
        <PromptContainer />
        <ModalsContainer />
        <LightboxContainer />
      </div>
    </>
  )
}

const AppContent: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const { isLightboxActive } = useLightbox();

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
      {isLightboxActive && <div className='fake-scrollbar'></div>}
    </div>
  );
}

export default App;
