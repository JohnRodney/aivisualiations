import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
} from '@mui/material';
import { NavLink } from 'react-router';
import { ThemeToggle } from './theme/ThemeToggle';

export function AppNav() {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1300, // Ensure it stays on top of other content
        backdropFilter: 'blur(10px)', // Add glass morphism effect
        background: theme.palette.glass.appBar, // Use theme colors
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Subtle shadow
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ML Interactive Demos
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button color="inherit" component={NavLink} to="/ml-demos" end>
            ML Demos
          </Button>
          <Button color="inherit" component={NavLink} to="/about" end>
            About
          </Button>
          <ThemeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
