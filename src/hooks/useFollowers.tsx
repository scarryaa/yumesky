import { type AppBskyGraphGetFollowers } from '@atproto/api';
import agent from '../api/agent';
import { useEffect, useState } from 'react';

export const useFollowers = (actor: string): { followersRes: AppBskyGraphGetFollowers.Response | undefined; getMoreFollowers: () => Promise<void>, loadMore: boolean, setLoadMore: React.Dispatch<React.SetStateAction<boolean>>, setCursor: React.Dispatch<React.SetStateAction<string | undefined>> } => {
  const [followersRes, setFollowersRes] = useState<AppBskyGraphGetFollowers.Response | undefined>();
  const [cursor, setCursor] = useState<string | undefined>();
  const [loadMore, setLoadMore] = useState<boolean>(false);

  useEffect(() => {
    const getFollowers = async (actor: string): Promise<void> => {
      if (actor === undefined || actor === '') return;

      const res = await agent.getFollowers({ actor });
      setFollowersRes(res);
      setCursor(res.data.cursor);
    };

    void getFollowers(actor);
  }, [actor]);

  useEffect(() => {
    if (loadMore) {
      void getMoreFollowers();
      setLoadMore(false);
    }
  }, [loadMore]);

  const getMoreFollowers = async (): Promise<void> => {
    if (cursor == null) return;
    const res = await agent.getFollowers({ actor, cursor });
    setFollowersRes(prev => ({
      data: {
        followers: [...(prev?.data.followers ?? []), ...(res.data.followers ?? [])],
        subject: res.data.subject,
        cursor: res.data.cursor,
        uri: res.data.uri
      },
      headers: (prev != null) ? prev.headers : res.headers,
      success: (prev != null) ? prev.success && res.success : res.success
    }));
    setCursor(res.data.cursor);
  };

  return { followersRes, getMoreFollowers, loadMore, setLoadMore, setCursor };
};
