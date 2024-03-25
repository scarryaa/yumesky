import { type AppBskyActorDefs } from '@atproto/api'
import { LoadingPlaceholder } from '../../pages/com/util/LoadingPlaceholder'
import { ProfileHeaderStandard } from './Header/ProfileHeaderStandard';
import useProfileDropdown from '../../hooks/dropdown/useProfileDropdown';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropdown from '../../components/Dropdown/Dropdown';
import PillButton from '../../components/PillButton/PillButton';
import { LoadingSkeletonText } from '../../pages/com/util/LoadingSkeletonText';

interface Props {
  profile: AppBskyActorDefs.ProfileViewDetailed;
}

export const ProfileHeaderLoading: React.FC = () => {
  return (
    <div>
        <LoadingPlaceholder width={'100%'} height={150} style={{ borderRadius: 0 }} />
        <LoadingPlaceholder width={100} height={100} style={{
          borderRadius: '50%',
          backgroundColor: 'var(--secondary-highlight',
          position: 'absolute',
          marginLeft: '0.8rem',
          top: 152
        }} />
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: '0.2rem' }}>
            <div style={{ flex: '1', marginLeft: '8rem', marginTop: '0.2rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <LoadingSkeletonText />
                <LoadingSkeletonText />
            </div>
            <div style={{ marginRight: '0.5rem', display: 'flex', flexDirection: 'row', gap: '0.2rem' }}>
                <LoadingSkeletonText style={{ borderRadius: '16px', marginTop: '0.2rem' }} height={45} width={100} />
                <LoadingSkeletonText style={{ borderRadius: '16px', marginTop: '0.2rem' }} height={45} width={60} />
            </div>
        </div>
    </div>
  )
}

export const ProfileHeader: React.FC<Props> = (props: Props) => {
  return <ProfileHeaderStandard {...props} />
}

interface ProfileDropdownProps {
  profile: AppBskyActorDefs.ProfileView;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ profile }: ProfileDropdownProps) => {
  const { dropdownItems } = useProfileDropdown(profile);

  return (
      <Dropdown items={dropdownItems}>
        <div>
          <PillButton color='var(--secondary-highlight)'>
            <FontAwesomeIcon icon={faEllipsisH} fontSize={16} />
          </PillButton>
        </div>
      </Dropdown>
  )
}
