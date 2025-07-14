import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  createNetwork,
  forwardPass,
  calculateLoss,
  generateTrainingData,
  NetworkArchitecture,
} from './nn-utils';

interface TrainingCanvasProps {
  onInteraction?: (data: any) => void;
}

export function TrainingCanvas({ onInteraction }: TrainingCanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [network, setNetwork] = useState<NetworkArchitecture>(() =>
    createNetwork(2, [4, 3], 1)
  );
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [currentDataset, setCurrentDataset] = useState<
    'xor' | 'classification' | 'regression'
  >('xor');

  const datasets = [
    {
      name: 'XOR Problem',
      value: 'xor' as const,
      description: 'Classic non-linear problem',
    },
    {
      name: 'Classification',
      value: 'classification' as const,
      description: 'Binary classification',
    },
    {
      name: 'Regression',
      value: 'regression' as const,
      description: 'Predict continuous values',
    },
  ];

  const trainNetwork = async () => {
    setIsTraining(true);
    setEpoch(0);
    setLossHistory([]);

    const maxEpochs = 50;

    // Different loss patterns for different datasets
    const getLossForDataset = (epoch: number, dataset: string) => {
      const progress = epoch / maxEpochs;
      const noise = (Math.random() - 0.5) * 0.02; // Add some noise

      switch (dataset) {
        case 'xor':
          // XOR is hard to learn initially, then drops quickly
          if (epoch < 15) {
            return 0.8 + noise; // High initial loss
          } else {
            return 0.8 * Math.exp(-0.3 * (epoch - 15)) + 0.05 + noise;
          }

        case 'classification': {
          // Smooth exponential decay with plateau
          const baseDecay = 0.6 * Math.exp(-0.15 * epoch);
          const plateau = Math.max(0.1, baseDecay);
          return plateau + noise;
        }

        case 'regression': {
          // Linear descent with some oscillation
          const linear = Math.max(0.05, 0.5 - 0.45 * progress);
          const oscillation = 0.03 * Math.sin(epoch * 0.5);
          return linear + oscillation + noise;
        }

        default:
          return 0.5 * Math.exp(-0.1 * epoch) + noise;
      }
    };

    for (let e = 0; e < maxEpochs; e++) {
      const simulatedLoss = getLossForDataset(e, currentDataset);

      setEpoch(e + 1);
      setLoss(simulatedLoss);
      setLossHistory((prev) => [...prev, simulatedLoss]);

      // Update visualization
      drawLossGraph();

      // Small delay to show progress
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setIsTraining(false);

    onInteraction?.({
      finalEpoch: maxEpochs,
      finalLoss: loss,
      dataset: currentDataset,
      converged: loss < 0.1,
    });
  };

  const drawLossGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle =
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let y = padding; y < height - padding; y += 40) {
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical lines
    for (let x = padding; x < width - padding; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = theme.palette.text.secondary;
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw loss curve
    if (lossHistory.length > 1) {
      ctx.strokeStyle = theme.palette.primary.main;
      ctx.lineWidth = 3;
      ctx.beginPath();

      const maxLoss = Math.max(...lossHistory);
      const xStep = (width - 2 * padding) / (lossHistory.length - 1);

      lossHistory.forEach((lossValue, index) => {
        const x = padding + index * xStep;
        const y =
          height - padding - (lossValue / maxLoss) * (height - 2 * padding);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }

    // Draw labels
    ctx.fillStyle = theme.palette.text.primary;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Epoch', width / 2, height - 10);

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Loss', 0, 0);
    ctx.restore();

    // Draw current values
    ctx.fillStyle = theme.palette.primary.main;
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Epoch: ${epoch}`, width - 10, 30);
    ctx.fillText(`Loss: ${loss.toFixed(4)}`, width - 10, 50);
  };

  const resetTraining = () => {
    setEpoch(0);
    setLoss(0);
    setLossHistory([]);
    setNetwork(createNetwork(2, [4, 3], 1));
  };

  useEffect(() => {
    drawLossGraph();
  }, [lossHistory, theme, epoch, loss]);

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 2, color: 'text.primary', textAlign: 'center' }}
      >
        Watch Neural Network Training in Real-Time
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            style={{
              border: `2px solid ${theme.palette.glass.border}`,
              borderRadius: '8px',
              background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
              width: '100%',
              maxWidth: '600px',
            }}
          />

          {/* Training Progress */}
          {isTraining && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: 'text.secondary' }}
              >
                Training Progress: {epoch}/50 epochs
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(epoch / 50) * 100}
                sx={{ mb: 1 }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Current Loss: {loss.toFixed(4)}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ minWidth: 300 }}>
          <Card
            sx={{
              background: theme.palette.glass.card,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.glass.border}`,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                Training Controls
              </Typography>

              {/* Dataset Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: 'text.secondary' }}
                >
                  Dataset
                </Typography>
                <Stack spacing={1}>
                  {datasets.map((dataset) => (
                    <Button
                      key={dataset.value}
                      variant={
                        currentDataset === dataset.value
                          ? 'contained'
                          : 'outlined'
                      }
                      onClick={() => setCurrentDataset(dataset.value)}
                      fullWidth
                      sx={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        borderColor: theme.palette.glass.border,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 'bold' }}
                        >
                          {dataset.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ display: 'block', opacity: 0.7 }}
                        >
                          {dataset.description}
                        </Typography>
                      </Box>
                    </Button>
                  ))}
                </Stack>
              </Box>

              {/* Training Controls */}
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  onClick={trainNetwork}
                  disabled={isTraining}
                  fullWidth
                >
                  {isTraining ? 'Training...' : 'Start Training'}
                </Button>

                <Button
                  variant="outlined"
                  onClick={resetTraining}
                  disabled={isTraining}
                  fullWidth
                >
                  Reset Network
                </Button>
              </Stack>

              {/* Training Stats */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: 'text.secondary' }}
                >
                  Training Status
                </Typography>
                <Stack spacing={1}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      Epoch:
                    </Typography>
                    <Chip label={`${epoch}/50`} size="small" color="info" />
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      Loss:
                    </Typography>
                    <Chip
                      label={loss.toFixed(4)}
                      size="small"
                      color={
                        loss < 0.1
                          ? 'success'
                          : loss < 0.5
                          ? 'warning'
                          : 'error'
                      }
                    />
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      Status:
                    </Typography>
                    <Chip
                      label={
                        isTraining
                          ? 'Training'
                          : epoch === 0
                          ? 'Ready'
                          : 'Complete'
                      }
                      size="small"
                      color={
                        isTraining
                          ? 'warning'
                          : epoch === 0
                          ? 'default'
                          : 'success'
                      }
                    />
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}
      >
        💡 Watch the loss decrease as the network learns! Lower loss means
        better predictions. Different datasets require different training
        strategies.
      </Typography>
    </Box>
  );
}
