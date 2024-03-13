import React from 'react';
import './Link.scss';
import { Link as ReactLink, type LinkProps as ReactLinkProps } from 'react-router-dom';

interface LinkProps extends ReactLinkProps {
  children: React.ReactNode;
  linkStyle: boolean;
}

const Link: React.FC<LinkProps> = ({ children, linkStyle, to, className }: LinkProps) => {
  return (
    <ReactLink to={to} className={`${linkStyle ? '' : 'no-link-style'} ${className}`}>
        {children}
    </ReactLink>
  )
}

export default Link;
