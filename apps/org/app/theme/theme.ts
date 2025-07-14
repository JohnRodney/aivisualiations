import { createTheme, ThemeOptions } from '@mui/material/styles';

// Extend MUI theme interface to include custom properties
declare module '@mui/material/styles' {
  interface Palette {
    glass: {
      primary: string;
      secondary: string;
      appBar: string;
      card: string;
      overlay: string;
      border: string;
      shadow: {
        light: string;
        medium: string;
        heavy: string;
      };
    };
    gradients: {
      primary: string;
      secondary: string;
      text: string;
      button: string;
    };
  }

  interface PaletteOptions {
    glass?: {
      primary?: string;
      secondary?: string;
      appBar?: string;
      card?: string;
      overlay?: string;
      border?: string;
      shadow?: {
        light?: string;
        medium?: string;
        heavy?: string;
      };
    };
    gradients?: {
      primary?: string;
      secondary?: string;
      text?: string;
      button?: string;
    };
  }
}

// Base theme configuration shared between light and dark modes
const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'url(/aibackground.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        },
      },
    },
  },
};

// Light theme
export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: 'rgba(245, 245, 245, 0.95)',
      paper: 'rgba(255, 255, 255, 0.95)',
    },
    text: {
      primary: '#212121',
      secondary: '#343434',
    },
    glass: {
      primary: 'rgba(255, 255, 255, 0.8)',
      secondary: 'rgba(255, 255, 255, 0.74)',
      appBar: 'rgba(25, 118, 210, 0.9)',
      card: 'rgba(255, 255, 255, 0.64)',
      overlay: 'rgba(255, 255, 255, 0.6)',
      border: 'rgba(255, 255, 255, 0.2)',
      shadow: {
        light: '0 4px 15px rgba(0, 0, 0, 0.1)',
        medium: '0 8px 32px rgba(0, 0, 0, 0.15)',
        heavy: '0 12px 40px rgba(0, 0, 0, 0.2)',
      },
    },
    gradients: {
      primary: 'linear-gradient(45deg, #1976d2, #1565c0)',
      secondary: 'linear-gradient(45deg, #dc004e, #9a0036)',
      text: 'linear-gradient(45deg, #1976d2, #dc004e)',
      button: 'linear-gradient(45deg, #4caf50, #2e7d32)',
    },
  },
  components: {
    ...baseTheme.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'url(/aibackground.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            zIndex: -1,
          },
        },
      },
    },
  },
});

// Dark theme
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
    },
    secondary: {
      main: '#f48fb1',
      light: '#fce4ec',
      dark: '#ad1457',
    },
    background: {
      default: 'rgba(18, 18, 18, 0.95)',
      paper: 'rgba(30, 30, 30, 0.95)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    glass: {
      primary: 'rgba(255, 255, 255, 0.05)',
      secondary: 'rgba(255, 255, 255, 0.08)',
      appBar: 'rgba(18, 18, 18, 0.9)',
      card: 'rgba(255, 255, 255, 0.05)',
      overlay: 'rgba(0, 0, 0, 0.6)',
      border: 'rgba(255, 255, 255, 0.2)',
      shadow: {
        light: '0 4px 15px rgba(0, 0, 0, 0.2)',
        medium: '0 8px 32px rgba(0, 0, 0, 0.3)',
        heavy: '0 12px 40px rgba(0, 0, 0, 0.4)',
      },
    },
    gradients: {
      primary: 'linear-gradient(45deg, #90caf9, #42a5f5)',
      secondary: 'linear-gradient(45deg, #f48fb1, #ad1457)',
      text: 'linear-gradient(45deg, #90caf9, #f48fb1)',
      button: 'linear-gradient(45deg, #66bb6a, #388e3c)',
    },
  },
  components: {
    ...baseTheme.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'url(/aibackground.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: -1,
          },
        },
      },
    },
  },
});

export type ThemeMode = 'light' | 'dark';
