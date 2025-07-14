import React, { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LessonContainerProps } from './types';
import { LessonProgress } from './LessonProgress';
import { Lesson } from './Lesson';
import { LessonNavigation } from './LessonNavigation';

export function LessonContainer({
  lessons,
  title,
  description,
  onComplete,
}: LessonContainerProps) {
  const theme = useTheme();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(
    new Set()
  );

  const currentLesson = lessons[currentLessonIndex];
  const lessonTitles = lessons.map((lesson) => lesson.title);

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleNext = () => {
    setCompletedLessons((prev) => new Set(prev).add(currentLessonIndex));

    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handleComplete = () => {
    setCompletedLessons((prev) => new Set(prev).add(currentLessonIndex));
    onComplete?.();
  };

  const handleCanvasInteraction = (data: any) => {
    // Handle canvas interactions - could be used for completion criteria
    console.log('Canvas interaction:', data);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 6 }}>
        {/* Course Header */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: theme.palette.glass.primary,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.glass.border}`,
            boxShadow: theme.palette.glass.shadow.light,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 'bold',
              background: theme.palette.gradients.text,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              mb: 2,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h6"
            component="p"
            sx={{
              color: 'text.secondary',
              fontSize: '1.1rem',
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        </Box>

        {/* Progress Indicator */}
        <LessonProgress
          currentLesson={currentLessonIndex}
          totalLessons={lessons.length}
          lessonTitles={lessonTitles}
        />

        {/* Current Lesson */}
        <Lesson
          lesson={currentLesson}
          onCanvasInteraction={handleCanvasInteraction}
        />

        {/* Navigation */}
        <LessonNavigation
          currentLesson={currentLessonIndex}
          totalLessons={lessons.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onComplete={handleComplete}
          nextButtonText={currentLesson.nextButtonText}
        />
      </Box>
    </Container>
  );
}
