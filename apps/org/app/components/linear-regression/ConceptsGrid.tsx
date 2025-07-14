import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export function ConceptsGrid() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 4,
        mb: 6,
      }}
    >
      {/* Equation Explanation */}
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          background: theme.palette.glass.card,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.glass.border}`,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: 'text.primary',
            fontWeight: 600,
            mb: 3,
          }}
        >
          📐 The Equation
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'monospace',
            color: 'text.primary',
            background: theme.palette.glass.secondary,
            p: 2,
            borderRadius: 2,
            textAlign: 'center',
            mb: 3,
          }}
        >
          y = mx + b
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>m</strong> = slope (how steep the line is)
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>b</strong> = y-intercept (where the line crosses the y-axis)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>x</strong> = input value, <strong>y</strong> = predicted
          output
        </Typography>
      </Box>

      {/* R-squared Explanation */}
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          background: theme.palette.glass.card,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.glass.border}`,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: 'text.primary',
            fontWeight: 600,
            mb: 3,
          }}
        >
          📊 R-squared (R²)
        </Typography>
        <Typography variant="body1" color="text.primary" paragraph>
          Measures how well the line fits the data, ranging from 0 to 1.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            <strong>R² = 1.0</strong> Perfect fit (line passes through all
            points)
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            <strong>R² = 0.8+</strong> Great fit (strong linear relationship)
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            <strong>R² = 0.5+</strong> Good fit (moderate relationship)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>R² = 0.0</strong> Poor fit (no linear relationship)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
