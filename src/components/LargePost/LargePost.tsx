import { AppBskyFeedPost, RichText as RichTextAPI, type AppBskyFeedDefs } from '@atproto/api';
import React, { useMemo } from 'react';
import Link from '../Link/Link';
import { PostTimestamp } from '../Post/Post';
import './LargePost.scss';
import PostControls from '../PostControls/PostControls';
import RichText from '../RichText/RichText';
import EmbedHandler from '../Embed/EmbedHandler';
import Avatar from '../Avatar/Avatar';

interface LargePostProps {
  post: AppBskyFeedDefs.FeedViewPost | undefined;
  ref: any;
}

const LargePost = React.forwardRef<HTMLDivElement, LargePostProps>(({ post }, ref) => {
  const record = useMemo<AppBskyFeedPost.Record | undefined>(
    () =>
      AppBskyFeedPost.isRecord(post?.post.record) &&
                    AppBskyFeedPost.validateRecord(post?.post.record).success
        ? post?.post.record
        : undefined,
    [post]
  );

  const rt = useMemo<RichTextAPI>(() => new RichTextAPI({ text: (record != null) ? record.text : '', facets: record?.facets }), [post]);

  return (
    <div className='large-post' ref={ref}>
        <div className='poster-info' style={{ marginBottom: rt?.length === 0 ? 0 : '0.5rem' }}>
          <Avatar className='post-avatar' src={post?.post.author.avatar} link={`/profile/${post?.post.author.handle}`} width={40} height={40} />
            <div className='post-info-inner'>
                <Link linkStyle={true} className='post-display-name-link' to={`/profile/${post?.post.author.handle}`}>
                    <span className='post-display-name'>{post?.post.author.displayName}</span>
                    &nbsp;
                </Link>
                <Link linkStyle={true} to={`/profile/${post?.post.author.handle}`} className='post-handle'>@{post?.post.author.handle}</Link>
            </div>
        </div>
        <div className='post-info-container'>
            <div className='post-info'>
                <div className='post-content'>
                    <RichText value={rt} />
                </div>

                {post !== undefined && <EmbedHandler post={post} />}

                <PostTimestamp className='post-timestamp no-underline' short={false} post={post} />
                {((((post?.post.likeCount) != null) && post.post.likeCount > 0) || ((post?.post.repostCount != null) && post.post.repostCount > 0)) && <div className='reposts-and-likes'>
                    {(post.post.repostCount != null) && post.post.repostCount > 0 && <span className='count'>{post?.post.repostCount} <span className='normal-text'>repost{(((post?.post.repostCount) != null) && post?.post.repostCount !== 1) ? 's' : ''}</span></span>}
                    {(post.post.likeCount != null) && post.post.likeCount > 0 && <span className='count'>{post?.post.likeCount} <span className='normal-text'>like{(((post?.post.likeCount) != null) && post?.post.likeCount !== 1) ? 's' : ''}</span></span>}
                </div>}
                <PostControls big={true} post={post} />
            </div>
        </div>
    </div>
  )
});

LargePost.displayName = 'LargePost';

export default LargePost;
