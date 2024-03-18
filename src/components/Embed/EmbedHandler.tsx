import { type AppBskyFeedDefs, type AppBskyEmbedImages, type AppBskyFeedPost, type AppBskyEmbedRecord, type AppBskyEmbedExternal, type AppBskyEmbedRecordWithMedia } from '@atproto/api';
import ImageGrid from '../ImageGrid/ImageGrid';
import EmbedContainer from './EmbedContainer';
import './EmbedHandler.scss';
import { type View, type ViewImage } from '@atproto/api/dist/client/types/app/bsky/embed/images';

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
  console.log(post.post.embed);

  switch (embedType) {
    case 'app.bsky.embed.images#view': {
      return (
        <ImageGrid images={post.post.embed?.images as AppBskyEmbedImages.ViewImage[]} />
      )
    }
    case 'app.bsky.embed.record#view': {
      return (
        <EmbedContainer embed={post.post.embed}>
            {((post.post.embed?.record as AppBskyEmbedRecord.ViewRecord).value as AppBskyFeedPost.Record).text}
            <div className='embed-images-container'>
              {(((post.post.embed?.record as AppBskyEmbedRecord.ViewRecord).embeds?.length) != null) &&
              (post.post.embed?.record as AppBskyEmbedRecord.ViewRecord).embeds?.map((embed, i) => (
                <ImageGrid className='embed-images' key={i} images={embed.images as ViewImage[]} />
              ))}
            </div>
        </EmbedContainer>
      )
    }
    case 'app.bsky.embed.external#view': {
      return (
            <div className='embed-handler'>
              <img className='embed-external-img' src={(post.post.embed?.external as AppBskyEmbedExternal.External).thumb?.toString()} />
              <div className='embed-external-info'>
                <span className='embed-external-uri'>{(post.post.embed?.external as AppBskyEmbedExternal.External).uri}</span>
                <span className='embed-external-title'>{(post.post.embed?.external as AppBskyEmbedExternal.External).title}</span>
                <span className='embed-external-description'>{(post.post.embed?.external as AppBskyEmbedExternal.External).description}</span>
              </div>
            </div>
      )
    }
    case 'app.bsky.embed.recordWithMedia#view': {
      return (
        <>
        <ImageGrid images={(post.post.embed?.media as MediaType).images as ViewImage[]} />
        <EmbedContainer embed={post.post.embed?.record as AppBskyEmbedRecordWithMedia.View}>
          {((post.post.embed?.record as AppBskyEmbedRecord.View).record.value as AppBskyFeedPost.Record).text}
          <div className='embed-images-container'>
            {(((post.post.embed?.record as AppBskyEmbedRecord.View).record.embeds) != null) &&
            ((post.post.embed?.record as AppBskyEmbedRecord.View).record.embeds as EmbedEmbedType).map((embed, i) => (
              <ImageGrid className='embed-images' key={i} images={(embed.media as MediaType).images as ViewImage[]} />
            ))}
          </div>
      </EmbedContainer>
        </>
      )
    }
    default: return (
      null
    )
  }
}

export default EmbedHandler;
