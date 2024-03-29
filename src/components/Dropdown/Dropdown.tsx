import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import './Dropdown.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useDropdown from '../../hooks/dropdown/useDropdown';
import React, { useRef, type MouseEvent } from 'react';

export type MenuItem = {
  label: 'separator';
  icon?: never;
  iconSize?: never;
  onClick?: never;
  img?: never;
  accountName?: never;
} | {
  label: string;
  icon: IconProp;
  iconSize: number;
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  img?: never;
  accountName?: never;
} | {
  label: 'account';
  icon?: never;
  iconSize?: never;
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  img: string;
  accountName: string;
} | {
  label: 'add-account';
  icon: IconProp;
  iconSize: number;
  onClick?: never;
  img?: never;
  accountName?: never;
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
  const { setOpen, menuRef } = useDropdown();
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild className='no-button-style' onClick={() => { setOpen(o => !o); }} ref={ref}>
          {children}
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
            <DropdownMenu.Content className='dropdown' ref={menuRef} sideOffset={5}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}>
            {items.map((item, index) => {
              if (item.label === 'account') {
                return <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  if (item.onClick !== undefined) { item.onClick(e); }
                }}
                key={index}>
                  <img className='dropdown-account-image' src={item.img} />
                  <span>{item.accountName}</span>
                </DropdownMenuItem>
              }

              if (item.label === 'add-account') {
                return (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    if (item.onClick !== undefined) { item.onClick(e); }
                  }}
                      key={index}>
                      {item.icon !== undefined && <FontAwesomeIcon className='dropdown-icon' icon={item.icon} transform={{ x: 8, size: 30 }} fontSize={item.iconSize} />}
                      <span>Add account</span>
                  </DropdownMenuItem>
                )
              }

              if (item.label === 'separator') {
                return (
                    <DropdownMenu.Separator onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
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
