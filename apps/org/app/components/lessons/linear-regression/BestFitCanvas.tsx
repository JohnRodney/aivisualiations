import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Chip,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Point {
  x: number;
  y: number;
}

interface BestFitCanvasProps {
  onInteraction?: (data: any) => void;
}

export function BestFitCanvas({ onInteraction }: BestFitCanvasProps) {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userLine, setUserLine] = useState<{ start: Point; end: Point } | null>(
    null
  );
  const [algorithmLine, setAlgorithmLine] = useState<{
    start: Point;
    end: Point;
  } | null>(null);
  const [showAlgorithm, setShowAlgorithm] = useState(false);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [algorithmScore, setAlgorithmScore] = useState<number | null>(null);
  const [gamePhase, setGamePhase] = useState<
    'drawing' | 'submitted' | 'comparing'
  >('drawing');
  const [currentChallenge, setCurrentChallenge] = useState(0);

  // Multiple challenge scenarios
  const challenges = [
    {
      name: 'Strong Positive',
      difficulty: 'Easy',
      color: 'success',
      points: [
        { x: 80, y: 200 },
        { x: 150, y: 180 },
        { x: 220, y: 150 },
        { x: 290, y: 140 },
        { x: 360, y: 120 },
        { x: 430, y: 100 },
        { x: 500, y: 80 },
      ],
    },
    {
      name: 'Moderate Positive',
      difficulty: 'Medium',
      color: 'info',
      points: [
        { x: 100, y: 180 },
        { x: 180, y: 160 },
        { x: 250, y: 140 },
        { x: 320, y: 130 },
        { x: 400, y: 110 },
        { x: 480, y: 100 },
        { x: 550, y: 90 },
      ],
    },
    {
      name: 'Scattered Data',
      difficulty: 'Hard',
      color: 'warning',
      points: [
        { x: 90, y: 190 },
        { x: 170, y: 140 },
        { x: 240, y: 160 },
        { x: 310, y: 120 },
        { x: 380, y: 100 },
        { x: 450, y: 110 },
        { x: 520, y: 80 },
      ],
    },
    {
      name: 'Strong Negative',
      difficulty: 'Easy',
      color: 'success',
      points: [
        { x: 80, y: 100 },
        { x: 150, y: 120 },
        { x: 220, y: 140 },
        { x: 290, y: 160 },
        { x: 360, y: 180 },
        { x: 430, y: 200 },
        { x: 500, y: 220 },
      ],
    },
    {
      name: 'Very Scattered',
      difficulty: 'Expert',
      color: 'error',
      points: [
        { x: 90, y: 200 },
        { x: 170, y: 120 },
        { x: 240, y: 180 },
        { x: 310, y: 100 },
        { x: 380, y: 160 },
        { x: 450, y: 90 },
        { x: 520, y: 140 },
      ],
    },
  ];

  const dataPoints = challenges[currentChallenge].points;

  const calculateOptimalLine = () => {
    const n = dataPoints.length;
    const sumX = dataPoints.reduce((sum, p) => sum + p.x, 0);
    const sumY = dataPoints.reduce((sum, p) => sum + p.y, 0);
    const sumXY = dataPoints.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumX2 = dataPoints.reduce((sum, p) => sum + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return {
      start: { x: 50, y: slope * 50 + intercept },
      end: { x: 550, y: slope * 550 + intercept },
    };
  };

  const calculateR2 = (line: { start: Point; end: Point }) => {
    const slope = (line.end.y - line.start.y) / (line.end.x - line.start.x);
    const intercept = line.start.y - slope * line.start.x;

    const predictions = dataPoints.map((p) => slope * p.x + intercept);
    const actual = dataPoints.map((p) => p.y);
    const mean = actual.reduce((sum, val) => sum + val, 0) / actual.length;

    const totalSumSquares = actual.reduce(
      (sum, val) => sum + Math.pow(val - mean, 2),
      0
    );
    const residualSumSquares = actual.reduce(
      (sum, val, i) => sum + Math.pow(val - predictions[i], 2),
      0
    );

    return Math.max(0, 1 - residualSumSquares / totalSumSquares);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw subtle gridlines
    ctx.strokeStyle =
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;

    // Vertical gridlines
    for (let x = 50; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Horizontal gridlines
    for (let y = 25; y < canvas.height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw data points
    ctx.fillStyle = theme.palette.primary.main;
    dataPoints.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw user line
    if (userLine) {
      ctx.strokeStyle = theme.palette.info.main;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(userLine.start.x, userLine.start.y);
      ctx.lineTo(userLine.end.x, userLine.end.y);
      ctx.stroke();
    }

    // Draw algorithm line
    if (algorithmLine && showAlgorithm) {
      ctx.strokeStyle = theme.palette.success.main;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(algorithmLine.start.x, algorithmLine.start.y);
      ctx.lineTo(algorithmLine.end.x, algorithmLine.end.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gamePhase !== 'drawing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const startPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const endPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setUserLine({ start: startPoint, end: endPoint });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleSubmitLine = () => {
    if (!userLine) return;

    const userR2 = calculateR2(userLine);
    const optimalLine = calculateOptimalLine();
    const algorithmR2 = calculateR2(optimalLine);

    setUserScore(userR2);
    setAlgorithmScore(algorithmR2);
    setAlgorithmLine(optimalLine);
    setGamePhase('submitted');

    onInteraction?.({
      userR2,
      algorithmR2,
      winner: userR2 > algorithmR2 ? 'user' : 'algorithm',
    });
  };

  const handleShowComparison = () => {
    setShowAlgorithm(true);
    setGamePhase('comparing');
  };

  const handleReset = () => {
    setUserLine(null);
    setAlgorithmLine(null);
    setShowAlgorithm(false);
    setUserScore(null);
    setAlgorithmScore(null);
    setGamePhase('drawing');
  };

  const handleChallengeChange = (challengeIndex: number) => {
    setCurrentChallenge(challengeIndex);
    handleReset();
  };

  const getResultMessage = () => {
    if (!userScore || !algorithmScore) return null;

    const diff = Math.abs(userScore - algorithmScore);
    if (userScore > algorithmScore) {
      return {
        type: 'success',
        message: `🎉 You beat the algorithm by ${(diff * 100).toFixed(1)}%!`,
      };
    } else if (diff < 0.05) {
      return {
        type: 'info',
        message: `🤝 Great job! You matched the algorithm closely!`,
      };
    } else {
      return {
        type: 'warning',
        message: `💪 Algorithm wins, but you're getting closer!`,
      };
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [userLine, algorithmLine, showAlgorithm, theme, currentChallenge]);

  const result = getResultMessage();

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 2, color: 'text.primary', textAlign: 'center' }}
      >
        Draw your best fitting line, then see how you compare against the
        algorithm!
      </Typography>

      <Box
        sx={{
          mb: 3,
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {challenges.map((challenge, index) => (
          <Button
            key={index}
            variant={currentChallenge === index ? 'contained' : 'outlined'}
            size="small"
            onClick={() => handleChallengeChange(index)}
            sx={{
              minWidth: 'auto',
              borderColor:
                currentChallenge === index
                  ? undefined
                  : theme.palette.glass.border,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {challenge.name}
              </Typography>
              <Chip
                label={challenge.difficulty}
                size="small"
                color={challenge.color as any}
                sx={{ height: 16, fontSize: '0.7rem' }}
              />
            </Stack>
          </Button>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={300}
            onMouseDown={handleMouseDown}
            style={{
              border: `2px solid ${theme.palette.glass.border}`,
              borderRadius: '8px',
              background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
              cursor: gamePhase === 'drawing' ? 'crosshair' : 'default',
              width: '100%',
              maxWidth: '600px',
            }}
          />
        </Box>

        <Card
          sx={{
            minWidth: 250,
            background: theme.palette.glass.secondary,
            border: `1px solid ${theme.palette.glass.border}`,
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Challenge Results
            </Typography>

            {userScore !== null && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 1 }}
                >
                  Your R²:{' '}
                  <Chip
                    label={`${(userScore * 100).toFixed(1)}%`}
                    color="info"
                    size="small"
                  />
                </Typography>
                {algorithmScore !== null && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Algorithm R²:{' '}
                    <Chip
                      label={`${(algorithmScore * 100).toFixed(1)}%`}
                      color="success"
                      size="small"
                    />
                  </Typography>
                )}
              </Box>
            )}

            {result && (
              <Alert
                severity={result.type as any}
                sx={{ mb: 2, fontSize: '0.875rem' }}
              >
                {result.message}
              </Alert>
            )}

            <Stack spacing={1}>
              {gamePhase === 'drawing' && (
                <Button
                  variant="contained"
                  onClick={handleSubmitLine}
                  disabled={!userLine}
                  size="small"
                >
                  Submit My Line
                </Button>
              )}

              {gamePhase === 'submitted' && (
                <Button
                  variant="outlined"
                  onClick={handleShowComparison}
                  size="small"
                >
                  Show Algorithm Line
                </Button>
              )}

              {gamePhase === 'comparing' && (
                <Button variant="outlined" onClick={handleReset} size="small">
                  Try Again
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Typography
        variant="body2"
        sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}
      >
        💡{' '}
        {gamePhase === 'drawing'
          ? `Challenge: ${challenges[currentChallenge].name} (${challenges[currentChallenge].difficulty}) - Click and drag to draw your best fitting line`
          : gamePhase === 'submitted'
          ? 'Ready to see the optimal solution?'
          : "Blue = Your line, Green dashed = Algorithm's optimal line"}
      </Typography>
    </Box>
  );
}
