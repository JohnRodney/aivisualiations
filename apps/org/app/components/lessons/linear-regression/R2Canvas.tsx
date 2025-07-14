import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Point,
  LineSegment,
  drawGridlines,
  drawPoints,
  drawLine,
  calculateBestFitLine,
  clearCanvas,
} from './canvas-utils';

interface R2CanvasProps {
  onInteraction?: (data: any) => void;
}

export function R2Canvas({ onInteraction }: R2CanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentDataset, setCurrentDataset] = useState(0);
  const [guess, setGuess] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const datasets = [
    {
      name: 'Perfect Linear',
      r2: 1.0,
      points: [
        { x: 80, y: 200 },
        { x: 150, y: 180 },
        { x: 220, y: 160 },
        { x: 290, y: 140 },
        { x: 360, y: 120 },
        { x: 430, y: 100 },
        { x: 500, y: 80 },
      ],
    },
    {
      name: 'Strong Relationship',
      r2: 0.85,
      points: [
        { x: 80, y: 205 },
        { x: 150, y: 175 },
        { x: 220, y: 165 },
        { x: 290, y: 135 },
        { x: 360, y: 115 },
        { x: 430, y: 105 },
        { x: 500, y: 75 },
      ],
    },
    {
      name: 'Moderate Fit',
      r2: 0.65,
      points: [
        { x: 80, y: 190 },
        { x: 150, y: 170 },
        { x: 220, y: 175 },
        { x: 290, y: 145 },
        { x: 360, y: 125 },
        { x: 430, y: 115 },
        { x: 500, y: 95 },
      ],
    },
    {
      name: 'Weak Relationship',
      r2: 0.25,
      points: [
        { x: 80, y: 180 },
        { x: 150, y: 160 },
        { x: 220, y: 190 },
        { x: 290, y: 140 },
        { x: 360, y: 130 },
        { x: 430, y: 150 },
        { x: 500, y: 110 },
      ],
    },
    {
      name: 'No Relationship',
      r2: 0.05,
      points: [
        { x: 80, y: 160 },
        { x: 150, y: 200 },
        { x: 220, y: 120 },
        { x: 290, y: 180 },
        { x: 360, y: 140 },
        { x: 430, y: 190 },
        { x: 500, y: 130 },
      ],
    },
  ];

  const currentData = datasets[currentDataset];

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas(ctx, canvas);
    drawGridlines(ctx, canvas, theme);

    const bestFitLine = calculateBestFitLine(currentData.points);
    drawLine(ctx, bestFitLine, theme.palette.primary.main);
    drawPoints(ctx, currentData.points, theme.palette.secondary.main);
  };

  const handleGuess = (guessValue: number) => {
    setGuess(guessValue);
    setShowResult(true);
    onInteraction?.({
      dataset: currentDataset,
      guess: guessValue,
      actual: currentData.r2,
    });
  };

  const nextDataset = () => {
    setCurrentDataset((prev) => (prev + 1) % datasets.length);
    setGuess(null);
    setShowResult(false);
  };

  const getAccuracyMessage = () => {
    if (guess === null) return null;
    const diff = Math.abs(guess - currentData.r2);
    if (diff < 0.1)
      return {
        message: 'Excellent! Great eye for correlation!',
        color: 'success',
      };
    if (diff < 0.2)
      return { message: "Good! You're getting the hang of it!", color: 'info' };
    if (diff < 0.3)
      return { message: 'Not bad! Keep practicing!', color: 'warning' };
    return { message: 'Keep studying the patterns!', color: 'error' };
  };

  useEffect(() => {
    drawCanvas();
  }, [currentDataset, theme]);

  const accuracy = getAccuracyMessage();

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 2, color: 'text.primary', textAlign: 'center' }}
      >
        R² Detective - Look at the scatter and guess the R² value!
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            style={{
              border: `2px solid ${theme.palette.glass.border}`,
              borderRadius: '8px',
              background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
              width: '100%',
              maxWidth: '600px',
            }}
          />
        </Box>

        <Card
          sx={{
            minWidth: 250,
            background: theme.palette.glass.secondary,
            border: `1px solid ${theme.palette.glass.border}`,
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Dataset: {currentData.name}
            </Typography>

            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              What's the R² value?
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}
            >
              {[0.1, 0.3, 0.5, 0.7, 0.9].map((value) => (
                <Button
                  key={value}
                  variant={guess === value ? 'contained' : 'outlined'}
                  onClick={() => handleGuess(value)}
                  size="small"
                  disabled={showResult}
                  sx={{ minWidth: 40 }}
                >
                  {value}
                </Button>
              ))}
            </Stack>

            {showResult && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 1 }}
                >
                  Your guess: <Chip label={guess} color="info" size="small" />
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 1 }}
                >
                  Actual R²:{' '}
                  <Chip
                    label={currentData.r2.toFixed(2)}
                    color="success"
                    size="small"
                  />
                </Typography>

                {accuracy && (
                  <Chip
                    label={accuracy.message}
                    color={accuracy.color as any}
                    size="small"
                    sx={{ fontSize: '0.7rem' }}
                  />
                )}
              </Box>
            )}

            <Button
              variant="outlined"
              onClick={nextDataset}
              size="small"
              fullWidth
            >
              Next Dataset ({currentDataset + 1}/5)
            </Button>
          </CardContent>
        </Card>
      </Box>

      <Typography
        variant="body2"
        sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}
      >
        💡 Look at how scattered the points are around the line - tighter
        clustering means higher R²!
      </Typography>
    </Box>
  );
}
