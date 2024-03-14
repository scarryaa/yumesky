import React from 'react';
import './SelectableButton.scss';

interface SelectableButtonProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  left?: boolean;
  right?: boolean;
  borderColor?: string;
}

const SelectableButton: React.FC<SelectableButtonProps> = ({ label, selected, onSelect, left, right, borderColor }: SelectableButtonProps) => {
  const buttonStyle: React.CSSProperties = {
    borderTopLeftRadius: (left ?? false) ? 4 : 0,
    borderBottomLeftRadius: (left ?? false) ? 4 : 0,
    borderTopRightRadius: (right ?? false) ? 4 : 0,
    borderBottomRightRadius: (right ?? false) ? 4 : 0,
    borderRight: (right ?? false) ? `1px solid ${borderColor ?? '#000'}` : 0,
    backgroundColor: selected ? 'red' : 'transparent'
  };

  return (
    <button className='no-button-style selectable-button' style={buttonStyle} onClick={onSelect}>
      {label}
    </button>
  );
};

export default SelectableButton;
