import { AppBskyFeedPost, type AppBskyFeedDefs } from '@atproto/api';
import { type MenuItem } from '../../components/Dropdown/Dropdown';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faShare, faClipboard, faFont, faVolumeOff, faFilter, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { generatePostShareLink } from '../../utils';
import { useToggleThreadMute } from '../../state/muted-threads';
import { useToggleHidePost } from '../../state/hidden-posts';
import { useModalControls } from '../../state/modals';

interface UsePostDropdownProps {
  dropdownItems: MenuItem[];
}

const usePostDropdown = (post: AppBskyFeedDefs.FeedViewPost | undefined): UsePostDropdownProps => {
  const text = AppBskyFeedPost.isRecord(post?.post.record) ? post?.post.record.text : '';
  const trimmedText = text?.replace(/%20+/g, '') ?? '';
  const toggleThreadMute = useToggleThreadMute();
  const toggleHidePost = useToggleHidePost();
  const { openModal } = useModalControls();

  const dropdownItems: MenuItem[] = [
    {
      label: 'Translate',
      icon: faFont,
      iconSize: 18,
      onClick: () => {
        // TODO implement inline translate
        window.open(`https://translate.google.com/?sl=auto&tl=en&text=${trimmedText}`);
      }
    },
    {
      label: 'Copy post',
      icon: faClipboard,
      iconSize: 18,
      onClick: async () => {
        await navigator.clipboard.writeText(trimmedText);
      }
    },
    {
      label: 'Share post',
      icon: faShare,
      iconSize: 18,
      onClick: async () => {
        const link = generatePostShareLink(post);
        await navigator.clipboard.writeText(link);
      }
    },
    {
      label: 'separator'
    },
    {
      label: 'Mute thread',
      icon: faVolumeOff,
      iconSize: 20,
      onClick: () => {
        if (post == null) return;
        const muted = toggleThreadMute(post?.post.uri);

        // TODO show toast
        if (muted) {
          console.log('muted');
        } else {
          console.log('unmuted');
        }
      }
    },
    {
      label: 'Mute words & tags',
      icon: faFilter,
      iconSize: 18,
      onClick: () => { }
    },
    {
      label: 'Hide post',
      icon: faEyeSlash,
      iconSize: 18,
      onClick: () => {
        if (post == null) return;
        const hidden = toggleHidePost(post?.post.uri);

        // TODO show toast
        if (hidden) {
          console.log('post hidden');
        } else {
          console.log('post unhidden');
        }
      }
    },
    {
      label: 'separator'
    },
    {
      label: 'Report post',
      icon: faCircleExclamation,
      iconSize: 18,
      onClick: () => {
        openModal({
          name: 'report',
          uri: '',
          cid: ''
        });
      }
    }
  ];

  return { dropdownItems };
}

export default usePostDropdown;
