import { useEffect } from 'react';
import { type AppBskyFeedDefs } from '@atproto/api';
import { usePrefs } from '../contexts/PrefsContext';
import './HomeTabs.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import FeedService from '../api/feed';

interface HomeTabsProps {
  selectedTab: string;
  onTabClick: (tabKey: string) => void;
  tabs: AppBskyFeedDefs.GeneratorView[];
  setTabs: React.Dispatch<React.SetStateAction<AppBskyFeedDefs.GeneratorView[]>>;
}

const HomeTabs: React.FC<HomeTabsProps> = ({ selectedTab, onTabClick, setTabs, tabs }: HomeTabsProps) => {
  const { prefs } = usePrefs();

  useEffect(() => {
    const feeds = FeedService.getUserFeeds(prefs);

    const setShownTabs = async (): Promise<void> => {
      setTabs(await feeds);
    }

    void setShownTabs();
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

export interface TabType {
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
