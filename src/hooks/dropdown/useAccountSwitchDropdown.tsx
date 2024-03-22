import { faRightFromBracket, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { type MenuItem } from '../../components/Dropdown/Dropdown';
import * as persisted from '../../state/persisted';
import agent from '../../api/agent';
import { useEffect, useState } from 'react';
import { type AppBskyActorDefs } from '@atproto/api';
import { useModalControls } from '../../state/modals';

interface UseAccountSwitchDropdownProps {
  dropdownItems: MenuItem[];
}

const useAccountSwitchDropdown = (): UseAccountSwitchDropdownProps => {
  const [profiles, setProfiles] = useState<AppBskyActorDefs.ProfileViewDetailed[]>([]);
  const { openModal } = useModalControls();
  let dropdownItems: MenuItem[] = [];

  useEffect(() => {
    const getProfiles = async (): Promise<void> => {
      const accounts = persisted.get('session').accounts;
      if (accounts.every(a => a !== undefined)) {
        const profileData = await agent.getProfiles({ actors: accounts.map(account => account.did) });
        setProfiles(profileData.data.profiles);
      }
    };

    void getProfiles();
  }, []);

  if (persisted.get('session')?.accounts !== undefined) {
    dropdownItems = persisted.get('session').accounts.map((account, i) => ({
      label: 'account',
      accountName: account.handle,
      img: profiles[i]?.avatar ?? '',
      onClick: (event) => {
        const currentSession = persisted.get('session');
        const acc = currentSession.accounts.find((_account) => _account.did === account.did);
        persisted.write('session', { currentAccount: acc, accounts: currentSession.accounts })
        location.reload();
      }
    }));
  }

  dropdownItems.push({
    label: 'add-account',
    onClick: (event) => {
      openModal({
        name: 'add-account'
      });
    },
    iconSize: 40,
    icon: faUserCircle
  });

  dropdownItems.push({
    label: 'Logout',
    onClick: (event) => {
      const currentSession = persisted.get('session');
      const accountToRemove = currentSession.accounts.find(v => v.did === currentSession.currentAccount?.did);
      if (accountToRemove !== undefined) {
        const updatedAccounts = currentSession.accounts.filter(account => account.did !== accountToRemove.did);
        const updatedSession = { ...currentSession, accounts: updatedAccounts, currentAccount: currentSession.accounts[0] ?? undefined };
        persisted.write('session', updatedSession);
        location.reload();
      }
    },
    iconSize: 18,
    icon: faRightFromBracket
  });

  return { dropdownItems };
}

export default useAccountSwitchDropdown;
