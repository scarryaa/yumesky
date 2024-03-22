import { createContext, useContext } from 'react';

export interface Session {
  currentAccount?: Account | undefined;
  accounts: Account[] | undefined;
}

export interface Account {
  accessJwt?: string;
  did: string;
  email?: string;
  emailConfirmed?: boolean;
  handle: string;
  refreshJwt?: string;
  service: string;
  deactivated?: boolean;
}

interface SessionContext {
  session: Session | undefined;
  setSession: (session: Session | undefined) => void;
}

const sessionContext = createContext<SessionContext>({
  session: undefined,
  setSession: () => {}
});

export const useSession = (): SessionContext => useContext(sessionContext);

export default sessionContext;
