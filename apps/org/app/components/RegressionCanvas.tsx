import React, { useRef, useEffect, useCallback } from 'react';
import { Paper, useTheme as useMuiTheme } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import { Point, LineParams } from '../hooks/useLinearRegression';

interface RegressionCanvasProps {
  points: Point[];
  lineParams: LineParams;
  onPointAdd: (point: Point) => void;
  width?: number;
  height?: number;
  noise?: number;
}

export const RegressionCanvas: React.FC<RegressionCanvasProps> = ({
  points,
  lineParams,
  onPointAdd,
  width = 600,
  height = 400,
  noise = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { themeMode } = useTheme();
  const muiTheme = useMuiTheme();

  const PADDING = 50;

  // Convert canvas coordinates to data coordinates
  const canvasToData = useCallback(
    (canvasX: number, canvasY: number) => {
      return {
        x: ((canvasX - PADDING) / (width - 2 * PADDING)) * 10,
        y: ((height - canvasY - PADDING) / (height - 2 * PADDING)) * 10,
      };
    },
    [width, height]
  );

  // Convert data coordinates to canvas coordinates
  const dataToCanvas = useCallback(
    (dataX: number, dataY: number) => {
      return {
        x: (dataX / 10) * (width - 2 * PADDING) + PADDING,
        y: height - ((dataY / 10) * (height - 2 * PADDING) + PADDING),
      };
    },
    [width, height]
  );

  // Handle canvas click
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const canvasX = event.clientX - rect.left;
      const canvasY = event.clientY - rect.top;

      const dataPoint = canvasToData(canvasX, canvasY);

      // Add some noise if enabled
      if (noise > 0) {
        dataPoint.y += (Math.random() - 0.5) * noise;
      }

      onPointAdd(dataPoint);
    },
    [canvasToData, noise, onPointAdd]
  );

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = themeMode === 'dark' ? '#1e1e1e' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = themeMode === 'dark' ? '#444' : '#e0e0e0';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * (width - 2 * PADDING) + PADDING;
      const y = (i / 10) * (height - 2 * PADDING) + PADDING;

      ctx.beginPath();
      ctx.moveTo(x, PADDING);
      ctx.lineTo(x, height - PADDING);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(PADDING, y);
      ctx.lineTo(width - PADDING, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = themeMode === 'dark' ? '#ffffff' : '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PADDING, height - PADDING);
    ctx.lineTo(width - PADDING, height - PADDING);
    ctx.moveTo(PADDING, PADDING);
    ctx.lineTo(PADDING, height - PADDING);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = themeMode === 'dark' ? '#ffffff' : '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('X', width / 2, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Y', 0, 0);
    ctx.restore();

    // Draw points
    ctx.fillStyle = '#1976d2';
    points.forEach((point) => {
      const canvasPoint = dataToCanvas(point.x, point.y);
      ctx.beginPath();
      ctx.arc(canvasPoint.x, canvasPoint.y, 6, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw regression line
    if (points.length >= 2) {
      const startPoint = dataToCanvas(0, lineParams.intercept);
      const endPoint = dataToCanvas(
        10,
        lineParams.slope * 10 + lineParams.intercept
      );

      ctx.strokeStyle = '#dc004e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.stroke();
    }
  }, [points, lineParams, dataToCanvas, themeMode, width, height]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        textAlign: 'center',
        background: muiTheme.palette.glass.primary,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleCanvasClick}
        style={{
          border: `1px solid ${themeMode === 'dark' ? '#444' : '#e0e0e0'}`,
          cursor: 'crosshair',
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '8px',
        }}
      />
    </Paper>
  );
};
