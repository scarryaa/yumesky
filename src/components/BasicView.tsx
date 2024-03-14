import './BasicView.scss';

interface BasicViewProps {
  children: React.ReactNode;
  padding?: boolean;
}

const BasicView: React.FC<BasicViewProps> = ({ children, padding }: BasicViewProps) => {
  const style: React.CSSProperties = { padding: '0.8rem' }

  return (
        <div className='basic-view' style={(padding ?? false) ? style : {}}>
            {children}
        </div>
  )
}

export default BasicView;
