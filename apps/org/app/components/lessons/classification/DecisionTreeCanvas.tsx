import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  generateClassificationDataset,
  trainDecisionTree,
  calculateMetrics,
} from './index';
import {
  ClassificationPoint,
  ClassificationDataset,
  DecisionTreeNode,
} from './types';
import {
  drawGridlines,
  drawPoints,
  clearCanvas,
} from '../linear-regression/canvas-utils';

interface DecisionTreeCanvasProps {
  onInteraction?: (data: any) => void;
}

export function DecisionTreeCanvas({ onInteraction }: DecisionTreeCanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataset, setDataset] = useState<ClassificationDataset>(
    () => generateClassificationDataset('linearly_separable', 40, 600, 400) // Pass canvas dimensions
  );
  const [tree, setTree] = useState<DecisionTreeNode | null>(null);
  const [trained, setTrained] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  const generateNewDataset = (type: any) => {
    const newDataset = generateClassificationDataset(type, 40, 600, 400); // Pass canvas dimensions
    setDataset(newDataset);
    setTree(null);
    setTrained(false);
    setCurrentStep(0);
    setShowSteps(false);
  };

  const trainTree = () => {
    const decisionTree = trainDecisionTree(dataset.points);
    setTree(decisionTree);
    setTrained(true);
    setShowSteps(true);
    setCurrentStep(1);

    // Calculate metrics
    const predictedPoints = dataset.points.map((point) => {
      const prediction = predictWithTree(point.x, point.y, decisionTree);
      return { ...point, predicted: prediction } as ClassificationPoint;
    });

    const metrics = calculateMetrics(predictedPoints);

    onInteraction?.({
      splitFeature: decisionTree.feature === 0 ? 'X' : 'Y',
      threshold: decisionTree.threshold.toFixed(1),
      metrics,
      dataset: dataset.name,
    });
  };

  const predictWithTree = (
    x: number,
    y: number,
    node: DecisionTreeNode
  ): 0 | 1 => {
    const value = node.feature === 0 ? x : y;

    if (value <= node.threshold) {
      return node.left?.prediction ?? 0;
    } else {
      return node.right?.prediction ?? 1;
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas(ctx, canvas);
    drawGridlines(ctx, canvas, theme);

    // Draw decision boundary
    if (trained && tree) {
      ctx.strokeStyle = theme.palette.primary.main;
      ctx.lineWidth = 3;

      if (tree.feature === 0) {
        // Vertical split
        ctx.beginPath();
        ctx.moveTo(tree.threshold, 0);
        ctx.lineTo(tree.threshold, canvas.height);
        ctx.stroke();

        // Draw feature label
        ctx.fillStyle = theme.palette.primary.main;
        ctx.font = '14px Arial';
        ctx.fillText(
          `X ≤ ${tree.threshold.toFixed(0)}`,
          tree.threshold + 5,
          20
        );
      } else {
        // Horizontal split
        ctx.beginPath();
        ctx.moveTo(0, tree.threshold);
        ctx.lineTo(canvas.width, tree.threshold);
        ctx.stroke();

        // Draw feature label
        ctx.fillStyle = theme.palette.primary.main;
        ctx.font = '14px Arial';
        ctx.fillText(`Y ≤ ${tree.threshold.toFixed(0)}`, 5, tree.threshold - 5);
      }

      // Draw regions
      ctx.globalAlpha = 0.2;
      if (tree.feature === 0) {
        // Left region (class 0)
        ctx.fillStyle = theme.palette.error.main;
        ctx.fillRect(0, 0, tree.threshold, canvas.height);

        // Right region (class 1)
        ctx.fillStyle = theme.palette.success.main;
        ctx.fillRect(
          tree.threshold,
          0,
          canvas.width - tree.threshold,
          canvas.height
        );
      } else {
        // Bottom region (class 0)
        ctx.fillStyle = theme.palette.error.main;
        ctx.fillRect(
          0,
          tree.threshold,
          canvas.width,
          canvas.height - tree.threshold
        );

        // Top region (class 1)
        ctx.fillStyle = theme.palette.success.main;
        ctx.fillRect(0, 0, canvas.width, tree.threshold);
      }
      ctx.globalAlpha = 1.0;
    }

    // Draw data points
    const class0Points = dataset.points
      .filter((p) => p.label === 0)
      .map((p) => ({ x: p.x, y: p.y }));
    const class1Points = dataset.points
      .filter((p) => p.label === 1)
      .map((p) => ({ x: p.x, y: p.y }));

    drawPoints(ctx, class0Points, theme.palette.error.main, 8);
    drawPoints(ctx, class1Points, theme.palette.success.main, 8);
  };

  const getTreeExplanation = () => {
    if (!tree) return '';

    const feature = tree.feature === 0 ? 'X-coordinate' : 'Y-coordinate';
    const threshold = tree.threshold.toFixed(1);

    return `Split on ${feature}: if ${feature} ≤ ${threshold} → Class 0, else → Class 1`;
  };

  const getInformationGain = () => {
    if (!tree) return 0;

    // Calculate approximate information gain
    const total = dataset.points.length;
    const class0Count = dataset.points.filter((p) => p.label === 0).length;
    const class1Count = dataset.points.filter((p) => p.label === 1).length;

    const originalEntropy = -(
      (class0Count / total) * Math.log2(class0Count / total + 0.001) +
      (class1Count / total) * Math.log2(class1Count / total + 0.001)
    );

    // Approximate weighted entropy after split
    const leftCount = dataset.points.filter(
      (p) => (tree.feature === 0 ? p.x : p.y) <= tree.threshold
    ).length;
    const rightCount = total - leftCount;

    const weightedEntropy =
      (leftCount / total) * 0.5 + (rightCount / total) * 0.5;

    return Math.max(0, originalEntropy - weightedEntropy);
  };

  useEffect(() => {
    drawCanvas();
  }, [dataset, trained, tree, theme]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Decision Tree: Learn rule-based classification
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Dataset</InputLabel>
          <Select
            value={dataset.name.toLowerCase().replace(/\s+/g, '_')}
            onChange={(e) => generateNewDataset(e.target.value)}
            MenuProps={{
              disableScrollLock: true,
            }}
          >
            <MenuItem value="linearly_separable">Linear</MenuItem>
            <MenuItem value="circles">Circles</MenuItem>
            <MenuItem value="moons">Moons</MenuItem>
            <MenuItem value="blobs">Blobs</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          style={{
            border: `2px solid ${theme.palette.glass.border}`,
            borderRadius: '8px',
            background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
          }}
        />
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <Button variant="contained" onClick={trainTree} disabled={trained}>
          Train Decision Tree
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setTrained(false);
            setTree(null);
            setCurrentStep(0);
            setShowSteps(false);
          }}
        >
          Reset
        </Button>
      </Stack>

      {trained && tree && (
        <Stack spacing={2}>
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Decision Rule
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {getTreeExplanation()}
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip
                  label={`Split Feature: ${tree.feature === 0 ? 'X' : 'Y'}`}
                  color="primary"
                />
                <Chip
                  label={`Threshold: ${tree.threshold.toFixed(1)}`}
                  color="secondary"
                />
                <Chip
                  label={`Information Gain: ${getInformationGain().toFixed(3)}`}
                  color="info"
                />
              </Stack>
            </CardContent>
          </Card>

          <Paper sx={{ p: 2, background: theme.palette.glass.secondary }}>
            <Typography variant="body2" color="text.primary">
              <strong>How it works:</strong> Decision trees make predictions by
              asking a series of yes/no questions. This tree asks: "Is the{' '}
              {tree.feature === 0 ? 'X' : 'Y'} value ≤{' '}
              {tree.threshold.toFixed(1)}?" If yes → Class 0, if no → Class 1.
            </Typography>
          </Paper>
        </Stack>
      )}
    </Box>
  );
}
