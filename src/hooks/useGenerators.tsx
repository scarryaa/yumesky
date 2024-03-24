import { type AppBskyFeedDefs } from '@atproto/api';
import { useEffect, useState } from 'react'
import { convertStringArrayToGeneratorViewArray } from '../utils';
import getConfig from '../config';
import FeedService from '../api/feed';
import { usePrefs } from '../contexts/PrefsContext';
import { getPrefs } from '../api/agent';

export const useGenerators = (): { pinnedGenerators: AppBskyFeedDefs.GeneratorView[], setPinnedGenerators: React.Dispatch<React.SetStateAction<AppBskyFeedDefs.GeneratorView[]>>, myGenerators: AppBskyFeedDefs.GeneratorView[] | undefined, setMyGenerators: React.Dispatch<React.SetStateAction<AppBskyFeedDefs.GeneratorView[] | undefined>>,
  discoveryGenerators: AppBskyFeedDefs.GeneratorView[] | undefined, setDiscoveryGenerators: React.Dispatch<React.SetStateAction<AppBskyFeedDefs.GeneratorView[] | undefined>>,
  loadMore: boolean, setLoadMore: React.Dispatch<React.SetStateAction<boolean>> } => {
  const { prefs, setPrefs } = usePrefs();
  const [pinnedGenerators, setPinnedGenerators] = useState<AppBskyFeedDefs.GeneratorView[]>(convertStringArrayToGeneratorViewArray(getConfig().DEFAULT_HOME_TABS.TABS, getConfig().DEFAULT_HOME_TABS.GENERATORS));
  const [myGenerators, setMyGenerators] = useState<AppBskyFeedDefs.GeneratorView[] | undefined>();
  const [discoveryGenerators, setDiscoveryGenerators] = useState<AppBskyFeedDefs.GeneratorView[] | undefined>();
  const [cursor, setCursor] = useState<string | undefined>();
  const [loadMore, setLoadMore] = useState<boolean>(false);

  useEffect(() => {
    setCursor(undefined);

    const getUserPrefs = async (): Promise<void> => {
      const res = await getPrefs();
      setPrefs(res);
    }

    void getUserPrefs();
  }, []);

  useEffect(() => {
    const getPinnedGenerators = async (): Promise<void> => {
      const gens = await FeedService.getPinnedFeeds(prefs);
      setPinnedGenerators(gens);
    }

    void getPinnedGenerators();
  }, [prefs])

  useEffect(() => {
    const getGenerators = async (): Promise<void> => {
      const gens = await FeedService.getMyFeeds(prefs);
      setMyGenerators(gens);

      const discoverGens = await FeedService.getDiscoveryFeeds();
      setDiscoveryGenerators(discoverGens.data.feeds);
    }

    void getGenerators();
  }, [prefs]);

  const loadMoreDiscoveryGens = async (): Promise<void> => {
    const res = await FeedService.getDiscoveryFeeds(cursor);
    setDiscoveryGenerators(prev => prev !== undefined ? [...prev, ...res.data.feeds] : res.data.feeds);
    setCursor(res.data.cursor);
  };

  useEffect(() => {
    if (loadMore) {
      void loadMoreDiscoveryGens();
      setLoadMore(false);
    }
  }, [loadMore]);

  return { pinnedGenerators, setPinnedGenerators, myGenerators, setMyGenerators, discoveryGenerators, setDiscoveryGenerators, loadMore, setLoadMore };
}
