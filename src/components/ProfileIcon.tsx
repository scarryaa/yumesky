import './ProfileIcon.scss';

interface ProfileIconProps {
  size: number;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ size }: ProfileIconProps) => {
  return (
    <div className='profile-icon' style={{ width: size, height: size }}>
    </div>
  )
}

export default ProfileIcon;
