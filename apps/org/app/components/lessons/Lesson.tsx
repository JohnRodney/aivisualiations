import { Box, Typography, Card, CardContent, Stack, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LessonData } from './types';

interface LessonProps {
  lesson: LessonData;
  onCanvasInteraction?: (data: any) => void;
}

export function Lesson({ lesson, onCanvasInteraction }: LessonProps) {
  const theme = useTheme();
  const CanvasComponent = lesson.canvasComponent;

  return (
    <Box>
      {/* Lesson Header */}
      <Box
        sx={{
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
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: '1.8rem', md: '2.4rem' },
            fontWeight: 'bold',
            background: theme.palette.gradients.text,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            mb: 3,
          }}
        >
          {lesson.title}
        </Typography>

        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            background: theme.palette.glass.secondary,
            border: `1px solid ${theme.palette.glass.border}`,
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              mb: 1,
            }}
          >
            🎯 Learning Objective
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.primary',
              fontWeight: 500,
              mb: 1,
            }}
          >
            {lesson.objective.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
            }}
          >
            {lesson.objective.description}
          </Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{
            fontSize: '1.1rem',
            lineHeight: 1.7,
            color: 'text.primary',
            textAlign: 'center',
          }}
        >
          {lesson.explanation}
        </Typography>
      </Box>

      {/* Interactive Canvas */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          background: theme.palette.glass.card,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.glass.border}`,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <CanvasComponent
            {...lesson.canvasProps}
            onInteraction={onCanvasInteraction}
          />
        </CardContent>
      </Card>

      {/* Key Takeaways */}
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          background: theme.palette.glass.secondary,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.glass.border}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: 'text.primary',
            fontWeight: 600,
            mb: 2,
          }}
        >
          💡 Key Takeaways
        </Typography>
        <Stack spacing={1}>
          {lesson.keyTakeaways.map((takeaway, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}
            >
              <Chip
                label={index + 1}
                size="small"
                sx={{
                  minWidth: 24,
                  height: 24,
                  fontSize: '0.75rem',
                  background: theme.palette.gradients.primary,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  flex: 1,
                }}
              >
                {takeaway}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
