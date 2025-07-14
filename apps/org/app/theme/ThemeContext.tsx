import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '@mui/material/styles';
import { lightTheme, darkTheme, ThemeMode } from './theme';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Helper function to get system preference
const getSystemPreference = (): ThemeMode => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light';
};

// Helper function to get initial theme
const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('themeMode');
      if (saved && (saved === 'light' || saved === 'dark')) {
        return saved as ThemeMode;
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
    }
    return getSystemPreference();
  }
  return 'light';
};

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [isHydrated, setIsHydrated] = useState(false);

  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Load saved theme on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('themeMode');
      if (saved && (saved === 'light' || saved === 'dark')) {
        setThemeMode(saved as ThemeMode);
      } else {
        setThemeMode(getSystemPreference());
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
      setThemeMode(getSystemPreference());
    }
    setIsHydrated(true);
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem('themeMode', themeMode);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
  }, [themeMode, isHydrated]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
