import { type AppBskyActorDefs } from '@atproto/api';
import { type MenuItem } from '../../components/Dropdown/Dropdown';
import { faFlag, faList, faShare, faUserXmark, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import agent from '../../api/agent';
import { generateProfileShareLink } from '../../utils';
import { useToasts } from '../../state/toasts';

interface UseProfileDropdownProps {
  dropdownItems: MenuItem[];
}

// TODO implement rest of dropdown
const useProfileDropdown = (profile: AppBskyActorDefs.ProfileView): UseProfileDropdownProps => {
  const profileIsOwner = profile.did === agent.session?.did;
  const { addToast } = useToasts();

  const common: MenuItem[] = [
    {
      label: 'Share',
      icon: faShare,
      iconSize: 18,
      onClick: async () => {
        await navigator.clipboard.writeText(generateProfileShareLink(profile));
      }
    },
    {
      label: 'separator'
    },
    {
      label: 'Add to Lists',
      icon: faList,
      iconSize: 18,
      onClick: () => {
        console.log('add to list');
        addToast({ message: 'Add to list!' });
      }
    }
  ];

  const dropdownItems: MenuItem[] = profileIsOwner
    ? [
        ...common
      ]
    : [
        ...common,
        {
          label: 'Mute',
          icon: faVolumeXmark,
          iconSize: 18,
          onClick: async () => {
            ((profile.viewer?.muted) ?? false)
              ? await agent.unmute(profile.did)
              : await agent.mute(profile.did);
          }
        },
        {
          label: 'Block',
          icon: faUserXmark,
          iconSize: 18,
          onClick: async () => {
            (((profile.viewer?.blocking) != null))
              ? await agent.app.bsky.graph.block.delete({ repo: profile.did },
                { rkey: profile.viewer.blocking })
              : await agent.app.bsky.graph.block.create({ repo: profile.did },
                { subject: profile.did, createdAt: new Date().toISOString() })
          }
        },
        {
          label: 'Report',
          icon: faFlag,
          iconSize: 18,
          onClick: () => {
            console.log('report');
          }
        }
      ];

  return { dropdownItems };
}

export default useProfileDropdown;
