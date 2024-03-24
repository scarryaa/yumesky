import { AppBskyActorDefs, type AppBskyFeedDefs } from '@atproto/api';
import agent from './agent';

interface FeedParameters {
  feed: string;
  cursor?: string;
  limit?: number;
}

interface FeedResponse {
  cursor?: string | undefined;
  feed: AppBskyFeedDefs.FeedViewPost[];
}

const FeedService = {
  getFeed: async ({ feed, cursor, limit }: FeedParameters): Promise<FeedResponse> => {
    const res = await agent.app.bsky.feed.getFeed({ feed, cursor, limit });
    if (res.success) {
      return { cursor: res.data.cursor, feed: res.data.feed }
    }

    return {
      feed: []
    }
  },

  getMyFeeds: async (prefs: AppBskyActorDefs.Preferences) => {
    const feedsPref = prefs.find(
      (pref): pref is AppBskyActorDefs.SavedFeedsPref =>
        AppBskyActorDefs.isSavedFeedsPref(pref)
    );

    if (feedsPref !== undefined) {
      const res = await agent.app.bsky.feed.getFeedGenerators({
        feeds: (((feedsPref?.saved) != null) && feedsPref.pinned !== null)
          ? [...feedsPref?.saved, ...feedsPref?.pinned.filter((feed) => feedsPref.saved.find((f) => f === feed) == null)]
          : ((feedsPref?.saved) != null)
              ? feedsPref.saved
              : ((feedsPref?.pinned) != null) ? feedsPref.pinned : []
      });

      return res.data.feeds;
    }

    return [];
  },

  getPinnedFeeds: async (prefs: AppBskyActorDefs.Preferences): Promise<AppBskyFeedDefs.GeneratorView[]> => {
    const pinneedFeedsPref = prefs.find(
      (pref): pref is AppBskyActorDefs.SavedFeedsPref =>
        AppBskyActorDefs.isSavedFeedsPref(pref)
    );

    if (pinneedFeedsPref !== undefined) {
      const res = await agent.app.bsky.feed.getFeedGenerators({ feeds: pinneedFeedsPref?.pinned });
      const followingFeed = { displayName: 'Following', cid: '', uri: '', indexedAt: '', did: '', creator: { did: '', handle: '' } };
      res.data.feeds.unshift(followingFeed);

      return res.data.feeds;
    }

    return [];
  },

  getDiscoveryFeeds: async (cursor?: string | undefined) => {
    const res = await agent.app.bsky.feed.getSuggestedFeeds({ cursor });
    return res;
  }
}

export default FeedService;
