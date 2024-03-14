import { type AppBskyFeedDefs, BskyAgent } from '@atproto/api';

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

export default agent;
