import { AppBskyEmbedRecord, type AppBskyEmbedExternal, type AppBskyEmbedImages, type AppBskyEmbedRecordWithMedia } from '@atproto/api';
import './EmbedContainer.scss';
import { ago } from '../../utils';
import Avatar from '../Avatar/Avatar';
import Link from '../Link/Link';
import { useNavigate } from 'react-router-dom';
import { usePost } from '../../contexts/PostContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

type EmbedType = AppBskyEmbedImages.View | AppBskyEmbedExternal.View | AppBskyEmbedRecord.View | AppBskyEmbedRecordWithMedia.View | {
  $type: string;
  [k: string]: unknown;
} | undefined;

interface EmbedContainerProps {
  children: React.ReactNode;
  embed: EmbedType;
}
const EmbedContainer: React.FC<EmbedContainerProps> = ({ children, embed }: EmbedContainerProps) => {
  const navigate = useNavigate();
  const { setCachedPost } = usePost();
  if (embed === undefined) return null;

  // blocked
  if ((embed.record as AppBskyEmbedRecord.ViewRecord).$type === 'app.bsky.embed.record#viewBlocked') {
    return (
        <div onClick={(e: React.MouseEvent<Element>) => { setCachedPost(undefined); e.stopPropagation(); e.preventDefault(); navigate(`../profile/${AppBskyEmbedRecord.isViewRecord(embed.record) && embed.record.author.handle}/post/${AppBskyEmbedRecord.isViewRecord(embed.record) && embed.record.uri.split('/')[4]}`); }} className='embed-container'>
            <div className='embed-info'>
                <div className='embed-deleted'>
                    <FontAwesomeIcon icon={faInfoCircle} fontSize={14} />
                    <span>Blocked</span>
                </div>
            </div>
            <div className='embed-children'>
                {children}
            </div>
        </div>
    )
  }

  // not found
  if ((embed.record as AppBskyEmbedRecord.ViewRecord).$type === 'app.bsky.embed.record#viewNotFound') {
    return (
        <div onClick={(e: React.MouseEvent<Element>) => { setCachedPost(undefined); e.stopPropagation(); e.preventDefault(); navigate(`../profile/${AppBskyEmbedRecord.isViewRecord(embed.record) && embed.record.author.handle}/post/${AppBskyEmbedRecord.isViewRecord(embed.record) && embed.record.uri.split('/')[4]}`); }} className='embed-container'>
            <div className='embed-info'>
                <div className='embed-deleted'>
                    <FontAwesomeIcon icon={faInfoCircle} fontSize={14} />
                    <span>Deleted</span>
                </div>
            </div>
            <div className='embed-children'>
                {children}
            </div>
        </div>
    )
  }

  return (
    // TODO fix caching interaction with this
    <Link onClick={(e: React.MouseEvent<Element>) => { setCachedPost(undefined); e.stopPropagation(); e.preventDefault(); navigate(`../profile/${AppBskyEmbedRecord.isViewRecord(embed.record) && embed.record.author.handle}/post/${AppBskyEmbedRecord.isViewRecord(embed.record) && embed.record.uri.split('/')[4]}`); }} linkStyle={false} to={`/profile/${AppBskyEmbedRecord.isViewRecord(embed.record) && embed.record.author.handle}/post/${AppBskyEmbedRecord.isViewRecord(embed.record) && embed.record.uri.split('/')[4]}`} className='embed-container'>
        <div className='embed-info'>
            <Avatar src={AppBskyEmbedRecord.isViewRecord(embed.record) ? embed.record.author.avatar : ''} height={15} width={15} />
            <div className='embed-info-and-timestamp'>
                <div className='embed-author-display-name-and-handle'>
                    <span className='embed-author-display-name'>{AppBskyEmbedRecord.isViewRecord(embed.record) && embed.record.author.displayName}</span>
                    &nbsp;
                    <span className='embed-author-handle'>@{AppBskyEmbedRecord.isViewRecord(embed.record) && embed.record.author.handle}</span>
                </div>
                <span>·</span>
                <span className='embed-timestamp'>{AppBskyEmbedRecord.isViewRecord(embed.record) && ago(embed.record.indexedAt)}</span>
            </div>
        </div>
        <div className='embed-children'>
            {children}
        </div>
    </Link>
  )
}

export default EmbedContainer;
