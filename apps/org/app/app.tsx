import { Container, Box } from '@mui/material';
import { HeroSection } from './components/HeroSection';
import { FeaturedDemos } from './components/FeaturedDemos';
import { BenefitsSection } from './components/BenefitsSection';
import { ThemeStatus } from './components/ThemeStatus';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 6 }}>
        <HeroSection />
        <FeaturedDemos />
        <BenefitsSection />
        <ThemeStatus />
      </Box>
    </Container>
  );
}

export default App;
