import './BasicView.scss';

interface BasicViewProps {
  children: React.ReactNode;
  padding?: boolean;
  viewPadding: boolean;
  className?: string;
}

const BasicView: React.FC<BasicViewProps> = ({ children, padding, viewPadding, className }: BasicViewProps) => {
  const style: React.CSSProperties = { padding: '0.8rem' }

  return (
    <div className={`basic-view ${className}`} style={(padding ?? false) ? style : {}}>
      <div className='basic-view-inner'>
        {children}
        {viewPadding && <div className='basic-view-padding'></div>}
      </div>
    </div>
  )
}

export default BasicView;
