import { useEffect, useRef, useState } from 'react';
import { AppBskyFeedDefs, AppBskyFeedPost } from '@atproto/api';
import { usePost } from '../contexts/PostContext';
import agent from '../api/agent';

type OutputSchema = AppBskyFeedDefs.ThreadViewPost | AppBskyFeedDefs.NotFoundPost | AppBskyFeedDefs.BlockedPost | {
  $type: string;
  [k: string]: unknown;
};

// TODO improve this (namely lag between switching posts, and ghost replies showing briefly, and like/reply/repost counts carrying over btwn cached posts)
export const useThreadView = (): { filteredPosts: AppBskyFeedDefs.PostView[], currentPost: AppBskyFeedDefs.PostView | undefined, childPosts: AppBskyFeedDefs.PostView[], postRef: React.RefObject<HTMLDivElement>, setChildPosts: React.Dispatch<React.SetStateAction<AppBskyFeedDefs.PostView[]>>, loading: boolean } => {
  const { cachedPost } = usePost();
  const [thread, setThread] = useState<OutputSchema>();
  const [currentPost, setCurrentPost] = useState<AppBskyFeedDefs.PostView | undefined>(undefined);
  const [posts, setPosts] = useState<AppBskyFeedDefs.PostView[]>([]);
  const [childPosts, setChildPosts] = useState<AppBskyFeedDefs.PostView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const postRef = useRef<HTMLDivElement>(null);
  const [scrollSet, setScrollSet] = useState<boolean>(false);

  useEffect(() => {
    const getParentPosts = async (): Promise<void> => {
      // verify post has record
      if (cachedPost !== undefined && AppBskyFeedPost.isRecord(cachedPost.post.record) && AppBskyFeedPost.validateRecord(cachedPost.post.record).success) {
        try {
          const thread = await agent.getPostThread({ uri: cachedPost.post.uri });
          setThread(thread.data.thread);
        } catch (error) {
          console.error('Error fetching parent posts:', error);
        }
      }
    };

    void getParentPosts();
    setCurrentPost(cachedPost?.post);
  }, [cachedPost]);

  useEffect(() => {
    if (postRef.current != null) {
      postRef.current.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start', inline: 'nearest' });
      window.scrollBy(0, -52);
      setScrollSet(true);
    }
  }, [loading, currentPost, scrollSet, cachedPost]);

  useEffect(() => {
    if (thread != null) {
      setChildPosts([]);
      setScrollSet(false);
      const collectedPosts: AppBskyFeedDefs.PostView[] = [];

      const collectPosts = (thread: OutputSchema): void => {
        if (AppBskyFeedDefs.isThreadViewPost(thread)) {
          collectedPosts.push(thread.post);
          if (AppBskyFeedDefs.isThreadViewPost(thread.parent)) {
            collectPosts(thread.parent);
          }
        }
      };

      collectPosts(thread);
      setPosts(collectedPosts.reverse());

      // check if thread.replies is an array
      if (Array.isArray(thread.replies)) {
        const replyPosts: AppBskyFeedDefs.PostView[] = [];

        const collectReplies = (replies: OutputSchema[]): void => {
          replies.forEach(reply => {
            if (AppBskyFeedDefs.isThreadViewPost(reply)) {
              replyPosts.push(reply.post);
              if (Array.isArray(reply.replies)) {
                collectReplies(reply.replies);
              }
            }
          });
        };

        collectReplies(thread.replies as OutputSchema[]);
        setChildPosts(replyPosts);
        setLoading(false);
      }
    }
  }, [thread, cachedPost]);

  // filter out the current post from the collected posts
  const filteredPosts = posts.filter(p => p.uri !== currentPost?.uri);

  return { filteredPosts, currentPost, childPosts, setChildPosts, postRef, loading };
}

export default useThreadView;
