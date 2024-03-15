import { type AppBskyActorDefs, AppBskyFeedDefs, AppBskyFeedPost, RichText, type AppBskyEmbedImages } from '@atproto/api';
import './Post.scss';
import Link from './Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisH, faReply, faRetweet, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import ImageGrid from './ImageGrid';
import { useMemo, useState } from 'react';
import agent from '../api/agent';
import { usePost } from '../contexts/PostContext';
import { ago, agoLong } from '../utils';

interface PostControlsProps {
  post: AppBskyFeedDefs.FeedViewPost | undefined;
  big?: boolean;
}
export const PostControls: React.FC<PostControlsProps> = ({ post, big }: PostControlsProps) => {
  const [likedUri, setLikedUri] = useState<string | undefined>(post?.post.viewer?.like);
  const [repostedUri, setRepostedUri] = useState<string | undefined>(post?.post.viewer?.repost);
  const [likeCount, setLikeCount] = useState<number | undefined>(post?.post.likeCount);
  const [repostCount, setRepostCount] = useState<number | undefined>(post?.post.repostCount);
  const [replyCount] = useState<number | undefined>(post?.post.replyCount);

  const reply = (e: React.MouseEvent<HTMLButtonElement>, post: AppBskyFeedDefs.FeedViewPost | undefined): void => {
    e.preventDefault();
  }

  const repost = async (e: React.MouseEvent<HTMLButtonElement>, post: AppBskyFeedDefs.FeedViewPost | undefined): Promise<void> => {
    e.preventDefault();
    if (post === undefined) return;
    // TODO add better error handling (msg, toast?)

    if (repostedUri !== undefined) {
      // if reposted, attempt to un-repost
      await agent.deleteRepost(repostedUri);
      if (repostCount !== undefined) setRepostCount(repostCount - 1);
      setRepostedUri(undefined);
    } else {
      const res = await agent.repost(post.post.uri, post.post.cid);
      if (res.uri.length > 0) {
        if (repostCount !== undefined) setRepostCount(repostCount + 1);
        setRepostedUri(res.uri);
      }
    }
  }

  const like = async (e: React.MouseEvent<HTMLButtonElement>, post: AppBskyFeedDefs.FeedViewPost | undefined): Promise<void> => {
    e.preventDefault();
    if (post === undefined) return;
    // TODO add better error handling (msg, toast?)

    if (likedUri !== undefined) {
      // if liked, attempt to unlike
      await agent.deleteLike(likedUri);
      if (likeCount !== undefined) setLikeCount(likeCount - 1);
      setLikedUri(undefined);
    } else {
      const res = await agent.like(post.post.uri, post.post.cid);
      if (res.uri.length > 0) {
        if (likeCount !== undefined) setLikeCount(likeCount + 1);
        setLikedUri(res.uri);
      }
    }
  }

  const more = (e: React.MouseEvent<HTMLButtonElement>, post: AppBskyFeedDefs.FeedViewPost | undefined): void => {
    e.preventDefault();
  }

  return (
    <div className='post-controls' style={{ paddingInline: (big ?? false) ? '0.2rem' : 0 }}>
        <button onClick={async (e) => { reply(e, post); }} style={{ flex: (big ?? false) ? 0 : 1 }} className='post-controls-comment no-button-style'>
            <FontAwesomeIcon icon={faComment} fontSize={(big ?? false) ? 20 : 16} />
            <span className='post-controls-comment-count'>{replyCount === 0 ? null : replyCount}</span>
        </button>
        <button onClick={async (e) => { await repost(e, post); }} style={{ flex: (big ?? false) ? 0 : 1 }} className='post-controls-repost no-button-style'>
            <FontAwesomeIcon icon={faRetweet} color={(repostedUri != null) ? 'var(--green)' : 'var(--text-light)'} fontSize={(big ?? false) ? 20 : 16} />
            <span className='post-controls-repost-count' style={{ color: (repostedUri != null) ? 'var(--green)' : 'var(--text-light)' }}>{repostCount === 0 ? null : repostCount}</span>
        </button>
        <button onClick={async (e) => { await like(e, post); }} style={{ flex: (big ?? false) ? 0 : 1 }} className='post-controls-like no-button-style'>
            <FontAwesomeIcon icon={(likedUri != null) ? faHeartSolid : faHeart} color={(likedUri != null) ? 'var(--red)' : 'var(--text-light)'} fontSize={(big ?? false) ? 20 : 16} />
            <span className='post-controls-like-count' style={{ color: (likedUri != null) ? 'var(--red)' : 'var(--text-light)' }}>{likeCount === 0 ? null : likeCount}</span>
        </button>
        <button onClick={async (e) => { more(e, post); }} style={{ flex: (big ?? false) ? 0 : 1 }} className='post-controls-more no-button-style'>
            <FontAwesomeIcon icon={faEllipsisH} fontSize={(big ?? false) ? 20 : 16} />
        </button>
    </div>
  )
}

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
