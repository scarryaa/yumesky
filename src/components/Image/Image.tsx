import { type MouseEvent } from 'react';
import { useLightbox, useLightboxControls } from '../../state/lightbox';
import './Image.scss';

interface ImageProps {
  className?: string;
  src: string | undefined;
  originalSrc?: string | undefined;
  style?: React.CSSProperties;
  alt?: string;
  onClick?: (e: MouseEvent) => void;
}
const Image: React.FC<ImageProps> = ({ className, src, originalSrc, style, alt, onClick }: ImageProps) => {
  const { openLightbox, closeLightbox } = useLightboxControls();
  const { isLightboxActive } = useLightbox();

  return (
    <div className='image-container' onClick={onClick}>
        <img src={src} style={style} onClick={(e) => { e.stopPropagation(); e.preventDefault(); isLightboxActive ? closeLightbox() : openLightbox(originalSrc ?? src, alt); }} className={`${className}`} />
        {(alt !== undefined && alt !== '') && <div className='image-alt-tag'>ALT</div>}
    </div>
  )
}

export default Image;
