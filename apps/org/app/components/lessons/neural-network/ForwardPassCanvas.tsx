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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  createNetwork,
  drawNetwork,
  forwardPass,
  NetworkArchitecture,
  ActivationFunction,
} from './nn-utils';

interface ForwardPassCanvasProps {
  onInteraction?: (data: any) => void;
}

export function ForwardPassCanvas({ onInteraction }: ForwardPassCanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [network, setNetwork] = useState<NetworkArchitecture>(() =>
    createNetwork(3, [4, 3], 2)
  );
  const [inputValues, setInputValues] = useState([0.5, 0.3, 0.8]);
  const [activationFunction, setActivationFunction] =
    useState<ActivationFunction>('relu');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(0);

  const activationFunctions: { label: string; value: ActivationFunction }[] = [
    { label: 'ReLU', value: 'relu' },
    { label: 'Sigmoid', value: 'sigmoid' },
    { label: 'Tanh', value: 'tanh' },
    { label: 'Linear', value: 'linear' },
  ];

  const runForwardPass = () => {
    // Reset network state
    network.layers.forEach((layer) => {
      layer.neurons.forEach((neuron) => {
        neuron.isActive = false;
      });
    });
    network.connections.forEach((conn) => {
      conn.isActive = false;
    });

    // Run forward pass
    const output = forwardPass(network, inputValues, activationFunction);

    onInteraction?.({
      inputValues,
      output,
      activationFunction,
      totalLayers: network.layers.length,
    });

    // Animate the forward pass
    animateForwardPass();
  };

  const animateForwardPass = () => {
    setIsAnimating(true);
    setCurrentLayer(0);

    const animateLayer = (layerIndex: number) => {
      if (layerIndex >= network.layers.length) {
        setIsAnimating(false);
        return;
      }

      // Activate current layer
      network.layers[layerIndex].neurons.forEach((neuron) => {
        neuron.isActive = true;
      });

      // Activate connections from current layer to next
      if (layerIndex < network.layers.length - 1) {
        network.connections.forEach((conn) => {
          const fromNeuron = network.layers[layerIndex].neurons.find(
            (n) => n.id === conn.fromNeuron
          );
          if (fromNeuron) {
            conn.isActive = true;
          }
        });
      }

      setCurrentLayer(layerIndex);

      // Move to next layer after delay
      setTimeout(() => {
        animateLayer(layerIndex + 1);
      }, 800);
    };

    animateLayer(0);
  };

  const updateInputValue = (index: number, value: number) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const resetNetwork = () => {
    network.layers.forEach((layer) => {
      layer.neurons.forEach((neuron) => {
        neuron.isActive = false;
      });
    });
    network.connections.forEach((conn) => {
      conn.isActive = false;
    });
    setCurrentLayer(0);
    setIsAnimating(false);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawNetwork(ctx, network, canvas);
  };

  useEffect(() => {
    drawCanvas();
  }, [network, theme, currentLayer]);

  const getLayerStatusColor = (layerIndex: number) => {
    if (layerIndex < currentLayer) return 'success';
    if (layerIndex === currentLayer) return 'warning';
    return 'default';
  };

  const outputValues =
    network.layers[network.layers.length - 1]?.neurons.map(
      (n) => n.activation
    ) || [];

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 2, color: 'text.primary', textAlign: 'center' }}
      >
        Watch Data Flow Through the Network
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

          {/* Layer Status Indicators */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 2, justifyContent: 'center' }}
          >
            {network.layers.map((layer, index) => (
              <Chip
                key={layer.id}
                label={
                  layer.type === 'input'
                    ? 'Input'
                    : layer.type === 'output'
                    ? 'Output'
                    : `Hidden ${index}`
                }
                size="small"
                color={getLayerStatusColor(index)}
                variant={index === currentLayer ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
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
                Forward Pass Controls
              </Typography>

              {/* Input Values */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: 'text.secondary' }}
                >
                  Input Values
                </Typography>
                {inputValues.map((value, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      Input {index + 1}: {value.toFixed(2)}
                    </Typography>
                    <Slider
                      value={value}
                      onChange={(_, newValue) =>
                        updateInputValue(index, newValue as number)
                      }
                      min={0}
                      max={1}
                      step={0.1}
                      valueLabelDisplay="auto"
                      sx={{ mb: 1 }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Activation Function */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: 'text.secondary' }}
                >
                  Activation Function
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ flexWrap: 'wrap', gap: 1 }}
                >
                  {activationFunctions.map((func) => (
                    <Button
                      key={func.value}
                      variant={
                        activationFunction === func.value
                          ? 'contained'
                          : 'outlined'
                      }
                      size="small"
                      onClick={() => setActivationFunction(func.value)}
                      sx={{
                        minWidth: 'auto',
                        fontSize: '0.75rem',
                        borderColor: theme.palette.glass.border,
                      }}
                    >
                      {func.label}
                    </Button>
                  ))}
                </Stack>
              </Box>

              {/* Controls */}
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  onClick={runForwardPass}
                  disabled={isAnimating}
                  fullWidth
                >
                  {isAnimating ? 'Running...' : 'Run Forward Pass'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={resetNetwork}
                  disabled={isAnimating}
                  fullWidth
                >
                  Reset Network
                </Button>
              </Stack>

              {/* Output Values */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: 'text.secondary' }}
                >
                  Output Values
                </Typography>
                {outputValues.map((value, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      Output {index + 1}:
                    </Typography>
                    <Chip
                      label={value.toFixed(3)}
                      size="small"
                      color="primary"
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}
      >
        💡 Watch how different input values and activation functions affect the
        network's output. The connections light up as data flows through each
        layer!
      </Typography>
    </Box>
  );
}
