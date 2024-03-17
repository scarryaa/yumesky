import { useParams } from 'react-router-dom';
import BasicView from '../../components/BasicView/BasicView';
import { useProfile } from '../../hooks/useProfile';
import { useEffect, useState } from 'react';
import './Profile.scss';
import PillButton from '../../components/PillButton/PillButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import FollowsYou from '../../components/FollowsYou/FollowsYou';
import TabList from '../../components/TabList/TabList';
import RichText from '../../components/RichText/RichText';
import { RichText as RichTextAPI } from '@atproto/api';
import agent from '../../api/agent';
import getConfig from '../../config';

interface ProfileProps {
  setCurrentPage: (pageName: string) => void;
}
const Profile: React.FC<ProfileProps> = ({ setCurrentPage }: ProfileProps) => {
  const { username } = useParams();
  const profile = useProfile(username);

  const [selectedTab, setSelectedTab] = useState<string>(getConfig().DEFAULT_PROFILE_TABS.TABS[0]);
  const [tabs] = useState<string[]>(getConfig().DEFAULT_PROFILE_TABS.TABS);
  const handleTabClick = (tabDisplayName: string): void => {
    setSelectedTab(tabDisplayName);
  };

  const description = profile?.description;
  const descriptionRT = new RichTextAPI({ text: description ?? '' });

  useEffect(() => {
    setCurrentPage('Profile');
  }, [])

  return (
    <BasicView viewPadding={false}>
        <div className='profile'>
          {((profile?.banner) != null) ? <img className='profile-banner' src={profile?.banner} /> : <div className='profile-banner fallback-div'></div>}
          <div className='profile-info'>
            <img className='profile-picture' src={profile?.avatar} />
            <div className='profile-info-inner'>
              <div className='displayname-and-handle'>
                <span className='displayname'>{profile?.displayName}</span>
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
        </div>
    </BasicView>
  )
}

export default Profile;
