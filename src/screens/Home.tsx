import React, { useEffect, useState } from 'react';
import './Home.scss';
import Post from '../components/Post';
import agent, { getTimeline } from '../api/agent';
import { type AppBskyFeedDefs } from '@atproto/api';
import BasicView from '../components/BasicView';

interface HomeProps {
  selectedTab: string;
  tabs: AppBskyFeedDefs.GeneratorView[];
  setCurrentPage: (pageName: string | null) => void;
}
const Home: React.FC<HomeProps> = ({ selectedTab, tabs, setCurrentPage }: HomeProps) => {
  const [posts, setPosts] = useState<AppBskyFeedDefs.FeedViewPost[]>([]);

  setCurrentPage(null);

  useEffect(() => {
    const getPosts = async (): Promise<void> => {
      const selected = tabs.find(t => t.displayName === selectedTab);
      console.log(selected);
      if (selected !== undefined) {
        switch (selected.displayName) {
          // default is always 'Following'
          case 'Following': {
            console.log('e');
            const res = await getTimeline();
            const uniquePosts = filterDuplicatePosts(res);
            setPosts(uniquePosts);
            break;
          }
          // get feed
          default: {
            // TODO create api call for this
            const res = (await agent.api.app.bsky.feed.getFeed({ feed: selected.uri })).data.feed;
            const uniquePosts = filterDuplicatePosts(res);
            setPosts(uniquePosts);
            break;
          }
        }
      }
    };

    void getPosts();
  }, [selectedTab]);

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
    <BasicView viewPadding={false}>
      {posts.map((post, index) => (
        <Post post={post} key={index} />
      ))}
    </BasicView>
  );
};

export default Home;
