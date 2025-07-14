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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  generateClassificationDataset,
  calculateMetrics,
  trainSVM as trainSVMAlgorithm,
  predictSVM as predictSVMAlgorithm,
} from './index';
import { ClassificationPoint, ClassificationDataset, SVMParams } from './types';
import {
  drawGridlines,
  drawPoints,
  clearCanvas,
} from '../linear-regression/canvas-utils';

interface SVMCanvasProps {
  onInteraction?: (data: any) => void;
}

export function SVMCanvas({ onInteraction }: SVMCanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataset, setDataset] = useState<ClassificationDataset>(
    () => generateClassificationDataset('linearly_separable', 50, 600, 400) // Pass canvas dimensions
  );
  const [C, setC] = useState(1.0); // Regularization parameter
  const [kernel, setKernel] = useState<'linear' | 'rbf'>('linear');
  const [gamma, setGamma] = useState(0.1); // RBF kernel parameter
  const [trained, setTrained] = useState(false);
  const [svmParams, setSvmParams] = useState<SVMParams | null>(null);
  const [isTraining, setIsTraining] = useState(false);

  const generateNewDataset = (type: any) => {
    const newDataset = generateClassificationDataset(type, 50, 600, 400); // Pass canvas dimensions
    setDataset(newDataset);
    setTrained(false);
    setSvmParams(null);
  };

  const resetTraining = () => {
    setTrained(false);
    setSvmParams(null);
  };

  const trainSVMModel = async () => {
    setIsTraining(true);

    try {
      console.log(`Training SVM with kernel=${kernel}, C=${C}, gamma=${gamma}`);
      // Use the proper SVM training function
      const params = trainSVMAlgorithm(dataset.points, kernel, C, gamma);
      setSvmParams(params);
      setTrained(true);

      // Calculate metrics
      const predictedPoints = dataset.points.map((point) => {
        const prediction = predictSVMAlgorithm(
          point.x,
          point.y,
          params,
          dataset.points
        );
        return { ...point, predicted: prediction } as ClassificationPoint;
      });

      const metrics = calculateMetrics(predictedPoints);

      onInteraction?.({
        kernel,
        C,
        gamma: kernel === 'rbf' ? gamma : undefined,
        supportVectors: params.supportVectors.length,
        metrics,
        dataset: dataset.name,
      });
    } catch (error) {
      console.error('SVM training failed:', error);
    } finally {
      setIsTraining(false);
    }
  };

  const predictPoint = (x: number, y: number): 0 | 1 => {
    if (!svmParams) return 0;
    return predictSVMAlgorithm(x, y, svmParams, dataset.points);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas(ctx, canvas);
    drawGridlines(ctx, canvas, theme);

    // Draw decision boundary visualization
    if (trained && svmParams) {
      if (kernel === 'linear') {
        // Draw linear decision boundary
        ctx.strokeStyle = theme.palette.primary.main;
        ctx.lineWidth = 3;
        ctx.beginPath();

        // Calculate decision boundary using the learned weights
        const { weights, bias } = svmParams;
        console.log('SVM weights:', weights, 'bias:', bias); // Debug log

        if (weights && weights.length >= 2 && Math.abs(weights[1]) > 0.0001) {
          let hasValidPoints = false;

          for (let x = 0; x < canvas.width; x += 5) {
            // Calculate y from decision boundary equation: w1*x + w2*y + b = 0
            const y = -(weights[0] * x + bias) / weights[1];

            // Check if y is within canvas bounds
            if (y >= 0 && y <= canvas.height) {
              if (!hasValidPoints) {
                ctx.moveTo(x, y);
                hasValidPoints = true;
              } else {
                ctx.lineTo(x, y);
              }
            }
          }

          // If no valid points found, try drawing a more robust line
          if (!hasValidPoints) {
            console.log('No valid points found, trying alternative approach');

            // Find intersection points with canvas edges
            const intersections = [];

            // Left edge (x=0)
            const yLeft = -(weights[0] * 0 + bias) / weights[1];
            if (yLeft >= 0 && yLeft <= canvas.height) {
              intersections.push({ x: 0, y: yLeft });
            }

            // Right edge (x=canvas.width)
            const yRight = -(weights[0] * canvas.width + bias) / weights[1];
            if (yRight >= 0 && yRight <= canvas.height) {
              intersections.push({ x: canvas.width, y: yRight });
            }

            // Top edge (y=0)
            const xTop = -(weights[1] * 0 + bias) / weights[0];
            if (xTop >= 0 && xTop <= canvas.width) {
              intersections.push({ x: xTop, y: 0 });
            }

            // Bottom edge (y=canvas.height)
            const xBottom = -(weights[1] * canvas.height + bias) / weights[0];
            if (xBottom >= 0 && xBottom <= canvas.width) {
              intersections.push({ x: xBottom, y: canvas.height });
            }

            console.log('Intersections found:', intersections);

            // Draw line between first two intersection points
            if (intersections.length >= 2) {
              ctx.moveTo(intersections[0].x, intersections[0].y);
              ctx.lineTo(intersections[1].x, intersections[1].y);
            }
          }
        } else {
          console.log('Invalid weights or near-zero weights[1]:', weights);
        }
        ctx.stroke();
      } else {
        // Draw RBF decision boundary with better visibility
        console.log('Drawing RBF decision boundary...');

        // Debug: Test predictions at key points
        const debugPreds = [
          { x: 300, y: 200, pred: predictPoint(300, 200) }, // Center
          { x: 250, y: 200, pred: predictPoint(250, 200) }, // Left of center
          { x: 350, y: 200, pred: predictPoint(350, 200) }, // Right of center
          { x: 300, y: 150, pred: predictPoint(300, 150) }, // Top of center
          { x: 300, y: 250, pred: predictPoint(300, 250) }, // Bottom of center
        ];
        console.log('Debug predictions:', debugPreds);

        // Simple and reliable approach: Draw colored regions
        let class0Count = 0;
        let class1Count = 0;

        // Draw background regions in a coarse grid
        for (let x = 0; x < canvas.width; x += 12) {
          for (let y = 0; y < canvas.height; y += 12) {
            const prediction = predictPoint(x, y);

            if (prediction === 1) {
              ctx.fillStyle = 'rgba(0, 255, 0, 0.2)'; // Light green
              class1Count++;
            } else {
              ctx.fillStyle = 'rgba(255, 0, 0, 0.2)'; // Light red
              class0Count++;
            }
            ctx.fillRect(x, y, 12, 12);
          }
        }

        console.log(
          `Prediction counts: Class 0: ${class0Count}, Class 1: ${class1Count}`
        );

        // Draw boundary contour by looking for transitions
        ctx.fillStyle = theme.palette.warning.main; // Yellow boundary markers
        let boundaryPoints = 0;

        for (let x = 6; x < canvas.width - 6; x += 6) {
          for (let y = 6; y < canvas.height - 6; y += 6) {
            const center = predictPoint(x, y);
            const neighbors = [
              predictPoint(x - 6, y),
              predictPoint(x + 6, y),
              predictPoint(x, y - 6),
              predictPoint(x, y + 6),
            ];

            // If center differs from any neighbor, it's a boundary point
            if (neighbors.some((n) => n !== center)) {
              ctx.beginPath();
              ctx.arc(x, y, 2, 0, 2 * Math.PI);
              ctx.fill();
              boundaryPoints++;
            }
          }
        }

        console.log(`Drew ${boundaryPoints} boundary points`);
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

    // Highlight support vectors
    if (trained && svmParams && svmParams.supportVectors.length > 0) {
      const svIndices = svmParams.supportVectors;
      ctx.strokeStyle = theme.palette.warning.main;
      ctx.lineWidth = 3;
      svIndices.forEach((svIndex) => {
        if (svIndex < dataset.points.length) {
          const point = dataset.points[svIndex];
          ctx.beginPath();
          ctx.arc(point.x, point.y, 12, 0, 2 * Math.PI);
          ctx.stroke();
        }
      });
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [dataset, trained, svmParams, theme]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Learn how SVM finds the optimal decision boundary
      </Typography>

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
          onClick={trainSVMModel}
          disabled={isTraining}
          color={!trained ? 'primary' : 'secondary'}
        >
          {isTraining ? 'Training...' : !trained ? 'Train SVM' : 'Retrain SVM'}
        </Button>
        <Button
          variant="outlined"
          onClick={() => generateNewDataset('linearly_separable')}
        >
          New Dataset
        </Button>
      </Stack>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            SVM Parameters
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography gutterBottom>Kernel Type</Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={kernel}
                  onChange={(e) => {
                    setKernel(e.target.value as 'linear' | 'rbf');
                    resetTraining();
                  }}
                  disabled={isTraining}
                >
                  <MenuItem value="linear">Linear</MenuItem>
                  <MenuItem value="rbf">RBF</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography gutterBottom>C (Regularization): {C}</Typography>
              <Slider
                value={C}
                onChange={(_, value) => {
                  setC(value as number);
                  resetTraining();
                }}
                min={0.01}
                max={10}
                step={0.01}
                marks={[
                  { value: 0.01, label: '0.01' },
                  { value: 1, label: '1' },
                  { value: 10, label: '10' },
                ]}
                disabled={isTraining}
              />
            </Box>

            {kernel === 'rbf' && (
              <Box>
                <Typography gutterBottom>Gamma: {gamma}</Typography>
                <Slider
                  value={gamma}
                  onChange={(_, value) => {
                    setGamma(value as number);
                    resetTraining();
                  }}
                  min={0.01}
                  max={2}
                  step={0.01}
                  marks={[
                    { value: 0.01, label: '0.01' },
                    { value: 0.1, label: '0.1' },
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                  ]}
                  disabled={isTraining}
                />
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="outlined"
          onClick={() => generateNewDataset('linearly_separable')}
          disabled={isTraining}
        >
          Linear Separable
        </Button>
        <Button
          variant="outlined"
          onClick={() => generateNewDataset('xor')}
          disabled={isTraining}
        >
          XOR
        </Button>
        <Button
          variant="outlined"
          onClick={() => generateNewDataset('circles')}
          disabled={isTraining}
        >
          Circles
        </Button>
      </Stack>

      {trained && svmParams && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              SVM Results
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip
                label={`Support Vectors: ${svmParams.supportVectors.length}`}
                color="primary"
              />
              <Chip label={`Kernel: ${kernel}`} color="secondary" />
              <Chip label={`C: ${C}`} color="info" />
              {kernel === 'rbf' && (
                <Chip label={`Gamma: ${gamma}`} color="info" />
              )}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
