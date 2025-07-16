import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ManimalVideo } from '../ManimalVideo';
import {
  Point,
  LineSegment,
  drawGridlines,
  drawPoints,
  drawLine,
  clearCanvas,
  calculateLineQuality,
  drawErrorLines,
  drawBestFitHint,
  calculateBestFitLine,
} from './canvas-utils';

interface WhatIsLineCanvasProps {
  onInteraction?: (data: any) => void;
}

export function WhatIsLineCanvas({ onInteraction }: WhatIsLineCanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [userLine, setUserLine] = useState<LineSegment | null>(null);
  const [videoWatched, setVideoWatched] = useState(false);
  const [lineQuality, setLineQuality] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [bestFitLine, setBestFitLine] = useState<LineSegment | null>(null);

  // Sample data points for practice
  const dataPoints: Point[] = [
    { x: 100, y: 200 },
    { x: 180, y: 170 },
    { x: 260, y: 140 },
    { x: 340, y: 110 },
    { x: 420, y: 80 },
    { x: 500, y: 50 },
  ];

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setIsDrawing(true);
    setUserLine({ start: { x, y }, end: { x, y } });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !userLine) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setUserLine({ ...userLine, end: { x, y } });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (userLine) {
      const quality = calculateLineQuality(dataPoints, userLine);
      setLineQuality(quality);
      onInteraction?.({
        action: 'line_drawn',
        line: userLine,
        quality: quality,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const clearLine = () => {
    setUserLine(null);
    setLineQuality(0);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas(ctx, canvas);
    drawGridlines(ctx, canvas, theme);
    drawPoints(ctx, dataPoints, theme.palette.primary.main);

    // Show best fit hint if requested
    if (showHints && bestFitLine) {
      drawBestFitHint(ctx, bestFitLine, theme.palette.success.main);
    }

    if (userLine) {
      drawLine(ctx, userLine, theme.palette.secondary.main, 3);
      drawErrorLines(ctx, dataPoints, userLine, theme.palette.error.main);
    }
  };

  const handleVideoEnd = () => {
    setVideoWatched(true);
    onInteraction?.({
      action: 'video_completed',
      video: 'LinearRegression30Second',
      timestamp: new Date().toISOString(),
    });
  };

  useEffect(() => {
    // Calculate best fit line on mount
    if (!bestFitLine) {
      setBestFitLine(calculateBestFitLine(dataPoints));
    }
    drawCanvas();
  }, [userLine, theme, showHints, bestFitLine]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Video Introduction */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          color="primary"
          sx={{ textAlign: 'center' }}
        >
          🎬 Watch This 30-Second Explanation First
        </Typography>
        <ManimalVideo
          topic="linear_regression"
          sceneName="LinearRegression30Second"
          title="Linear Regression - Quick Introduction"
          description="A fast-paced explanation of what linear regression is and how it works"
          onVideoEnd={handleVideoEnd}
          onVideoStart={() =>
            onInteraction?.({
              action: 'video_started',
              video: 'LinearRegression30Second',
            })
          }
          showControls={true}
        />

        {videoWatched && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="success.main">
              ✅ Great! Now try drawing lines through the data points below
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Interactive Practice */}
      <Box>
        <Typography variant="h6" gutterBottom color="primary">
          🎯 Now Practice What You Learned
        </Typography>

        <Card
          elevation={0}
          sx={{
            mb: 2,
            background: theme.palette.glass.secondary,
            border: `1px solid ${theme.palette.glass.border}`,
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              🎮 <strong>Instructions:</strong> Click and drag to draw different
              lines through the data points. Try to find the line that best fits
              the data, just like you saw in the video!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              💡 <strong>Feedback:</strong> Red dotted lines show how far each
              point is from your line. Higher quality scores mean a better fit!
              Use "Show Best Fit" to see the optimal line.
            </Typography>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            background: theme.palette.glass.card,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.glass.border}`,
            borderRadius: 2,
          }}
        >
          <CardContent>
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                border: `2px solid ${theme.palette.glass.border}`,
                borderRadius: '8px',
                cursor: isDrawing ? 'crosshair' : 'pointer',
                display: 'block',
                margin: '0 auto',
              }}
            />
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant="outlined"
                  onClick={clearLine}
                  disabled={!userLine}
                  sx={{
                    borderColor: theme.palette.glass.border,
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  Clear Line
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => setShowHints(!showHints)}
                  sx={{
                    borderColor: theme.palette.glass.border,
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: theme.palette.success.main,
                    },
                  }}
                >
                  {showHints ? 'Hide Hint' : 'Show Best Fit'}
                </Button>
              </Stack>

              {userLine && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: theme.palette.glass.secondary,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="text.primary" gutterBottom>
                    <strong>Line Quality Score:</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 8,
                        backgroundColor: theme.palette.grey[300],
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${lineQuality}%`,
                          height: '100%',
                          backgroundColor:
                            lineQuality > 80
                              ? theme.palette.success.main
                              : lineQuality > 60
                              ? theme.palette.warning.main
                              : theme.palette.error.main,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{ minWidth: 45 }}
                    >
                      {Math.round(lineQuality)}%
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    {lineQuality > 80
                      ? '🎉 Excellent fit!'
                      : lineQuality > 60
                      ? '👍 Good fit!'
                      : lineQuality > 40
                      ? '📈 Getting better!'
                      : '🎯 Keep trying!'}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
