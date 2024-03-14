import React, { useEffect, useState } from 'react';
import './Home.scss';
import Post from '../components/Post';
import { getTimeline } from '../api/agent';
import { type AppBskyFeedDefs } from '@atproto/api';
import BasicView from '../components/BasicView';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<AppBskyFeedDefs.FeedViewPost[]>([]);

  useEffect(() => {
    const getPosts = async (): Promise<void> => {
      const res = await getTimeline();
      setPosts(res);
    }

    void getPosts();
  }, []);

  return (
    <BasicView>
        {posts.map((post, index) => (
            <Post post={post} key={index}/>
        ))}
    </BasicView>
  );
};

export default Home;
