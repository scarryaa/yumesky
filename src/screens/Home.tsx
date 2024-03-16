import React, { useEffect } from 'react';
import './Home.scss';
import Post from '../components/Post';
import { type AppBskyFeedDefs } from '@atproto/api';
import BasicView from '../components/BasicView';
import { usePosts } from '../hooks/usePosts';

interface HomeProps {
  selectedTab: string;
  tabs: AppBskyFeedDefs.GeneratorView[];
  setCurrentPage: (pageName: string | null) => void;
}
const Home: React.FC<HomeProps> = ({ selectedTab, tabs, setCurrentPage }: HomeProps) => {
  const timeline = usePosts(selectedTab, tabs);

  useEffect(() => {
    setCurrentPage(null);
  }, []);

  return (
    <BasicView viewPadding={false}>
      {timeline?.map((post) => (
        <Post post={post} key={post.post.cid} />
      ))}
    </BasicView>
  );
};

export default Home;
