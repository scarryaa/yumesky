import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './MainTopBar.scss';
import { faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import ProfileIcon from './ProfileIcon';

const MainTopBar: React.FC = () => {
  return (
    <div className='main-top-bar'>
        <FontAwesomeIcon icon={faBell} fontSize={20} />
        <FontAwesomeIcon icon={faEnvelope} fontSize={20} />
        <ProfileIcon size={40} />
    </div>
  )
}

export default MainTopBar;
