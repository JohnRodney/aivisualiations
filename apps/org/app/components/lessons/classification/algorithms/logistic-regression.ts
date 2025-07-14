// Logistic Regression Algorithm
// Training and prediction functions for logistic regression classifier

import { activationFunctions } from '../../neural-network/nn-utils';
import { ClassificationPoint, LogisticRegressionParams } from '../types';

export function trainLogisticRegression(
  points: ClassificationPoint[],
  epochs = 1000,
  learningRate = 0.1
): LogisticRegressionParams {
  // Feature normalization - scale to [0, 1] range
  const xValues = points.map((p) => p.x);
  const yValues = points.map((p) => p.y);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  const xRange = xMax - xMin;
  const yRange = yMax - yMin;

  // Normalize points
  const normalizedPoints = points.map((p) => ({
    x: (p.x - xMin) / xRange,
    y: (p.y - yMin) / yRange,
    label: p.label,
  }));

  // Initialize weights with better values
  const weights = [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2];
  let bias = (Math.random() - 0.5) * 2;

  for (let epoch = 0; epoch < epochs; epoch++) {
    for (const point of normalizedPoints) {
      const z = weights[0] * point.x + weights[1] * point.y + bias;
      const prediction = activationFunctions.sigmoid(z);
      const error = point.label - prediction;

      // Update weights
      weights[0] += learningRate * error * point.x;
      weights[1] += learningRate * error * point.y;
      bias += learningRate * error;
    }
  }

  // Transform weights back to original scale
  const originalWeights = [weights[0] / xRange, weights[1] / yRange];
  const originalBias =
    bias - (weights[0] * xMin) / xRange - (weights[1] * yMin) / yRange;

  return {
    weights: originalWeights || [0, 0], // Ensure weights exist
    bias: originalBias || 0,
    learningRate,
    // Store normalization parameters for predictions
    normalization: { xMin, xMax, yMin, yMax, xRange, yRange },
  };
}

export function predictLogistic(
  x: number,
  y: number,
  params: LogisticRegressionParams
): number {
  const { weights, bias } = params;

  // Safety check for undefined weights
  if (!weights || weights.length !== 2) {
    console.warn('Logistic regression weights not properly initialized');
    return 0.5; // Return neutral prediction
  }

  const z = weights[0] * x + weights[1] * y + bias;
  return activationFunctions.sigmoid(z);
}
