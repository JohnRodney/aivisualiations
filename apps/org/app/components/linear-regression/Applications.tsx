import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export function Applications() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        background: theme.palette.glass.primary,
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
          textAlign: 'center',
        }}
      >
        🌍 Real-World Applications
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 2,
            }}
          >
            Business & Economics
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • Predicting sales based on advertising spend
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • Estimating house prices from square footage
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Forecasting revenue growth over time
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="h6"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 2,
            }}
          >
            Science & Engineering
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • Modeling temperature vs. pressure relationships
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • Predicting drug dosage effects
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Analyzing climate data trends
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
