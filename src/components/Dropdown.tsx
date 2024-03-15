import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { useEffect, useRef, useState } from 'react';
import './Dropdown.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type MenuItem = {
  label: string | 'separator';
  icon?: never;
  iconSize?: never;
  onPress?: never;
} | {
  label: string;
  icon: IconProp;
  iconSize: number;
  onPress: () => void;
};

type ItemProps = React.ComponentProps<(typeof DropdownMenu)['Item']>
const DropdownMenuItem = (props: ItemProps): JSX.Element => {
  return (
        <DropdownMenu.DropdownMenuItem
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
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const clickHandler = (e: MouseEvent): void => {
      const t = e.target;

      if (!open) return;
      if (t == null) return;
      if ((buttonRef.current == null) || (menuRef.current == null)) return;

      if (
        t !== buttonRef.current &&
                !buttonRef.current.contains(t as Node) &&
                t !== menuRef.current &&
                !menuRef.current.contains(t as Node)
      ) {
        e.preventDefault();
        e.stopPropagation();

        setOpen(false);
      }
    }

    const keydownHandler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    }

    document.addEventListener('click', clickHandler, true);
    window.addEventListener('keydown', keydownHandler, true);
    return () => {
      document.removeEventListener('click', clickHandler, true);
      window.removeEventListener('keydown', keydownHandler, true);
    }
  }, [open, setOpen]);

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
                <DropdownMenuItem onSelect={item.onPress} key={index}>
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
