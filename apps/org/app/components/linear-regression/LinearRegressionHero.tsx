import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export function LinearRegressionHero() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: 'center',
        mb: 6,
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        background: theme.palette.glass.primary,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.glass.border}`,
        boxShadow: theme.palette.glass.shadow.light,
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontSize: { xs: '2rem', md: '3rem' },
          fontWeight: 'bold',
          background: theme.palette.gradients.text,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        Linear Regression Demo
      </Typography>

      <Typography
        variant="h6"
        component="h2"
        gutterBottom
        sx={{
          color: 'text.primary',
          fontWeight: 500,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        }}
      >
        Click on the plot to add points and watch the regression line adjust
        automatically
      </Typography>
    </Box>
  );
}
