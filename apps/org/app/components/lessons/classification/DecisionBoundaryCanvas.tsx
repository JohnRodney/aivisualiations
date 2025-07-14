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
  Slider,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import {
  generateClassificationDataset,
  trainLogisticRegression,
  trainSVM,
  trainDecisionTree,
  createDecisionBoundary,
  createRBFBoundaryAsync,
  calculateMetrics,
  predictLogistic,
  predictSVM,
  predictDecisionTree,
  DATASET_CONFIGS,
  ALGORITHM_CONFIGS,
} from './index';
import { ClassificationPoint, ClassificationDataset } from './types';
import {
  drawGridlines,
  drawPoints,
  clearCanvas,
} from '../linear-regression/canvas-utils';

interface DecisionBoundaryCanvasProps {
  onInteraction?: (data: any) => void;
}

export function DecisionBoundaryCanvas({
  onInteraction,
}: DecisionBoundaryCanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataset, setDataset] = useState<ClassificationDataset>(
    () => generateClassificationDataset('linearly_separable', 60, 600, 400) // Pass canvas dimensions
  );
  const [selectedDatasetType, setSelectedDatasetType] =
    useState<string>('linearly_separable');
  const [algorithm, setAlgorithm] = useState<'logistic' | 'svm' | 'tree'>(
    'logistic'
  );
  const [showBoundary, setShowBoundary] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [userPoints, setUserPoints] = useState<ClassificationPoint[]>([]);
  const [trainedModel, setTrainedModel] = useState<any>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [isCalculatingBoundary, setIsCalculatingBoundary] = useState(false);
  const [boundaryProgress, setBoundaryProgress] = useState(0);
  const [asyncBoundaryPoints, setAsyncBoundaryPoints] = useState<
    { x: number; y: number }[]
  >([]);

  // Algorithm parameters
  const [logisticParams, setLogisticParams] = useState({
    epochs: 1000,
    learningRate: 0.1,
  });
  const [svmParams, setSvmParams] = useState({
    C: 1.0,
    gamma: 0.1,
  });
  const [treeParams, setTreeParams] = useState({
    maxDepth: 3,
  });

  // Get available datasets and algorithms from centralized config
  const availableDatasets = Object.values(DATASET_CONFIGS);
  const availableAlgorithms = Object.values(ALGORITHM_CONFIGS);

  const generateNewDataset = (type: any) => {
    const newDataset = generateClassificationDataset(type, 60, 600, 400); // Pass canvas dimensions
    setDataset(newDataset);
    setSelectedDatasetType(type);
    setShowBoundary(false);
    setMetrics(null);
    setUserPoints([]);
    setTrainedModel(null);
    setAsyncBoundaryPoints([]);
    setIsCalculatingBoundary(false);
    setBoundaryProgress(0);
  };

  // Reset parameters when algorithm changes
  const handleAlgorithmChange = (newAlgorithm: 'logistic' | 'svm' | 'tree') => {
    setAlgorithm(newAlgorithm);
    setShowBoundary(false);
    setMetrics(null);
    setTrainedModel(null);
    setAsyncBoundaryPoints([]);
    setIsCalculatingBoundary(false);
    setBoundaryProgress(0);

    // Reset to default parameters
    setLogisticParams({ epochs: 1000, learningRate: 0.1 });
    setSvmParams({ C: 1.0, gamma: 0.1 });
    setTreeParams({ maxDepth: 3 });
  };

  const trainAndVisualize = async () => {
    setIsTraining(true);

    try {
      const allPoints = [...dataset.points, ...userPoints];
      let model: any;

      // Get dataset config for algorithm selection
      const datasetConfig =
        DATASET_CONFIGS[selectedDatasetType as keyof typeof DATASET_CONFIGS];

      console.log(
        `Training ${algorithm} algorithm with ${allPoints.length} points`
      );

      // Train the selected algorithm
      switch (algorithm) {
        case 'logistic': {
          model = trainLogisticRegression(
            allPoints,
            logisticParams.epochs,
            logisticParams.learningRate
          );
          break;
        }
        case 'svm': {
          // Use RBF kernel for non-linear datasets
          const useRBF = datasetConfig?.difficultyLevel >= 2;
          const kernel = useRBF ? 'rbf' : 'linear';

          console.log(
            `Training SVM with kernel=${kernel}, C=${svmParams.C}, gamma=${svmParams.gamma}`
          );

          model = trainSVM(allPoints, kernel, svmParams.C, svmParams.gamma);

          console.log(
            `SVM training complete. Support vectors: ${
              model.supportVectors?.length || 'unknown'
            }`
          );
          break;
        }
        case 'tree': {
          model = trainDecisionTree(allPoints, 0, treeParams.maxDepth);
          break;
        }
      }

      // Safety check for model validity
      if (!model) {
        console.error('Training failed - model is undefined');
        return;
      }

      setTrainedModel(model);

      // Calculate predictions and metrics
      const pointsWithPredictions = allPoints.map((point) => {
        let predicted: 0 | 1;

        switch (algorithm) {
          case 'logistic':
            predicted = predictLogistic(point.x, point.y, model) > 0.5 ? 1 : 0;
            break;
          case 'svm':
            predicted = predictSVM(point.x, point.y, model, allPoints);
            break;
          case 'tree':
            predicted = predictDecisionTree(point.x, point.y, model);
            break;
          default:
            predicted = 0;
        }

        return { ...point, predicted };
      });

      const newMetrics = calculateMetrics(pointsWithPredictions);
      setMetrics(newMetrics);
      setShowBoundary(true);

      // Start async boundary calculation for RBF SVM
      if (algorithm === 'svm' && datasetConfig?.difficultyLevel >= 2) {
        startAsyncBoundaryCalculation(model, allPoints);
      }

      // Trigger callback
      onInteraction?.({
        algorithm: ALGORITHM_CONFIGS[algorithm],
        dataset: datasetConfig,
        metrics: newMetrics,
        model,
      });
    } catch (error) {
      console.error('Training failed:', error);
    } finally {
      setIsTraining(false);
    }
  };

  const startAsyncBoundaryCalculation = async (
    model: any,
    allPoints: ClassificationPoint[]
  ) => {
    setIsCalculatingBoundary(true);
    setBoundaryProgress(0);
    setAsyncBoundaryPoints([]);

    try {
      const boundaryPoints = await createRBFBoundaryAsync(
        model,
        allPoints,
        600,
        400,
        (progress, points) => {
          setBoundaryProgress(progress);
          setAsyncBoundaryPoints(points);
        }
      );

      setAsyncBoundaryPoints(boundaryPoints);
      setBoundaryProgress(1);
    } catch (error) {
      console.error('Async boundary calculation failed:', error);
    } finally {
      setIsCalculatingBoundary(false);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Add point with label based on click position (simple heuristic)
    const label = x > 300 ? 1 : 0;
    const newPoint: ClassificationPoint = { x, y, label: label as 0 | 1 };

    setUserPoints((prev) => [...prev, newPoint]);
    setShowBoundary(false);
    setMetrics(null);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas(ctx, canvas);
    drawGridlines(ctx, canvas, theme);

    // Draw decision boundary if trained
    if (showBoundary && trainedModel) {
      const allPoints = [...dataset.points, ...userPoints];
      let boundary;

      // Safety check for trained model
      if (!trainedModel) {
        console.warn('Trained model is undefined');
        return;
      }

      switch (algorithm) {
        case 'logistic':
          boundary = createDecisionBoundary(
            'logistic',
            trainedModel,
            allPoints,
            600,
            400
          );
          break;
        case 'svm':
          boundary = createDecisionBoundary(
            'svm',
            trainedModel,
            allPoints,
            600,
            400
          );
          break;
        case 'tree':
          boundary = createDecisionBoundary(
            'tree',
            trainedModel,
            allPoints,
            600,
            400
          );
          break;
      }

      let boundaryPoints = boundary?.points || [];

      // For async RBF boundaries, use the async points
      if (boundary?.async && algorithm === 'svm') {
        boundaryPoints = asyncBoundaryPoints;
      }

      // Draw boundary line
      if (boundaryPoints.length > 0) {
        console.log(
          `Drawing boundary with ${boundaryPoints.length} points for ${algorithm}`
        );

        ctx.strokeStyle = theme.palette.primary.main;
        ctx.lineWidth = 3;
        ctx.beginPath();

        let firstPoint = true;
        for (const point of boundaryPoints) {
          if (
            point.x >= 0 &&
            point.x <= canvas.width &&
            point.y >= 0 &&
            point.y <= canvas.height
          ) {
            if (firstPoint) {
              ctx.moveTo(point.x, point.y);
              firstPoint = false;
            } else {
              ctx.lineTo(point.x, point.y);
            }
          }
        }
        ctx.stroke();
      } else {
        console.warn(`No boundary points generated for ${algorithm}`);
      }
    }

    // Draw dataset points
    const class0Points = dataset.points
      .filter((p) => p.label === 0)
      .map((p) => ({ x: p.x, y: p.y }));
    const class1Points = dataset.points
      .filter((p) => p.label === 1)
      .map((p) => ({ x: p.x, y: p.y }));

    drawPoints(ctx, class0Points, theme.palette.error.main, 8);
    drawPoints(ctx, class1Points, theme.palette.success.main, 8);

    // Draw user-added points
    const userClass0 = userPoints
      .filter((p) => p.label === 0)
      .map((p) => ({ x: p.x, y: p.y }));
    const userClass1 = userPoints
      .filter((p) => p.label === 1)
      .map((p) => ({ x: p.x, y: p.y }));

    drawPoints(ctx, userClass0, theme.palette.error.light, 6);
    drawPoints(ctx, userClass1, theme.palette.success.light, 6);
  };

  const clearUserPoints = () => {
    setUserPoints([]);
    setShowBoundary(false);
    setMetrics(null);
    setAsyncBoundaryPoints([]);
    setIsCalculatingBoundary(false);
    setBoundaryProgress(0);
  };

  useEffect(() => {
    drawCanvas();
  }, [
    dataset,
    userPoints,
    showBoundary,
    algorithm,
    trainedModel,
    theme,
    asyncBoundaryPoints,
  ]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Explore how different algorithms create decision boundaries
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
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

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Algorithm</InputLabel>
          <Select
            value={algorithm}
            onChange={(e) => handleAlgorithmChange(e.target.value as any)}
            MenuProps={{
              disableScrollLock: true,
            }}
          >
            {availableAlgorithms.map((alg) => (
              <MenuItem key={alg.id} value={alg.id}>
                {alg.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Algorithm Parameters */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Algorithm Parameters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {algorithm === 'logistic' && (
            <Stack spacing={3}>
              <Box>
                <Typography gutterBottom>
                  Learning Rate: {logisticParams.learningRate}
                </Typography>
                <Slider
                  value={logisticParams.learningRate}
                  onChange={(_, value) =>
                    setLogisticParams((prev) => ({
                      ...prev,
                      learningRate: value as number,
                    }))
                  }
                  min={0.001}
                  max={1.0}
                  step={0.001}
                  valueLabelDisplay="auto"
                />
                <Typography variant="caption" color="text.secondary">
                  Higher values = faster learning but may overshoot optimal
                  solution
                </Typography>
              </Box>
              <Box>
                <Typography gutterBottom>
                  Epochs: {logisticParams.epochs}
                </Typography>
                <Slider
                  value={logisticParams.epochs}
                  onChange={(_, value) =>
                    setLogisticParams((prev) => ({
                      ...prev,
                      epochs: value as number,
                    }))
                  }
                  min={100}
                  max={5000}
                  step={100}
                  valueLabelDisplay="auto"
                />
                <Typography variant="caption" color="text.secondary">
                  More epochs = more training iterations, better convergence
                </Typography>
              </Box>
            </Stack>
          )}

          {algorithm === 'svm' && (
            <Stack spacing={3}>
              <Box>
                <Typography gutterBottom>
                  C (Regularization): {svmParams.C}
                </Typography>
                <Slider
                  value={svmParams.C}
                  onChange={(_, value) => {
                    setSvmParams((prev) => ({ ...prev, C: value as number }));
                    // Reset boundary when parameters change
                    if (showBoundary) {
                      setShowBoundary(false);
                      setMetrics(null);
                    }
                  }}
                  min={0.1}
                  max={10.0}
                  step={0.1}
                  valueLabelDisplay="auto"
                />
                <Typography variant="caption" color="text.secondary">
                  Higher C = less regularization, may overfit to training data
                </Typography>
              </Box>
              <Box>
                <Typography gutterBottom>
                  Gamma (RBF Kernel): {svmParams.gamma}
                </Typography>
                <Slider
                  value={svmParams.gamma}
                  onChange={(_, value) => {
                    setSvmParams((prev) => ({
                      ...prev,
                      gamma: value as number,
                    }));
                    // Reset boundary when parameters change
                    if (showBoundary) {
                      setShowBoundary(false);
                      setMetrics(null);
                    }
                  }}
                  min={0.01}
                  max={2.0}
                  step={0.01}
                  valueLabelDisplay="auto"
                />
                <Typography variant="caption" color="text.secondary">
                  Higher gamma = more complex boundaries, may overfit
                </Typography>
              </Box>
            </Stack>
          )}

          {algorithm === 'tree' && (
            <Stack spacing={3}>
              <Box>
                <Typography gutterBottom>
                  Max Depth: {treeParams.maxDepth}
                </Typography>
                <Slider
                  value={treeParams.maxDepth}
                  onChange={(_, value) =>
                    setTreeParams((prev) => ({
                      ...prev,
                      maxDepth: value as number,
                    }))
                  }
                  min={1}
                  max={10}
                  step={1}
                  valueLabelDisplay="auto"
                />
                <Typography variant="caption" color="text.secondary">
                  Deeper trees = more complex rules, may overfit
                </Typography>
              </Box>
            </Stack>
          )}
        </AccordionDetails>
      </Accordion>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onClick={handleCanvasClick}
          style={{
            border: `2px solid ${theme.palette.glass.border}`,
            borderRadius: '8px',
            cursor: 'crosshair',
            background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
          }}
        />
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          onClick={trainAndVisualize}
          disabled={isTraining || isCalculatingBoundary}
        >
          {isTraining ? 'Training...' : 'Train & Visualize'}
        </Button>
        <Button variant="outlined" onClick={clearUserPoints}>
          Clear Added Points
        </Button>
      </Stack>

      {isCalculatingBoundary && (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Calculating decision boundary...{' '}
            {Math.round(boundaryProgress * 100)}%
          </Typography>
          <Box
            sx={{
              width: '200px',
              height: '4px',
              backgroundColor: theme.palette.grey[300],
              borderRadius: '2px',
              mx: 'auto',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: `${boundaryProgress * 100}%`,
                height: '100%',
                backgroundColor: theme.palette.primary.main,
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
        </Box>
      )}

      {metrics && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip
                label={`Accuracy: ${(metrics.accuracy * 100).toFixed(1)}%`}
                color={metrics.accuracy > 0.8 ? 'success' : 'warning'}
              />
              <Chip
                label={`Precision: ${(metrics.precision * 100).toFixed(1)}%`}
                color="info"
              />
              <Chip
                label={`Recall: ${(metrics.recall * 100).toFixed(1)}%`}
                color="info"
              />
              <Chip
                label={`F1-Score: ${(metrics.f1Score * 100).toFixed(1)}%`}
                color="primary"
              />
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
