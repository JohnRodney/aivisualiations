import { Box, Button, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CheckCircle from '@mui/icons-material/CheckCircle';

interface LessonNavigationProps {
  currentLesson: number;
  totalLessons: number;
  onPrevious: () => void;
  onNext: () => void;
  onComplete?: () => void;
  nextButtonText?: string;
  canProceed?: boolean;
}

export function LessonNavigation({
  currentLesson,
  totalLessons,
  onPrevious,
  onNext,
  onComplete,
  nextButtonText = 'Next Lesson',
  canProceed = true,
}: LessonNavigationProps) {
  const theme = useTheme();
  const isFirstLesson = currentLesson === 0;
  const isLastLesson = currentLesson === totalLessons - 1;

  const handleNext = () => {
    if (isLastLesson && onComplete) {
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <Box
      sx={{
        mt: 4,
        p: 3,
        borderRadius: 3,
        background: theme.palette.glass.primary,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.glass.border}`,
      }}
    >
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onPrevious}
          disabled={isFirstLesson}
          sx={{
            minWidth: 120,
            borderColor: theme.palette.glass.border,
            color: 'text.primary',
            '&:hover': {
              borderColor: 'primary.main',
              background: theme.palette.glass.secondary,
            },
            '&:disabled': {
              opacity: 0.5,
            },
          }}
        >
          Previous
        </Button>

        <Button
          variant="contained"
          endIcon={isLastLesson ? <CheckCircle /> : <ArrowForward />}
          onClick={handleNext}
          disabled={!canProceed}
          sx={{
            minWidth: 140,
            background: canProceed
              ? theme.palette.gradients.primary
              : theme.palette.glass.secondary,
            '&:hover': {
              background: canProceed
                ? theme.palette.gradients.primary
                : theme.palette.glass.secondary,
              filter: 'brightness(1.1)',
            },
            '&:disabled': {
              opacity: 0.6,
            },
          }}
        >
          {isLastLesson ? 'Complete' : nextButtonText}
        </Button>
      </Stack>
    </Box>
  );
}
