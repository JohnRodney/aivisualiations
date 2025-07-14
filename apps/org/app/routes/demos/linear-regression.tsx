import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import { useLinearRegression } from '../../hooks/useLinearRegression';
import { LinearRegressionHero } from '../../components/linear-regression/LinearRegressionHero';
import { LinearRegressionDemo } from '../../components/linear-regression/LinearRegressionDemo';
import { LinearRegressionEducation } from '../../components/linear-regression/LinearRegressionEducation';

export default function LinearRegression() {
  const { points, lineParams, addPoint, clearPoints, generateSampleData } =
    useLinearRegression();

  // UI state
  const [showEquation, setShowEquation] = useState(true);
  const [showR2, setShowR2] = useState(true);
  const [noise, setNoise] = useState(0);

  // Handle point addition with noise
  const handlePointAdd = (point: { x: number; y: number }) => {
    const noisyPoint = { ...point };
    if (noise > 0) {
      noisyPoint.y += (Math.random() - 0.5) * noise;
    }
    addPoint(noisyPoint);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 6 }}>
        <LinearRegressionHero />

        <LinearRegressionDemo
          points={points}
          lineParams={lineParams}
          onPointAdd={handlePointAdd}
          onGenerateSample={generateSampleData}
          onClearPoints={clearPoints}
          noise={noise}
          onNoiseChange={setNoise}
          showEquation={showEquation}
          onShowEquationChange={setShowEquation}
          showR2={showR2}
          onShowR2Change={setShowR2}
        />

        <LinearRegressionEducation />
      </Box>
    </Container>
  );
}
