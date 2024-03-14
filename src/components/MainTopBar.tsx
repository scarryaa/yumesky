import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './MainTopBar.scss';
import { faBell, faCog, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import ProfileIcon from './ProfileIcon';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import Link from './Link';

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
}
const MainTopBar: React.FC<MainTopBarProps> = ({ title }: MainTopBarProps) => {
  return (
    <div className='main-top-bar'>
        {(title != null) ? <span className='main-top-bar-title'>{title}</span> : <div></div>}
        <div className='main-top-bar-buttons'>
            <TopBarButton link='/settings' icon={faCog} fontSize={20} />
            <TopBarButton link='/notifications' icon={faBell} fontSize={20} />
            <TopBarButton link='/messages' icon={faEnvelope} fontSize={20} />
            <ProfileIcon className='main-top-bar-profile-icon' size={40} />
        </div>
    </div>
  )
}

export default MainTopBar;
