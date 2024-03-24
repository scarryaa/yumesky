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
import { overwriteSession, convertStringArrayToGeneratorViewArray } from './utils';
import { Provider as MutedThreadsProvider } from './state/muted-threads';
import { Provider as HiddenPostsProvider } from './state/hidden-posts';
import { Provider as ModalProvider } from './state/modals/index';
import { Provider as PromptProvider } from './state/prompts/index';
import { Provider as LightboxProvider, useLightbox } from './state/lightbox';
import { Provider as ToastProvider } from './state/toasts';
import { Provider as ComposerProvider } from './hooks/useComposer';
import { Provider as CachedProfileProvider } from './hooks/useCachedProfile';
import { ModalsContainer } from './components/Modal/Modal';
import Hashtag from './pages/Hashtag/Hashtag';
import Feeds from './pages/Feeds/Feeds';
import { LightboxContainer } from './components/Lightbox/Lightbox';
import { PromptContainer } from './components/Prompt/Prompt';
import Notifications from './pages/Notifications/Notifications';
import Composer from './components/Composer/Composer';
import ComposeButton from './components/Composer/ComposeButton';
import { useSelectedTab } from './hooks/useSelectedTab';
import LikedBy from './pages/LikedBy/LikedBy';
import RepostedBy from './pages/Home/RepostedBy/RepostedBy';
import Followers from './pages/Followers/Followers';
import Follows from './pages/Follows/Follows';
import * as persisted from './state/persisted';

const App: React.FC = () => {
  return (
    <PrefsProvider>
      <HiddenPostsProvider>
        <MutedThreadsProvider>
          <ComposerProvider>
            <CachedProfileProvider>
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
            </CachedProfileProvider>
          </ComposerProvider>
        </MutedThreadsProvider>
      </HiddenPostsProvider>
    </PrefsProvider>
  );
}

const AppLoggedIn: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const { selectedTab, tabs, changeTab, setTabs } = useSelectedTab();
  const { setPrefs } = usePrefs();
  const [generators, setGenerators] = useState<AppBskyFeedDefs.GeneratorView[]>(
    convertStringArrayToGeneratorViewArray(getConfig().DEFAULT_HOME_TABS.TABS, getConfig().DEFAULT_HOME_TABS.GENERATORS));

  const handleTabClick = (tabDisplayName: string): void => {
    changeTab(tabDisplayName);
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
    setTabs(generators.map(generator => generator));
  }, [generators]);

  return (
    <>
      <Sidebar />
      <div className="current-route">
        <MainTopBar
          component={(currentPage == null) ? <TabList tabs={tabs?.map(tab => tab.displayName) as DefaultHomeTabs} selectedTab={selectedTab ?? ''} onTabClick={handleTabClick} /> : null}
          title={(currentPage != null) ? `${currentPage?.[0].toUpperCase()}${currentPage?.substring(1)}` : null}/>
        <Routes>
          <Route path="/" element={<Home tabs={generators} setCurrentPage={setCurrentPage} selectedTab={selectedTab ?? ''} />} />
          <Route path="/profile/:username" element={<Profile setCurrentPage={setCurrentPage}/>} />
          <Route path="/profile/:username/post/:id" element={<ThreadView setCurrentPage={setCurrentPage} />} />
          <Route path='/hashtag/:hashtag' element={<Hashtag setCurrentPage={setCurrentPage} />} />
          <Route path='/feeds' element={<Feeds setCurrentPage={setCurrentPage} />} />
          <Route path="/settings" element={<Settings setCurrentPage={setCurrentPage} />} />
          <Route path='/notifications' element={<Notifications setCurrentPage={setCurrentPage} />} />
          <Route path='profile/:username/post/:id/liked-by' element={<LikedBy setCurrentPage={setCurrentPage} />} />
          <Route path='profile/:username/post/:id/reposted-by' element={<RepostedBy setCurrentPage={setCurrentPage} />} />
          <Route path='profile/:username/followers' element={<Followers setCurrentPage={setCurrentPage} />} />
          <Route path='profile/:username/follows' element={<Follows setCurrentPage={setCurrentPage} />} />
        </Routes>
        <Composer />
        <ComposeButton />
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
      const res = (await agent.login({ identifier: username, password }));
      if (res.success) {
        const session = res.data;
        overwriteSession(persisted.get('session'), {
          did: session.did,
          handle: session.handle,
          service: 'https://bsky.social',
          accessJwt: session.accessJwt,
          deactivated: false,
          email: session.email,
          emailConfirmed: session.emailConfirmed,
          refreshJwt: session.refreshJwt
        })
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
