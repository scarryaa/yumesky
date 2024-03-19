import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface LightboxContext {
  isLightboxActive: boolean;
  lightboxImages: string[] | undefined;
  alts: string[] | undefined;
  currentImageIndex: number;
}

interface LightboxControlContext {
  openLightbox: (images: string[], initialIndex: number, alts: string[]) => void;
  closeLightbox: () => void;
  nextImage: () => void;
  previousImage: () => void;
}

const lightboxContext = createContext<LightboxContext>({ isLightboxActive: false, lightboxImages: [], alts: [], currentImageIndex: 0 });
const lightboxControlContext = createContext<LightboxControlContext>({
  closeLightbox: () => {},
  openLightbox: () => {},
  nextImage: () => {},
  previousImage: () => {}
});

export const Provider = ({ children }: React.PropsWithChildren<Record<string, unknown>>): JSX.Element => {
  const [isLightboxActive, setIsLightboxActive] = useState<boolean>(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [alts, setAlts] = useState<string[]>([]);

  useEffect(() => {
    if (isLightboxActive) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxActive]);

  const openLightbox = (images: string[], initialIndex: number = 0, alts: string[]): void => {
    setLightboxImages(images);
    setCurrentImageIndex(initialIndex);
    setAlts(alts);
    setIsLightboxActive(true);
  };

  const closeLightbox = (): void => {
    setLightboxImages([]);
    setCurrentImageIndex(0);
    setAlts([]);
    setIsLightboxActive(false);
  };

  const nextImage = useCallback(() => {
    setCurrentImageIndex((currentImageIndex + 1) % lightboxImages.length);
  }, [currentImageIndex, lightboxImages]);

  const previousImage = useCallback(() => {
    setCurrentImageIndex((currentImageIndex - 1 + lightboxImages.length) % lightboxImages.length);
  }, [currentImageIndex, lightboxImages]);

  const state = useMemo(() => ({
    isLightboxActive,
    lightboxImages,
    alts,
    currentImageIndex
  }), [isLightboxActive, currentImageIndex, alts, lightboxImages]);

  const methods = useMemo(() => ({
    closeLightbox,
    openLightbox,
    previousImage,
    nextImage
  }), [closeLightbox, openLightbox, nextImage, previousImage])

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
