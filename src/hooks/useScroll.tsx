import { useEffect, useState } from 'react';

export const useScroll = (): {
  yPosition: number,
  setYPosition: React.Dispatch<React.SetStateAction<number>>
} => {
  const [yPosition, setYPosition] = useState<number>(0);

  useEffect(() => {
    const handleScroll = (): void => {
      setYPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { yPosition, setYPosition };
};
