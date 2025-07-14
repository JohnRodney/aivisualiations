import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router';

const demos = [
  {
    title: 'Linear Regression',
    description:
      'Interactive scatter plot where you can add points and watch the regression line adjust in real-time. Perfect for understanding how linear models fit data.',
    difficulty: 'Beginner',
    route: '/demos/linear-regression',
    color: 'primary' as const,
    concepts: ['Supervised Learning', 'Regression', 'Least Squares'],
  },
  {
    title: 'Neural Network',
    description:
      'Visualize how data flows through neural network layers with animated weights and activations. See the magic of deep learning in action.',
    difficulty: 'Intermediate',
    route: '/demos/neural-network',
    color: 'secondary' as const,
    concepts: ['Deep Learning', 'Forward Pass', 'Backpropagation'],
  },
  {
    title: 'Classification',
    description:
      'Explore binary classification with adjustable decision boundaries. Watch how different algorithms separate data points.',
    difficulty: 'Beginner',
    route: '/demos/classification',
    color: 'success' as const,
    concepts: ['Supervised Learning', 'Decision Boundary', 'Classification'],
  },
  {
    title: 'Clustering',
    description:
      'Interactive K-means clustering with draggable centroids. Discover how unsupervised learning groups similar data points.',
    difficulty: 'Intermediate',
    route: '/demos/clustering',
    color: 'warning' as const,
    concepts: ['Unsupervised Learning', 'K-means', 'Centroids'],
  },
  {
    title: 'Gradient Descent',
    description:
      'Visualize the optimization process on a 3D surface. See how algorithms find the minimum of complex functions.',
    difficulty: 'Advanced',
    route: '/demos/gradient-descent',
    color: 'error' as const,
    concepts: ['Optimization', 'Gradient Descent', 'Loss Function'],
  },
];

export default function Demos() {
  const theme = useTheme();

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
            Interactive ML Demos
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              color: 'text.primary',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              mb: 2,
            }}
          >
            Learn machine learning through hands-on visualizations
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{
              fontSize: '1.1rem',
              color: 'text.primary',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Explore fundamental machine learning concepts through interactive
            demonstrations. Each demo is designed to help you understand the
            core principles behind different algorithms.
          </Typography>
        </Box>

        {/* Demos Grid with Glass Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 3,
            mt: 4,
          }}
        >
          {demos.map((demo) => (
            <Card
              key={demo.title}
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: theme.palette.glass.card,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.palette.glass.border}`,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.palette.glass.shadow.heavy,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                    }}
                  >
                    {demo.title}
                  </Typography>
                  <Chip
                    label={demo.difficulty}
                    color={demo.color}
                    size="small"
                    sx={{
                      ml: 1,
                      fontWeight: 500,
                    }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  paragraph
                  sx={{ lineHeight: 1.5 }}
                >
                  {demo.description}
                </Typography>

                <Box
                  sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}
                >
                  {demo.concepts.map((concept) => (
                    <Chip
                      key={concept}
                      label={concept}
                      variant="outlined"
                      size="small"
                      sx={{
                        background: theme.palette.glass.secondary,
                        backdropFilter: 'blur(5px)',
                      }}
                    />
                  ))}
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  component={Link}
                  to={demo.route}
                  variant="contained"
                  color={demo.color}
                  fullWidth
                  sx={{
                    m: 1,
                    background:
                      demo.title === 'Linear Regression' ||
                      demo.title === 'Neural Network'
                        ? theme.palette.gradients.button
                        : undefined,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.palette.glass.shadow.light,
                    },
                  }}
                >
                  {demo.title === 'Linear Regression' ||
                  demo.title === 'Neural Network'
                    ? 'Try Demo'
                    : 'Coming Soon'}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>

        {/* Info Section with Glass Effect */}
        <Box
          sx={{
            mt: 6,
            p: 4,
            borderRadius: 3,
            background: theme.palette.glass.primary,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.glass.border}`,
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
              mb: 2,
            }}
          >
            🚧 More Demos Coming Soon!
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            We're working hard to bring you more interactive machine learning
            demonstrations. Start with our Linear Regression or Neural Network
            demos and check back soon for new additions!
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
