import React from 'react';
import './SelectableButton.scss';

interface SelectableButtonProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  left?: boolean;
  right?: boolean;
}

const SelectableButton: React.FC<SelectableButtonProps> = ({ label, selected, onSelect, left, right }: SelectableButtonProps) => {
  const buttonStyle: React.CSSProperties = {
    borderTopLeftRadius: (left ?? false) ? 4 : 0,
    borderBottomLeftRadius: (left ?? false) ? 4 : 0,
    borderTopRightRadius: (right ?? false) ? 4 : 0,
    borderBottomRightRadius: (right ?? false) ? 4 : 0,
    borderRight: (right ?? false) ? '1px solid var(--border)' : 'transparent',
    backgroundColor: selected ? 'var(--secondary-highlight)' : 'transparent'
  };

  return (
    <button className='no-button-style selectable-button' style={buttonStyle} onClick={onSelect}>
      {label}
    </button>
  );
};

export default SelectableButton;
