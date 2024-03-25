import './PillButton.scss';

interface PillButtonProps {
  color: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
const PillButton: React.FC<PillButtonProps> = ({ children, color, className, onClick }: PillButtonProps) => {
  return (
    <button onClick={onClick} className={`no-button-style button ${className}`}>
        {children}
    </button>
  )
}

export default PillButton;
