import { type AppBskyFeedGetLikes } from '@atproto/api';
import agent from '../api/agent';
import { useEffect, useState } from 'react';

export const useLikedBy = (uri: string): { likedByRes: AppBskyFeedGetLikes.Response | undefined; getMoreLikes: () => Promise<void>, loadMore: boolean, setLoadMore: React.Dispatch<React.SetStateAction<boolean>> } => {
  const [likedByRes, setLikedByRes] = useState<AppBskyFeedGetLikes.Response | undefined>();
  const [cursor, setCursor] = useState<string | undefined>();
  const [loadMore, setLoadMore] = useState<boolean>(false);

  useEffect(() => {
    const getLikedBy = async (uri: string): Promise<void> => {
      const res = await agent.getLikes({ uri });
      setLikedByRes(res);
      setCursor(res.data.cursor);
    };

    void getLikedBy(uri);
  }, []);

  useEffect(() => {
    if (loadMore) {
      void getMoreLikes();
      setLoadMore(false);
    }
  }, [loadMore]);

  const getMoreLikes = async (): Promise<void> => {
    if (cursor == null) return;
    const res = await agent.getLikes({ uri, cursor });
    setLikedByRes(prev => ({
      data: {
        likes: [...(prev?.data.likes ?? []), ...(res.data.likes ?? [])],
        cursor: res.data.cursor,
        uri: res.data.uri
      },
      headers: (prev != null) ? prev.headers : res.headers,
      success: (prev != null) ? prev.success && res.success : res.success
    }));
    setCursor(res.data.cursor);
  };

  return { likedByRes, getMoreLikes, loadMore, setLoadMore };
};
