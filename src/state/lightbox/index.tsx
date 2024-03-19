import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface LightboxContext {
  isLightboxActive: boolean;
  src: string | undefined;
  alt: string | undefined;
}

interface LightboxControlContext {
  openLightbox: (src: string | undefined, alt: string | undefined) => void;
  closeLightbox: () => void;
}

const lightboxContext = createContext<LightboxContext>({ isLightboxActive: false, src: undefined, alt: undefined });
const lightboxControlContext = createContext<LightboxControlContext>({
  closeLightbox: () => {},
  openLightbox: () => {}
});

export const Provider = ({ children }: React.PropsWithChildren<Record<string, unknown>>): JSX.Element => {
  const [isLightboxActive, setIsLightboxActive] = useState<boolean>(false);
  const [src, setSrc] = useState<string | undefined>();
  const [alt, setAlt] = useState<string | undefined>();

  useEffect(() => {
    if (isLightboxActive) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxActive]);

  const closeLightbox = useCallback(() => {
    setIsLightboxActive(false);
  }, []);

  const openLightbox = useCallback((src: string | undefined, alt: string | undefined) => {
    setIsLightboxActive(true);
    setAlt(alt);
    setSrc(src);
  }, []);

  const state = useMemo(() => ({
    isLightboxActive,
    src,
    alt
  }), [isLightboxActive]);

  const methods = useMemo(() => ({
    closeLightbox,
    openLightbox
  }), [closeLightbox, openLightbox])

  return (
    <lightboxContext.Provider value={state}>
        <lightboxControlContext.Provider value={methods}>
            {children}
        </lightboxControlContext.Provider>
    </lightboxContext.Provider>
  )
}

export const useLightbox = (): LightboxContext => {
  return useContext(lightboxContext);
}

export const useLightboxControls = (): LightboxControlContext => {
  return useContext(lightboxControlContext);
}
