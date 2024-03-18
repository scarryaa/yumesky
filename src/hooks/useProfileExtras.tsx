import { useEffect, useState } from 'react';
import agent from '../api/agent';

export const useProfileExtras = (actor: string | undefined): { hasLists: boolean, hasFeedgens: boolean } => {
  const [hasLists, setHasLists] = useState<boolean>(false);
  const [hasFeedgens, setHasFeedgens] = useState<boolean>(false);

  useEffect(() => {
    const getProfileExtras = async (): Promise<void> => {
      if (actor === undefined) return;

      const [listsRes, feedsRes] = await Promise.all([
        agent.app.bsky.graph.getLists({ actor }),
        agent.app.bsky.feed.getActorFeeds({ actor })
      ]);

      if (listsRes.success) setHasLists(listsRes.data.lists.length > 0);
      if (feedsRes.success) setHasFeedgens(feedsRes.data.feeds.length > 0);
    }

    void getProfileExtras();
  }, [actor]);

  return { hasFeedgens, hasLists };
}
