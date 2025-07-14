import { Box, LinearProgress, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface LessonProgressProps {
  currentLesson: number;
  totalLessons: number;
  lessonTitles: string[];
}

export function LessonProgress({
  currentLesson,
  totalLessons,
  lessonTitles,
}: LessonProgressProps) {
  const theme = useTheme();
  const progress = ((currentLesson + 1) / totalLessons) * 100;

  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        borderRadius: 3,
        background: theme.palette.glass.secondary,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.glass.border}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: 'text.primary', fontWeight: 600 }}
        >
          Lesson Progress
        </Typography>
        <Chip
          label={`${currentLesson + 1} of ${totalLessons}`}
          size="small"
          sx={{
            background: theme.palette.glass.primary,
            backdropFilter: 'blur(5px)',
          }}
        />
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: theme.palette.glass.primary,
          '& .MuiLinearProgress-bar': {
            background: theme.palette.gradients.primary,
            borderRadius: 4,
          },
          mb: 2,
        }}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {lessonTitles.map((title, index) => (
          <Chip
            key={index}
            label={title}
            size="small"
            variant={index === currentLesson ? 'filled' : 'outlined'}
            color={index <= currentLesson ? 'primary' : 'default'}
            sx={{
              fontSize: '0.75rem',
              background:
                index === currentLesson
                  ? theme.palette.gradients.primary
                  : index < currentLesson
                  ? theme.palette.glass.primary
                  : 'transparent',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
