import { Box } from '@mui/material';
import { LinearRegressionIntro } from './LinearRegressionIntro';
import { ConceptsGrid } from './ConceptsGrid';
import { HowItWorks } from './HowItWorks';
import { Applications } from './Applications';

export function LinearRegressionEducation() {
  return (
    <Box sx={{ mt: 8 }}>
      <LinearRegressionIntro />
      <ConceptsGrid />
      <HowItWorks />
      <Applications />
    </Box>
  );
}
