import React, { useEffect, useRef, useState } from 'react';
import { type AppBskyFeedLike, type AppBskyFeedDefs, type AppBskyFeedPost, type AppBskyNotificationListNotifications, type AppBskyActorDefs } from '@atproto/api';
import BasicView from '../../components/BasicView/BasicView';
import { useNotifications } from '../../hooks/useNotifications';
import Image from '../../components/Image/Image';
import './Notifications.scss';
import { ago } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt, faChevronDown, faChevronUp, faHeart, faRetweet, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Post from '../../components/Post/Post';
import Link from '../../components/Link/Link';
import { usePost } from '../../contexts/PostContext';
import { type ViewImage } from '@atproto/api/dist/client/types/app/bsky/embed/images';
import ImageGridSmall from '../../components/ImageGrid/ImageGridSmall';

type GroupedNotifications = Record<string, {
  notifications: AppBskyNotificationListNotifications.Notification[];
  authors: AppBskyActorDefs.ProfileView[];
  avatars: string[];
  post?: AppBskyFeedDefs.PostView;
}>;

const reasonTextMap: Record<string, string> = {
  like: 'liked your post',
  reply: 'replied to your post',
  follow: 'followed you',
  mention: 'mentioned you',
  quote: 'quoted your post',
  repost: 'reposted your post'
};

const reasonIconMap: Record<string, { icon: any, color: string }> = {
  like: { icon: faHeart, color: 'var(--red)' },
  follow: { icon: faUserPlus, color: 'var(--blue)' },
  mention: { icon: faAt, color: 'var(--blue)' },
  repost: { icon: faRetweet, color: 'var(--green)' }
};

const AvatarGroup: React.FC<{ post: GroupedNotifications[string] }> = ({ post }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="notification-avatar-container" onClick={(e) => { e.preventDefault(); setOpen(!open); }}>
        <div className='notification-avatars'>
            {post.avatars.slice(0, 10).map((avatar, i) => (
              !open ? <Image className='notification-avatar' key={i} src={avatar} /> : null
            ))}
            <AvatarDropdown open={open} post={post} />
        </div>
        {open
          ? <div className='notification-dropdown-container'>
                {post.avatars.map((avatar, i) => (
                    <div className='notification-dropdown' key={i}>
                        <Image className='notification-dropdown-avatar' key={i} src={avatar} />
                        <Link className='notification-dropdown-link' linkStyle={true} to={`/profile/${post.authors[i].handle}`}>
                            <span className='display-name'>{post.authors[i].displayName}</span>
                            <span className='handle'>@{post.authors[i].handle}</span>
                        </Link>
                    </div>
                ))}
            </div>
          : null}
    </div>
  )
};

const AvatarDropdown: React.FC<{ open: boolean, post: GroupedNotifications[string] }> = ({ open, post }) => (
  post.avatars.length > 1
    ? <div className='notification-chevron'>
        <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} fontSize={18} color={open ? 'var(--text)' : 'var(--text-light)'} />
        {open && <span>Hide</span>}
    </div>
    : null
);

