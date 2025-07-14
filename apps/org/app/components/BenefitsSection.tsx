import { Box, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { benefitsData } from '../data/demos';

export function BenefitsSection() {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 4,
        background: theme.palette.glass.primary,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.glass.border}`,
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
          mb: 4,
        }}
      >
        Why Interactive Learning?
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          mt: 2,
        }}
      >
        {benefitsData.map((benefit) => (
          <Box key={benefit.title} sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              component="h4"
              gutterBottom
              sx={{
                color: 'text.primary',
                fontWeight: 600,
              }}
            >
              {benefit.icon} {benefit.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.5 }}
            >
              {benefit.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
