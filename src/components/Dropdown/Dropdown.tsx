import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import './Dropdown.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useDropdown from '../../hooks/dropdown/useDropdown';
import React, { type MouseEvent } from 'react';

export type MenuItem = {
  label: string | 'separator';
  icon?: never;
  iconSize?: never;
  onClick?: never;
} | {
  label: string;
  icon: IconProp;
  iconSize: number;
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
};

type ItemProps = React.ComponentProps<(typeof DropdownMenu)['Item']>
const DropdownMenuItem = (props: ItemProps & { onClick: (e: MouseEvent<HTMLDivElement>) => void }): JSX.Element => {
  return (
        <DropdownMenu.DropdownMenuItem
        onClick={e => { props?.onClick(e); }}
        className={'dropdown-menu-item'}>
            {props.children}
        </DropdownMenu.DropdownMenuItem>
  )
};

interface DropdownProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  items: MenuItem[];
}
const Dropdown: React.FC<DropdownProps> = ({ children, style, items }: DropdownProps) => {
  const { setOpen, buttonRef, menuRef } = useDropdown();

  return (
    <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
            <button style={style} className='no-button-style' onClick={() => { setOpen(o => !o); }} ref={buttonRef}>
                {children}
            </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
            <DropdownMenu.Content className='dropdown' ref={menuRef} sideOffset={5}>
            {items.map((item, index) => {
              if (item.label === 'separator') {
                return (
                    <DropdownMenu.Separator
                    className='separator'
                    key={index}>

                    </DropdownMenu.Separator>)
              }

              return (
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  if (item.onClick !== undefined) { item.onClick(e); }
                }}
                    key={index}>
                    <span>{item.label}</span>
                    {item.icon !== undefined && <FontAwesomeIcon className='dropdown-icon' icon={item.icon} fontSize={item.iconSize} />}
                </DropdownMenuItem>
              )
            })}
            </DropdownMenu.Content>
        </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default Dropdown;
