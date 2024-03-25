import './CenteredView.scss';

export const CenteredView: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="centered-view">
        {children}
    </div>
  );
};
