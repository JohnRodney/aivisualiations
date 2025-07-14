import { Box, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTheme as useCustomTheme } from '../theme/ThemeContext';

export function ThemeStatus() {
  const theme = useTheme();
  const { themeMode } = useCustomTheme();

  return (
    <Box
      sx={{
        textAlign: 'center',
        mt: 4,
        p: 2,
        borderRadius: 2,
        background: theme.palette.glass.secondary,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.glass.border}`,
      }}
    >
      <Chip
        label={`Current theme: ${themeMode} mode`}
        color="primary"
        variant="outlined"
        size="small"
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(5px)',
        }}
      />
    </Box>
  );
}
