import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router';
import { featuredDemos } from '../data/demos';

export function FeaturedDemos() {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 6 }}>
      <Box
        sx={{
          textAlign: 'center',
          mb: 4,
          p: 3,
          borderRadius: 3,
          background: theme.palette.glass.primary,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.glass.border}`,
        }}
      >
        <Typography
          variant="h3"
          component="h3"
          sx={{
            fontWeight: 'bold',
            background: theme.palette.gradients.text,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Featured Demos
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          mt: 2,
        }}
      >
        {featuredDemos.map((demo) => (
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
                  component="h4"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                  }}
                >
                  {demo.title}
                </Typography>
                <Chip
                  label={demo.status}
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
                sx={{ lineHeight: 1.5, mb: 2 }}
              >
                {demo.description}
              </Typography>

              {demo.difficulty && (
                <Chip
                  label={demo.difficulty}
                  size="small"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              )}

              {demo.concepts && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {demo.concepts.map((concept) => (
                    <Chip
                      key={concept}
                      label={concept}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
              )}
            </CardContent>

            <Box sx={{ p: 2, pt: 0 }}>
              <Button
                component={Link}
                to={demo.route}
                variant="contained"
                fullWidth
                disabled={demo.status === 'Coming Soon'}
                sx={{
                  background:
                    demo.status === 'Ready'
                      ? theme.palette.gradients.button
                      : undefined,
                  '&:hover': {
                    background:
                      demo.status === 'Ready'
                        ? theme.palette.gradients.button
                        : undefined,
                    filter: 'brightness(1.1)',
                  },
                }}
              >
                {demo.status === 'Ready' ? 'Try Demo' : 'Coming Soon'}
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
