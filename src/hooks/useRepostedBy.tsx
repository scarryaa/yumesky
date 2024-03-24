import { type AppBskyFeedGetRepostedBy } from '@atproto/api'
import agent from '../api/agent'
import { useEffect, useState } from 'react';

export const useRepostedBy = (uri: string): { repostedByRes: AppBskyFeedGetRepostedBy.Response | undefined; getMoreReposts: () => Promise<void>, loadMore: boolean, setLoadMore: React.Dispatch<React.SetStateAction<boolean>> } => {
  const [repostedByRes, setRepostedByRes] = useState<AppBskyFeedGetRepostedBy.Response | undefined>();
  const [cursor, setCursor] = useState<string | undefined>();
  const [loadMore, setLoadMore] = useState<boolean>(false);

  useEffect(() => {
    const getRepostedBy = async (uri: string): Promise<void> => {
      const res = await agent.getRepostedBy({ uri });
      setRepostedByRes(res);
    }

    void getRepostedBy(uri);
  }, []);

  useEffect(() => {
    if (loadMore) {
      void getMoreReposts();
      setLoadMore(false);
    }
  }, [loadMore]);

  const getMoreReposts = async (): Promise<void> => {
    if (cursor == null) return;
    const res = await agent.getRepostedBy({ uri, cursor });
    setRepostedByRes(prev => ({
      data: {
        repostedBy: [...(prev?.data.repostedBy ?? []), ...(res.data.repostedBy ?? [])],
        cursor: res.data.cursor,
        uri: res.data.uri
      },
      headers: (prev != null) ? prev.headers : res.headers,
      success: (prev != null) ? prev.success && res.success : res.success
    }));
    setCursor(res.data.cursor);
  };

  return { repostedByRes, getMoreReposts, loadMore, setLoadMore };
}
