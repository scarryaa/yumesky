import { useEffect } from 'react';
import { AppBskyActorDefs, type AppBskyFeedDefs } from '@atproto/api';
import { usePrefs } from '../contexts/PrefsContext';
import agent from '../api/agent';
import './HomeTabs.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface HomeTabsProps {
  selectedTab: string;
  onTabClick: (tabKey: string) => void;
  tabs: AppBskyFeedDefs.GeneratorView[];
  setTabs: React.Dispatch<React.SetStateAction<AppBskyFeedDefs.GeneratorView[]>>;
}

const HomeTabs: React.FC<HomeTabsProps> = ({ selectedTab, onTabClick, setTabs, tabs }: HomeTabsProps) => {
  const { prefs } = usePrefs();

  useEffect(() => {
    const setTabsFromPrefs = async (prefs: AppBskyActorDefs.Preferences): Promise<void> => {
      // set tabs from prefs
      const savedFeedsPref = prefs.find(
        (pref): pref is AppBskyActorDefs.SavedFeedsPref =>
          AppBskyActorDefs.isSavedFeedsPref(pref)
      );

      // look up feeds from saved
      if (savedFeedsPref !== undefined) {
        const res = await agent.app.bsky.feed.getFeedGenerators({ feeds: savedFeedsPref?.pinned });
        setTabs((prevTabs: AppBskyFeedDefs.GeneratorView[]) => [
          ...prevTabs,
          ...res.data.feeds
        ]);
      }
    }

    void setTabsFromPrefs(prefs);
  }, [prefs]);

  const firstThreeTabs = tabs.slice(0, 3);

  return (
      <div className="home-tabs">
        {firstThreeTabs.map((tab, index) => (
          <Tab
            key={tab.uri}
            name={tab.displayName}
            onClick={() => { onTabClick(tab.displayName); }}
            className={selectedTab === tab.displayName ? 'tab--active' : ''}
          />
        ))}
        <div className='home-more'>
            <FontAwesomeIcon color='var(--text)' icon={faChevronRight} fontSize={16} />
        </div>
      </div>
  );
};

interface TabType {
  name: string;
  onClick?: () => void;
  key: string;
  className?: string;
  uri?: string;
}
const Tab: React.FC<TabType> = ({ name, onClick, className }: TabType) => {
  return (
        <div className={`tab ${className}`} onClick={onClick}>
          {name}
        </div>
  )
}

export default HomeTabs;
