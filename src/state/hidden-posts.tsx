import { createContext, useCallback, useContext, useState } from 'react';
import * as persisted from './persisted';

type StateContext = persisted.Schema['hiddenPosts'];
type ToggleContext = (uri: string) => boolean;

const stateContext = createContext<StateContext>(persisted.defaults.hiddenPosts);
const toggleContext = createContext<ToggleContext>((_: string) => false);

export const Provider = ({ children }: React.PropsWithChildren<Record<string, unknown>>): JSX.Element => {
  const [state, setState] = useState(persisted.get('hiddenPosts'));

  const toggleHidePost = useCallback((uri: string) => {
    let hidden = false;
    setState((arr: string[] | undefined) => {
      if (arr === undefined) return [];
      // unhide
      if (arr.includes(uri)) {
        arr = arr.filter(v => v !== uri);
        hidden = false;
      } else {
        arr = arr.concat([uri]);
        hidden = true;
      }

      persisted.write('hiddenPosts', arr);
      return arr;
    })
    return hidden;
  }, [setState]);

  return (
    <stateContext.Provider value={state}>
        <toggleContext.Provider value={toggleHidePost}>
            {children}
        </toggleContext.Provider>
    </stateContext.Provider>
  )
}

export const useHiddenPosts = (): StateContext => {
  return useContext(stateContext);
}

export const useToggleHidePost = (): ToggleContext => {
  return useContext(toggleContext);
}

export const isPostHidden = (uri: string): boolean => {
  return persisted.get('hiddenPosts')?.includes(uri) ?? false;
}
