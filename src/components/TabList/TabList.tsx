import { type DefaultHomeTabs, type DefaultProfileTabs } from '../../config';
import './TabList.scss';

interface TabListProps {
  selectedTab: string;
  onTabClick: (tabKey: DefaultProfileTabs[number] | DefaultHomeTabs[number]) => void;
  tabs: Array<DefaultHomeTabs[number] | DefaultProfileTabs[number] | null>;
  className?: string;
}

const TabList: React.FC<TabListProps> = ({ selectedTab, onTabClick, tabs, className }: TabListProps) => {
  return (
      <div className={`tablist ${className}`}>
        {tabs?.filter(tab => tab !== null).map((tab, i) => (
          <Tab
            key={tab ?? `tab-${i}`}
            name={tab ?? ''}
            onClick={() => { onTabClick(tab ?? 'Posts'); }}
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
