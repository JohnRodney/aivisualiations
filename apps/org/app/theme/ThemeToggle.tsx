import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';
import { useTheme } from './ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { themeMode, toggleTheme } = useTheme();

  return (
    <Tooltip
      title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
    >
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        sx={{
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        {themeMode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
};
