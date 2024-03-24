import React, { useEffect, useRef } from 'react';
import './Home.scss';
import Post from '../../components/Post/Post';
import { type AppBskyFeedDefs } from '@atproto/api';
import BasicView from '../../components/BasicView/BasicView';
import { usePosts } from '../../hooks/usePosts';

interface HomeProps {
  selectedTab: string;
  tabs: AppBskyFeedDefs.GeneratorView[];
  setCurrentPage: (pageName: string | null) => void;
}

const Home: React.FC<HomeProps> = ({ selectedTab, tabs, setCurrentPage }: HomeProps) => {
  const { timeline, loadMore, setLoadMore } = usePosts(selectedTab, tabs);
  const bottomBoundaryRef = useRef<HTMLDivElement>(null);
  const isHandlingScroll = useRef(false);

  useEffect(() => {
    setCurrentPage(null);
  }, []);

  const handleScroll = async (): Promise<void> => {
    if (bottomBoundaryRef.current === null) return;
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
  }, [loadMore]);

  return (
    <BasicView viewPadding={false}>
      {timeline?.map((post, i) => (
        <Post post={post} key={`${post.post.cid}_${i}`} />
      ))}
      <div className='bottom-boundary-ref' ref={bottomBoundaryRef} />
    </BasicView>
  );
};

export default Home;
