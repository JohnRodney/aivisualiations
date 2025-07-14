import React from 'react';
import { Box, Typography, Chip, Alert, Button, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Prediction {
  x: number;
  y: number;
  predicted: number;
  confidence: 'high' | 'medium' | 'low';
  type: 'interpolation' | 'extrapolation';
}

interface PredictionResultsProps {
  predictions: Prediction[];
  accuracy: number;
  onClear: () => void;
  getConfidenceMessage: (confidence: 'high' | 'medium' | 'low') => string;
}

export function PredictionResults({
  predictions,
  accuracy,
  onClear,
  getConfidenceMessage,
}: PredictionResultsProps) {
  const theme = useTheme();

  if (predictions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Click anywhere on the canvas to make your first prediction!
        </Typography>
      </Box>
    );
  }

  const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return 'success';
      case 'medium':
        return 'warning';
      case 'low':
        return 'error';
    }
  };

  const getTypeColor = (type: 'interpolation' | 'extrapolation') => {
    return type === 'interpolation' ? 'info' : 'secondary';
  };

  const recentPredictions = predictions.slice(-3);

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        background: theme.palette.glass.secondary,
        border: `1px solid ${theme.palette.glass.border}`,
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: 'text.primary' }}>
          Predictions ({predictions.length})
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={onClear}
          sx={{ minWidth: 'auto' }}
        >
          Clear
        </Button>
      </Box>

      <Box sx={{ maxHeight: 120, overflowY: 'auto', mb: 2 }}>
        {recentPredictions.map((pred, index) => (
          <Box
            key={predictions.length - recentPredictions.length + index}
            sx={{ mb: 1 }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                x={pred.x.toFixed(0)} → y={pred.predicted.toFixed(1)}
              </Typography>
              <Chip
                label={pred.confidence}
                size="small"
                color={getConfidenceColor(pred.confidence) as any}
                sx={{ height: 16, fontSize: '0.7rem' }}
              />
              <Chip
                label={pred.type}
                size="small"
                color={getTypeColor(pred.type) as any}
                sx={{ height: 16, fontSize: '0.7rem' }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {getConfidenceMessage(pred.confidence)}
            </Typography>
          </Box>
        ))}
        {predictions.length > 3 && (
          <Typography
            variant="caption"
            sx={{ color: 'text.disabled', fontStyle: 'italic' }}
          >
            Showing last 3 predictions...
          </Typography>
        )}
      </Box>

      <Alert
        severity={
          accuracy > 80 ? 'success' : accuracy > 60 ? 'info' : 'warning'
        }
        sx={{ fontSize: '0.875rem' }}
      >
        Overall Accuracy: {accuracy.toFixed(1)}%
        {accuracy > 80 && ' - Excellent predictions!'}
        {accuracy <= 80 && accuracy > 60 && ' - Good job!'}
        {accuracy <= 60 && ' - Keep practicing!'}
      </Alert>
    </Box>
  );
}
