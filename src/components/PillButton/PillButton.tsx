import './PillButton.scss';

interface PillButtonProps {
  color: string;
  children: React.ReactNode;
  className?: string;
}
const PillButton: React.FC<PillButtonProps> = ({ children, color, className }: PillButtonProps) => {
  return (
    <button className={`no-button-style button ${className}`}>
        {children}
    </button>
  )
}

export default PillButton;
