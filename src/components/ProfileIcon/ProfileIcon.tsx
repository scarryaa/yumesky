import { Link } from 'react-router-dom';
import './ProfileIcon.scss';
import agent from '../../api/agent';
import { useProfile } from '../../hooks/useProfile';

interface ProfileIconProps {
  size: number;
  className: string;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ size, className }: ProfileIconProps) => {
  const { profile } = useProfile(agent.session?.handle);

  return (
    <Link to={`/profile/${agent.session?.handle}`} className={`profile-icon ${className}`} style={{ width: size, height: size }}>
      <img className='profile-icon-img' src={profile?.avatar} style={{ width: size, height: size }}/>
    </Link>
  )
}

export default ProfileIcon;
