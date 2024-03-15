import { useEffect, useState } from 'react';
import BasicView from '../components/BasicView';
import LargePost from '../components/LargePost';
import Post from '../components/Post';
import { usePost } from '../contexts/PostContext';
import { AppBskyFeedDefs } from '@atproto/api';
import { getThread } from '../api/agent';
import { type ThreadViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs';

const ThreadView: React.FC = () => {
  const { cachedPost } = usePost();
  const [replies, setReplies] = useState<AppBskyFeedDefs.ThreadViewPost[] | undefined>(undefined);

  useEffect(() => {
    const getPostThread = async (): Promise<void> => {
      if (cachedPost == null) return;

      const res = await getThread(cachedPost.post.uri);
      if (res != null) {
        if (AppBskyFeedDefs.isThreadViewPost(res.replies)) {
          setReplies([res.replies]);
        } else {
          setReplies(res.replies as ThreadViewPost[]);
        }
      }
    }

    void getPostThread();
  }, [cachedPost]);

  return (
    <BasicView>
      {(cachedPost != null) && <LargePost post={cachedPost} />}
      {replies?.map((post, index) => (
        <Post post={post} key={index} />
      ))}
    </BasicView>
  )
}

export default ThreadView;
