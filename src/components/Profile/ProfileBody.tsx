import { type DefaultHomeTabs, type DefaultProfileTabs } from '../../config'
import { useProfilePosts } from '../../hooks/useProfile';
import Post from '../Post/Post';
import './ProfileBody.scss';

type Tab = (DefaultProfileTabs | DefaultHomeTabs)[number]
interface ProfileBodyProps {
  actor: string | undefined;
  currentTab: Tab;
}
const ProfileBody: React.FC<ProfileBodyProps> = ({ actor, currentTab }: ProfileBodyProps) => {
  const { posts, feeds, lists } = useProfilePosts(actor, currentTab);

  switch (currentTab) {
    case 'Likes':
      return (
        <div>
            {posts?.map((post, i) => (
                <Post post={post} key={i} />
            ))}
        </div>
      )
    case 'Feeds':
      if ((feeds !== undefined) && feeds.length <= 0) return (<div className='no-feeds'>You have no feeds.</div>)

      return (
        <div>
            {feeds?.map((feed, i) => (
                <div key={i}>feed</div>
            ))}
        </div>
      )
    case 'Lists':
      if ((lists !== undefined) && lists.length <= 0) return (<div className='no-lists'>You have no lists.</div>)

      return (
        <div>
            {lists?.map((list, i) => (
                <div key={i}>list</div>
            ))}
        </div>
      )
    case 'Media':
      return (
        <div>
            {posts?.map((post, i) => (
                <Post post={post} key={i} />
            ))}
        </div>
      )
    case 'Posts':
      return (
        <div>
            {posts?.map((post, i) => (
                <Post post={post} key={i} />
            ))}
        </div>
      )
    case 'Replies':
      return (
        <div>
            {posts?.map((post, i) => (
                <Post post={post} key={i} />
            ))}
        </div>
      )
  }

  return null;
}

export default ProfileBody;
