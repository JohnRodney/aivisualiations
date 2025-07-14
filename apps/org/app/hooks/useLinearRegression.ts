import { useState, useCallback, useEffect } from 'react';

export interface Point {
  x: number;
  y: number;
}

export interface LineParams {
  slope: number;
  intercept: number;
  r2: number;
}

export const useLinearRegression = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [lineParams, setLineParams] = useState<LineParams>({
    slope: 0,
    intercept: 0,
    r2: 0,
  });

  // Calculate linear regression
  const calculateRegression = useCallback((points: Point[]): LineParams => {
    if (points.length < 2) {
      return { slope: 0, intercept: 0, r2: 0 };
    }

    const n = points.length;
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumX2 = points.reduce((sum, p) => sum + p.x * p.x, 0);
    const sumY2 = points.reduce((sum, p) => sum + p.y * p.y, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R²
    const meanY = sumY / n;
    const totalSumSquares = points.reduce(
      (sum, p) => sum + Math.pow(p.y - meanY, 2),
      0
    );
    const residualSumSquares = points.reduce((sum, p) => {
      const predicted = slope * p.x + intercept;
      return sum + Math.pow(p.y - predicted, 2);
    }, 0);
    const r2 = 1 - residualSumSquares / totalSumSquares;

    return { slope, intercept, r2 };
  }, []);

  // Add a point to the dataset
  const addPoint = useCallback((point: Point) => {
    setPoints((prev) => [...prev, point]);
  }, []);

  // Clear all points
  const clearPoints = useCallback(() => {
    setPoints([]);
  }, []);

  // Generate sample data
  const generateSampleData = useCallback(() => {
    const samplePoints: Point[] = [];
    const trueSlope = 0.5;
    const trueIntercept = 2;

    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 8 + 1;
      const y = trueSlope * x + trueIntercept + (Math.random() - 0.5) * 1.5;
      samplePoints.push({ x, y });
    }

    setPoints(samplePoints);
  }, []);

  // Set custom points (for advanced use cases)
  const setCustomPoints = useCallback((newPoints: Point[]) => {
    setPoints(newPoints);
  }, []);

  // Update line parameters when points change
  useEffect(() => {
    setLineParams(calculateRegression(points));
  }, [points, calculateRegression]);

  return {
    points,
    lineParams,
    addPoint,
    clearPoints,
    generateSampleData,
    setCustomPoints,
    calculateRegression,
  };
};
