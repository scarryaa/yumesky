import BasicView from '../../components/BasicView/BasicView';
import AccountCard from '../../components/AccountCard/AccountCard';
import { useEffect, useRef } from 'react';
import { useFollowers } from '../../hooks/useFollowers';
import { useParams } from 'react-router-dom';

const Followers: React.FC<{ setCurrentPage: (pageName: string) => void }> = ({ setCurrentPage }: { setCurrentPage: (pageName: string) => void }) => {
  const { username } = useParams();
  const { followersRes, setLoadMore, setCursor } = useFollowers(username ?? '');
  const bottomBoundaryRef = useRef<HTMLDivElement>(null);
  const isHandlingScroll = useRef(false);

  useEffect(() => {
    setCurrentPage('Followers');
    setCursor(undefined);
  }, []);

  const handleScroll = async (): Promise<void> => {
    if (bottomBoundaryRef.current === null || isHandlingScroll.current) return;
    isHandlingScroll.current = true;

    const bottomBoundary = bottomBoundaryRef.current.getBoundingClientRect().top - window.innerHeight;
    if (bottomBoundary < 0 || (bottomBoundary < 300 && bottomBoundary > 0)) {
      setLoadMore(true);
    }

    setTimeout(() => {
      isHandlingScroll.current = false;
    }, 500);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <BasicView viewPadding={false}>
        {followersRes?.data.followers.map((follower, i) => (
            <AccountCard profile={follower} key={i} />
        ))}
        <div className='bottom-boundary-ref' ref={bottomBoundaryRef} />
    </BasicView>
  )
}

export default Followers;
