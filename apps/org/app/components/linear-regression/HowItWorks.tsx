import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export function HowItWorks() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        background: theme.palette.glass.primary,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.glass.border}`,
        mb: 6,
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: 'text.primary',
          fontWeight: 600,
          mb: 3,
          textAlign: 'center',
        }}
      >
        🔍 How Linear Regression Works
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
          gap: 3,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 2,
            }}
          >
            1. Collect Data
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gather pairs of (x, y) values that represent your observations
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 2,
            }}
          >
            2. Find Best Line
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Algorithm calculates the line that minimizes the distance to all
            points
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 2,
            }}
          >
            3. Make Predictions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use the line equation to predict y values for new x inputs
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
