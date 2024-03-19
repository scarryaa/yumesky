import { useEffect } from 'react';
import { useLightbox, useLightboxControls } from '../../state/lightbox'
import Image from '../Image/Image';
import './Lightbox.scss';

export const LightboxContainer: React.FC = () => {
  const { isLightboxActive, lightboxImages, alts } = useLightbox();

  if (!isLightboxActive) return null;

  return (
    <div>
        <Lightbox srcs={lightboxImages} alts={alts} />
    </div>
  )
}

export const Lightbox: React.FC<{ srcs: string[] | undefined, alts: string[] | undefined }> = ({ srcs, alts }: { srcs: string[] | undefined, alts: string[] | undefined }) => {
  const { isLightboxActive, lightboxImages, currentImageIndex } = useLightbox();
  const { closeLightbox, nextImage, previousImage } = useLightboxControls();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'ArrowRight') {
        nextImage();
      } else if (event.key === 'ArrowLeft') {
        previousImage();
      } else if (event.key === 'Escape') {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextImage, previousImage, currentImageIndex]);

  if (!isLightboxActive) return null;

  const onMaskClick = (): void => {
    closeLightbox();
  }

  return (
    <div className='lightbox-mask' onClick={onMaskClick}>
        <div className='lightbox-mask-inner' style={{ maxHeight: (alts !== undefined) ? '100%' : '100%' }}>
            <Image key={currentImageIndex} className='lightbox-image' src={lightboxImages?.[currentImageIndex]} />
            {(alts?.[currentImageIndex] !== undefined && alts?.[currentImageIndex] !== '') && <div className='lightbox-alt-text-container'>
                <span className='lightbox-alt-text'>{alts?.[currentImageIndex]}</span>
            </div>}
        </div>
    </div>
  )
}
