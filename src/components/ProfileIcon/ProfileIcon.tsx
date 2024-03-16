import './ProfileIcon.scss';

interface ProfileIconProps {
  size: number;
  className: string;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ size, className }: ProfileIconProps) => {
  return (
    <div className={`profile-icon ${className}`} style={{ width: size, height: size }}>
    </div>
  )
}

export default ProfileIcon;
