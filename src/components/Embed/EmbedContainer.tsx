import { AppBskyEmbedRecord, type AppBskyEmbedExternal, type AppBskyEmbedImages, type AppBskyEmbedRecordWithMedia } from '@atproto/api';
import './EmbedContainer.scss';
import { ago } from '../../utils';
import Avatar from '../Avatar/Avatar';
import Link from '../Link/Link';
import { useNavigate } from 'react-router-dom';
import { usePost } from '../../contexts/PostContext';

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

  return (
    <Link onClick={(e: React.MouseEvent<Element>) => { setCachedPost(undefined); e.stopPropagation(); e.preventDefault(); console.log('e'); navigate(`../profile/${AppBskyEmbedRecord.isViewRecord(embed.record) && embed.record.author.handle}/post/${AppBskyEmbedRecord.isViewRecord(embed.record) && embed.record.uri.split('/')[4]}`); }} linkStyle={false} to={`/profile/${AppBskyEmbedRecord.isViewRecord(embed.record) && embed.record.author.handle}/post/${AppBskyEmbedRecord.isViewRecord(embed.record) && embed.record.uri.split('/')[4]}`} className='embed-container'>
        <div className='embed-info'>
            <Avatar img={AppBskyEmbedRecord.isViewRecord(embed.record) ? embed.record.author.avatar : ''} height={15} width={15} />
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