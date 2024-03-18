import { useParams } from 'react-router-dom';
import BasicView from '../../components/BasicView/BasicView';
import { useProfile } from '../../hooks/useProfile';
import { useEffect, useMemo, useState } from 'react';
import './Profile.scss';
import PillButton from '../../components/PillButton/PillButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import FollowsYou from '../../components/FollowsYou/FollowsYou';
import TabList from '../../components/TabList/TabList';
import RichText from '../../components/RichText/RichText';
import { RichText as RichTextAPI } from '@atproto/api';
import agent from '../../api/agent';
import getConfig, { type DefaultHomeTabs, type DefaultProfileTabs } from '../../config';
import ProfileBody from '../../components/Profile/ProfileBody';
import { useProfileExtras } from '../../hooks/useProfileExtras';
import Avatar from '../../components/Avatar/Avatar';

interface ProfileProps {
  setCurrentPage: (pageName: string) => void;
}
const Profile: React.FC<ProfileProps> = ({ setCurrentPage }: ProfileProps) => {
  const { username } = useParams();
  const profile = useProfile(username);
  const { hasFeedgens, hasLists } = useProfileExtras(profile?.did);
  const isAgentProfile = agent.session?.handle === username;

  const [selectedTab, setSelectedTab] = useState<DefaultProfileTabs[number] | DefaultHomeTabs[number]>(getConfig().DEFAULT_PROFILE_TABS.TABS[0]);
  const [tabs, setTabs] = useState<Array<DefaultProfileTabs[number] | null>>(['Posts', 'Replies', 'Media', (isAgentProfile || hasFeedgens) ? 'Feeds' : null, (isAgentProfile || hasLists) ? 'Lists' : null, isAgentProfile ? 'Likes' : null]);
  const handleTabClick = (tabDisplayName: DefaultProfileTabs[number] | DefaultHomeTabs[number]): void => {
    setSelectedTab(tabDisplayName);
  };

  const description = profile?.description;
  const descriptionRT = new RichTextAPI({ text: description ?? '' });

  const authorDisplayNameOrHandle = useMemo(() =>
    (profile?.displayName ?? profile?.handle), [profile]);

  useEffect(() => {
    setTabs(['Posts', 'Replies', 'Media', (isAgentProfile || hasFeedgens) ? 'Feeds' : null, (isAgentProfile || hasLists) ? 'Lists' : null, isAgentProfile ? 'Likes' : null]);
  }, [hasFeedgens, hasLists]);

  useEffect(() => {
    setCurrentPage('Profile');
  }, [])

  return (
    <BasicView viewPadding={true}>
        <div className='profile'>
          {((profile?.banner) != null) ? <img className='profile-banner' src={profile?.banner} /> : <div className='profile-banner fallback-div'></div>}
          <div className='profile-info'>
            <Avatar className='profile-picture' height={100} width={100} img={profile?.avatar} link={undefined} />
            <div className='profile-info-inner'>
              <div className='displayname-and-handle'>
                <span className='displayname'>{authorDisplayNameOrHandle}</span>
                <div className='follows-you-and-handle'>
                  {((profile?.viewer?.followedBy) != null) && <FollowsYou />}
                  <div className='handle'>@{profile?.handle}</div>
                </div>
              </div>
              <div className='profile-buttons'>
                <PillButton color='var(--secondary-highlight)' className='profile-buttons-following'>
                  {((profile?.viewer?.following) != null) ? <><FontAwesomeIcon icon={faCheck} fontSize={14} />Following</> : (profile?.did === agent.session?.did) ? 'Edit Profile' : 'Follow'}
                </PillButton>
                <PillButton color='var(--secondary-highlight)'>
                  <FontAwesomeIcon icon={faEllipsisH} fontSize={16} />
                </PillButton>
              </div>
            </div>
            <div className='profile-body'>
              <div className='profile-metrics'>
                  <span className='hover-underline'><span className='text-bold profile-metrics-text'>{profile?.followersCount}</span> followers</span>
                  <span className='hover-underline'><span className='text-bold profile-metrics-text'>{profile?.followsCount}</span> following</span>
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
