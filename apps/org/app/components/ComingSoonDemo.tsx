import React from 'react';
import {
  Container,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Feature {
  title: string;
  description: string;
}

interface ComingSoonDemoProps {
  title: string;
  description: string;
  features: Feature[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  concepts: string[];
}

export default function ComingSoonDemo({
  title,
  description,
  features,
  difficulty,
  concepts,
}: ComingSoonDemoProps) {
  const theme = useTheme();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'success';
      case 'Intermediate':
        return 'warning';
      case 'Advanced':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 6 }}>
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 6,
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
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 'bold',
              background: theme.palette.gradients.text,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              mb: 3,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h6"
            component="p"
            sx={{
              fontSize: '1.2rem',
              color: 'text.primary',
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.6,
              mb: 4,
            }}
          >
            {description}
          </Typography>

          {/* Difficulty and Concepts */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Chip
              label={difficulty}
              color={getDifficultyColor(difficulty) as any}
              size="medium"
              sx={{
                fontWeight: 600,
                background: theme.palette.glass.secondary,
                backdropFilter: 'blur(5px)',
              }}
            />
            {concepts.map((concept, index) => (
              <Chip
                key={index}
                label={concept}
                variant="outlined"
                size="medium"
                sx={{
                  background: theme.palette.glass.secondary,
                  backdropFilter: 'blur(5px)',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Coming Soon Message */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 6,
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: theme.palette.glass.primary,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.glass.border}`,
            boxShadow: theme.palette.glass.shadow.medium,
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 'bold',
              color: 'text.primary',
              mb: 3,
            }}
          >
            🚧 Coming Soon! 🚧
          </Typography>

          <Typography
            variant="h6"
            component="p"
            sx={{
              fontSize: '1.1rem',
              color: 'text.secondary',
              lineHeight: 1.6,
            }}
          >
            This interactive demo is currently under development. Here's what
            you can expect:
          </Typography>
        </Box>

        {/* Features Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 3,
            mb: 6,
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              elevation={0}
              sx={{
                background: theme.palette.glass.card,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.palette.glass.border}`,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.palette.glass.shadow.medium,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Stay Tuned */}
        <Box
          sx={{
            textAlign: 'center',
            p: 3,
            borderRadius: 3,
            background: theme.palette.glass.secondary,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.glass.border}`,
          }}
        >
          <Typography
            variant="h6"
            component="p"
            sx={{
              color: 'text.primary',
              fontWeight: 500,
            }}
          >
            Stay tuned for this exciting interactive learning experience! 🎓
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
