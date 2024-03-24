import { type AppBskyActorDefs } from '@atproto/api';
import './AccountCard.scss';
import { RichText as RichTextAPI } from '@atproto/api';
import RichText from '../RichText/RichText';
import { useEffect, useMemo } from 'react';
import agent from '../../api/agent';
import Link from '../Link/Link';
import FollowsYou from '../FollowsYou/FollowsYou';
import FollowButton from '../FollowButton/FollowButton';
import Avatar from '../Avatar/Avatar';

interface AccountCardProps {
  profile: AppBskyActorDefs.ProfileView;
}

const AccountCard: React.FC<AccountCardProps> = ({ profile }: AccountCardProps) => {
  const rt = useMemo<RichTextAPI>(() => new RichTextAPI({ text: profile.description ?? '' }), [profile]);

  useEffect(() => {
    void rt.detectFacets(agent)
  }, []);

  return (
    <Link linkStyle={false} to={`/profile/${profile.handle}`} className='account-card'>
        <Avatar width={50} height={50} link={`/profile/${profile.handle}`} className='account-card-avatar' src={profile.avatar} />
        <div className='account-card-display-name-handle-follow'>
            <div className='account-card-info'>
                <span className='account-card-display-name'>{profile.displayName === '' ? profile.handle : profile.displayName}</span>
                <span className='account-card-handle'>@{profile.handle}</span>
                { ((profile.viewer?.followedBy) != null) && <FollowsYou className='account-card-follows-you' />}
                <RichText value={rt} className='account-card-description'></RichText>
            </div>
            {profile.did !== agent.session?.did && <FollowButton profile={profile} />}
        </div>
    </Link>
  )
}

export default AccountCard;
