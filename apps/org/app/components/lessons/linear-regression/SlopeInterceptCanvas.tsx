import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Point {
  x: number;
  y: number;
}

interface SlopeInterceptCanvasProps {
  onInteraction?: (data: any) => void;
}

export function SlopeInterceptCanvas({
  onInteraction,
}: SlopeInterceptCanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [slope, setSlope] = useState(0.5);
  const [intercept, setIntercept] = useState(150);

  // Sample data points
  const dataPoints: Point[] = [
    { x: 50, y: 180 },
    { x: 120, y: 160 },
    { x: 180, y: 140 },
    { x: 240, y: 120 },
    { x: 300, y: 110 },
    { x: 360, y: 90 },
    { x: 420, y: 80 },
    { x: 480, y: 70 },
  ];

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = theme.palette.mode === 'dark' ? '#333333' : '#eeeeee';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = theme.palette.mode === 'dark' ? '#666666' : '#999999';
    ctx.lineWidth = 2;
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(40, canvas.height);
    ctx.stroke();
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 40);
    ctx.lineTo(canvas.width, canvas.height - 40);
    ctx.stroke();

    // Draw data points
    ctx.fillStyle = theme.palette.secondary.main;
    dataPoints.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw regression line
    ctx.strokeStyle = theme.palette.primary.main;
    ctx.lineWidth = 3;
    ctx.beginPath();

    // Calculate line endpoints
    const x1 = 0;
    const y1 = intercept;
    const x2 = canvas.width;
    const y2 = slope * x2 + intercept;

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Highlight y-intercept
    ctx.fillStyle = theme.palette.error.main;
    ctx.beginPath();
    ctx.arc(40, intercept, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Draw y-intercept label
    ctx.fillStyle = theme.palette.mode === 'dark' ? '#ffffff' : '#000000';
    ctx.font = '14px Arial';
    ctx.fillText(`y-intercept: ${intercept.toFixed(1)}`, 50, intercept - 10);
  };

  const calculateR2 = () => {
    const predictions = dataPoints.map((point) => slope * point.x + intercept);
    const actual = dataPoints.map((point) => point.y);
    const mean = actual.reduce((sum, val) => sum + val, 0) / actual.length;

    const totalSumSquares = actual.reduce(
      (sum, val) => sum + Math.pow(val - mean, 2),
      0
    );
    const residualSumSquares = actual.reduce(
      (sum, val, i) => sum + Math.pow(val - predictions[i], 2),
      0
    );

    return Math.max(0, 1 - residualSumSquares / totalSumSquares);
  };

  const handleSlopeChange = (_: Event, newValue: number | number[]) => {
    const newSlope = newValue as number;
    setSlope(newSlope);
    onInteraction?.({ slope: newSlope, intercept, r2: calculateR2() });
  };

  const handleInterceptChange = (_: Event, newValue: number | number[]) => {
    const newIntercept = newValue as number;
    setIntercept(newIntercept);
    onInteraction?.({ slope, intercept: newIntercept, r2: calculateR2() });
  };

  useEffect(() => {
    drawCanvas();
  }, [slope, intercept, theme]);

  const r2 = calculateR2();
  const equation = `y = ${slope.toFixed(2)}x + ${intercept.toFixed(1)}`;

  // Grading system based on R² value
  const getGrade = (r2Value: number) => {
    if (r2Value >= 0.95)
      return {
        grade: 'A+',
        color: 'success',
        message: 'Perfect fit! You nailed it!',
      };
    if (r2Value >= 0.9)
      return {
        grade: 'A',
        color: 'success',
        message: 'Excellent work! Very close to optimal.',
      };
    if (r2Value >= 0.8)
      return {
        grade: 'B+',
        color: 'info',
        message: 'Great job! Good understanding of the relationship.',
      };
    if (r2Value >= 0.7)
      return {
        grade: 'B',
        color: 'info',
        message: 'Good work! Getting closer to the best fit.',
      };
    if (r2Value >= 0.6)
      return {
        grade: 'C+',
        color: 'warning',
        message: 'Not bad! Keep adjusting to improve the fit.',
      };
    if (r2Value >= 0.5)
      return {
        grade: 'C',
        color: 'warning',
        message: "You're getting there! Try different values.",
      };
    if (r2Value >= 0.3)
      return {
        grade: 'D',
        color: 'warning',
        message: 'Keep trying! Adjust slope and intercept.',
      };
    return {
      grade: 'F',
      color: 'error',
      message: 'Keep experimenting! Try different combinations.',
    };
  };

  const gradeInfo = getGrade(r2);
  const scorePercentage = Math.round(r2 * 100);

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 3, color: 'text.primary', textAlign: 'center' }}
      >
        Adjust the slope and y-intercept to see how they affect the line
      </Typography>

      <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
        <Grid item xs={12} md={8} sx={{ flexShrink: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <canvas
              ref={canvasRef}
              width={600}
              height={300}
              style={{
                border: `2px solid ${theme.palette.glass.border}`,
                borderRadius: '8px',
                background:
                  theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4} sx={{ flexGrow: 1, minWidth: 0 }}>
          <Card
            elevation={0}
            sx={{
              background: theme.palette.glass.secondary,
              border: `1px solid ${theme.palette.glass.border}`,
              mb: 2,
              width: '100%',
              minWidth: '300px',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Equation
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 2,
                  background: theme.palette.glass.primary,
                  borderRadius: 2,
                  mb: 2,
                  minHeight: '60px',
                  flex: '1 1 auto',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: 'monospace',
                    color: 'primary.main',
                    textAlign: 'center',
                  }}
                >
                  {equation}
                </Typography>
              </Box>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  R² = {r2.toFixed(3)}
                </Typography>
                <Chip
                  label={gradeInfo.grade}
                  color={
                    gradeInfo.color as 'success' | 'info' | 'warning' | 'error'
                  }
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 1 }}
                >
                  Score: {scorePercentage}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={scorePercentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.palette.glass.border,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor:
                        gradeInfo.color === 'success'
                          ? theme.palette.success.main
                          : gradeInfo.color === 'info'
                          ? theme.palette.info.main
                          : gradeInfo.color === 'warning'
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                    },
                  }}
                />
              </Box>

              <Alert
                severity={
                  gradeInfo.color as 'success' | 'info' | 'warning' | 'error'
                }
                sx={{
                  backgroundColor:
                    gradeInfo.color === 'success'
                      ? `${theme.palette.success.light}20`
                      : gradeInfo.color === 'info'
                      ? `${theme.palette.info.light}20`
                      : gradeInfo.color === 'warning'
                      ? `${theme.palette.warning.light}20`
                      : `${theme.palette.error.light}20`,
                  border:
                    gradeInfo.color === 'success'
                      ? `1px solid ${theme.palette.success.main}40`
                      : gradeInfo.color === 'info'
                      ? `1px solid ${theme.palette.info.main}40`
                      : gradeInfo.color === 'warning'
                      ? `1px solid ${theme.palette.warning.main}40`
                      : `1px solid ${theme.palette.error.main}40`,
                }}
              >
                {gradeInfo.message}
              </Alert>
            </CardContent>
          </Card>

          <Box sx={{ px: 2 }}>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.primary' }}>
              Slope (m): {slope.toFixed(2)}
            </Typography>
            <Slider
              value={slope}
              onChange={handleSlopeChange}
              min={-2}
              max={2}
              step={0.1}
              sx={{ mb: 3 }}
            />

            <Typography variant="body1" sx={{ mb: 2, color: 'text.primary' }}>
              Y-intercept (b): {intercept.toFixed(1)}
            </Typography>
            <Slider
              value={intercept}
              onChange={handleInterceptChange}
              min={0}
              max={300}
              step={5}
            />
          </Box>
        </Grid>
      </Grid>

      <Typography
        variant="body2"
        sx={{ mt: 3, color: 'text.secondary', textAlign: 'center' }}
      >
        💡 Try different values to see how slope affects steepness and intercept
        shifts the line up/down!
      </Typography>
    </Box>
  );
}
