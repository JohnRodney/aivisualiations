import { Box, Typography, Stack, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router';

export function HeroSection() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: 'center',
        mb: 8,
        p: { xs: 4, md: 6 },
        borderRadius: 4,
        background: theme.palette.glass.primary,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.glass.border}`,
        boxShadow: theme.palette.glass.shadow.light,
      }}
    >
      <Typography
        variant="h1"
        component="h1"
        gutterBottom
        sx={{
          fontSize: { xs: '2.5rem', md: '4rem' },
          fontWeight: 'bold',
          background: theme.palette.gradients.text,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        Interactive ML Demos
      </Typography>

      <Typography
        variant="h4"
        component="h2"
        color="text.primary"
        gutterBottom
        sx={{
          fontSize: { xs: '1.5rem', md: '2rem' },
          mb: 3,
          fontWeight: 500,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        }}
      >
        Learn Machine Learning Through Visualization
      </Typography>

      <Typography
        variant="body1"
        sx={{
          fontSize: '1.2rem',
          maxWidth: '600px',
          mx: 'auto',
          mb: 4,
          lineHeight: 1.6,
          color: 'text.primary',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        }}
      >
        Explore fundamental machine learning concepts through hands-on,
        interactive demonstrations. No coding required - just point, click, and
        learn!
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="center"
      >
        <Button
          component={Link}
          to="/demos"
          variant="contained"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            background: theme.palette.gradients.primary,
            boxShadow: theme.palette.glass.shadow.light,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.palette.glass.shadow.medium,
            },
          }}
        >
          Explore All Demos
        </Button>

        <Button
          component={Link}
          to="/demos/linear-regression"
          variant="outlined"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            borderColor: 'primary.main',
            color: 'primary.main',
            backdropFilter: 'blur(5px)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.palette.glass.shadow.light,
            },
          }}
        >
          Try Linear Regression
        </Button>

        <Button
          component={Link}
          to="/demos/neural-network"
          variant="outlined"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            borderColor: 'secondary.main',
            color: 'secondary.main',
            backdropFilter: 'blur(5px)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.palette.glass.shadow.light,
            },
          }}
        >
          Try Neural Networks
        </Button>
      </Stack>
    </Box>
  );
}
