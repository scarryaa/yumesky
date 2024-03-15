import { createContext, useContext, useState } from 'react';
import { type AppBskyActorDefs } from '@atproto/api';

interface PrefsContextType {
  prefs: AppBskyActorDefs.Preferences;
  setPrefs: React.Dispatch<React.SetStateAction<AppBskyActorDefs.Preferences>>;
}

const defaultPrefs: AppBskyActorDefs.Preferences = [];

const PrefsContext = createContext<PrefsContextType>({
  prefs: defaultPrefs,
  setPrefs: () => {}
});

export const usePrefs = (): PrefsContextType => {
  const context = useContext(PrefsContext);

  if (context === undefined) {
    throw new Error('usePrefs must be used within a PrefsProvider!');
  }

  return context;
};

interface PrefsProviderProps {
  children: React.ReactNode;
}
const PrefsProvider: React.FC<PrefsProviderProps> = ({ children }: PrefsProviderProps) => {
  const [prefs, setPrefs] = useState<AppBskyActorDefs.Preferences>(defaultPrefs);

  return (
    <PrefsContext.Provider value={{ prefs, setPrefs }}>
      {children}
    </PrefsContext.Provider>
  );
};

export default PrefsProvider;
