import React from 'react';
import './Sidebar.scss';
import { faBell, faHashtag, faHome, faList } from '@fortawesome/free-solid-svg-icons';
import NavButton from './NavButton';

const Sidebar: React.FC = () => {
  return (
    <ul className='sidebar-container'>
        <li>
            <NavButton active={true} link='/' icon={faHome} size={22}/>
        </li>
        <li>
            <NavButton active={false} link='/#' icon={faHashtag} size={22}/>
        </li>
        <li>
            <NavButton active={false} link='/notifications' icon={faBell} size={22}/>
        </li>
        <li>
            <NavButton active={false} link='/lists' icon={faList} size={22}/>
        </li>
    </ul>
  );
};

export default Sidebar;
