import { type AppBskyActorDefs } from '@atproto/api';
import { type UseQueryResult, useQuery, useQueryClient } from '@tanstack/react-query';
import agent from '../../api/agent';

export const RQKEY = (did: string): [string, string] => ['profile', did];
export const profileBasicQueryKey = (didOrHandle: string): [string, string] => [
  'profileBasic',
  didOrHandle
];

export const useProfileQuery = ({ did, staleTime = 15 }: { did: string | undefined, staleTime?: number }): UseQueryResult<AppBskyActorDefs.ProfileViewDetailed, Error> => {
  const queryClient = useQueryClient();
  return useQuery<AppBskyActorDefs.ProfileViewDetailed>({
    staleTime,
    refetchOnWindowFocus: true,
    queryKey: RQKEY(did ?? ''),
    queryFn: async () => {
      const res = await agent.getProfile({ actor: did ?? '' });
      return res.data;
    },
    placeholderData: () => {
      if (did == null) return;

      return queryClient.getQueryData<AppBskyActorDefs.ProfileViewBasic>(profileBasicQueryKey(did)
      )
    },
    enabled: !(did == null)
  })
}
