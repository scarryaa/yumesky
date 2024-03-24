import { useParams } from 'react-router-dom';
import BasicView from '../../components/BasicView/BasicView';
import { useProfile } from '../../hooks/useProfile';
import { useEffect, useMemo, useState } from 'react';
import './Profile.scss';
import PillButton from '../../components/PillButton/PillButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import FollowsYou from '../../components/FollowsYou/FollowsYou';
import TabList from '../../components/TabList/TabList';
import RichText from '../../components/RichText/RichText';
import { type AppBskyActorDefs, RichText as RichTextAPI } from '@atproto/api';
import agent from '../../api/agent';
import getConfig, { type DefaultHomeTabs, type DefaultProfileTabs } from '../../config';
import ProfileBody from '../../components/Profile/ProfileBody';
import { useProfileExtras } from '../../hooks/useProfileExtras';
import Avatar from '../../components/Avatar/Avatar';
import Image from '../../components/Image/Image';
import { useLightbox, useLightboxControls } from '../../state/lightbox';
import useProfileDropdown from '../../hooks/dropdown/useProfileDropdown';
import Dropdown from '../../components/Dropdown/Dropdown';
import FollowButton from '../../components/FollowButton/FollowButton';
import { useCachedProfile } from '../../hooks/useCachedProfile';
import Link from '../../components/Link/Link';

interface ProfileDropdownProps {
  profile: AppBskyActorDefs.ProfileView;
}
const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ profile }: ProfileDropdownProps) => {
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

interface ProfileProps {
  setCurrentPage: (pageName: string) => void;
}
const Profile: React.FC<ProfileProps> = ({ setCurrentPage }: ProfileProps) => {
  const { username } = useParams();
  const { profile, setProfile } = useProfile(username);
  const { hasFeedgens, hasLists } = useProfileExtras(profile?.did);
  const isAgentProfile = agent.session?.handle === username;
  const { isLightboxActive } = useLightbox();
  const { openLightbox, closeLightbox } = useLightboxControls();
  const { setCachedProfile } = useCachedProfile();

  const [selectedTab, setSelectedTab] = useState<DefaultProfileTabs[number] | DefaultHomeTabs[number]>(getConfig().DEFAULT_PROFILE_TABS.TABS[0]);
  const [tabs, setTabs] = useState<Array<DefaultProfileTabs[number] | null>>(['Posts', 'Replies', 'Media', (isAgentProfile || hasFeedgens) ? 'Feeds' : null, (isAgentProfile || hasLists) ? 'Lists' : null, isAgentProfile ? 'Likes' : null]);
  const handleTabClick = (tabDisplayName: DefaultProfileTabs[number] | DefaultHomeTabs[number]): void => {
    setSelectedTab(tabDisplayName);
  };

  const description = profile?.description;
  const descriptionRT = new RichTextAPI({ text: description ?? '' });

  const authorDisplayNameOrHandle = useMemo(() =>
    (profile?.displayName === '' || profile?.displayName === undefined ? profile?.handle : profile?.displayName), [profile]);

  useEffect(() => {
    setTabs(['Posts', 'Replies', 'Media', (isAgentProfile || hasFeedgens) ? 'Feeds' : null, (isAgentProfile || hasLists) ? 'Lists' : null, isAgentProfile ? 'Likes' : null]);
  }, [hasFeedgens, hasLists, profile]);

  useEffect(() => {
    setProfile(undefined);
    setCurrentPage('Profile');
  }, []);

  useEffect(() => {
    if (profile !== undefined && profile?.handle !== '') {
      setCachedProfile(profile);
    }
  }, [profile]);

  return (
    <BasicView viewPadding={false}>
        <div className='profile'>
          {((profile?.banner) != null) ? <div className='profile-banner'><Image onClick={() => { isLightboxActive ? closeLightbox() : openLightbox([profile?.banner ?? ''], 0, []) }} src={profile?.banner} /></div> : <div className='profile-banner fallback-div'></div>}
          <div className='profile-info'>
            <Avatar className='profile-picture' height={100} width={100} src={profile?.avatar} link={undefined} />
            <div className='profile-info-inner'>
              <div className='displayname-and-handle'>
                <span className='displayname'>{authorDisplayNameOrHandle}</span>
                <div className='follows-you-and-handle'>
                  {((profile?.viewer?.followedBy) != null) && <FollowsYou />}
                  <div className='handle'>@{profile?.handle}</div>
                </div>
              </div>
              <div className='profile-buttons'>
                <FollowButton profile={profile} />
                {profile !== undefined && <ProfileDropdown profile={profile}/>}
              </div>
            </div>
            <div className='profile-body'>
              <div className='profile-metrics'>
                  <Link linkStyle={true} to={`/profile/${profile?.handle}/followers`} className='hover-underline'><span className='text-bold profile-metrics-text'>{profile?.followersCount}</span> followers</Link>
                  <Link linkStyle={true} to={`/profile/${profile?.handle}/follows`} className='hover-underline'><span className='text-bold profile-metrics-text'>{profile?.followsCount}</span> following</Link>
                  <span><span className='text-bold profile-metrics-text'>{profile?.postsCount}</span> posts</span>
              </div>
              <RichText value={descriptionRT} />
            </div>
          </div>

          <div>
            <TabList className='profile-tablist' tabs={tabs} selectedTab={selectedTab} onTabClick={handleTabClick} />
          </div>
          <div>
            <ProfileBody actor={profile?.did} currentTab={selectedTab} />
          </div>
        </div>
    </BasicView>
  )
}

export default Profile;
