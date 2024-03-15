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
      const uniquePosts = filterDuplicatePosts(res);
      setPosts(uniquePosts);
    };

    void getPosts();
  }, []);

  const filterDuplicatePosts = (posts: AppBskyFeedDefs.FeedViewPost[]): AppBskyFeedDefs.FeedViewPost[] => {
    const uniqueCids = new Set<string>();
    return posts.filter(post => {
      if (uniqueCids.has(post.post.cid)) {
        return false;
      } else {
        uniqueCids.add(post.post.cid);
        return true;
      }
    });
  };

  return (
    <BasicView>
      {posts.map((post, index) => (
        <Post post={post} key={index} />
      ))}
    </BasicView>
  );
};

export default Home;
