import React, { type CSSProperties, type MouseEvent } from 'react';
import './Link.scss';
import { Link as ReactLink, type LinkProps as ReactLinkProps } from 'react-router-dom';

interface LinkProps extends ReactLinkProps {
  children: React.ReactNode;
  linkStyle: boolean;
  onClick?: (e: MouseEvent) => void;
  style?: CSSProperties;
}

const Link: React.FC<LinkProps> = ({ children, linkStyle, to, className, onClick, style }: LinkProps) => {
  return (
    <ReactLink style={style} onClick={onClick} to={to} className={`${linkStyle ? 'link-style' : 'no-link-style'} ${className}`}>
        {children}
    </ReactLink>
  )
}

export default Link;
