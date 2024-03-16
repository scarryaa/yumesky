import { type AppBskyActorDefs, AppBskyFeedDefs, AppBskyFeedPost, RichText, type AppBskyEmbedImages } from '@atproto/api';
import './Post.scss';
import Link from '../Link/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faRetweet } from '@fortawesome/free-solid-svg-icons';
import ImageGrid from '../ImageGrid/ImageGrid';
import { useMemo } from 'react';
import { usePost } from '../../contexts/PostContext';
import { ago, agoLong } from '../../utils';
import PostControls from '../PostControls/PostControls';

interface PostTimestampProps {
  post: AppBskyFeedDefs.FeedViewPost | undefined;
  short: boolean;
  className?: string;
}
export const PostTimestamp: React.FC<PostTimestampProps> = ({ post, short, className }: PostTimestampProps) => {
  return (
    <div style={{ fontSize: short ? '16px' : '15px' }} className={`post-timestamp ${className}`}>{post?.post !== undefined && ((short) ? ago(post?.post.indexedAt) : agoLong(post?.post.indexedAt))}</div>
  )
}

interface PostProps {
  post: AppBskyFeedDefs.FeedViewPost;
}

const PostInfo: React.FC<PostProps> = ({ post }: PostProps) => {
  const record = useMemo<AppBskyFeedPost.Record | undefined>(
    () =>
      AppBskyFeedPost.isRecord(post.post.record) &&
                AppBskyFeedPost.validateRecord(post.post.record).success
        ? post.post.record
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

  const authorDisplayName = useMemo(
    () =>
      ((post.reply != null) ? post.reply?.parent.author as AppBskyActorDefs.ProfileViewBasic : undefined)?.displayName,
    [post]
  )

  const authorHandle = useMemo(
    () =>
      ((post.reply != null) ? post.reply.parent.author as AppBskyActorDefs.ProfileViewBasic : undefined)?.handle,
    [post]
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {post.reason?.$type === 'app.bsky.feed.defs#reasonRepost' &&
            <Link linkStyle={false} to={`/profile/${AppBskyFeedDefs.isReasonRepost(post.reason) && post.reason.by.handle}`} className='post-reason'>
                <FontAwesomeIcon className='post-reason-icon' icon={faRetweet} fontSize={14} />
                <span>Reposted by <Link to={`/profile/${AppBskyFeedDefs.isReasonRepost(post.reason) && post.reason.by.handle}`} linkStyle={true}>{AppBskyFeedDefs.isReasonRepost(post.reason) && post.reason.by.displayName}</Link></span>
            </Link>}
        <div className='post-info-container'>
            <img className='post-avatar' src={post.post.author.avatar} />
            <div className='post-info'>
                <div className='post-info-and-timestamp'>
                    <Link linkStyle={true} to={`/profile/${post.post.author.handle}`} className='post-info-inner'>
                        <span className='post-display-name'>{post.post.author.displayName}</span>
                        &nbsp;
                        <span className='post-handle'>@{post.post.author.handle}</span>
                    </Link>
                    <span>·</span>
                    <PostTimestamp short={true} post={post} />
                </div>
                {post.reply?.parent.uri != null && <div className='post-reply-tag'>
                    <FontAwesomeIcon className='post-reply-icon' icon={faReply} fontSize={10} />
                    <span>Reply to <Link linkStyle={true} to={`/profile/${authorHandle}`}>{authorDisplayName}</Link></span>
                </div>}
                <div className='post-content'>
                    {rt?.text}
                </div>

                {post.post.embed?.$type === 'app.bsky.embed.images#view' && <ImageGrid images={post.post.embed.images as AppBskyEmbedImages.ViewImage[]} />}
                <PostControls post={post}/>
            </div>
        </div>
    </div>
  )
}

const Post: React.FC<PostProps> = ({ post }: PostProps) => {
  const { setCachedPost } = usePost();

  return (
        <Link onClick={() => { setCachedPost(post); }} linkStyle={false} to={`/profile/${post.post.author.handle}/post/${post.post.uri.split('/')[4]}`} className='post'>
            <PostInfo post={post} />
        </Link>
  )
}

export default Post;
