import { type AppBskyActorDefs, AppBskyFeedDefs, AppBskyFeedPost, RichText as RichTextAPI } from '@atproto/api';
import './Post.scss';
import Link from '../Link/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faRetweet } from '@fortawesome/free-solid-svg-icons';
import { useMemo } from 'react';
import { usePost } from '../../contexts/PostContext';
import { ago, agoLong } from '../../utils';
import PostControls from '../PostControls/PostControls';
import RichText from '../RichText/RichText';
import Avatar from '../Avatar/Avatar';
import EmbedHandler from '../Embed/EmbedHandler';

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
  ref?: any;
}

const PostInfo: React.FC<PostProps> = ({ post, ref }: PostProps) => {
  const record = useMemo<AppBskyFeedPost.Record | undefined>(
    () =>
      AppBskyFeedPost.isRecord(post.post.record) &&
                AppBskyFeedPost.validateRecord(post.post.record).success
        ? post.post.record
        : undefined,
    [post]
  );

  const rt = new RichTextAPI({ text: (record != null) ? record.text : '', facets: record?.facets });

  const authorDisplayNameOrHandle = useMemo(() =>
    (post.post.author.displayName ?? post.post.author.handle), [post]);

  const authorHandleOrDisplayName = useMemo(() =>
    (post.post.author.handle ?? post.post.author.displayName), [post]);

  const postReasonAuthor = useMemo(
    () =>
      (AppBskyFeedDefs.isReasonRepost(post.reason) && (post.reason.by.displayName ?? post.reason.by.handle)),
    [post]
  );

  const replyToDisplayNameOrHandle = useMemo(
    () =>
      ((post.reply != null) ? post.reply?.parent.author as AppBskyActorDefs.ProfileViewBasic : undefined)?.displayName ??
      ((post.reply != null) ? post.reply?.parent.author as AppBskyActorDefs.ProfileViewBasic : undefined)?.handle,
    [post]
  );

  const replyHandle = useMemo(
    () =>
      ((post.reply != null) ? post.reply?.parent.author as AppBskyActorDefs.ProfileViewBasic : undefined)?.handle,
    [post]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }} ref={ref}>
        {post.reason?.$type === 'app.bsky.feed.defs#reasonRepost' &&
            <Link linkStyle={false} to={`/profile/${AppBskyFeedDefs.isReasonRepost(post.reason) && post.reason.by.handle}`} className='post-reason'>
                <FontAwesomeIcon className='post-reason-icon' icon={faRetweet} fontSize={14} />
                <span>Reposted by <Link to={`/profile/${postReasonAuthor}`} linkStyle={true}>{postReasonAuthor}</Link></span>
            </Link>}
        <div className='post-info-container'>
          <Avatar link={`/profile/${post.post.author.handle}`} width={40} height={40} className='post-avatar' src={post.post.author.avatar} />
            <div className='post-info'>
                <div className='post-info-and-timestamp'>
                    <Link linkStyle={true} to={`/profile/${post.post.author.handle}`} className='post-info-inner'>
                        <span className='post-display-name'>{authorDisplayNameOrHandle}</span>
                        &nbsp;
                        <span className='post-handle'>@{authorHandleOrDisplayName}</span>
                    </Link>
                    <span>·</span>
                    <PostTimestamp short={true} post={post} />
                </div>
                {post.reply?.parent.uri != null && <div className='post-reply-tag'>
                    <FontAwesomeIcon className='post-reply-icon' icon={faReply} fontSize={10} />
                    <span>Reply to <Link linkStyle={true} to={`/profile/${replyHandle}`}>{replyToDisplayNameOrHandle}</Link></span>
                </div>}
                <div className='post-content'>
                    <RichText value={rt} />
                </div>

                <EmbedHandler post={post} />
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
