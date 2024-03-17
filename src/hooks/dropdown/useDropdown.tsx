import { useState, useRef, useEffect } from 'react';

interface UseDropdownProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  buttonRef: React.Ref<HTMLButtonElement>;
  menuRef: React.Ref<HTMLDivElement>;
}
const useDropdown = (initialState = false): UseDropdownProps => {
  const [open, setOpen] = useState(initialState);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (e: MouseEvent): void => {
      const target = e.target;

      if (!open) return;
      if (target == null) return;
      if ((buttonRef.current == null) || (menuRef.current == null)) return;

      if (
        target !== buttonRef.current &&
            !buttonRef.current.contains(target as Node) &&
            target !== menuRef.current &&
            !menuRef.current.contains(target as Node)
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
  }, [open]);

  return { open, setOpen, buttonRef, menuRef };
};

export default useDropdown;
