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
    const saved = localStorage.getItem('themeMode');
    if (saved && (saved === 'light' || saved === 'dark')) {
      return saved as ThemeMode;
    }
    return getSystemPreference();
  }
  return 'light';
};

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);
  const [isHydrated, setIsHydrated] = useState(false);

  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Handle hydration and system preference changes
  useEffect(() => {
    setIsHydrated(true);

    // Re-check theme after hydration
    const savedTheme = localStorage.getItem('themeMode');
    if (!savedTheme) {
      const systemPreference = getSystemPreference();
      setThemeMode(systemPreference);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      const savedTheme = localStorage.getItem('themeMode');
      if (!savedTheme) {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () =>
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem('themeMode', themeMode);
    }
  }, [themeMode, isHydrated]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
