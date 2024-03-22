import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Avatar.scss';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Link from '../Link/Link';
import Image from '../Image/Image';
import { useLightbox, useLightboxControls } from '../../state/lightbox';

interface AvatarProps {
  link?: string;
  src: string | undefined;
  originalSrc?: string | undefined;
  width: number;
  height: number;
  className?: string;
}
// TODO fix issue where profile pfp doesnt reload if you navigate from a broken profile to a normal one
const Avatar: React.FC<AvatarProps> = ({ link, src, originalSrc, width, height, className }: AvatarProps) => {
  const { isLightboxActive } = useLightbox();
  const { openLightbox, closeLightbox } = useLightboxControls();

  if (link === undefined) {
    return (
    <div className={`avatar ${className}`} style={{ width, height }}>
      <Image onClick={() => { isLightboxActive ? closeLightbox() : openLightbox([originalSrc ?? src ?? ''], 0, []) }} className='avatar-image' style={{ width, height }} src={originalSrc ?? src} alt='' />
    </div>
    )
  }

  return (
    <Link linkStyle={false} to={link ?? ''} className={`avatar ${className}`} style={{ width, height }}>
        <object className='avatar-image' type='image/jpeg' data={originalSrc ?? src} style={{ width, height }}>
            <div className='avatar-fallback' style={{ width, height }}><FontAwesomeIcon className='avatar-fallback-icon' icon={faUser} fontSize={width / 1.25} /></div>
        </object>
    </Link>
  )
}

export default Avatar;
