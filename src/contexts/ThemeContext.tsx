import React, { createContext, useContext, useEffect, useState } from 'react';

// TODO clean up
export interface Theme {
  theme: ThemeType;
  colors: {
    primary: string;
    secondary: string;
    secondaryHighlight: string;
    background: string;
    text: string;
    textLight: string;
    border: string;
    red: string;
    green: string;
    blue: string;
    white: string;
    black: string;
  };
}
export type ThemeType = 'light' | 'dim' | 'dark' | 'system';
interface ThemeContextType {
  theme: ThemeType;
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
  toggleTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context == null) {
    throw new Error('useTheme must be used within an ThemeProvider');
  }
  return context;
}

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const storedTheme = localStorage.getItem('yumesky-theme');
    if (storedTheme === 'light' || storedTheme === 'dim' || storedTheme === 'dark') {
      return storedTheme;
    } else if (storedTheme === 'system') {
      return 'system';
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDarkMode ? 'dark' : 'light';
    }
  });

  useEffect(() => {
    const storedTheme = localStorage.getItem('yumesky-theme');
    if (storedTheme !== 'light' && storedTheme !== 'dim' && storedTheme !== 'dark') {
      const listener = (e: MediaQueryListEvent): void => {
        const body = document.querySelector('body');
        body?.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };

      const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQueryList.addEventListener('change', listener);

      // Set initial theme based on system preference or local storage
      if (storedTheme === 'system' || storedTheme === null) {
        const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        setTheme('system');
        const body = document.querySelector('body');
        body?.setAttribute('data-theme', mediaQueryList.matches ? 'dark' : 'light');
      }

      return () => {
        mediaQueryList.removeEventListener('change', listener);
      };
    } else {
      setTheme(storedTheme);
      const body = document.querySelector('body');
      body?.setAttribute('data-theme', storedTheme);
    }
  }, []);

  const toggleTheme = (theme: ThemeType): void => {
    const body = document.querySelector('body');

    if (body == null) return;

    if (theme === 'system') {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme('system');
      localStorage.setItem('yumesky-theme', 'system');
      body.setAttribute('data-theme', prefersDarkMode ? 'dark' : 'light');
    } else {
      setTheme(theme);
      localStorage.setItem('yumesky-theme', theme);
      body.setAttribute('data-theme', theme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
