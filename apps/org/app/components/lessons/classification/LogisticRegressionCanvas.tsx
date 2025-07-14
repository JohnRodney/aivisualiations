import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Slider,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  generateClassificationDataset,
  trainLogisticRegression,
  calculateMetrics,
  DATASET_CONFIGS,
} from './index';
import { ClassificationPoint, ClassificationDataset } from './types';
import {
  drawGridlines,
  drawPoints,
  clearCanvas,
} from '../linear-regression/canvas-utils';
import { activationFunctions } from '../neural-network/nn-utils';

interface LogisticRegressionCanvasProps {
  onInteraction?: (data: any) => void;
}

export function LogisticRegressionCanvas({
  onInteraction,
}: LogisticRegressionCanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sigmoidCanvasRef = useRef<HTMLCanvasElement>(null);
  const [dataset, setDataset] = useState<ClassificationDataset>(
    () => generateClassificationDataset('linearly_separable', 50, 800, 600) // Pass canvas dimensions
  );
  const [selectedDatasetType, setSelectedDatasetType] =
    useState<string>('linearly_separable');
  const [weights, setWeights] = useState([0.01, 0.01]);
  const [bias, setBias] = useState(0);
  const [learningRate, setLearningRate] = useState(0.1);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0);
  const [showProbabilities, setShowProbabilities] = useState(false);
  const [maxEpochs, setMaxEpochs] = useState(1000);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [shouldStopTraining, setShouldStopTraining] = useState(false);

  // Get available datasets from centralized config
  const availableDatasets = Object.values(DATASET_CONFIGS);

  const calculateProbability = (x: number, y: number) => {
    // Get data range for coordinate transformation
    const xValues = dataset.points.map((p) => p.x);
    const yValues = dataset.points.map((p) => p.y);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;

    // Normalize coordinates to match training space
    const normalizedX = (x - xMin) / xRange;
    const normalizedY = (y - yMin) / yRange;

    const z = weights[0] * normalizedX + weights[1] * normalizedY + bias;
    return activationFunctions.sigmoid(z);
  };

  const trainOneEpoch = async () => {
    const newWeights = [...weights];
    let newBias = bias;
    let totalLoss = 0;

    // Feature normalization for better training stability
    const xValues = dataset.points.map((p) => p.x);
    const yValues = dataset.points.map((p) => p.y);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;

    for (const point of dataset.points) {
      // Normalize features to [0, 1] range for training
      const normalizedX = (point.x - xMin) / xRange;
      const normalizedY = (point.y - yMin) / yRange;

      const z =
        newWeights[0] * normalizedX + newWeights[1] * normalizedY + newBias;
      const prediction = activationFunctions.sigmoid(z);
      const error = point.label - prediction;

      // Gradient descent updates with proper scaling
      newWeights[0] += learningRate * error * normalizedX;
      newWeights[1] += learningRate * error * normalizedY;
      newBias += learningRate * error;

      // Calculate loss (cross-entropy)
      const clippedPred = Math.max(0.0001, Math.min(0.9999, prediction));
      totalLoss += -(
        point.label * Math.log(clippedPred) +
        (1 - point.label) * Math.log(1 - clippedPred)
      );
    }

    setWeights(newWeights);
    setBias(newBias);
    setLoss(totalLoss / dataset.points.length);
    setEpoch((prev) => prev + 1);
  };

  const trainModel = async () => {
    setIsTraining(true);
    setEpoch(0);
    setTrainingProgress(0);
    setShouldStopTraining(false);

    const updateFrequency = Math.max(1, Math.floor(maxEpochs / 100)); // Update UI every 1% of progress
    const canvasUpdateFrequency = Math.max(1, Math.floor(maxEpochs / 50)); // Update canvas every 2% of progress

    for (let i = 0; i < maxEpochs; i++) {
      if (shouldStopTraining) {
        break;
      }

      await trainOneEpoch();

      // Update progress
      const progress = ((i + 1) / maxEpochs) * 100;
      setTrainingProgress(progress);

      // Update UI at checkpoints for smooth progress
      if (i % updateFrequency === 0 || i === maxEpochs - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1));
      }

      // Slower canvas updates for better performance
      if (i % canvasUpdateFrequency === 0) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }

    setIsTraining(false);
    setTrainingProgress(100);
    setShouldStopTraining(false);

    // Calculate final metrics
    const predictedPoints = dataset.points.map((point) => {
      const probability = calculateProbability(point.x, point.y);
      return {
        ...point,
        predicted: probability > 0.5 ? 1 : 0,
      } as ClassificationPoint;
    });

    const metrics = calculateMetrics(predictedPoints);

    onInteraction?.({
      finalWeights: weights,
      finalBias: bias,
      finalLoss: loss,
      finalEpoch: epoch,
      metrics,
      converged: loss < 0.5,
      trainingCompleted: !shouldStopTraining,
    });
  };

  const stopTraining = () => {
    setShouldStopTraining(true);
  };

  const resetModel = () => {
    setWeights([0.01, 0.01]);
    setBias(0);
    setEpoch(0);
    setLoss(0);
    setTrainingProgress(0);
    setShouldStopTraining(false);
    generateNewDataset();
  };

  const generateNewDataset = (type = 'linearly_separable') => {
    const newDataset = generateClassificationDataset(type as any, 50, 800, 600); // Pass canvas dimensions
    setDataset(newDataset);
    setSelectedDatasetType(type);

    // Reset model state when dataset changes
    setWeights([0.01, 0.01]);
    setBias(0);
    setEpoch(0);
    setLoss(0);
    setTrainingProgress(0);
    setIsTraining(false);
    setShouldStopTraining(false);
  };

  const drawMainCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas(ctx, canvas);
    drawGridlines(ctx, canvas, theme);

    // Draw decision boundary
    if (Math.abs(weights[0]) > 0.001 || Math.abs(weights[1]) > 0.001) {
      ctx.strokeStyle = theme.palette.primary.main;
      ctx.lineWidth = 3;
      ctx.beginPath();

      // Get data range for coordinate transformation
      const xValues = dataset.points.map((p) => p.x);
      const yValues = dataset.points.map((p) => p.y);
      const xMin = Math.min(...xValues);
      const xMax = Math.max(...xValues);
      const yMin = Math.min(...yValues);
      const yMax = Math.max(...yValues);
      const xRange = xMax - xMin;
      const yRange = yMax - yMin;

      // Transform weights back to original coordinate space
      // Since training was on normalized [0,1] features, we need to scale back
      const originalWeight0 = weights[0] / xRange;
      const originalWeight1 = weights[1] / yRange;
      const originalBias =
        bias - (weights[0] * xMin) / xRange - (weights[1] * yMin) / yRange;

      let hasValidPoints = false;
      for (let x = 0; x < canvas.width; x += 5) {
        const y = -(originalWeight0 * x + originalBias) / originalWeight1;
        if (y >= 0 && y <= canvas.height) {
          if (!hasValidPoints) {
            ctx.moveTo(x, y);
            hasValidPoints = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }

      if (hasValidPoints) {
        ctx.stroke();
      }
    }

    // Draw probability heatmap if enabled
    if (showProbabilities) {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let x = 0; x < canvas.width; x += 2) {
        for (let y = 0; y < canvas.height; y += 2) {
          const probability = calculateProbability(x, y);
          const intensity = Math.floor(probability * 255);

          const index = (y * canvas.width + x) * 4;
          data[index] = intensity; // Red
          data[index + 1] = 0; // Green
          data[index + 2] = 255 - intensity; // Blue
          data[index + 3] = 80; // Alpha
        }
      }

      ctx.putImageData(imageData, 0, 0);
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

  const drawSigmoidCanvas = () => {
    const canvas = sigmoidCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas(ctx, canvas);

    // Draw axes
    ctx.strokeStyle = theme.palette.text.primary;
    ctx.lineWidth = 2;

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(50, 10);
    ctx.lineTo(50, canvas.height - 10);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(10, canvas.height / 2);
    ctx.lineTo(canvas.width - 10, canvas.height / 2);
    ctx.stroke();

    // Draw sigmoid curve
    ctx.strokeStyle = theme.palette.primary.main;
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let x = 0; x < canvas.width - 60; x++) {
      const z = (x - canvas.width / 2 + 30) / 30; // Scale to -6 to 6
      const y = activationFunctions.sigmoid(z);
      const canvasY = canvas.height - 10 - y * (canvas.height - 20);

      if (x === 0) {
        ctx.moveTo(x + 50, canvasY);
      } else {
        ctx.lineTo(x + 50, canvasY);
      }
    }
    ctx.stroke();

    // Add labels
    ctx.fillStyle = theme.palette.text.primary;
    ctx.font = '14px Arial';
    ctx.fillText('1.0', 15, 25);
    ctx.fillText('0.5', 15, canvas.height / 2 + 5);
    ctx.fillText('0.0', 15, canvas.height - 10);
    ctx.fillText('Sigmoid Function', canvas.width / 2 - 50, canvas.height - 10);
  };

  useEffect(() => {
    drawMainCanvas();
    drawSigmoidCanvas();
  }, [dataset, weights, bias, showProbabilities, theme]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Understand how logistic regression uses the sigmoid function
      </Typography>

      {/* Dataset Selection */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Dataset</InputLabel>
          <Select
            value={selectedDatasetType}
            onChange={(e) => generateNewDataset(e.target.value)}
            MenuProps={{
              disableScrollLock: true,
            }}
          >
            {availableDatasets.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          size="small"
          onClick={() => generateNewDataset(selectedDatasetType)}
          disabled={isTraining}
        >
          Generate New Dataset
        </Button>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', gap: 2, minHeight: 0 }}>
        {/* Main visualization area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 0,
            }}
          >
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              style={{
                border: `2px solid ${theme.palette.glass.border}`,
                borderRadius: '8px',
                background:
                  theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>

          {/* Action buttons */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ py: 1 }}
          >
            <Button
              variant="contained"
              onClick={trainModel}
              disabled={isTraining}
            >
              {isTraining ? 'Training...' : 'Train Model'}
            </Button>
            {isTraining && (
              <Button variant="outlined" onClick={stopTraining} color="warning">
                Stop Training
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={resetModel}
              disabled={isTraining}
            >
              Reset
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowProbabilities(!showProbabilities)}
            >
              {showProbabilities ? 'Hide' : 'Show'} Probabilities
            </Button>
          </Stack>
        </Box>

        {/* Sidebar with controls and sigmoid visualization */}
        <Box
          sx={{ width: 350, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {/* Sigmoid Function Visualization */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sigmoid Function
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <canvas
                  ref={sigmoidCanvasRef}
                  width={300}
                  height={200}
                  style={{
                    border: `2px solid ${theme.palette.glass.border}`,
                    borderRadius: '8px',
                    background:
                      theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
                  }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Training Controls */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Training Controls
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Epochs: {maxEpochs}</Typography>
                <Slider
                  value={maxEpochs}
                  onChange={(_, value) => setMaxEpochs(value as number)}
                  min={100}
                  max={10000}
                  step={100}
                  marks={[
                    { value: 100, label: '100' },
                    { value: 1000, label: '1K' },
                    { value: 5000, label: '5K' },
                    { value: 10000, label: '10K' },
                  ]}
                  disabled={isTraining}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>
                  Learning Rate: {learningRate}
                </Typography>
                <Slider
                  value={learningRate}
                  onChange={(_, value) => setLearningRate(value as number)}
                  min={0.001}
                  max={1}
                  step={0.001}
                  marks={[
                    { value: 0.001, label: '0.001' },
                    { value: 0.1, label: '0.1' },
                    { value: 0.5, label: '0.5' },
                    { value: 1, label: '1.0' },
                  ]}
                  disabled={isTraining}
                />
              </Box>

              {isTraining && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Training Progress: {trainingProgress.toFixed(1)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={trainingProgress}
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Training Progress */}
          {epoch > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Training Progress
                </Typography>
                <Stack spacing={1}>
                  <Chip
                    label={`Epoch: ${epoch}`}
                    color="primary"
                    size="small"
                  />
                  <Chip
                    label={`Loss: ${loss.toFixed(4)}`}
                    color="secondary"
                    size="small"
                  />
                  <Chip
                    label={`Weight 1: ${weights[0].toFixed(3)}`}
                    color="info"
                    size="small"
                  />
                  <Chip
                    label={`Weight 2: ${weights[1].toFixed(3)}`}
                    color="info"
                    size="small"
                  />
                  <Chip
                    label={`Bias: ${bias.toFixed(3)}`}
                    color="info"
                    size="small"
                  />
                </Stack>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
}
