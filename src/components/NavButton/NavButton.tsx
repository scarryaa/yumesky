import React from 'react';
import './NavButton.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type Transform, type IconProp } from '@fortawesome/fontawesome-svg-core';
import { Link } from 'react-router-dom';

interface NavButtonProps {
  icon: IconProp;
  size: number;
  link: string;
  active: boolean;
  transform?: string | Transform;
  onClick?: () => void;
}
const NavButton: React.FC<NavButtonProps> = ({ icon, size, link, active, transform, onClick }) => {
  return (
    <Link to={link} onClick={onClick} className='nav-link'>
        <button className='nav-button no-button-style'>
            <FontAwesomeIcon transform={(active && transform !== null) ? transform : ''} icon={icon} fontSize={size}/>
        </button>
    </Link>
  );
};

export default NavButton;
