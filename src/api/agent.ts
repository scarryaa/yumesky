import { BskyAgent, type AppBskyActorDefs, type AtpPersistSessionHandler, type AppBskyFeedGetTimeline } from '@atproto/api';
import { type ThreadViewPost, type NotFoundPost, type BlockedPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs';
import * as persisted from '../state/persisted'
import { addAccountToSessionIfNeeded } from '../utils';

const persistSession: AtpPersistSessionHandler = (evt, session) => {
  try {
    if (evt === 'expired' || evt === 'create-failed') {
      throw new Error('Session expired or creation failed.');
    }

    if (session !== undefined) {
      addAccountToSessionIfNeeded(persisted.get('session'), {
        service: 'https://public.api.bsky.app',
        did: session.did,
        handle: session.handle,
        accessJwt: session.accessJwt,
        email: session.email,
        emailConfirmed: session.emailConfirmed,
        deactivated: false,
        refreshJwt: session.refreshJwt
      });
    }
  } catch (error) {
    console.error('Error occurred while persisting session:', error);
  }
};

const agent = new BskyAgent({
  service: 'https://bsky.social',
  persistSession
});

export const getTimeline = async (cursor: string | undefined, pageSize: number): Promise<AppBskyFeedGetTimeline.Response> => {
  const res = await agent.getTimeline({ cursor: cursor ?? '', limit: pageSize });

  if (res.success) {
    return res;
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

export const getPrefs = async (): Promise<AppBskyActorDefs.Preferences> => {
  const res = await agent.api.app.bsky.actor.getPreferences();

  if (res.success) {
    return res.data.preferences;
  } else {
    throw new Error('Error fetching user preferences.');
  }
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

export const deletePost = async (uri: string): Promise<void> => {
  await agent.deletePost(uri);
}

export default agent;
