import { RichText as RichTextAPI, type AppBskyActorDefs } from '@atproto/api';
import Image from '../../../components/Image/Image';
import Avatar from '../../../components/Avatar/Avatar';
import Link from '../../../components/Link/Link';
import FollowButton from '../../../components/FollowButton/FollowButton';
import FollowsYou from '../../../components/FollowsYou/FollowsYou';
import { ProfileDropdown } from '..';
import RichText from '../../../components/RichText/RichText';
import { useMemo } from 'react';
import { useLightbox, useLightboxControls } from '../../../state/lightbox';

interface Props {
  profile: AppBskyActorDefs.ProfileViewDetailed;
}
export const ProfileHeaderStandard: React.FC<Props> = ({ profile }: Props) => {
  const description = profile?.description;
  const descriptionRT = new RichTextAPI({ text: description ?? '' });
  const { isLightboxActive } = useLightbox();
  const { openLightbox, closeLightbox } = useLightboxControls();

  const authorDisplayNameOrHandle = useMemo(() =>
    (profile?.displayName === '' || profile?.displayName === undefined ? profile?.handle : profile?.displayName), [profile]);

  return (
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
                    {profile !== undefined && <ProfileDropdown profile={profile} />}
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
    </div>
  )
}
