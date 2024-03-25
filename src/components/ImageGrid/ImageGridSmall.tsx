import { type AppBskyEmbedImages } from '@atproto/api';
import './ImageGridSmall.scss';
import Image from '../Image/Image'; ;

interface ImageGridSmallProps {
  images: AppBskyEmbedImages.ViewImage[] | undefined;
  className?: string;
}

const ImageGridSmall: React.FC<ImageGridSmallProps> = ({ images, className }: ImageGridSmallProps) => {
  const count = images?.length;

  switch (count) {
    case 1:
      return (
        <div className={`image-grid-small--1 ${className}`}>
            <Image style={{ width: '100%' }} className='img-small' originalSrc={images?.[0].fullsize} src={images?.[0].thumb} />
        </div>
      )
    case 2:
      return (
        <div className={`image-grid-small--2 ${className}`}>
            <Image style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img-small' originalSrc={images?.[0].fullsize} src={images?.[0].thumb} />
            <Image style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img-small' originalSrc={images?.[1].fullsize} src={images?.[1].thumb} />
        </div>
      )
    case 3:
      return (
        <div className={`image-grid-small--3 ${className}`}>
            <Image style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img-small' originalSrc={images?.[0].fullsize} src={images?.[0].thumb} />
            <Image style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img-small' originalSrc={images?.[1].fullsize} src={images?.[1].thumb} />
            <Image style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img-small img-small--3' originalSrc={images?.[2].fullsize} src={images?.[2].thumb} />
        </div>
      )
    case 4:
      return (
        <div className={`image-grid-small--4 ${className}`}>
            <Image style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img-small' originalSrc={images?.[0].fullsize} src={images?.[0].thumb} />
            <Image style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img-small' originalSrc={images?.[1].fullsize} src={images?.[1].thumb} />
            <Image style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img-small' originalSrc={images?.[2].fullsize} src={images?.[2].thumb} />
            <Image style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img-small' originalSrc={images?.[3].fullsize} src={images?.[3].thumb} />
        </div>
      )

    default: return null;
  }
}

export default ImageGridSmall;
