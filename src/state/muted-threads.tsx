import React, { createContext, useCallback, useContext, useState } from 'react';

import * as persisted from '../state/persisted';

type StateContext = persisted.Schema['mutedThreads'];
type ToggleContext = (uri: string) => boolean;

const stateContext = createContext<StateContext>(persisted.defaults.mutedThreads);
const toggleContext = createContext<ToggleContext>((_: string) => false);

export const Provider = ({ children }: React.PropsWithChildren<Record<string, unknown>>): JSX.Element => {
  const [state, setState] = useState(persisted.get('mutedThreads'));

  const toggleThreadMute = useCallback((uri: string) => {
    let muted = false;
    setState((arr: string[]) => {
      // unmute
      if (arr.includes(uri)) {
        arr = arr.filter(v => v !== uri);
        muted = false;
      } else {
        arr = arr.concat([uri]);
        muted = true;
      }

      persisted.write('mutedThreads', arr);
      return arr;
    })
    return muted;
  }, [setState]);

  return (
    <stateContext.Provider value={state}>
        <toggleContext.Provider value={toggleThreadMute}>
            {children}
        </toggleContext.Provider>
    </stateContext.Provider>
  )
}

export const useMutedThreads = (): StateContext => {
  return useContext(stateContext);
}

export const useToggleThreadMute = (): ToggleContext => {
  return useContext(toggleContext);
}

export const isThreadMuted = (uri: string): boolean => {
  return persisted.get('mutedThreads').includes(uri);
}
