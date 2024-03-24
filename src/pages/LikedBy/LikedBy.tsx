import BasicView from '../../components/BasicView/BasicView';
import { useLikedBy } from '../../hooks/useLikedBy';
import AccountCard from '../../components/AccountCard/AccountCard';
import { usePost } from '../../contexts/PostContext';
import { useEffect, useRef } from 'react';

const LikedBy: React.FC<{ setCurrentPage: (pageName: string) => void }> = ({ setCurrentPage }: { setCurrentPage: (pageName: string) => void }) => {
  const { cachedPost } = usePost();
  const { likedByRes, setLoadMore } = useLikedBy(cachedPost?.post.uri ?? '');
  const bottomBoundaryRef = useRef<HTMLDivElement>(null);
  const isHandlingScroll = useRef(false);

  useEffect(() => {
    setCurrentPage('Liked By')
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
        {likedByRes?.data.likes.map((likedBy, i) => (
            <AccountCard profile={likedBy.actor} key={i} />
        ))}
        <div className='bottom-boundary-ref' ref={bottomBoundaryRef} />
    </BasicView>
  )
}

export default LikedBy;
