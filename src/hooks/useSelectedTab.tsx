import { type AppBskyFeedDefs } from '@atproto/api';
import { useMemo, useState } from 'react';

export const useSelectedTab = (): { selectedTab: string | undefined, changeTab: (displayName: string) => void, setTabs: React.Dispatch<React.SetStateAction<AppBskyFeedDefs.GeneratorView[] | undefined>>, tabs: AppBskyFeedDefs.GeneratorView[] | undefined } => {
  const [selectedTab, setSelectedTab] = useState<string | undefined>();
  const [tabs, setTabs] = useState<AppBskyFeedDefs.GeneratorView[] | undefined>();

  const changeTab = (displayName: string): void => {
    const tab = tabs?.find(t => t.displayName === displayName);
    setSelectedTab(tab?.displayName);
  }

  const state = useMemo(() => ({
    selectedTab,
    changeTab,
    setTabs,
    tabs
  }), [selectedTab, changeTab, setTabs, tabs]);

  return state;
};
