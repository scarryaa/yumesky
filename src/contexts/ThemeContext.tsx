import React, { createContext, useContext, useEffect, useState } from 'react';
import * as persisted from '../state/persisted';

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
export type ThemeType = 'light' | 'dim' | 'dark' | 'system' | 'custom';
interface ThemeContextType {
  primaryColor: string;
  setPrimaryColor: React.Dispatch<React.SetStateAction<string>>;
  theme: ThemeType;
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
  toggleTheme: (theme: ThemeType) => void;
  changePrimaryColor: (primaryColor: string) => void;
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
  const [primaryColor, setPrimaryColor] = useState<string>(document.documentElement.style.getPropertyValue('--primary'));
  const [theme, setTheme] = useState<ThemeType>(() => {
    const storedTheme = persisted.get('colorMode');
    if (storedTheme.value === 'light' || storedTheme.value === 'dim' || storedTheme.value === 'dark') {
      return storedTheme.value;
    } else if (storedTheme.value === 'system') {
      return 'system';
    } else if (storedTheme.value === 'custom') {
      return 'custom'
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDarkMode ? 'dark' : 'light';
    }
  });

  useEffect(() => {
    // set primary color
    const colorMode = persisted.get('colorMode');
    setPrimaryColor(colorMode.primary);

    if (colorMode.value !== 'light' && colorMode.value !== 'dim' && colorMode.value !== 'dark') {
      const listener = (e: MediaQueryListEvent): void => {
        const body = document.querySelector('body');
        body?.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };

      const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQueryList.addEventListener('change', listener);

      // Set initial theme based on system preference or local storage
      if (colorMode.value === 'system' || colorMode.value === null) {
        const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        setTheme('system');
        const body = document.querySelector('body');
        body?.setAttribute('data-theme', mediaQueryList.matches ? 'dark' : 'light');
      }

      return () => {
        mediaQueryList.removeEventListener('change', listener);
      };
    } else {
      setTheme(colorMode.value);
      const body = document.querySelector('body');
      body?.setAttribute('data-theme', colorMode.value);
    }
  }, []);

  const changePrimaryColor = (primaryColor: string): void => {
    persisted.write('colorMode', { value: persisted.get('colorMode').value, primary: primaryColor });
    setPrimaryColor(primaryColor);
  }

  const toggleTheme = (theme: ThemeType): void => {
    const body = document.querySelector('body');

    if (body == null) return;

    if (theme === 'system') {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme('system');
      persisted.write('colorMode', { value: 'system', primary: persisted.get('colorMode').primary });
      body.setAttribute('data-theme', prefersDarkMode ? 'dark' : 'light');
    } else if (theme === 'custom') {
      setTheme('custom');
      persisted.write('colorMode', { value: 'custom', primary: persisted.get('colorMode').primary });
    } else {
      setTheme(theme);
      persisted.write('colorMode', { value: theme, primary: persisted.get('colorMode').primary });
      body.setAttribute('data-theme', theme);
    }
  };

  return (
    <ThemeContext.Provider value={{ changePrimaryColor, setPrimaryColor, primaryColor, theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
