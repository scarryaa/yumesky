import { type AppBskyFeedDefs, type AppBskyEmbedImages, type AppBskyFeedPost, type AppBskyEmbedRecord } from '@atproto/api';
import ImageGrid from '../ImageGrid/ImageGrid';
import EmbedContainer from './EmbedContainer';
import './EmbedHandler.scss';
import { type ViewImage } from '@atproto/api/dist/client/types/app/bsky/embed/images';

type EmbedType = 'app.bsky.embed.images#view' | 'app.bsky.embed.record#view' | 'app.bsky.embed.external#view';

interface EmbedHandlerProps {
  post: AppBskyFeedDefs.FeedViewPost;
}
const EmbedHandler: React.FC<EmbedHandlerProps> = ({ post }: EmbedHandlerProps) => {
  const embedType: EmbedType = post.post.embed?.$type as EmbedType;
  console.log(post.post.embed?.record);

  switch (embedType) {
    case 'app.bsky.embed.images#view': {
      return (
        <div>
            <ImageGrid images={post.post.embed?.images as AppBskyEmbedImages.ViewImage[]} />
        </div>
      )
    }
    case 'app.bsky.embed.record#view': {
      return (
        <EmbedContainer embed={post.post.embed}>
            {((post.post.embed?.record as AppBskyEmbedRecord.ViewRecord).value as AppBskyFeedPost.Record).text}
            {(((post.post.embed?.record as AppBskyEmbedRecord.ViewRecord).embeds?.length) != null) &&
            (post.post.embed?.record as AppBskyEmbedRecord.ViewRecord).embeds?.map((embed, i) => (
              <ImageGrid className='embed-images' key={i} images={embed.images as ViewImage[]} />
            ))}
        </EmbedContainer>
      )
    }
    case 'app.bsky.embed.external#view': {
      return (
            <div className='embed-handler'>
                external embed
            </div>
      )
    }
    default: return (
      null
    )
  }
}

export default EmbedHandler;
