import './TabList.scss';

interface TabListProps {
  selectedTab: string;
  onTabClick: (tabKey: string) => void;
  tabs: string[];
}

const TabList: React.FC<TabListProps> = ({ selectedTab, onTabClick, tabs }: TabListProps) => {
  return (
      <div className="tablist">
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
          {name}
        </div>
  )
}

export default TabList;
