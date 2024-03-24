import React, { createContext, useContext, useState } from 'react';
import { type AppBskyActorDefs } from '@atproto/api';

interface UseCachedProfile {
  cachedProfile: AppBskyActorDefs.ProfileView | undefined;
  setCachedProfile: React.Dispatch<React.SetStateAction<AppBskyActorDefs.ProfileView | undefined>>;
}

const CachedProfileContext = createContext<UseCachedProfile | undefined>(undefined);

export const useCachedProfile = (): UseCachedProfile => {
  const context = useContext(CachedProfileContext);
  if (context == null) {
    throw new Error('useCachedProfile must be used within a CachedProfileProvider!');
  }
  return context;
};

export const Provider = ({ children }: React.PropsWithChildren<Record<string, unknown>>): JSX.Element => {
  const [cachedProfile, setCachedProfile] = useState<AppBskyActorDefs.ProfileView | undefined>();

  return (
    <CachedProfileContext.Provider value={{ cachedProfile, setCachedProfile }}>
      {children}
    </CachedProfileContext.Provider>
  );
};
