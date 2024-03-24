import { useEffect, useRef } from 'react';
import AccountCard from '../../../components/AccountCard/AccountCard';
import BasicView from '../../../components/BasicView/BasicView';
import { usePost } from '../../../contexts/PostContext';
import { useRepostedBy } from '../../../hooks/useRepostedBy';

const ReposteedBy: React.FC<{ setCurrentPage: (pageName: string) => void }> = ({ setCurrentPage }: { setCurrentPage: (pageName: string) => void }) => {
  const { cachedPost } = usePost();
  const { repostedByRes, setLoadMore } = useRepostedBy(cachedPost?.post.uri ?? '');
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
        {repostedByRes?.data.repostedBy.map((repostedBy, i) => (
            <AccountCard profile={repostedBy} key={i} />
        ))}
        <div className='bottom-boundary-ref' ref={bottomBoundaryRef} />
    </BasicView>
  )
}

export default ReposteedBy;
