import { useEffect } from 'react';
import BasicView from '../../components/BasicView/BasicView';

interface FeedsProps {
  setCurrentPage: (pageName: string) => void;
}

const Feeds: React.FC<FeedsProps> = ({ setCurrentPage }: FeedsProps) => {
  useEffect(() => {
    setCurrentPage('Feeds');
  });

  return (
    <BasicView padding={false} viewPadding={false}>
        <div>Feeds</div>
    </BasicView>
  )
};

export default Feeds;
