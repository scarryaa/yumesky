import './BasicView.scss';

interface BasicViewProps {
  children: React.ReactNode;
  padding?: boolean;
  viewPadding: boolean;
}

const BasicView: React.FC<BasicViewProps> = ({ children, padding, viewPadding }: BasicViewProps) => {
  const style: React.CSSProperties = { padding: '0.8rem' }

  return (
        <div className='basic-view' style={(padding ?? false) ? style : {}}>
            {children}
            {viewPadding && <div className='basic-view-padding'></div>}
        </div>
  )
}

export default BasicView;
