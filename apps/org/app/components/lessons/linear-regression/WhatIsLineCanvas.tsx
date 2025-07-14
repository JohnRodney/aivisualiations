import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Point {
  x: number;
  y: number;
}

interface WhatIsLineCanvasProps {
  onInteraction?: (data: any) => void;
}

export function WhatIsLineCanvas({ onInteraction }: WhatIsLineCanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [score, setScore] = useState<number | null>(null);

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

    // Set up styles
    ctx.fillStyle = theme.palette.mode === 'dark' ? '#ffffff' : '#000000';
    ctx.strokeStyle = theme.palette.primary.main;
    ctx.lineWidth = 2;

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

    // Draw data points
    ctx.fillStyle = theme.palette.secondary.main;
    dataPoints.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw current line
    if (currentLine.length >= 2) {
      ctx.strokeStyle = theme.palette.primary.main;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(currentLine[0].x, currentLine[0].y);
      ctx.lineTo(currentLine[1].x, currentLine[1].y);
      ctx.stroke();
    }
  };

  const calculateScore = (line: Point[]) => {
    if (line.length < 2) return 0;

    const [start, end] = line;
    const slope = (end.y - start.y) / (end.x - start.x);
    const intercept = start.y - slope * start.x;

    // Calculate sum of squared distances
    const totalError = dataPoints.reduce((sum, point) => {
      const predictedY = slope * point.x + intercept;
      const error = Math.pow(point.y - predictedY, 2);
      return sum + error;
    }, 0);

    // Convert to a 0-100 score (lower error = higher score)
    const maxError = 50000; // Approximate max error for terrible lines
    return Math.max(0, 100 - (totalError / maxError) * 100);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentLine([{ x, y }]);
    setScore(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentLine((prev) => [prev[0], { x, y }]);
  };

  const handleMouseUp = () => {
    if (isDrawing && currentLine.length >= 2) {
      const lineScore = calculateScore(currentLine);
      setScore(lineScore);
      onInteraction?.({ line: currentLine, score: lineScore });
    }
    setIsDrawing(false);
  };

  const resetCanvas = () => {
    setCurrentLine([]);
    setScore(null);
  };

  useEffect(() => {
    drawCanvas();
  }, [currentLine, theme]);

  const getScoreMessage = (score: number) => {
    if (score > 80) return '🎉 Excellent! You have a great eye for data!';
    if (score > 60) return '👍 Good! Your line fits the data well.';
    if (score > 40) return '📈 Not bad! Try to get closer to more points.';
    return '🎯 Keep trying! Look for the overall trend.';
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 2, color: 'text.primary', textAlign: 'center' }}
      >
        Draw a line through the data points
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            border: `2px solid ${theme.palette.glass.border}`,
            borderRadius: '8px',
            cursor: isDrawing ? 'crosshair' : 'pointer',
            background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
          }}
        />
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={resetCanvas}>
          Clear Line
        </Button>
      </Stack>

      {score !== null && (
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: theme.palette.glass.secondary,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
            Score: {Math.round(score)}/100
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {getScoreMessage(score)}
          </Typography>
        </Box>
      )}

      <Typography
        variant="body2"
        sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}
      >
        💡 Tip: Click and drag to draw a line. Try to get as close as possible
        to all the points!
      </Typography>
    </Box>
  );
}
