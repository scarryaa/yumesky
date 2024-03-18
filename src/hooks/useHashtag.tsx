import { type AppBskyFeedDefs } from '@atproto/api';
import { useEffect, useState } from 'react';
import agent from '../api/agent';

export const useHashtag = (hashtag: string | undefined): AppBskyFeedDefs.PostView[] | undefined => {
  const [posts, setPosts] = useState<AppBskyFeedDefs.PostView[] | undefined>();

  useEffect(() => {
    const getHashtagPosts = async (hashtag: string): Promise<void> => {
      const res = await agent.api.app.bsky.feed.searchPosts({ q: hashtag });
      if (res.success) {
        setPosts(res.data.posts);
      } else {
        throw new Error('Failed to search posts');
      }
    }

    void getHashtagPosts(hashtag ?? '');
  }, [])

  return posts;
}
