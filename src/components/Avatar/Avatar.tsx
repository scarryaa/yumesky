import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Avatar.scss';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Link from '../Link/Link';

interface AvatarProps {
  link?: string;
  img: string | undefined;
  width: number;
  height: number;
  className?: string;
}
// TODO fix issue where profile pfp doesnt reload if you navigate from a broken profile to a normal one
const Avatar: React.FC<AvatarProps> = ({ link, img, width, height, className }: AvatarProps) => {
  if (link === undefined) {
    return (
    <div className={`avatar ${className}`} style={{ width, height }}>
        { img !== undefined &&
        <object type='image/jpeg' data={img} style={{ width, height }}>
            <div className='avatar-fallback' style={{ width, height }}><FontAwesomeIcon className='avatar-fallback-icon' icon={faUser} fontSize={width / 1.25} /></div>
        </object>}
    </div>
    )
  }

  return (
    <Link linkStyle={false} to={link ?? ''} className={`avatar ${className}`} style={{ width, height }}>
        { img !== undefined &&
        <object type='image/jpeg' data={img} style={{ width, height }}>
            <div className='avatar-fallback' style={{ width, height }}><FontAwesomeIcon className='avatar-fallback-icon' icon={faUser} fontSize={width / 1.25} /></div>
        </object>}
    </Link>
  )
}

export default Avatar;
