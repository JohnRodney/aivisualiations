import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export function LinearRegressionIntro() {
  const theme = useTheme();

  return (
    <Box
      sx={{
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
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          fontSize: { xs: '1.8rem', md: '2.4rem' },
          fontWeight: 'bold',
          background: theme.palette.gradients.text,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
          mb: 4,
        }}
      >
        Understanding Linear Regression
      </Typography>

      <Typography
        variant="body1"
        paragraph
        sx={{
          fontSize: '1.1rem',
          lineHeight: 1.7,
          color: 'text.primary',
          mb: 3,
        }}
      >
        Linear regression is one of the most fundamental algorithms in machine
        learning and statistics. It finds the best-fitting straight line through
        a set of data points, allowing us to understand relationships between
        variables and make predictions.
      </Typography>

      <Typography
        variant="body1"
        paragraph
        sx={{
          fontSize: '1.1rem',
          lineHeight: 1.7,
          color: 'text.primary',
        }}
      >
        Think of it as drawing the "line of best fit" through scattered points
        on a graph. This line represents the underlying trend in your data and
        can be used to predict future values.
      </Typography>
    </Box>
  );
}
