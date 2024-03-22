import { useEffect, useRef } from 'react';
import { type DefaultHomeTabs, type DefaultProfileTabs } from '../../config'
import { useProfilePosts } from '../../hooks/useProfile';
import Feed from '../Feed/Feed';
import List from '../List/List';
import Post from '../Post/Post';
import './ProfileBody.scss';

type Tab = (DefaultProfileTabs | DefaultHomeTabs)[number]
interface ProfileBodyProps {
  actor: string | undefined;
  currentTab: Tab;
}
const ProfileBody: React.FC<ProfileBodyProps> = ({ actor, currentTab }: ProfileBodyProps) => {
  const { posts, feeds, lists, loadMore, setLoadMore } = useProfilePosts(actor, currentTab);
  const bottomBoundaryRef = useRef<HTMLDivElement>(null);
  const isHandlingScroll = useRef(false);

  const handleScroll = async (): Promise<void> => {
    if (bottomBoundaryRef.current === null || isHandlingScroll.current) return;
    isHandlingScroll.current = true;

    const bottomBoundary = bottomBoundaryRef.current.getBoundingClientRect().top - window.innerHeight;
    if (bottomBoundary < 0 || (bottomBoundary < 300 && bottomBoundary > 0)) {
      setLoadMore(true);
    }

    setTimeout(() => {
      isHandlingScroll.current = false;
    }, 500);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore]);

  switch (currentTab) {
    case 'Likes':
    case 'Posts':
    case 'Replies':
    case 'Media':
      return (
        <div>
            {posts?.map((post, i) => (
                <Post post={post} key={i} />
            ))}
            <div className='bottom-boundary-ref' ref={bottomBoundaryRef} />
        </div>
      )
    case 'Feeds':
      if ((feeds !== undefined) && feeds.length <= 0) return (<div className='no-feeds'>You have no feeds.</div>)

      return (
        <div>
            {feeds?.map((feed, i) => (
                <Feed feed={feed} key={i} />
            ))}
            <div className='bottom-boundary-ref' ref={bottomBoundaryRef} />
        </div>
      )
    case 'Lists':
      if ((lists !== undefined) && lists.length <= 0) return (<div className='no-lists'>You have no lists.</div>)

      return (
        <div>
            {lists?.map((list, i) => (
                <List list={list} key={i} />
            ))}
            <div className='bottom-boundary-ref' ref={bottomBoundaryRef} />
        </div>
      )
  }

  return null;
}

export default ProfileBody;
