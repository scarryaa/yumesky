import { type AppBskyFeedDefs, BskyAgent } from '@atproto/api';
import { type ThreadViewPost, type NotFoundPost, type BlockedPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs';

const agent = new BskyAgent({
  service: 'https://bsky.social'
});

export const getTimeline = async (): Promise<AppBskyFeedDefs.FeedViewPost[]> => {
  const res = await agent.getTimeline();

  if (res.success) {
    return res.data.feed;
  } else {
    throw new Error('Fetching timeline was unsuccessful.');
  }
}

export const repost = async (uri: string, cid: string): Promise<void> => {
  await agent.repost(uri, cid);
}

export const like = async (uri: string, cid: string): Promise<void> => {
  await agent.like(uri, cid);
}

export const getThread = async (uri: string | undefined): Promise<ThreadViewPost | NotFoundPost | BlockedPost | { [k: string]: unknown; $type: string; } | undefined> => {
  if (uri === undefined) return;
  const res = await agent.getPostThread({ uri });

  if (res.success) {
    return res.data.thread;
  } else {
    throw new Error('Error fetching post thread.');
  }
}

export default agent;
