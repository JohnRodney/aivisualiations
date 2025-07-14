import { Box, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { RegressionCanvas } from '../RegressionCanvas';
import { RegressionControls } from '../RegressionControls';
import { RegressionResults } from '../RegressionResults';

interface LinearRegressionDemoProps {
  points: Array<{ x: number; y: number }>;
  lineParams: { slope: number; intercept: number; r2: number };
  onPointAdd: (point: { x: number; y: number }) => void;
  onGenerateSample: () => void;
  onClearPoints: () => void;
  noise: number;
  onNoiseChange: (noise: number) => void;
  showEquation: boolean;
  onShowEquationChange: (show: boolean) => void;
  showR2: boolean;
  onShowR2Change: (show: boolean) => void;
}

export function LinearRegressionDemo({
  points,
  lineParams,
  onPointAdd,
  onGenerateSample,
  onClearPoints,
  noise,
  onNoiseChange,
  showEquation,
  onShowEquationChange,
  showR2,
  onShowR2Change,
}: LinearRegressionDemoProps) {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 3,
          mt: 4,
        }}
      >
        {/* Canvas Area */}
        <Box sx={{ flex: 1 }}>
          <RegressionCanvas
            points={points}
            lineParams={lineParams}
            onPointAdd={onPointAdd}
            noise={noise}
          />
        </Box>

        {/* Controls and Results */}
        <Box sx={{ width: { xs: '100%', lg: '300px' } }}>
          <RegressionControls
            onGenerateSample={onGenerateSample}
            onClearPoints={onClearPoints}
            noise={noise}
            onNoiseChange={onNoiseChange}
            showEquation={showEquation}
            onShowEquationChange={onShowEquationChange}
            showR2={showR2}
            onShowR2Change={onShowR2Change}
          />

          {/* Results */}
          {points.length >= 2 && (
            <RegressionResults
              lineParams={lineParams}
              pointCount={points.length}
              showEquation={showEquation}
              showR2={showR2}
            />
          )}
        </Box>
      </Box>

      {/* Info Alert */}
      {points.length < 2 && (
        <Box
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 3,
            background: theme.palette.glass.primary,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.glass.border}`,
          }}
        >
          <Alert
            severity="info"
            sx={{
              background: 'transparent',
              border: 'none',
              '& .MuiAlert-message': {
                color: 'text.primary',
                fontWeight: 500,
              },
            }}
          >
            Click on the plot to add at least 2 points to see the regression
            line!
          </Alert>
        </Box>
      )}
    </>
  );
}
