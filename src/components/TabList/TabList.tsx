import './TabList.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

interface TabListProps {
  selectedTab: string;
  onTabClick: (tabKey: string) => void;
  tabs: string[];
  shownTabs: number;
}

const TabList: React.FC<TabListProps> = ({ selectedTab, onTabClick, tabs, shownTabs }: TabListProps) => {
  const [tabsSlice, setTabsSlice] = useState<string[]>([]);

  useEffect(() => {
    setTabsSlice(tabs.slice(0, shownTabs));
  }, [tabs])

  return (
      <div className="tablist">
        {tabsSlice.map((tab) => (
          <Tab
            key={tab}
            name={tab}
            onClick={() => { onTabClick(tab); }}
            className={selectedTab === tab ? 'tab--active' : ''}
          />
        ))}
        {(tabsSlice.length !== tabs.length) && <div className='tablist-more'>
            <FontAwesomeIcon color='var(--text)' icon={faChevronRight} fontSize={16} />
        </div>}
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

export default TabList;
