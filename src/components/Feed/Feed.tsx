import { type AppBskyFeedDefs } from '@atproto/api'
import Link from '../Link/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import './Feed.scss';

interface FeedProps {
  feed: AppBskyFeedDefs.GeneratorView;
}

const FeedIcon: React.FC = () => {
  return (
    <div className='feed-icon'>
        <FontAwesomeIcon icon={faHashtag} fontSize={16} />
    </div>
  )
}

const Feed: React.FC<FeedProps> = ({ feed }: FeedProps) => {
  const feedId = feed.uri.split('/')[4];

  return (
    <Link linkStyle={false} className='feed' to={`/profile/${feed.creator.handle}/feed/${feedId}`}>
        <div className='feed-shell'>
            {feed.avatar === undefined ? <FeedIcon /> : <img className='feed-avatar' src={feed.avatar} />}
            <div className='feed-inner'>
                <span className='feed-name'>{feed.displayName}</span>
                <span className='feed-by'>Feed by <Link linkStyle={true} to={`/profile/${feed.creator.handle}`}>@{feed.creator.handle}</Link></span>
            </div>
        </div>
        <div className='feed-liked-by'>
            <span>Liked by {feed.likeCount} user{feed.likeCount === 1 ? '' : 's'}</span>
        </div>
    </Link>
  )
}

export default Feed;
