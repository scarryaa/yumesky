import { type MouseEvent } from 'react';
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
  return (
    <div className='image-container' onClick={onClick}>
        <img src={src} style={style} className={`${className}`} />
        {(alt !== undefined && alt !== '') && <div className='image-alt-tag'>ALT</div>}
    </div>
  )
}

export default Image;
