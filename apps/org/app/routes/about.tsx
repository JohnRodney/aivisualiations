import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { useTheme } from '../theme/ThemeContext';

export default function AboutComponent() {
  const { themeMode } = useTheme();

  const features = [
    {
      title: 'Interactive Learning',
      description:
        'Experience machine learning concepts through hands-on interaction rather than passive reading.',
      icon: '🎮',
    },
    {
      title: 'Visual Explanations',
      description:
        'See algorithms in action with real-time visualizations and dynamic parameter adjustments.',
      icon: '📊',
    },
    {
      title: 'No Coding Required',
      description:
        'Learn complex ML concepts without writing a single line of code - just point, click, and explore.',
      icon: '🖱️',
    },
    {
      title: 'Progressive Difficulty',
      description:
        'Start with beginner-friendly demos and work your way up to advanced concepts at your own pace.',
      icon: '📈',
    },
  ];

  const technologies = [
    'React',
    'TypeScript',
    'Material-UI',
    'Canvas API',
    'Statistical Computing',
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 6 }}>
        {/* Hero Section with Glass Morphism */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 6,
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            background:
              themeMode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 'bold',
              background:
                themeMode === 'dark'
                  ? 'linear-gradient(45deg, #90caf9, #f48fb1)'
                  : 'linear-gradient(45deg, #1976d2, #dc004e)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              mb: 3,
            }}
          >
            About Our Platform
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              color: 'text.primary',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              mb: 3,
            }}
          >
            Making Machine Learning Accessible Through Visualization
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.2rem',
              color: 'text.primary',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            We believe that machine learning concepts should be accessible to
            everyone. Our interactive demonstrations break down complex
            algorithms into intuitive, visual experiences that help you build
            deep understanding through exploration and play.
          </Typography>
        </Box>

        {/* Mission Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background:
              themeMode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h3"
            gutterBottom
            align="center"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 3,
            }}
          >
            Our Mission
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{
              fontSize: '1.1rem',
              color: 'text.primary',
              lineHeight: 1.7,
              textAlign: 'center',
              maxWidth: '700px',
              mx: 'auto',
            }}
          >
            To democratize machine learning education by providing intuitive,
            interactive tools that transform abstract mathematical concepts into
            engaging visual experiences. We're bridging the gap between theory
            and understanding, one demo at a time.
          </Typography>
        </Paper>

        {/* Features Grid */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            component="h3"
            gutterBottom
            align="center"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 4,
            }}
          >
            Why Interactive Learning Works
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
            }}
          >
            {features.map((feature) => (
              <Card
                key={feature.title}
                elevation={0}
                sx={{
                  height: '100%',
                  background:
                    themeMode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography
                      variant="h3"
                      component="span"
                      sx={{ mr: 2, fontSize: '2rem' }}
                    >
                      {feature.icon}
                    </Typography>
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 600,
                      }}
                    >
                      {feature.title}
                    </Typography>
                  </Box>
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
        </Box>

        {/* Technology Stack */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background:
              themeMode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 3,
            }}
          >
            Built With Modern Technologies
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              justifyContent: 'center',
            }}
          >
            {technologies.map((tech) => (
              <Chip
                key={tech}
                label={tech}
                variant="outlined"
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(5px)',
                  fontWeight: 500,
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
            ))}
          </Box>
        </Paper>

        {/* Call to Action */}
        <Box
          sx={{
            textAlign: 'center',
            p: 4,
            borderRadius: 3,
            background:
              themeMode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 2,
            }}
          >
            Ready to Start Learning?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            Dive into our interactive machine learning demonstrations and
            discover the beauty of algorithms through hands-on exploration.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: 'italic' }}
          >
            "The best way to learn is by doing, and the best way to understand
            is by seeing."
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
