import './TabList.scss';

interface TabListProps {
  selectedTab: string;
  onTabClick: (tabKey: string) => void;
  tabs: string[];
  className?: string;
}

const TabList: React.FC<TabListProps> = ({ selectedTab, onTabClick, tabs, className }: TabListProps) => {
  return (
      <div className={`tablist ${className}`}>
        {tabs.map((tab) => (
          <Tab
            key={tab}
            name={tab}
            onClick={() => { onTabClick(tab); }}
            className={selectedTab === tab ? 'tab--active' : ''}
          />
        ))}
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
          <span className='tab-name'>{name}</span>
          <div className='tab-border'></div>
        </div>
  )
}

export default TabList;
