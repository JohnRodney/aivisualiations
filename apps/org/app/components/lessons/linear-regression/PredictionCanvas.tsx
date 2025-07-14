import React, { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Point,
  drawGridlines,
  drawPoints,
  drawLine,
  clearCanvas,
} from './canvas-utils';
import { usePredictions } from './usePredictions';
import { PredictionResults } from './PredictionResults';

interface PredictionCanvasProps {
  onInteraction?: (data: any) => void;
}

export function PredictionCanvas({ onInteraction }: PredictionCanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sample training data points
  const dataPoints: Point[] = [
    { x: 100, y: 180 },
    { x: 180, y: 160 },
    { x: 260, y: 140 },
    { x: 340, y: 120 },
    { x: 420, y: 100 },
    { x: 500, y: 80 },
  ];

  const {
    predictions,
    bestFitLine,
    makePrediction,
    clearPredictions,
    calculateAccuracy,
    getConfidenceMessage,
    updateBestFitLine,
  } = usePredictions({ dataPoints, onInteraction });

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas(ctx, canvas);
    drawGridlines(ctx, canvas, theme);

    // Draw the best fit line
    if (bestFitLine) {
      drawLine(ctx, bestFitLine, theme.palette.primary.main, 2);
    }

    // Draw training data points
    drawPoints(ctx, dataPoints, theme.palette.secondary.main, 8);

    // Draw prediction points
    predictions.forEach((pred) => {
      const predictionPoint = { x: pred.x, y: pred.predicted };
      const actualPoint = { x: pred.x, y: pred.y };

      // Draw prediction point
      drawPoints(ctx, [predictionPoint], theme.palette.success.main, 6);

      // Draw actual clicked point (semi-transparent)
      ctx.globalAlpha = 0.5;
      drawPoints(ctx, [actualPoint], theme.palette.info.main, 4);
      ctx.globalAlpha = 1.0;

      // Draw line connecting them to show error
      ctx.strokeStyle = theme.palette.warning.main;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(predictionPoint.x, predictionPoint.y);
      ctx.lineTo(actualPoint.x, actualPoint.y);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    makePrediction(x, y);
  };

  useEffect(() => {
    updateBestFitLine();
  }, []);

  useEffect(() => {
    drawCanvas();
  }, [predictions, bestFitLine, theme]);

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 2, color: 'text.primary', textAlign: 'center' }}
      >
        Prediction Master - Click anywhere to predict the y-value!
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            onClick={handleCanvasClick}
            style={{
              border: `2px solid ${theme.palette.glass.border}`,
              borderRadius: '8px',
              background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
              cursor: 'crosshair',
              width: '100%',
              maxWidth: '600px',
            }}
          />

          <Box
            sx={{
              mt: 2,
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.secondary.main,
                }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Training Data
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.success.main,
                }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Predictions
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.info.main,
                  opacity: 0.5,
                }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Clicked Points
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ minWidth: 280 }}>
          <PredictionResults
            predictions={predictions}
            accuracy={calculateAccuracy()}
            onClear={clearPredictions}
            getConfidenceMessage={getConfidenceMessage}
          />
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}
      >
        💡 Green dots = predictions on the line, Blue dots = where you clicked,
        Dashed lines = prediction error
      </Typography>
    </Box>
  );
}
