import { type AppBskyEmbedImages } from '@atproto/api';
import './ImageGrid.scss';

interface ImageGridProps {
  images: AppBskyEmbedImages.ViewImage[] | undefined;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }: ImageGridProps) => {
  const count = images?.length;

  switch (count) {
    case 1:
      return (
        <img style={{ width: '100%', marginBottom: '0.5rem' }} className='img' src={images?.[0].thumb} />
      )
    case 2:
      return (
        <div>2</div>
      )
    case 3:
      return (
        <div>3</div>
      )
    case 4:
      return (
        <div>4</div>
      )

    default: return null;
  }
}

export default ImageGrid;
