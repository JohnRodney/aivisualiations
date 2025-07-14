import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { activationFunctions, ActivationFunction } from './nn-utils';

interface ActivationCanvasProps {
  onInteraction?: (data: any) => void;
}

export function ActivationCanvas({ onInteraction }: ActivationCanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedFunction, setSelectedFunction] =
    useState<ActivationFunction>('relu');

  const activationFunctionOptions: {
    label: string;
    value: ActivationFunction;
    description: string;
  }[] = [
    {
      label: 'ReLU',
      value: 'relu',
      description: 'Rectified Linear Unit - outputs 0 for negative inputs',
    },
    {
      label: 'Sigmoid',
      value: 'sigmoid',
      description: 'Squashes values between 0 and 1',
    },
    {
      label: 'Tanh',
      value: 'tanh',
      description: 'Squashes values between -1 and 1',
    },
    {
      label: 'Linear',
      value: 'linear',
      description: 'No transformation - outputs input directly',
    },
  ];

  const drawActivationFunction = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle =
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = theme.palette.text.secondary;
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Draw function curve
    ctx.strokeStyle = theme.palette.primary.main;
    ctx.lineWidth = 3;
    ctx.beginPath();

    const activationFn = activationFunctions[selectedFunction];
    const scale = 80;
    let isFirstPoint = true;

    for (let x = 0; x < width; x += 2) {
      const inputValue = (x - centerX) / scale;
      const outputValue = activationFn(inputValue);
      const y = centerY - outputValue * scale;

      if (isFirstPoint) {
        ctx.moveTo(x, y);
        isFirstPoint = false;
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Draw labels
    ctx.fillStyle = theme.palette.text.primary;
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Input', centerX, height - 10);

    ctx.save();
    ctx.translate(15, centerY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Output', 0, 0);
    ctx.restore();
  };

  useEffect(() => {
    drawActivationFunction();
  }, [selectedFunction, theme]);

  const handleFunctionChange = (func: ActivationFunction) => {
    setSelectedFunction(func);
    onInteraction?.({
      selectedFunction: func,
      functionType: 'activation',
    });
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 2, color: 'text.primary', textAlign: 'center' }}
      >
        Explore Different Activation Functions
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
                Activation Functions
              </Typography>

              <Stack spacing={1}>
                {activationFunctionOptions.map((func) => (
                  <Button
                    key={func.value}
                    variant={
                      selectedFunction === func.value ? 'contained' : 'outlined'
                    }
                    onClick={() => handleFunctionChange(func.value)}
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
                        {func.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ display: 'block', opacity: 0.7 }}
                      >
                        {func.description}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}
      >
        💡 Different activation functions have different properties. ReLU is
        fast but can "die", Sigmoid squashes values, and Tanh is centered around
        zero.
      </Typography>
    </Box>
  );
}
