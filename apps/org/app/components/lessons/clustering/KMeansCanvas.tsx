import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useKMeansClustering } from './useKMeansClustering';
import { ClusteringCanvasProps } from './types';
import {
  drawGridlines,
  drawPoints,
  clearCanvas,
} from '../linear-regression/canvas-utils';
import { CLUSTER_COLORS } from './utils';

export function KMeansCanvas({ onInteraction }: ClusteringCanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize] = useState({ width: 600, height: 400 });

  const {
    dataset,
    centroids,
    result,
    metrics,
    isRunning,
    iterations,
    params,
    setParams,
    generateDataset,
    runKMeans,
    reset,
    addPoint,
  } = useKMeansClustering('blobs', canvasSize.width, canvasSize.height);

  // Dataset options
  const datasetOptions = [
    { value: 'blobs', label: 'Gaussian Blobs' },
    { value: 'circles', label: 'Concentric Circles' },
    { value: 'uniform', label: 'Uniform Random' },
  ];

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    clearCanvas(ctx, canvas);

    // Draw grid
    drawGridlines(ctx, canvas, theme);

    // Draw points
    const pointsToDisplay = result?.points || dataset.points;

    if (pointsToDisplay.length > 0) {
      // Group points by cluster
      const clusteredPoints = pointsToDisplay.reduce((acc, point) => {
        const clusterId = point.clusterId ?? -1;
        if (!acc[clusterId]) acc[clusterId] = [];
        acc[clusterId].push(point);
        return acc;
      }, {} as Record<number, typeof pointsToDisplay>);

      // Draw points by cluster
      Object.entries(clusteredPoints).forEach(([clusterId, points]) => {
        const id = parseInt(clusterId);
        const color =
          id >= 0 && id < CLUSTER_COLORS.length
            ? CLUSTER_COLORS[id]
            : theme.palette.text.secondary;

        drawPoints(ctx, points, color, 4);
      });
    }

    // Draw centroids
    centroids.forEach((centroid, index) => {
      ctx.fillStyle = centroid.color;
      ctx.strokeStyle = theme.palette.text.primary;
      ctx.lineWidth = 2;

      // Draw centroid as larger circle with border
      ctx.beginPath();
      ctx.arc(centroid.x, centroid.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Draw centroid number
      ctx.fillStyle = theme.palette.text.primary;
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText((index + 1).toString(), centroid.x, centroid.y + 4);
    });

    // Draw connections from points to centroids (if result exists)
    if (result && result.points.length > 0) {
      ctx.strokeStyle = theme.palette.text.secondary;
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 1;

      result.points.forEach((point) => {
        const centroid = centroids.find((c) => c.id === point.clusterId);
        if (centroid) {
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(centroid.x, centroid.y);
          ctx.stroke();
        }
      });

      ctx.globalAlpha = 1;
    }
  }, [dataset, centroids, result, theme]);

  // Handle canvas click to add points
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    addPoint({ x, y });
  };

  // Handle run clustering
  const handleRunClustering = async () => {
    await runKMeans(canvasSize.width, canvasSize.height);

    // Report interaction
    onInteraction?.({
      algorithm: 'kmeans',
      params,
      iterations,
      metrics,
      converged: result?.converged,
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        K-Means Clustering
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Click on the canvas to add points, then run K-means clustering to group
        them.
      </Typography>

      {/* Controls */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Dataset</InputLabel>
          <Select
            value={dataset.name}
            label="Dataset"
            onChange={(e) => generateDataset(e.target.value as any)}
          >
            {datasetOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ minWidth: 120 }}>
          <Typography variant="body2">Clusters (k): {params.k}</Typography>
          <Slider
            value={params.k}
            onChange={(_, value) => setParams({ k: value as number })}
            min={2}
            max={8}
            step={1}
            size="small"
            disabled={isRunning}
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleRunClustering}
          disabled={isRunning || dataset.points.length < params.k}
        >
          {isRunning ? 'Running...' : 'Run K-Means'}
        </Button>

        <Button variant="outlined" onClick={reset} disabled={isRunning}>
          Reset
        </Button>
      </Stack>

      {/* Canvas */}
      <Box
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onClick={handleCanvasClick}
          style={{
            cursor: isRunning ? 'wait' : 'crosshair',
            display: 'block',
          }}
        />
      </Box>

      {/* Results */}
      {metrics && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Iterations: {iterations} | Inertia: {metrics.inertia.toFixed(2)} |
            Converged: {metrics.converged ? 'Yes' : 'No'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
