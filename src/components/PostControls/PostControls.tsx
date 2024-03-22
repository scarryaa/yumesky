import { type AppBskyFeedDefs } from '@atproto/api';
import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisH, faRetweet, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import agent from '../../api/agent';
import './PostControls.scss';
import Dropdown from '../Dropdown/Dropdown';
import usePostDropdown from '../../hooks/dropdown/usePostDropdown';
import { useComposer } from '../../hooks/useComposer';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { useToasts } from '../../state/toasts';

interface ButtonWithHoverProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon: IconProp;
  count: number | undefined;
  hoverColor: string;
  defaultColor: string;
  isHover: boolean;
  big: boolean | undefined;
  hoverCallback: (bool: boolean) => void;
  uri?: string;
}
const ButtonWithHover = React.forwardRef<HTMLButtonElement, ButtonWithHoverProps>(({
  onClick,
  icon,
  count,
  hoverColor,
  defaultColor,
  isHover,
  big,
  hoverCallback,
  uri,
  ...rest
}, ref) => {
  return (
    <button
      ref={ref}
      onMouseOver={() => { hoverCallback(true); }}
      onMouseLeave={() => { hoverCallback(false); }}
      onClick={onClick}
      className='post-control no-button-style'
      {...rest}
    >
      <FontAwesomeIcon
        icon={icon}
        color={isHover ? hoverColor : defaultColor}
        fontSize={(big ?? false) ? 20 : 16}
      />
      {count !== undefined && <span className='post-control-count' style={{ color: (uri != null || isHover) ? hoverColor : defaultColor }}>{count === 0 ? null : count}</span>}
    </button>
  );
});
ButtonWithHover.displayName = 'ButtonWithHover'

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
  const [hoverLike, setHoverLike] = useState<boolean>(false);
  const [hoverRepost, setHoverRepost] = useState<boolean>(false);
  const [hoverReply, setHoverReply] = useState<boolean>(false);
  const [hoverMore, setHoverMore] = useState<boolean>(false);
  const { openComposer } = useComposer();
  const { dropdownItems } = usePostDropdown(post);
  const { addToast } = useToasts();

  const more = (e: React.MouseEvent<HTMLButtonElement>, post: AppBskyFeedDefs.FeedViewPost | undefined): void => {
    e.preventDefault();
  }

  const reply = (e: React.MouseEvent<HTMLButtonElement>, post: AppBskyFeedDefs.FeedViewPost | undefined): void => {
    e.preventDefault();
    if (post === undefined) {
      addToast({ message: 'Error: Post is undefined!' });
      return;
    }

    openComposer(post);
  }

  const repost = async (e: React.MouseEvent<HTMLButtonElement>, post: AppBskyFeedDefs.FeedViewPost | undefined): Promise<void> => {
    e.preventDefault();
    if (post === undefined) {
      addToast({ message: 'Error: Post is undefined!' });
      return;
    }

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
    if (post === undefined) {
      addToast({ message: 'Error: Post is undefined!' });
      return;
    }

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
      <div style={{ flex: (big ?? false) ? 0 : 1 }}>
        <ButtonWithHover
          hoverCallback={setHoverReply}
          big={big}
          onClick={(e) => { reply(e, post); }}
          icon={faComment}
          count={replyCount}
          hoverColor='var(--blue)'
          defaultColor='var(--text-light)'
          isHover={hoverReply}
        />
      </div>
      <div style={{ flex: (big ?? false) ? 0 : 1 }}>
        <ButtonWithHover
          hoverCallback={setHoverRepost}
          big={big}
          onClick={async (e) => { await repost(e, post); }}
          icon={faRetweet}
          count={repostCount}
          hoverColor='var(--green)'
          defaultColor={(repostedUri != null || hoverRepost) ? 'var(--green)' : 'var(--text-light)'}
          isHover={hoverRepost}
          uri={repostedUri}
        />
      </div>
      <div style={{ flex: (big ?? false) ? 0 : 1 }}>
        <ButtonWithHover
          hoverCallback={setHoverLike}
          big={big}
          onClick={async (e) => { await like(e, post); }}
          icon={(likedUri != null) ? hoverLike ? faHeart : faHeartSolid : faHeart}
          count={likeCount}
          hoverColor='var(--red)'
          defaultColor={(likedUri != null || hoverLike) ? 'var(--red)' : 'var(--text-light)'}
          isHover={hoverLike}
          uri={likedUri}
        />
      </div>
      <div style={{ flex: (big ?? false) ? 0 : 1 }}>
        <Dropdown items={dropdownItems}>
          <ButtonWithHover
            hoverCallback={setHoverMore}
            big={big}
            onClick={(e) => { more(e, post); }}
            icon={faEllipsisH}
            count={undefined}
            hoverColor='var(--white)'
            defaultColor='var(--text-light)'
            isHover={hoverMore}
          />
        </Dropdown>
      </div>
    </div>
  )
}

export default PostControls;
