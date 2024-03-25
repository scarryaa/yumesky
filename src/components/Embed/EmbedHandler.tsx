import { type AppBskyFeedDefs, type AppBskyEmbedImages, type AppBskyFeedPost, type AppBskyEmbedRecord, type AppBskyEmbedExternal, type AppBskyEmbedRecordWithMedia } from '@atproto/api';
import ImageGrid from '../ImageGrid/ImageGrid';
import EmbedContainer from './EmbedContainer';
import './EmbedHandler.scss';
import { type View, type ViewImage } from '@atproto/api/dist/client/types/app/bsky/embed/images';
import Link from '../Link/Link';

type EmbedType = 'app.bsky.embed.images#view' | 'app.bsky.embed.record#view' | 'app.bsky.embed.external#view' | 'app.bsky.embed.recordWithMedia#view';
type EmbedEmbedType = Array<AppBskyEmbedImages.View | AppBskyEmbedExternal.View | View | AppBskyEmbedRecordWithMedia.View | {
  $type: string;
  [k: string]: unknown;
}>;
type MediaType = AppBskyEmbedImages.View | AppBskyEmbedExternal.View | {
  $type: string;
  [k: string]: unknown;
};

interface EmbedHandlerProps {
  post: AppBskyFeedDefs.FeedViewPost;
}
const EmbedHandler: React.FC<EmbedHandlerProps> = ({ post }: EmbedHandlerProps) => {
  const embedType: EmbedType = post.post.embed?.$type as EmbedType;

  switch (embedType) {
    case 'app.bsky.embed.images#view': {
      const viewImage = post.post.embed?.images as AppBskyEmbedImages.ViewImage[];

      return (
        <ImageGrid images={viewImage} />
      )
    }

    case 'app.bsky.embed.record#view': {
      const record = post.post.embed?.record as AppBskyEmbedRecord.ViewRecord;
      const value = record?.value as AppBskyFeedPost.Record;

      return (
        <EmbedContainer embed={post.post.embed}>
          {value?.text}
          <div className='embed-images-container'>
            {record.embeds?.length != null &&
              record.embeds?.map((embed, i) => (
                <ImageGrid className='embed-images' key={i} images={embed.images as ViewImage[]} />
              ))}
          </div>
        </EmbedContainer>
      )
    }

    case 'app.bsky.embed.external#view': {
      const external = post.post.embed?.external as AppBskyEmbedExternal.External;

      return (
        <Link onClick={(e) => { e.preventDefault(); location.href = external.uri; }} to={external.uri} linkStyle={false} className='embed-handler'>
          <img className='embed-external-img' src={external.thumb?.toString()} />
          <div className='embed-external-info'>
            <span className='embed-external-uri'>{external.uri}</span>
            <span className='embed-external-title'>{external.title}</span>
            <span className='embed-external-description'>{external.description}</span>
          </div>
        </Link>
      )
    }

    case 'app.bsky.embed.recordWithMedia#view': {
      const embedRecordWithMedia = post.post.embed?.record as AppBskyEmbedRecordWithMedia.View;
      const embedRecordView = post.post.embed?.record as AppBskyEmbedRecord.View;
      const mediaType = post.post.embed?.media as MediaType;
      const mediaTypeExternal = mediaType?.external as AppBskyEmbedExternal.External;

      return (
        <>
          <ImageGrid images={mediaType.images as ViewImage[]} />
          {(((post.post.embed?.media as MediaType)?.external !== undefined)) && <div className='embed-handler'>
            <img className='embed-external-img' src={(mediaType?.external as AppBskyEmbedExternal.External)?.thumb?.toString()} />
            <div className='embed-external-info'>
              <span className='embed-external-uri'>{mediaTypeExternal?.uri}</span>
              <span className='embed-external-title'>{mediaTypeExternal?.title}</span>
              <span className='embed-external-description'>{mediaTypeExternal?.description}</span>
            </div>
          </div>}
          <EmbedContainer embed={embedRecordWithMedia}>
            {((post.post.embed?.record as AppBskyEmbedRecord.View).record?.value as AppBskyFeedPost.Record)?.text}
            <div className='embed-images-container'>
              {((embedRecordView.record.embeds) != null) &&
                (embedRecordView.record.embeds as EmbedEmbedType).map((embed, i) => (
                  <ImageGrid className='embed-images' key={i} images={(embed.media as MediaType)?.images as ViewImage[]} />
                ))}
              {((embedRecordView.record.embeds) != null) &&
                (embedRecordView.record.embeds as EmbedEmbedType).map((embed, i) => (
                  <ImageGrid className='embed-images' key={i} images={(embed.images as ViewImage[])} />
                ))}
            </div>
          </EmbedContainer>
        </>
      )
    }

    default: return null;
  }
}

export default EmbedHandler;
