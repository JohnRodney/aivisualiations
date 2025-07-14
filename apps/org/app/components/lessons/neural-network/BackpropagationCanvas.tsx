import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface BackpropagationCanvasProps {
  onInteraction?: (data: any) => void;
}

export function BackpropagationCanvas({
  onInteraction,
}: BackpropagationCanvasProps) {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Forward Pass',
      description:
        'Data flows forward through the network to produce a prediction',
      details: 'Input → Hidden Layer → Output Layer → Prediction',
    },
    {
      title: 'Calculate Error',
      description:
        'Compare the prediction with the actual target to calculate the error',
      details: 'Error = Target - Prediction',
    },
    {
      title: 'Backward Pass',
      description: 'Error propagates backward through the network',
      details: 'Output Layer ← Hidden Layer ← Input Layer',
    },
    {
      title: 'Update Weights',
      description: 'Adjust weights based on their contribution to the error',
      details: 'Weight = Weight - Learning Rate × Gradient',
    },
  ];

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    onInteraction?.({
      currentStep: step,
      stepName: steps[step].title,
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      handleStepChange(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
  };

  const resetSteps = () => {
    handleStepChange(0);
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 2, color: 'text.primary', textAlign: 'center' }}
      >
        Understanding Backpropagation
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 2,
              background: theme.palette.glass.card,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.glass.border}`,
              minHeight: 400,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{ mb: 2, color: 'text.primary', textAlign: 'center' }}
            >
              Step {currentStep + 1}: {steps[currentStep].title}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: 'text.secondary',
                textAlign: 'center',
                fontSize: '1.1rem',
              }}
            >
              {steps[currentStep].description}
            </Typography>

            <Paper
              sx={{
                p: 3,
                background: theme.palette.glass.secondary,
                borderRadius: 2,
                border: `1px solid ${theme.palette.glass.border}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'text.primary',
                  textAlign: 'center',
                  fontFamily: 'monospace',
                }}
              >
                {steps[currentStep].details}
              </Typography>
            </Paper>

            {/* Step Progress */}
            <Box sx={{ mt: 4, display: 'flex', gap: 1 }}>
              {steps.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor:
                      index <= currentStep
                        ? theme.palette.primary.main
                        : theme.palette.grey[300],
                    transition: 'background-color 0.3s',
                  }}
                />
              ))}
            </Box>
          </Paper>
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
                Learning Process
              </Typography>

              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  fullWidth
                >
                  Previous Step
                </Button>

                <Button
                  variant="contained"
                  onClick={nextStep}
                  disabled={currentStep === steps.length - 1}
                  fullWidth
                >
                  Next Step
                </Button>

                <Button variant="outlined" onClick={resetSteps} fullWidth>
                  Reset to Start
                </Button>
              </Stack>

              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: 'text.secondary' }}
                >
                  All Steps
                </Typography>
                <Stack spacing={1}>
                  {steps.map((step, index) => (
                    <Button
                      key={index}
                      variant={index === currentStep ? 'contained' : 'outlined'}
                      onClick={() => handleStepChange(index)}
                      size="small"
                      sx={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        borderColor: theme.palette.glass.border,
                        opacity: index <= currentStep ? 1 : 0.6,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 'bold' }}
                        >
                          {index + 1}. {step.title}
                        </Typography>
                      </Box>
                    </Button>
                  ))}
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
        💡 Backpropagation is how neural networks learn! The algorithm
        calculates how much each weight contributed to the error and adjusts
        them to reduce future errors.
      </Typography>
    </Box>
  );
}