// TODO fix reply tags
const NotificationItem: React.FC<{ post: GroupedNotifications[string], reason: string }> = ({ post, reason }) => {
  const { setCachedPost } = usePost();

  switch (reason) {
    case 'like':
    case 'mention':
    case 'repost':
      return (
          <Link onClick={() => { post.post !== undefined && setCachedPost({ post: post.post }); }} linkStyle={false} to={`/profile/${post.post?.author.handle}/post/${post.post?.uri.split('/')[4]}`} className='notification'>
              <div className='notification-shell'>
              {reasonIconMap[reason] !== undefined && (
                  <FontAwesomeIcon
                  className='notification-icon'
                  color={reasonIconMap[reason].color}
                  icon={reasonIconMap[reason].icon}
                  fontSize={22}
                  />
              )}
              <div className='notification-inner'>
                  <AvatarGroup post={post} />
              </div>
              </div>
              <div className="notification-author-container">
              <Link linkStyle={true} to={`/profile/${post.authors[0].handle}`} className='notification-author'>{post.authors[0].displayName}</Link>
              <span className='no-bold'>{post.authors.length > 1 && 'and'}</span>
              {post.authors.length > 1 && (
                  <span className="notification-others">
                  {`${post.authors.length - 1} other${post.authors.length - 1 === 1 ? '' : 's'}`}
                  </span>
              )}
              <span>{reasonTextMap[reason]}</span>
              <span className='notification-timestamp'>{ago(post.notifications[0].indexedAt)}</span>
              </div>
              {((post.post?.record) != null) && <div className='notification-record'>{(post.post.record as AppBskyFeedPost.Record).text}</div>}
              {post.post?.embed?.images !== null && <div className='notification-embed-images'>
                <ImageGridSmall images={post.post?.embed?.images as ViewImage[]} />
              </div>}
          </Link>
      );
    case 'reply':
      return (
        post.post !== undefined ? <Post post={{ post: post.post, reply: { root: { $type: '', ...(post.post.record as AppBskyFeedPost.ReplyRef).root }, parent: { $type: '', ...(post.post.record as AppBskyFeedPost.ReplyRef).parent } } }} /> : null
      );
    case 'quote':
      return (
        post.post !== undefined ? <Post post={{ post: post.post }} /> : null
      );
    case 'follow':
      return (
        <div className='notification'>
            <div className='notification-shell'>
            {reasonIconMap[reason] !== undefined && (
                <FontAwesomeIcon
                className='notification-icon'
                color={reasonIconMap[reason].color}
                icon={reasonIconMap[reason].icon}
                fontSize={22}
                />
            )}
            <div className='notification-inner'>
                <AvatarGroup post={post} />
            </div>
            </div>
            <div className="notification-follow-author-container">
                <Link linkStyle={true} to={`/profile/${post.authors[0].handle}`} className='notification-author'>{post.authors[0].displayName}</Link>
                <span className='no-bold'>{post.authors.length > 1 && 'and'}</span>
                {post.authors.length > 1 && (
                    <span className="notification-others">
                    {`${post.authors.length - 1} other${post.authors.length - 1 === 1 ? '' : 's'}`}
                    </span>
                )}
                <span className='notification-reason'>{reasonTextMap[reason]}</span>
                <span className='notification-timestamp'>{ago(post.notifications[0].indexedAt)}</span>
            </div>
        </div>
      )
    default: return null;
  }
}

const Notifications: React.FC<{ setCurrentPage: (pageName: string) => void }> = ({ setCurrentPage }) => {
  useEffect(() => {
    setCurrentPage('Notifications');
  }, []);

  const bottomBoundaryRef = useRef<HTMLDivElement>(null);
  const isHandlingScroll = useRef(false);
  const { notifications, notifPosts, loadMore, setLoadMore } = useNotifications();
  const [seenNotificationIds] = useState<Set<string>>(new Set());

  const handleScroll = async (): Promise<void> => {
    if (bottomBoundaryRef.current === null || isHandlingScroll.current) return;
    isHandlingScroll.current = true;

    const bottomBoundary = bottomBoundaryRef.current.getBoundingClientRect().top - window.innerHeight;
    if (bottomBoundary < 0 || (bottomBoundary < 300 && bottomBoundary > 0)) {
      setLoadMore(true);
    }

    setTimeout(() => {
      isHandlingScroll.current = false;
    }, 200);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore]);

  const groupNotifs = (
    notifications: AppBskyNotificationListNotifications.Notification[],
    notifPosts: AppBskyFeedDefs.PostView[]
  ): GroupedNotifications => {
    const groupedNotifications: GroupedNotifications = {};

    // Group notifications
    notifications.forEach(notification => {
      const { cid, author, reason, record } = notification;
      const subjectUri = (record as AppBskyFeedLike.Record)?.subject?.uri ?? notification.uri;
      if (cid !== undefined && author?.avatar !== undefined && subjectUri !== undefined) {
        const compoundKey = `${reason}-${subjectUri}`;
        if (groupedNotifications[compoundKey] === undefined) {
          groupedNotifications[compoundKey] = {
            notifications: [],
            authors: [],
            avatars: [],
            post: undefined
          };
        }

        if (!groupedNotifications[compoundKey].notifications.some(n => n.cid === cid)) {
          groupedNotifications[compoundKey].notifications.push(notification);
          if (!groupedNotifications[compoundKey].authors.includes(author ?? '')) {
            groupedNotifications[compoundKey].authors.push(author ?? '');
            groupedNotifications[compoundKey].avatars.push(author.avatar);
          }
        }
      }
    });

    // Associate notifPosts with notifications
    notifPosts.forEach(post => {
      const { uri } = post;
      const matchingKey = Object.keys(groupedNotifications).find(key => key.endsWith(`-${uri}`));
      if (matchingKey != null) {
        groupedNotifications[matchingKey].post = post;
      }
    });

    return groupedNotifications;
  };

  const groupedNotifications = groupNotifs(notifications, notifPosts);

  return (
    <BasicView viewPadding={false}>
      {Object.entries(groupedNotifications).map(([compoundKey, data], index) => (
        !seenNotificationIds.has(data.notifications[0].cid) &&
        <NotificationItem key={index} post={data} reason={data.notifications[0].reason} />
      ))}
      <div className='bottom-boundary-ref' ref={bottomBoundaryRef} />
    </BasicView>
  );
};

export default Notifications;
