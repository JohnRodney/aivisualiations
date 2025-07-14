import React from 'react';
import { Paper, Typography, Box, Chip, useTheme } from '@mui/material';
import { LineParams } from '../hooks/useLinearRegression';

interface RegressionResultsProps {
  lineParams: LineParams;
  pointCount: number;
  showEquation: boolean;
  showR2: boolean;
}

export const RegressionResults: React.FC<RegressionResultsProps> = ({
  lineParams,
  pointCount,
  showEquation,
  showR2,
}) => {
  const theme = useTheme();

  const getFitQuality = (r2: number) => {
    if (r2 > 0.8) return { label: 'Great fit', color: 'success' as const };
    if (r2 > 0.5) return { label: 'Good fit', color: 'warning' as const };
    return { label: 'Poor fit', color: 'error' as const };
  };

  const fitQuality = getFitQuality(lineParams.r2);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mt: 2,
        background: theme.palette.glass.primary,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: 'text.primary',
          fontWeight: 600,
        }}
      >
        Results
      </Typography>

      {showEquation && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Equation:
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'monospace',
              color: 'text.primary',
              fontWeight: 500,
              fontSize: '1.1rem',
            }}
          >
            y = {lineParams.slope.toFixed(3)}x +{' '}
            {lineParams.intercept.toFixed(3)}
          </Typography>
        </Box>
      )}

      {showR2 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            R-squared:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'monospace',
                color: 'text.primary',
                fontWeight: 500,
                fontSize: '1.1rem',
              }}
            >
              {lineParams.r2.toFixed(4)}
            </Typography>
            <Chip
              label={fitQuality.label}
              color={fitQuality.color}
              size="small"
              sx={{
                fontWeight: 500,
              }}
            />
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          Points: {pointCount}
        </Typography>

        {pointCount >= 2 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Slope:{' '}
            {lineParams.slope > 0
              ? 'Positive'
              : lineParams.slope < 0
              ? 'Negative'
              : 'Zero'}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};
