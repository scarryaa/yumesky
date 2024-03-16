import { type AppBskyActorDefs } from '@atproto/api';
import { useEffect, useState } from 'react';
import agent from '../api/agent';

export const useProfile = (actor: string | undefined): AppBskyActorDefs.ProfileViewDetailed | undefined => {
  const [profile, setProfile] = useState<AppBskyActorDefs.ProfileViewDetailed | undefined>();

  useEffect(() => {
    const getActorProfile = async (): Promise<void> => {
      if (actor === undefined) return;

      const res = await agent.getProfile({ actor });

      if (res.success) {
        setProfile(res.data);
      }
    }

    void getActorProfile();
  }, [])

  return profile;
}
