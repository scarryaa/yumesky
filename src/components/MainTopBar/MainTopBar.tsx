import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './MainTopBar.scss';
import { faArrowsUpDown, faBell, faCog, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import ProfileIcon from '../ProfileIcon/ProfileIcon';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import Link from '../Link/Link';
import useAccountSwitchDropdown from '../../hooks/dropdown/useAccountSwitchDropdown';
import Dropdown from '../Dropdown/Dropdown';

interface TopBarButtonProps {
  icon: IconProp;
  fontSize: number;
  link: string;
}
const TopBarButton: React.FC<TopBarButtonProps> = ({ icon, fontSize, link }: TopBarButtonProps) => {
  return (
    <Link linkStyle={false} to={link} className='nav-link'>
        <button className='main-top-bar-button no-button-style'>
            <FontAwesomeIcon icon={icon} fontSize={fontSize} />
        </button>
    </Link>
  )
}

interface MainTopBarProps {
  title?: string | null;
  component?: React.ReactNode;
}
const MainTopBar: React.FC<MainTopBarProps> = ({ title, component }: MainTopBarProps) => {
  const { dropdownItems } = useAccountSwitchDropdown();

  return (
    <div className='main-top-bar' style={{ paddingLeft: title !== null ? '1rem' : 0 }}>
        {component !== null && <div className='main-top-bar-component'>{component}</div>}
        {title !== null && <span className='main-top-bar-title'>{title}</span>}
        <div className='main-top-bar-buttons'>
            <TopBarButton link='/settings' icon={faCog} fontSize={20} />
            <TopBarButton link='/notifications' icon={faBell} fontSize={20} />
            <TopBarButton link='/messages' icon={faEnvelope} fontSize={20} />
            <ProfileIcon className='main-top-bar-profile-icon' size={40} />
            <Dropdown items={dropdownItems}>
              <button className='no-button-style main-top-bar-account-switch-button'>
                  <FontAwesomeIcon className='main-top-bar-account-switch-icon' icon={faArrowsUpDown} fontSize={16} fill='var(--white)' color='var(--white)' />
              </button>
            </Dropdown>
        </div>
    </div>
  )
}

export default MainTopBar;
