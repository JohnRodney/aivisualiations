import React, { useState } from 'react';
import { Box, Typography, Button, Stack, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ManimalVideo } from '../apps/org/app/components/lessons/ManimalVideo';

// Example: Enhanced Linear Regression Lesson with Manim Integration
export function EnhancedLinearRegressionLesson() {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [videoWatched, setVideoWatched] = useState<Record<string, boolean>>({});

  const lessonSteps = [
    {
      id: 'concept-intro',
      title: 'What is Linear Regression?',
      type: 'video',
      content: {
        sceneName: 'LinearRegressionVisualization',
        title: 'Linear Regression Fundamentals',
        description:
          'Watch this beautiful animation to understand the core concept',
      },
    },
    {
      id: 'interactive-practice',
      title: 'Try It Yourself',
      type: 'interactive',
      content: {
        component: 'WhatIsLineCanvas', // Your existing interactive component
        description: 'Now practice drawing lines through data points',
      },
    },
    {
      id: 'gradient-descent',
      title: 'How Machines Learn',
      type: 'video',
      content: {
        sceneName: 'GradientDescentIntro',
        title: 'Gradient Descent Algorithm',
        description: 'See how algorithms automatically find the best line',
      },
    },
    {
      id: 'advanced-practice',
      title: 'Advanced Practice',
      type: 'interactive',
      content: {
        component: 'BestFitCanvas', // Your existing interactive component
        description: 'Challenge yourself with more complex datasets',
      },
    },
  ];

  const currentStepData = lessonSteps[currentStep];

  const handleVideoEnd = (stepId: string) => {
    setVideoWatched((prev) => ({ ...prev, [stepId]: true }));
  };

  const canProceed = () => {
    const step = lessonSteps[currentStep];
    if (step.type === 'video') {
      return videoWatched[step.id];
    }
    return true; // Interactive components handle their own completion
  };

  const handleNext = () => {
    if (currentStep < lessonSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {/* Progress Indicator */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Enhanced Linear Regression Course
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Step {currentStep + 1} of {lessonSteps.length}:{' '}
          {currentStepData.title}
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ mb: 4 }}>
        {currentStepData.type === 'video' && (
          <ManimalVideo
            topic="linear_regression"
            sceneName={currentStepData.content.sceneName}
            title={currentStepData.content.title}
            description={currentStepData.content.description}
            onVideoEnd={() => handleVideoEnd(currentStepData.id)}
            onVideoStart={() =>
              console.log(`Started video: ${currentStepData.id}`)
            }
          />
        )}

        {currentStepData.type === 'interactive' && (
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              background: theme.palette.glass.card,
              border: `1px solid ${theme.palette.glass.border}`,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Interactive Component: {currentStepData.content.component}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {currentStepData.content.description}
            </Typography>

            {/* This is where you'd render your existing Canvas component */}
            <Box
              sx={{
                height: 400,
                background: 'rgba(0, 0, 0, 0.1)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color="text.secondary">
                [{currentStepData.content.component} would render here]
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Navigation */}
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!canProceed() || currentStep === lessonSteps.length - 1}
          sx={{
            background: theme.palette.gradients.primary,
            '&:hover': {
              background: theme.palette.gradients.primaryHover,
            },
          }}
        >
          {currentStep === lessonSteps.length - 1 ? 'Complete' : 'Next'}
        </Button>
      </Stack>

      {/* Completion Status */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          background: theme.palette.glass.secondary,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Progress: {Object.keys(videoWatched).length} videos watched
        </Typography>
        {!canProceed() && currentStepData.type === 'video' && (
          <Typography variant="body2" color="warning.main">
            ⏱️ Please watch the video to continue
          </Typography>
        )}
      </Box>
    </Box>
  );
}

// Example: Integration with existing lesson structure
export function IntegratedLessonExample() {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" gutterBottom>
        🎯 Integration Pattern
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="primary">
          1. Video Introduction
        </Typography>
        <ManimalVideo
          topic="linear_regression"
          sceneName="LinearRegressionVisualization"
          title="Linear Regression Basics"
          description="Beautiful animated introduction to the concept"
          showControls={true}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="primary">
          2. Interactive Practice
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Your existing Canvas components would render here, enhanced with the
          knowledge from the video above.
        </Typography>
        {/* Your existing interactive components */}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="primary">
          3. Deep Dive Video
        </Typography>
        <ManimalVideo
          topic="linear_regression"
          sceneName="GradientDescentIntro"
          title="How Gradient Descent Works"
          description="Advanced concepts with beautiful mathematical animations"
          showControls={true}
        />
      </Box>
    </Box>
  );
}
