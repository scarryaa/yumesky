import { type AppBskyEmbedImages } from '@atproto/api';
import './ImageGrid.scss';
import Image from '../Image/Image';
import { useLightbox, useLightboxControls } from '../../state/lightbox';

interface ImageGridProps {
  images: AppBskyEmbedImages.ViewImage[] | undefined;
  className?: string;
}

// TODO consider aspect ratios
const ImageGrid: React.FC<ImageGridProps> = ({ images, className }: ImageGridProps) => {
  const count = images?.length;
  const { openLightbox, closeLightbox } = useLightboxControls();
  const { isLightboxActive } = useLightbox();
  const imgOpenLightbox = (index: number): void => {
    isLightboxActive
      ? closeLightbox()
      : openLightbox(images?.map(img => img.fullsize) ?? [], index, images?.map(img => img.alt) ?? [])
  }

  switch (count) {
    case 1:
      return (
        <div className={`image-grid--1 ${className}`}>
            <Image onClick={(e) => { e.preventDefault(); e.stopPropagation(); imgOpenLightbox(0); } } alt={images?.[0].alt} style={{ width: '100%' }} className='img' originalSrc={images?.[0].fullsize} src={images?.[0].thumb} />
        </div>
      )
    case 2:
      return (
        <div className={`image-grid--2 ${className}`}>
            <Image onClick={(e) => { e.preventDefault(); e.stopPropagation(); imgOpenLightbox(0); } } alt={images?.[0].alt} style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img' originalSrc={images?.[0].fullsize} src={images?.[0].thumb} />
            <Image onClick={(e) => { e.preventDefault(); e.stopPropagation(); imgOpenLightbox(1); } } alt={images?.[1].alt} style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img' originalSrc={images?.[1].fullsize} src={images?.[1].thumb} />
        </div>
      )
    case 3:
      return (
        <div className={`image-grid--3 ${className}`}>
            <Image onClick={(e) => { e.preventDefault(); e.stopPropagation(); imgOpenLightbox(0); } } alt={images?.[0].alt} style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img' originalSrc={images?.[0].fullsize} src={images?.[0].thumb} />
            <Image onClick={(e) => { e.preventDefault(); e.stopPropagation(); imgOpenLightbox(1); } } alt={images?.[1].alt} style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img' originalSrc={images?.[1].fullsize} src={images?.[1].thumb} />
            <Image onClick={(e) => { e.preventDefault(); e.stopPropagation(); imgOpenLightbox(2); } } alt={images?.[2].alt} style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img img--3' originalSrc={images?.[2].fullsize} src={images?.[2].thumb} />
        </div>
      )
    case 4:
      return (
        <div className={`image-grid--4 ${className}`}>
            <Image onClick={(e) => { e.preventDefault(); e.stopPropagation(); imgOpenLightbox(0); } } alt={images?.[0].alt} style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img' originalSrc={images?.[0].fullsize} src={images?.[0].thumb} />
            <Image onClick={(e) => { e.preventDefault(); e.stopPropagation(); imgOpenLightbox(1); } } alt={images?.[1].alt} style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img' originalSrc={images?.[1].fullsize} src={images?.[1].thumb} />
            <Image onClick={(e) => { e.preventDefault(); e.stopPropagation(); imgOpenLightbox(2); } } alt={images?.[2].alt} style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img' originalSrc={images?.[2].fullsize} src={images?.[2].thumb} />
            <Image onClick={(e) => { e.preventDefault(); e.stopPropagation(); imgOpenLightbox(3); } } alt={images?.[3].alt} style={{ width: '100%', height: '100%', marginBottom: '1rem' }} className='img' originalSrc={images?.[3].fullsize} src={images?.[3].thumb} />
        </div>
      )

    default: return null;
  }
}

export default ImageGrid;
