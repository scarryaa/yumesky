import { type AppBskyEmbedImages, AppBskyFeedPost, RichText, type AppBskyFeedDefs } from '@atproto/api';
import { useMemo } from 'react';
import Link from './Link';
import ImageGrid from './ImageGrid';
import { PostControls, PostTimestamp } from './Post';
import './LargePost.scss';

interface LargePostProps {
  post: AppBskyFeedDefs.FeedViewPost | undefined;
}
const LargePost: React.FC<LargePostProps> = ({ post }: LargePostProps) => {
  const record = useMemo<AppBskyFeedPost.Record | undefined>(
    () =>
      AppBskyFeedPost.isRecord(post?.post.record) &&
                    AppBskyFeedPost.validateRecord(post?.post.record).success
        ? post?.post.record
        : undefined,
    [post]
  );

  const rt = useMemo(
    () =>
      (record != null)
        ? new RichText({
          text: record.text,
          facets: record.facets
        })
        : undefined,
    [record]
  );

  return (
    <div className='large-post'>
        <div className='poster-info' style={{ marginBottom: rt?.length === 0 ? 0 : '0.5rem' }}>
            <img className='post-avatar' src={post?.post.author.avatar} />
            <div className='post-info-inner'>
                <Link linkStyle={true} to={`/profile/${post?.post.author.handle}`}>
                    <span className='post-display-name'>{post?.post.author.displayName}</span>
                    &nbsp;
                </Link>
                <Link linkStyle={true} to={`/profile/${post?.post.author.handle}`} className='post-handle'>@{post?.post.author.handle}</Link>
            </div>
        </div>
        <div className='post-info-container'>
            <div className='post-info'>
                <div className='post-content'>
                    {rt?.text}
                </div>

                {post?.post.embed?.$type === 'app.bsky.embed.images#view' &&
                <div className='image-grid' style={{ marginTop: rt?.length === 0 ? 0 : '0.2rem' }}>
                    <ImageGrid images={post.post.embed.images as AppBskyEmbedImages.ViewImage[]} />
                </div>}

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
}

export default LargePost;
