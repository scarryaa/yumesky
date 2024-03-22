import { useState, useEffect, useMemo } from 'react';
import { type AppBskyFeedDefs } from '@atproto/api';
import agent, { getTimeline } from '../api/agent';

const PAGE_SIZE = 30;

export const usePosts = (selectedTab: string = 'Following', tabs: AppBskyFeedDefs.GeneratorView[] = []): { timeline: AppBskyFeedDefs.FeedViewPost[] | undefined, loadMore: boolean, setLoadMore: React.Dispatch<React.SetStateAction<boolean>>, loadMorePosts: () => Promise<void> } => {
  const [timeline, setTimeline] = useState<AppBskyFeedDefs.FeedViewPost[] | undefined>(undefined);
  const [cursor, setCursor] = useState<string | undefined>();
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    setTimeline([]);
    setCursor(undefined);
    void refreshTimeline();
  }, [selectedTab]);

  const refreshTimeline = async (): Promise<void> => {
    await loadPosts(undefined);
  }

  const loadMorePosts = async (): Promise<void> => {
    await loadPosts(cursor);
  }

  const loadPosts = async (cursor: string | undefined): Promise<void> => {
    const selected = tabs.find(t => t.displayName === selectedTab);
    if (selected === undefined) return;

    let res;
    switch (selected.displayName.toLowerCase()) {
      // Default is always 'Following'
      case 'following': {
        res = await getTimeline(cursor, PAGE_SIZE);
        setCursor(res.data.cursor);

        if (res === undefined) return;

        const newPosts = res.data.feed;
        const uniquePosts = filterDuplicatePosts(newPosts);

        setTimeline(prevTimeline => {
          if (prevTimeline === undefined) {
            return uniquePosts;
          } else {
            return [...prevTimeline, ...uniquePosts];
          }
        });
        break;
      }
      // Get feed
      default: {
        // TODO: Create API call for this
        res = await agent.api.app.bsky.feed.getFeed({ feed: selected.uri, cursor: cursor ?? '', limit: PAGE_SIZE });

        if (res === undefined) return;

        const newPosts = res.data.feed;
        const uniquePosts = filterDuplicatePosts(newPosts);

        setTimeline(prevTimeline => {
          if (prevTimeline === undefined) {
            return uniquePosts;
          } else {
            return [...prevTimeline, ...uniquePosts];
          }
        });

        setCursor(res.data.cursor);
        break;
      }
    }
  }

  useEffect(() => {
    if (loadMore) {
      void loadMorePosts();
      setLoadMore(false);
    }
  }, [cursor, loadMore]);

  const filterDuplicatePosts = useMemo(() => (posts: AppBskyFeedDefs.FeedViewPost[]): AppBskyFeedDefs.FeedViewPost[] => {
    const uniqueCids = new Set<string>();
    return posts.filter(post => {
      if (uniqueCids.has(post.post.cid)) {
        return false;
      } else {
        uniqueCids.add(post.post.cid);
        return true;
      }
    });
  }, []);

  return { timeline, loadMore, setLoadMore, loadMorePosts };
};
