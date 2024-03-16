import { type AppBskyEmbedImages } from '@atproto/api';
import './ImageGrid.scss';

interface ImageGridProps {
  images: AppBskyEmbedImages.ViewImage[] | undefined;
}

// TODO consider aspect ratios
const ImageGrid: React.FC<ImageGridProps> = ({ images }: ImageGridProps) => {
  const count = images?.length;

  switch (count) {
    case 1:
      return (
        <div className='image-grid--1'>
            <img style={{ width: '100%' }} className='img' src={images?.[0].thumb} />
        </div>
      )
    case 2:
      return (
        <div className='image-grid--2'>
            <img style={{ width: '100%', marginBottom: '1rem' }} className='img' src={images?.[0].thumb} />
            <img style={{ width: '100%', marginBottom: '1rem' }} className='img' src={images?.[1].thumb} />
        </div>
      )
    case 3:
      return (
        <div className='image-grid--3'>
            <img style={{ width: '100%', marginBottom: '1rem' }} className='img' src={images?.[0].thumb} />
            <img style={{ width: '100%', marginBottom: '1rem' }} className='img' src={images?.[1].thumb} />
            <img style={{ width: '100%', marginBottom: '1rem' }} className='img' src={images?.[2].thumb} />
        </div>
      )
    case 4:
      return (
        <div className='image-grid--4'>
            <img style={{ width: '100%', marginBottom: '1rem' }} className='img' src={images?.[0].thumb} />
            <img style={{ width: '100%', marginBottom: '1rem' }} className='img' src={images?.[1].thumb} />
            <img style={{ width: '100%', marginBottom: '1rem' }} className='img' src={images?.[2].thumb} />
            <img style={{ width: '100%', marginBottom: '1rem' }} className='img' src={images?.[3].thumb} />
        </div>
      )

    default: return null;
  }
}

export default ImageGrid;
