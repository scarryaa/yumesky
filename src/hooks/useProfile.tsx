import { type AppBskyFeedDefs, type AppBskyActorDefs, type AppBskyGraphDefs } from '@atproto/api';
import { useEffect, useState } from 'react';
import agent from '../api/agent';
import { type DefaultHomeTabs, type DefaultProfileTabs } from '../config';

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

export const useProfilePosts = (actor: string | undefined, selectedTab: (DefaultProfileTabs | DefaultHomeTabs)[number]): { posts: AppBskyFeedDefs.FeedViewPost[] | undefined, feeds: AppBskyFeedDefs.GeneratorView[] | undefined, lists: AppBskyGraphDefs.ListView[] | undefined } => {
  const [posts, setPosts] = useState<AppBskyFeedDefs.FeedViewPost[] | undefined>();
  const [feeds, setFeeds] = useState<AppBskyFeedDefs.GeneratorView[] | undefined>();
  const [lists, setLists] = useState<AppBskyGraphDefs.ListView[] | undefined>();

  useEffect(() => {
    if (selectedTab === undefined || actor === undefined) return;
    setPosts([]);

    const getPosts = async (actor: string | undefined, selectedTab: (DefaultProfileTabs | DefaultHomeTabs)[number]): Promise<void> => {
      switch (selectedTab) {
        case 'Posts': {
          const res = await agent.api.app.bsky.feed.getAuthorFeed({ actor: actor ?? '', filter: 'posts_no_replies' });
          if (res.success) {
            setPosts(res.data.feed);
          }
          break;
        }
        case 'Replies': {
          const res = await agent.api.app.bsky.feed.getAuthorFeed({ actor: actor ?? '', filter: 'posts_with_replies' });
          if (res.success) {
            setPosts(res.data.feed);
          }
          break;
        }
        case 'Media': {
          const res = await agent.api.app.bsky.feed.getAuthorFeed({ actor: actor ?? '', filter: 'posts_with_media' });
          if (res.success) {
            setPosts(res.data.feed);
          }
          break;
        }
        case 'Feeds': {
          const res = await agent.api.app.bsky.feed.getActorFeeds({ actor: actor ?? '' });
          if (res.success) {
            setFeeds(res.data.feeds);
          }
          break;
        }
        case 'Lists': {
          const res = await agent.api.app.bsky.graph.getLists({ actor: actor ?? '' });
          if (res.success) {
            setLists(res.data.lists);
          }
          break;
        }
        case 'Likes': {
          const res = await agent.getActorLikes({ actor: actor ?? '' });
          if (res.success) {
            setPosts(res.data.feed);
          }
          break;
        }
      }
    }

    void getPosts(actor, selectedTab);
  }, [selectedTab, actor]);

  return { posts, feeds, lists };
}
