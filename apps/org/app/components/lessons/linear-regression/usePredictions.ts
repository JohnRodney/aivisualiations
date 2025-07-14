import { useState } from 'react';
import { Point, LineSegment, calculateBestFitLine } from './canvas-utils';

interface Prediction {
  x: number;
  y: number;
  predicted: number;
  confidence: 'high' | 'medium' | 'low';
  type: 'interpolation' | 'extrapolation';
}

interface UsePredictionsProps {
  dataPoints: Point[];
  onInteraction?: (data: any) => void;
}

export function usePredictions({
  dataPoints,
  onInteraction,
}: UsePredictionsProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [bestFitLine, setBestFitLine] = useState<LineSegment | null>(null);

  // Calculate the fitted line when data points change
  const updateBestFitLine = () => {
    if (dataPoints.length > 0) {
      const line = calculateBestFitLine(dataPoints);
      setBestFitLine(line);
      return line;
    }
    return null;
  };

  // Get the current or calculated best fit line
  const getCurrentLine = () => {
    return bestFitLine || updateBestFitLine();
  };

  // Calculate prediction confidence based on distance from data range
  const calculateConfidence = (x: number): 'high' | 'medium' | 'low' => {
    const xValues = dataPoints.map((p) => p.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const range = maxX - minX;

    if (x >= minX && x <= maxX) return 'high'; // Within data range

    const distance = x < minX ? minX - x : x - maxX;
    if (distance <= range * 0.2) return 'medium'; // Close extrapolation
    return 'low'; // Far extrapolation
  };

  // Determine if prediction is interpolation or extrapolation
  const getPredictionType = (x: number): 'interpolation' | 'extrapolation' => {
    const xValues = dataPoints.map((p) => p.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    return x >= minX && x <= maxX ? 'interpolation' : 'extrapolation';
  };

  // Make a prediction at a given x coordinate
  const makePrediction = (x: number, y: number) => {
    const line = getCurrentLine();
    if (!line) return;

    const slope = (line.end.y - line.start.y) / (line.end.x - line.start.x);
    const intercept = line.start.y - slope * line.start.x;
    const predicted = slope * x + intercept;

    const newPrediction: Prediction = {
      x,
      y,
      predicted,
      confidence: calculateConfidence(x),
      type: getPredictionType(x),
    };

    setPredictions((prev) => [...prev, newPrediction]);

    onInteraction?.({
      prediction: newPrediction,
      totalPredictions: predictions.length + 1,
      averageError: calculateAverageError([...predictions, newPrediction]),
    });

    return newPrediction;
  };

  // Calculate average prediction error
  const calculateAverageError = (preds: Prediction[] = predictions) => {
    if (preds.length === 0) return 0;
    const totalError = preds.reduce(
      (sum, pred) => sum + Math.abs(pred.predicted - pred.y),
      0
    );
    return totalError / preds.length;
  };

  // Calculate accuracy percentage
  const calculateAccuracy = () => {
    const avgError = calculateAverageError();
    const yValues = dataPoints.map((p) => p.y);
    const yRange = Math.max(...yValues) - Math.min(...yValues);
    return Math.max(0, 100 - (avgError / yRange) * 100);
  };

  // Clear all predictions
  const clearPredictions = () => {
    setPredictions([]);
  };

  // Get confidence message
  const getConfidenceMessage = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return 'High confidence - within training data range';
      case 'medium':
        return 'Medium confidence - close extrapolation';
      case 'low':
        return 'Low confidence - far from training data';
    }
  };

  return {
    predictions,
    bestFitLine: getCurrentLine(),
    makePrediction,
    clearPredictions,
    calculateAccuracy,
    getConfidenceMessage,
    updateBestFitLine,
  };
}
