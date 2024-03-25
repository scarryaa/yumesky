import { useParams } from 'react-router-dom';
import BasicView from '../../components/BasicView/BasicView';
import React, { useEffect, useState } from 'react';
import './Profile.scss';
import TabList from '../../components/TabList/TabList';
import agent from '../../api/agent';
import getConfig, { type DefaultHomeTabs, type DefaultProfileTabs } from '../../config';
import ProfileBody from '../../components/Profile/ProfileBody';
import { useProfileExtras } from '../../hooks/useProfileExtras';
import { useCachedProfile } from '../../hooks/useCachedProfile';
import { useProfileQuery } from '../../state/queries/profile';
import { ProfileHeaderLoading } from '../../views/Profile';
import { ProfileHeaderStandard } from '../../views/Profile/Header/ProfileHeaderStandard';
import { ErrorRetry } from '../com/ErrorRetry';

interface ProfileProps {
  setCurrentPage: (pageName: string) => void;
}
const Profile: React.FC<ProfileProps> = ({ setCurrentPage }: ProfileProps) => {
  const { username } = useParams();
  const isAgentProfile = agent.session?.handle === username;
  const { setCachedProfile } = useCachedProfile();
  const { data: profile, refetch: refetchProfile, error: profileError, isLoading: isLoadingProfile, isPlaceholderData: isPlaceholderProfile } = useProfileQuery({ did: username });
  const { hasFeedgens, hasLists } = useProfileExtras(profile?.did);

  const [selectedTab, setSelectedTab] = useState<DefaultProfileTabs[number] | DefaultHomeTabs[number]>(getConfig().DEFAULT_PROFILE_TABS.TABS[0]);
  const [tabs, setTabs] = useState<Array<DefaultProfileTabs[number] | null>>(['Posts', 'Replies', 'Media', (isAgentProfile || hasFeedgens) ? 'Feeds' : null, (isAgentProfile || hasLists) ? 'Lists' : null, isAgentProfile ? 'Likes' : null]);
  const handleTabClick = (tabDisplayName: DefaultProfileTabs[number] | DefaultHomeTabs[number]): void => {
    setSelectedTab(tabDisplayName);
  };

  useEffect(() => {
    setTabs(['Posts', 'Replies', 'Media', (isAgentProfile || hasFeedgens) ? 'Feeds' : null, (isAgentProfile || hasLists) ? 'Lists' : null, isAgentProfile ? 'Likes' : null]);
  }, [hasFeedgens, hasLists, profile]);

  useEffect(() => {
    setCurrentPage('Profile');
  }, [username]);

  useEffect(() => {
    if (profile !== undefined && profile?.handle !== '') {
      setCachedProfile(profile);
    }
  }, [profile]);

  const onPressTryAgain = React.useCallback(() => {
    void refetchProfile();
  }, [refetchProfile])

  if (isLoadingProfile || (profile == null) || isPlaceholderProfile) {
    return (
    <BasicView viewPadding={false}>
      <ProfileHeaderLoading />
    </BasicView>
    )
  }

  if (profileError !== null) {
    return (
      <>
        <ProfileHeaderLoading />
        <ErrorRetry onRetry={onPressTryAgain}/>
      </>
    )
  }

  return (
    <BasicView viewPadding={false}>
        <ProfileHeaderStandard profile={profile}/>
        <TabList className='profile-tablist' tabs={tabs} selectedTab={selectedTab} onTabClick={handleTabClick} />
        <ProfileBody actor={profile?.did} currentTab={selectedTab} />
    </BasicView>
  )
}

export default Profile;
