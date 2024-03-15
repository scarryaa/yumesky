import { type AppBskyFeedDefs } from '@atproto/api';
import { faComment, faEyeSlash, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisH, faRetweet, faHeart as faHeartSolid, faShare, faClipboard, faFont, faVolumeOff, faFilter, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import agent from '../api/agent';
import './PostControls.scss';
import Dropdown, { type MenuItem } from './Dropdown';

const dropdownItems: MenuItem[] = [
  {
    label: 'Translate',
    icon: faFont,
    iconSize: 18,
    onPress: () => { }
  },
  {
    label: 'Copy post',
    icon: faClipboard,
    iconSize: 18,
    onPress: () => { }
  },
  {
    label: 'Share post',
    icon: faShare,
    iconSize: 18,
    onPress: () => { }
  },
  {
    label: 'separator'
  },
  {
    label: 'Mute thread',
    icon: faVolumeOff,
    iconSize: 20,
    onPress: () => { }
  },
  {
    label: 'Mute words & tags',
    icon: faFilter,
    iconSize: 18,
    onPress: () => { }
  },
  {
    label: 'Hide post',
    icon: faEyeSlash,
    iconSize: 18,
    onPress: () => { }
  },
  {
    label: 'separator'
  },
  {
    label: 'Report post',
    icon: faCircleExclamation,
    iconSize: 18,
    onPress: () => { }
  }
]

interface MoreButtonProps {
  post: AppBskyFeedDefs.FeedViewPost | undefined;
  big?: boolean;
}
const MoreButton: React.FC<MoreButtonProps> = ({ post, big }: MoreButtonProps) => {
  const more = (e: React.MouseEvent<HTMLButtonElement>, post: AppBskyFeedDefs.FeedViewPost | undefined): void => {
    e.preventDefault();
  }

  return (
    <Dropdown items={dropdownItems}>
        <button onClick={async (e) => { more(e, post); }} style={{ flex: (big ?? false) ? 0 : 1 }} className='post-controls-more no-button-style'>
            <FontAwesomeIcon icon={faEllipsisH} fontSize={(big ?? false) ? 20 : 16} />
        </button>
    </Dropdown>
  )
}

interface PostControlsProps {
  post: AppBskyFeedDefs.FeedViewPost | undefined;
  big?: boolean;
}
const PostControls: React.FC<PostControlsProps> = ({ post, big }: PostControlsProps) => {
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
          <MoreButton post={post} big={big} />
      </div>
  )
}

export default PostControls;
