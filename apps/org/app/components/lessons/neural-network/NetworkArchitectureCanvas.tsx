import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Slider,
  Paper,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { createNetwork, drawNetwork, NetworkArchitecture } from './nn-utils';
import { ManimalVideo } from '../ManimalVideo';

interface NetworkArchitectureCanvasProps {
  onInteraction?: (data: any) => void;
}

export function NetworkArchitectureCanvas({
  onInteraction,
}: NetworkArchitectureCanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [network, setNetwork] = useState<NetworkArchitecture>(() =>
    createNetwork(3, [4, 3], 2)
  );
  const [inputSize, setInputSize] = useState(3);
  const [hiddenLayers, setHiddenLayers] = useState([4, 3]);
  const [outputSize, setOutputSize] = useState(2);

  const updateNetwork = () => {
    const newNetwork = createNetwork(inputSize, hiddenLayers, outputSize);
    setNetwork(newNetwork);

    onInteraction?.({
      inputSize,
      hiddenLayers,
      outputSize,
      totalConnections: newNetwork.connections.length,
      totalNeurons: newNetwork.layers.reduce(
        (sum, layer) => sum + layer.neurons.length,
        0
      ),
    });
  };

  const addHiddenLayer = () => {
    if (hiddenLayers.length < 4) {
      setHiddenLayers([...hiddenLayers, 3]);
    }
  };

  const removeHiddenLayer = () => {
    if (hiddenLayers.length > 0) {
      setHiddenLayers(hiddenLayers.slice(0, -1));
    }
  };

  const updateHiddenLayerSize = (index: number, size: number) => {
    const newHiddenLayers = [...hiddenLayers];
    newHiddenLayers[index] = size;
    setHiddenLayers(newHiddenLayers);
  };

  const presetConfigurations = [
    { name: 'Simple', input: 2, hidden: [3], output: 1 },
    { name: 'Classic', input: 3, hidden: [4, 3], output: 2 },
    { name: 'Deep', input: 4, hidden: [8, 6, 4], output: 3 },
    { name: 'Wide', input: 2, hidden: [10], output: 1 },
  ];

  const loadPreset = (preset: (typeof presetConfigurations)[0]) => {
    setInputSize(preset.input);
    setHiddenLayers(preset.hidden);
    setOutputSize(preset.output);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawNetwork(ctx, network, canvas);
  };

  useEffect(() => {
    updateNetwork();
  }, [inputSize, hiddenLayers, outputSize]);

  useEffect(() => {
    drawCanvas();
  }, [network, theme]);

  const totalNeurons = network.layers.reduce(
    (sum, layer) => sum + layer.neurons.length,
    0
  );
  const totalConnections = network.connections.length;

  return (
    <Box>
      {/* Video Introduction */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          color="primary"
          sx={{ textAlign: 'center' }}
        >
          🎬 Neural Network Architecture Introduction
        </Typography>
        <ManimalVideo
          topic="neural_network"
          sceneName="NetworkArchitectureIntro"
          title="Neural Network Architecture"
          description="Discover how neural networks are structured and learn the building blocks of AI"
          onVideoEnd={() =>
            onInteraction?.({
              action: 'video_completed',
              video: 'NetworkArchitectureIntro',
              timestamp: new Date().toISOString(),
            })
          }
          onVideoStart={() =>
            onInteraction?.({
              action: 'video_started',
              video: 'NetworkArchitectureIntro',
            })
          }
          showControls={true}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography
        variant="h6"
        sx={{ mb: 3, color: 'text.primary', textAlign: 'center' }}
      >
        Now Practice! Build your own neural network architecture
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

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 2, justifyContent: 'center' }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Total Neurons: <strong>{totalNeurons}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Total Connections: <strong>{totalConnections}</strong>
            </Typography>
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
                Network Configuration
              </Typography>

              {/* Preset Configurations */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: 'text.secondary' }}
                >
                  Quick Presets
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ flexWrap: 'wrap', gap: 1 }}
                >
                  {presetConfigurations.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outlined"
                      size="small"
                      onClick={() => loadPreset(preset)}
                      sx={{
                        minWidth: 'auto',
                        fontSize: '0.75rem',
                        borderColor: theme.palette.glass.border,
                      }}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </Stack>
              </Box>

              {/* Input Layer */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: 'text.secondary' }}
                >
                  Input Layer
                </Typography>
                <Slider
                  value={inputSize}
                  onChange={(_, value) => setInputSize(value as number)}
                  min={1}
                  max={8}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {inputSize} input neurons
                </Typography>
              </Box>

              {/* Hidden Layers */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: 'text.secondary' }}
                >
                  Hidden Layers
                </Typography>

                {hiddenLayers.map((size, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      Hidden Layer {index + 1}
                    </Typography>
                    <Slider
                      value={size}
                      onChange={(_, value) =>
                        updateHiddenLayerSize(index, value as number)
                      }
                      min={1}
                      max={10}
                      step={1}
                      marks
                      valueLabelDisplay="auto"
                      sx={{ mb: 1 }}
                    />
                  </Box>
                ))}

                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={addHiddenLayer}
                    disabled={hiddenLayers.length >= 4}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Add Layer
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={removeHiddenLayer}
                    disabled={hiddenLayers.length === 0}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Remove Layer
                  </Button>
                </Stack>
              </Box>

              {/* Output Layer */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: 'text.secondary' }}
                >
                  Output Layer
                </Typography>
                <Slider
                  value={outputSize}
                  onChange={(_, value) => setOutputSize(value as number)}
                  min={1}
                  max={5}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {outputSize} output neurons
                </Typography>
              </Box>

              {/* Network Stats */}
              <Paper
                sx={{
                  p: 2,
                  background: theme.palette.glass.secondary,
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: 'text.primary' }}
                >
                  Network Complexity
                </Typography>
                <Stack spacing={1}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      Layers:
                    </Typography>
                    <Chip
                      label={hiddenLayers.length + 2}
                      size="small"
                      color="info"
                    />
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      Parameters:
                    </Typography>
                    <Chip
                      label={totalConnections + totalNeurons}
                      size="small"
                      color="primary"
                    />
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      Complexity:
                    </Typography>
                    <Chip
                      label={
                        totalNeurons < 10
                          ? 'Simple'
                          : totalNeurons < 20
                          ? 'Medium'
                          : 'Complex'
                      }
                      size="small"
                      color={
                        totalNeurons < 10
                          ? 'success'
                          : totalNeurons < 20
                          ? 'warning'
                          : 'error'
                      }
                    />
                  </Box>
                </Stack>
              </Paper>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}
      >
        💡 Experiment with different architectures! More layers can learn
        complex patterns, but also increase training time and require more data.
      </Typography>
    </Box>
  );
}
