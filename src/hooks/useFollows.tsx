import { type AppBskyGraphGetFollows } from '@atproto/api';
import agent from '../api/agent';
import { useEffect, useState } from 'react';

export const useFollows = (actor: string): { followsRes: AppBskyGraphGetFollows.Response | undefined; getMoreFollows: () => Promise<void>, loadMore: boolean, setLoadMore: React.Dispatch<React.SetStateAction<boolean>>, setCursor: React.Dispatch<React.SetStateAction<string | undefined>> } => {
  const [followsRes, setFollowsRes] = useState<AppBskyGraphGetFollows.Response | undefined>();
  const [cursor, setCursor] = useState<string | undefined>();
  const [loadMore, setLoadMore] = useState<boolean>(false);

  useEffect(() => {
    const getFollowers = async (actor: string): Promise<void> => {
      if (actor === undefined || actor === '') return;

      const res = await agent.getFollows({ actor });
      setFollowsRes(res);
      setCursor(res.data.cursor);
    };

    void getFollowers(actor);
  }, [actor]);

  useEffect(() => {
    if (loadMore) {
      void getMoreFollows();
      setLoadMore(false);
    }
  }, [loadMore]);

  const getMoreFollows = async (): Promise<void> => {
    if (cursor == null) return;
    const res = await agent.getFollows({ actor, cursor });
    setFollowsRes(prev => ({
      data: {
        follows: [...(prev?.data.follows ?? []), ...(res.data.follows ?? [])],
        subject: res.data.subject,
        cursor: res.data.cursor,
        uri: res.data.uri
      },
      headers: (prev != null) ? prev.headers : res.headers,
      success: (prev != null) ? prev.success && res.success : res.success
    }));
    setCursor(res.data.cursor);
  };

  return { followsRes, getMoreFollows, loadMore, setLoadMore, setCursor };
};
