import { useState, useEffect, useMemo } from 'react';
import agent, { getTimeline } from '../api/agent';
import { type AppBskyFeedDefs } from '@atproto/api';

export const usePosts = (selectedTab: string = 'Following', tabs: AppBskyFeedDefs.GeneratorView[] = []): { timeline: AppBskyFeedDefs.FeedViewPost[] | undefined, refreshTimeline: (() => Promise<void>) } => {
  const [timeline, setTimeline] = useState<AppBskyFeedDefs.FeedViewPost[] | undefined>(undefined);

  useEffect(() => {
    void refreshTimeline();
  }, [selectedTab]);

  const refreshTimeline = async (): Promise<void> => {
    const selected = tabs.find(t => t.displayName === selectedTab);

    switch (selected?.displayName.toLowerCase()) {
      // default is always 'Following'
      case undefined:
      case 'following': {
        const res = await getTimeline();
        const uniquePosts = filterDuplicatePosts(res);
        setTimeline(uniquePosts);
        break;
      }
      // get feed
      default: {
        if (selected === undefined) return;
        // TODO create api call for this
        const res = (await agent.api.app.bsky.feed.getFeed({ feed: selected.uri })).data.feed;
        const uniquePosts = filterDuplicatePosts(res);
        setTimeline(uniquePosts);
        break;
      }
    }
  }

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

  return { timeline, refreshTimeline };
};
