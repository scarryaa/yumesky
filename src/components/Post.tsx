import { type AppBskyActorDefs, AppBskyFeedDefs, AppBskyFeedPost, RichText, type AppBskyEmbedImages } from '@atproto/api';
import './Post.scss';
import Link from './Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisH, faReply, faRetweet } from '@fortawesome/free-solid-svg-icons';
import ImageGrid from './ImageGrid';
import { useMemo } from 'react';
import agent from '../api/agent';

interface PostControlsProps {
  post: AppBskyFeedDefs.FeedViewPost;
  likeCount: number | undefined;
  replyCount: number | undefined;
  repostCount: number | undefined;
}
const PostControls: React.FC<PostControlsProps> = ({ likeCount, replyCount, repostCount, post }: PostControlsProps) => {
  const reply = (e: React.MouseEvent<HTMLButtonElement>, post: AppBskyFeedDefs.FeedViewPost): void => {
    e.preventDefault();
  }

  const repost = async (e: React.MouseEvent<HTMLButtonElement>, post: AppBskyFeedDefs.FeedViewPost): Promise<void> => {
    e.preventDefault();
    await agent.repost(post.post.uri, post.post.cid);
  }

  const like = async (e: React.MouseEvent<HTMLButtonElement>, post: AppBskyFeedDefs.FeedViewPost): Promise<void> => {
    e.preventDefault();
    await agent.like(post.post.uri, post.post.cid);
  }

  const more = (e: React.MouseEvent<HTMLButtonElement>, post: AppBskyFeedDefs.FeedViewPost): void => {
    e.preventDefault();
  }

  return (
    <div className='post-controls'>
        <button onClick={async (e) => { reply(e, post); }} className='post-controls-comment no-button-style'>
            <FontAwesomeIcon icon={faComment} fontSize={16} />
            <span className='post-controls-comment-count'>{replyCount}</span>
        </button>
        <button onClick={async (e) => { await repost(e, post); }} className='post-controls-repost no-button-style'>
            <FontAwesomeIcon icon={faRetweet} fontSize={16} />
            <span className='post-controls-repost-count'>{repostCount}</span>
        </button>
        <button onClick={async (e) => { await like(e, post); }} className='post-controls-like no-button-style'>
            <FontAwesomeIcon icon={faHeart} fontSize={16} />
            <span className='post-controls-like-count'>{likeCount}</span>
        </button>
        <button onClick={async (e) => { more(e, post); }} className='post-controls-more no-button-style'>
            <FontAwesomeIcon icon={faEllipsisH} fontSize={16} />
        </button>
    </div>
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
                <Link linkStyle={true} to={`/profile/${post.post.author.handle}`} className='post-info-inner'>
                    <span className='post-display-name'>{post.post.author.displayName}</span>
                    &nbsp;
                    <span className='post-handle'>@{post.post.author.handle}</span>
                </Link>
                {post.reply?.parent.uri != null && <div className='post-reply-tag'>
                    <FontAwesomeIcon className='post-reply-icon' icon={faReply} fontSize={10} />
                    <span>Reply to <Link linkStyle={true} to={`/profile/${authorHandle}`}>{authorDisplayName}</Link></span>
                </div>}
                <div className='post-content'>
                    {rt?.text}
                </div>

                {post.post.embed?.$type === 'app.bsky.embed.images#view' && <ImageGrid images={post.post.embed.images as AppBskyEmbedImages.ViewImage[]} />}
                <PostControls post={post} likeCount={post.post.likeCount} replyCount={post.post.replyCount} repostCount={post.post.repostCount} />
            </div>
        </div>
    </div>
  )
}

const Post: React.FC<PostProps> = ({ post }: PostProps) => {
  return (
        <Link linkStyle={false} to={`/profile/${post.post.author.handle}/post/${post.post.uri.split('/')[4]}`} className='post'>
            <PostInfo post={post} />
        </Link>
  )
}

export default Post;
