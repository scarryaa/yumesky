import { type AppBskyFeedDefs, type AppBskyActorDefs, type AppBskyGraphDefs } from '@atproto/api';
import { useEffect, useMemo, useState } from 'react';
import agent from '../api/agent';
import { type DefaultHomeTabs, type DefaultProfileTabs } from '../config';

const PAGE_SIZE = 30;

export const useProfile = (actor: string | undefined): AppBskyActorDefs.ProfileViewDetailed | undefined => {
  const [profile, setProfile] = useState<AppBskyActorDefs.ProfileViewDetailed | undefined>();

  useEffect(() => {
    const getActorProfile = async (): Promise<void> => {
      if (actor === undefined) return;

      const res = await agent.getProfile({ actor });

      if (res.success) {
        setProfile(res.data);
      }
    }

    void getActorProfile();
  }, [actor]);

  return profile;
}

export const useProfilePosts = (actor: string | undefined, selectedTab: (DefaultProfileTabs | DefaultHomeTabs)[number]): { posts: AppBskyFeedDefs.FeedViewPost[] | undefined, feeds: AppBskyFeedDefs.GeneratorView[] | undefined, lists: AppBskyGraphDefs.ListView[] | undefined, setLoadMore: React.Dispatch<React.SetStateAction<boolean>>, loadMore: boolean,
  loadMorePosts: () => void } => {
  const [posts, setPosts] = useState<AppBskyFeedDefs.FeedViewPost[] | undefined>();
  const [feeds, setFeeds] = useState<AppBskyFeedDefs.GeneratorView[] | undefined>();
  const [lists, setLists] = useState<AppBskyGraphDefs.ListView[] | undefined>();
  const [loadMore, setLoadMore] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();

  useEffect(() => {
    void getPosts(undefined);
  }, [actor])

  const loadMorePosts = async (): Promise<void> => {
    if (actor === undefined) return;
    await getPosts(cursor);
  }

  const getPosts = async (cursor: string | undefined): Promise<void> => {
    if (actor === undefined || selectedTab === undefined) return;

    let res;
    switch (selectedTab) {
      case 'Posts':
      case 'Replies':
      case 'Media':
      case 'Likes': {
        const filter = selectedTab === 'Likes' ? 'posts_liked' : selectedTab === 'Media' ? 'posts_with_media' : `posts_${selectedTab === 'Posts' ? 'no_' : 'with_'}replies`;
        if (selectedTab === 'Likes') {
          res = await agent.getActorLikes({ actor: actor ?? '', cursor, limit: PAGE_SIZE });
        } else {
          res = await agent.api.app.bsky.feed.getAuthorFeed({ actor: actor ?? '', filter, cursor, limit: PAGE_SIZE });
        }

        if (res.success) {
          const newPosts = res.data.feed;

          if (cursor === undefined) {
            setPosts(newPosts);
            setCursor(res.data.cursor);
          } else {
            const uniquePosts = filterDuplicatePosts(newPosts);

            setPosts(prevPosts => {
              return (prevPosts != null) ? [...prevPosts, ...uniquePosts] : uniquePosts;
            });
            setCursor(res.data.cursor);
          }
        }
        break;
      }
      case 'Feeds': {
        res = await agent.api.app.bsky.feed.getActorFeeds({ actor: actor ?? '', cursor, limit: PAGE_SIZE });
        if (res.success) {
          setFeeds(res.data.feeds);
        }
        break;
      }
      case 'Lists': {
        res = await agent.api.app.bsky.graph.getLists({ actor: actor ?? '', cursor, limit: PAGE_SIZE });
        if (res.success) {
          setLists(res.data.lists);
        }
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    if (selectedTab === undefined) return;

    setPosts([]);
    void getPosts(undefined);
  }, [selectedTab])

  useEffect(() => {
    if (loadMore) {
      void loadMorePosts();
      setLoadMore(false);
    }
  }, [loadMore]);

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
  }, [selectedTab, actor, loadMore]);

  return { posts, feeds, lists, loadMore, setLoadMore, loadMorePosts };
}
