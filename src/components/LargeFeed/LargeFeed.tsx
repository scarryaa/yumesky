import { type AppBskyFeedDefs } from '@atproto/api'
import Link from '../Link/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faPlus } from '@fortawesome/free-solid-svg-icons';
import './LargeFeed.scss';
import { type MouseEvent } from 'react';
import agent from '../../api/agent';

interface LargeFeedProps {
  feed: AppBskyFeedDefs.GeneratorView;
}

const LargeFeedIcon: React.FC = () => {
  return (
    <div className='feed-icon'>
        <FontAwesomeIcon icon={faHashtag} fontSize={16} />
    </div>
  )
}

const addFeed = async (e: MouseEvent<HTMLButtonElement>, feedUri: string): Promise<void> => {
  e.preventDefault();
  await agent.addSavedFeed(feedUri);
}

const LargeFeed: React.FC<LargeFeedProps> = ({ feed }: LargeFeedProps) => {
  const feedId = feed.uri.split('/')[4];

  return (
    <Link linkStyle={false} className='large-feed' to={`/profile/${feed.creator.handle}/feed/${feedId}`}>
        <div className='large-feed-shell'>
            {feed.avatar === undefined ? <LargeFeedIcon /> : <img className='large-feed-avatar' src={feed.avatar} />}
            <div className='large-feed-inner'>
                <div className='large-feed-inner-name-by'>
                    <span className='large-feed-name'>{feed.displayName}</span>
                    <span className='large-feed-by'>Feed by <Link linkStyle={true} to={`/profile/${feed.creator.handle}`}>@{feed.creator.handle}</Link></span>
                </div>
                <button onClick={async (e) => { await addFeed(e, feed.uri); }} className='large-feed-add-button no-button-style'>
                    <FontAwesomeIcon icon={faPlus} fontSize={18} color='var(--primary)'/>
                </button>
            </div>
        </div>
        <div className='large-feed-description'>
            <span>{feed.description}</span>
        </div>
        <div className='large-feed-liked-by'>
            <span>Liked by {feed.likeCount} user{feed.likeCount === 1 ? '' : 's'}</span>
        </div>
    </Link>
  )
}

export default LargeFeed;
