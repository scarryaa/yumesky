import { type AppBskyActorDefs } from '@atproto/api'
import { faCheck, faClose, faPencil, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import agent from '../../api/agent';
import './FollowButton.scss';
import { useState } from 'react';

interface FollowButtonProps {
  profile: AppBskyActorDefs.ProfileView | AppBskyActorDefs.ProfileViewDetailed | undefined;
}
const FollowButton: React.FC<FollowButtonProps> = ({ profile }: FollowButtonProps) => {
  const [hovered, setHovered] = useState<boolean>(false);

  const handleFollowClick = async (): Promise<void> => {
    if (profile === undefined) return;
    if ((profile?.viewer?.following) != null) {
      await agent.deleteFollow(profile.viewer.following);
    } else {
      await agent.follow(profile.did);
    }
  }

  const hoverStyle = (hovered && ((profile?.viewer?.following) != null)) ? 'var(--red)' : (profile?.did === agent.session?.did && hovered) ? 'var(--pill-button-highlight)' : profile?.did === agent.session?.did ? 'var(--secondary-highlight)' : (profile?.viewer?.following) != null ? 'var(--secondary-highlight)' : hovered ? 'var(--follow-button-highlight)' : 'var(--primary)';

  return (
    <button style={{ backgroundColor: hoverStyle }} onClick={handleFollowClick} onMouseEnter={() => { setHovered(true); }} onMouseLeave={() => { setHovered(false); }} className='no-button-style button follow-button'>
        {((profile?.viewer?.following) != null)
          ? hovered
            ? <>
                <FontAwesomeIcon icon={faClose} fontSize={14} />
                <span>Unfollow</span>
              </>
            : <>
                <FontAwesomeIcon icon={faCheck} fontSize={14} />
                <span>Following</span>
            </>
          : (profile?.did === agent.session?.did)
              ? <>
                    <FontAwesomeIcon icon={faPencil} fontSize={14} />
                    <span>Edit Profile</span>
                  </>
              : <>
                    <FontAwesomeIcon icon={faPlus} fontSize={14} />
                    <span>Follow</span>
                  </>}
    </button>
  )
}

export default FollowButton;
