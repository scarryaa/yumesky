import { type Theme } from './contexts/ThemeContext';

const sharedColors = {
  red: '#c44a5c',
  green: '#5f7a2e',
  blue: '#49b5c1',
  white: '#fff',
  black: '#000'
}

export const lightTheme: Theme = {
  theme: 'light',
  colors: {
    ...sharedColors,
    primary: '#007bff',
    secondary: '#f9fafb',
    secondaryHighlight: '#e2e2e2',
    background: '#fff',
    text: '#000',
    textLight: '#4b4b4b',
    border: '#ced4da'
  }
};

export const darkTheme: Theme = {
  theme: 'dark',
  colors: {
    ...sharedColors,
    primary: '#007bff',
    secondary: '#070707',
    secondaryHighlight: '#141414',
    background: '#000',
    text: '#fff',
    textLight: '#c0c0c0',
    border: '#000000'
  }
};
