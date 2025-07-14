import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Slider,
  FormControlLabel,
  Switch,
  useTheme,
} from '@mui/material';

interface RegressionControlsProps {
  onGenerateSample: () => void;
  onClearPoints: () => void;
  noise: number;
  onNoiseChange: (noise: number) => void;
  showEquation: boolean;
  onShowEquationChange: (show: boolean) => void;
  showR2: boolean;
  onShowR2Change: (show: boolean) => void;
  minNoise?: number;
  maxNoise?: number;
  noiseStep?: number;
}

export const RegressionControls: React.FC<RegressionControlsProps> = ({
  onGenerateSample,
  onClearPoints,
  noise,
  onNoiseChange,
  showEquation,
  onShowEquationChange,
  showR2,
  onShowR2Change,
  minNoise = 0,
  maxNoise = 3,
  noiseStep = 0.1,
}) => {
  const theme = useTheme();

  const noiseMarks = [
    { value: minNoise, label: minNoise.toString() },
    {
      value: (minNoise + maxNoise) / 2,
      label: ((minNoise + maxNoise) / 2).toString(),
    },
    { value: maxNoise, label: maxNoise.toString() },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
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
        Controls
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={onGenerateSample}
          fullWidth
          sx={{
            mb: 1,
            background: 'linear-gradient(45deg, #1976d2, #1565c0)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #0d47a1)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            },
          }}
        >
          Generate Sample Data
        </Button>
        <Button
          variant="outlined"
          onClick={onClearPoints}
          fullWidth
          color="secondary"
          sx={{
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          Clear Points
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography
          gutterBottom
          sx={{ color: 'text.primary', fontWeight: 500 }}
        >
          Noise Level: {noise.toFixed(1)}
        </Typography>
        <Slider
          value={noise}
          onChange={(_, value) => onNoiseChange(value as number)}
          min={minNoise}
          max={maxNoise}
          step={noiseStep}
          marks={noiseMarks}
        />
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={showEquation}
            onChange={(e) => onShowEquationChange(e.target.checked)}
          />
        }
        label="Show Equation"
        sx={{ color: 'text.primary', display: 'block', mb: 1 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={showR2}
            onChange={(e) => onShowR2Change(e.target.checked)}
          />
        }
        label="Show R²"
        sx={{ color: 'text.primary', display: 'block' }}
      />
    </Paper>
  );
};
