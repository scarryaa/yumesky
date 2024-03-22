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

  useEffect(() => {
    setCurrentPage(null);
  }, []);

  const handleScroll = async (): Promise<void> => {
    if (bottomBoundaryRef.current === null) return;
    const bottomBoundary = bottomBoundaryRef.current.getBoundingClientRect().top - window.innerHeight;
    if (bottomBoundary < 0) {
      setLoadMore(true);
      console.log(loadMore);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore]);

  return (
    <BasicView viewPadding={false}>
      {timeline?.map((post) => (
        <Post post={post} key={post.post.cid} />
      ))}
      <div className='bottom-boundary-ref' ref={bottomBoundaryRef} />
    </BasicView>
  );
};

export default Home;
