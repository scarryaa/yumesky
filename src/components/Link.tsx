import React from 'react';
import './Link.scss';
import { Link as ReactLink, type LinkProps as ReactLinkProps } from 'react-router-dom';

interface LinkProps extends ReactLinkProps {
  children: React.ReactNode;
  linkStyle: boolean;
  onClick?: () => void;
}

const Link: React.FC<LinkProps> = ({ children, linkStyle, to, className, onClick }: LinkProps) => {
  return (
    <ReactLink onClick={onClick} to={to} className={`${linkStyle ? 'link-style' : 'no-link-style'} ${className}`}>
        {children}
    </ReactLink>
  )
}

export default Link;
