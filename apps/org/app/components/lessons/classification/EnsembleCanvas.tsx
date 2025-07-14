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
  LinearProgress,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  generateClassificationDataset,
  trainDecisionTree,
  calculateMetrics,
  DATASET_CONFIGS,
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

interface EnsembleCanvasProps {
  onInteraction?: (data: any) => void;
}

export function EnsembleCanvas({ onInteraction }: EnsembleCanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataset, setDataset] = useState<ClassificationDataset>(
    () => generateClassificationDataset('moons', 60, 600, 400) // Pass canvas dimensions
  );
  const [datasetType, setDatasetType] = useState<string>('moons'); // Track dataset type separately
  const [trees, setTrees] = useState<DecisionTreeNode[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [currentTree, setCurrentTree] = useState(0);
  const [forestSize, setForestSize] = useState(5);
  const [showIndividualTrees, setShowIndividualTrees] = useState(false);

  const generateNewDataset = (type: any) => {
    const newDataset = generateClassificationDataset(type, 60, 600, 400); // Pass canvas dimensions
    setDataset(newDataset);
    setDatasetType(type); // Update dataset type state
    setTrees([]);
    setCurrentTree(0);
    setIsTraining(false);
  };

  const trainRandomForest = async () => {
    setIsTraining(true);
    const trainedTrees: DecisionTreeNode[] = [];

    for (let i = 0; i < forestSize; i++) {
      setCurrentTree(i + 1);

      // Bootstrap sampling - create random subset of data
      const sampleSize = Math.floor(dataset.points.length * 0.8);
      const bootstrapSample = [];
      for (let j = 0; j < sampleSize; j++) {
        const randomIndex = Math.floor(Math.random() * dataset.points.length);
        bootstrapSample.push(dataset.points[randomIndex]);
      }

      // Train tree on bootstrap sample
      const tree = trainDecisionTree(bootstrapSample);
      trainedTrees.push(tree);

      // Small delay to show progress
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    setTrees(trainedTrees);
    setIsTraining(false);

    // Calculate ensemble metrics
    const predictedPoints = dataset.points.map((point) => {
      const prediction = predictWithEnsemble(point.x, point.y, trainedTrees);
      return { ...point, predicted: prediction } as ClassificationPoint;
    });

    const metrics = calculateMetrics(predictedPoints);

    onInteraction?.({
      forestSize,
      accuracy: metrics.accuracy,
      individualTreeAccuracy: calculateIndividualTreeAccuracy(trainedTrees),
      dataset: datasetType,
    });
  };

  const predictWithEnsemble = (
    x: number,
    y: number,
    forest: DecisionTreeNode[]
  ): 0 | 1 => {
    if (forest.length === 0) return 0;

    let votes = 0;
    forest.forEach((tree) => {
      const value = tree.feature === 0 ? x : y;
      const prediction =
        tree.threshold !== undefined && value <= tree.threshold ? 0 : 1;
      votes += prediction;
    });

    return votes >= forest.length / 2 ? 1 : 0;
  };

  const calculateIndividualTreeAccuracy = (
    forest: DecisionTreeNode[]
  ): number => {
    if (forest.length === 0) return 0;

    let totalAccuracy = 0;
    forest.forEach((tree) => {
      const predictions = dataset.points.map((point) => {
        const value = tree.feature === 0 ? point.x : point.y;
        const prediction =
          tree.threshold !== undefined && value <= tree.threshold ? 0 : 1;
        return { ...point, predicted: prediction } as ClassificationPoint;
      });
      const metrics = calculateMetrics(predictions);
      totalAccuracy += metrics.accuracy;
    });

    return totalAccuracy / forest.length;
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas(ctx, canvas);
    drawGridlines(ctx, canvas, theme);

    // Draw decision boundaries
    if (trees.length > 0) {
      if (showIndividualTrees) {
        // Draw individual tree boundaries
        ctx.globalAlpha = 0.3;
        trees.forEach((tree, index) => {
          const hue = (index * 360) / trees.length;
          ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
          ctx.lineWidth = 2;

          if (tree.threshold !== undefined) {
            if (tree.feature === 0) {
              ctx.beginPath();
              ctx.moveTo(tree.threshold, 0);
              ctx.lineTo(tree.threshold, canvas.height);
              ctx.stroke();
            } else {
              ctx.beginPath();
              ctx.moveTo(0, tree.threshold);
              ctx.lineTo(canvas.width, tree.threshold);
              ctx.stroke();
            }
          }
        });
        ctx.globalAlpha = 1.0;
      } else {
        // Draw ensemble decision boundary
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;

        for (let x = 0; x < canvas.width; x += 3) {
          for (let y = 0; y < canvas.height; y += 3) {
            const prediction = predictWithEnsemble(x, y, trees);
            const index = (y * canvas.width + x) * 4;

            if (prediction === 1) {
              // Green class - use success theme color
              data[index] = 76; // Red component of success green
              data[index + 1] = 175; // Green component
              data[index + 2] = 80; // Blue component
            } else {
              // Red class - use error theme color
              data[index] = 244; // Red component of error red
              data[index + 1] = 67; // Green component
              data[index + 2] = 54; // Blue component
            }
            data[index + 3] = 80; // Alpha - visible but not overwhelming
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }
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

  useEffect(() => {
    drawCanvas();
  }, [dataset, trees, showIndividualTrees, theme]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Ensemble Methods: Combine multiple models for better predictions
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Dataset</InputLabel>
          <Select
            value={datasetType}
            onChange={(e) => generateNewDataset(e.target.value)}
            MenuProps={{
              disableScrollLock: true,
            }}
          >
            {Object.values(DATASET_CONFIGS).map((config) => (
              <MenuItem key={config.id} value={config.id}>
                {config.icon} {config.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Trees</InputLabel>
          <Select
            value={forestSize}
            onChange={(e) => setForestSize(Number(e.target.value))}
            MenuProps={{
              disableScrollLock: true,
            }}
          >
            <MenuItem value={1}>1 Tree</MenuItem>
            <MenuItem value={3}>3 Trees</MenuItem>
            <MenuItem value={5}>5 Trees</MenuItem>
            <MenuItem value={10}>10 Trees</MenuItem>
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
        <Button
          variant="contained"
          onClick={trainRandomForest}
          disabled={isTraining}
        >
          {isTraining ? 'Training...' : 'Train Random Forest'}
        </Button>
        <Button
          variant="outlined"
          onClick={() => setShowIndividualTrees(!showIndividualTrees)}
          disabled={trees.length === 0}
        >
          {showIndividualTrees ? 'Show Ensemble' : 'Show Individual Trees'}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setTrees([]);
            setCurrentTree(0);
            setIsTraining(false);
          }}
        >
          Reset
        </Button>
      </Stack>

      {isTraining && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="body2" gutterBottom>
              Training tree {currentTree} of {forestSize}...
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(currentTree / forestSize) * 100}
            />
          </CardContent>
        </Card>
      )}

      {trees.length > 0 && (
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Random Forest Results
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip label={`Trees: ${trees.length}`} color="primary" />
                <Chip
                  label={`Avg Individual Accuracy: ${(
                    calculateIndividualTreeAccuracy(trees) * 100
                  ).toFixed(1)}%`}
                  color="warning"
                />
                <Chip
                  label={`Ensemble Accuracy: ${(
                    calculateMetrics(
                      dataset.points.map((p) => ({
                        ...p,
                        predicted: predictWithEnsemble(p.x, p.y, trees),
                      }))
                    ).accuracy * 100
                  ).toFixed(1)}%`}
                  color="success"
                />
              </Stack>
            </CardContent>
          </Card>

          <Paper sx={{ p: 2, background: theme.palette.glass.secondary }}>
            <Typography variant="body2" color="text.primary">
              <strong>Ensemble Power:</strong> Each tree is trained on a
              different subset of data (bootstrap sampling). The final
              prediction is made by majority voting. This typically improves
              accuracy and reduces overfitting compared to individual trees.
            </Typography>
          </Paper>
        </Stack>
      )}
    </Box>
  );
}
