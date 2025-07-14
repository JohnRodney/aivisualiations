// Classification Metrics
// Functions for calculating classification performance metrics

import { ClassificationPoint, ClassificationMetrics } from '../types';

export function calculateMetrics(
  points: ClassificationPoint[]
): ClassificationMetrics {
  let tp = 0; // True Positive
  let fp = 0; // False Positive
  let tn = 0; // True Negative
  let fn = 0; // False Negative

  for (const point of points) {
    if (point.predicted === undefined) continue;

    if (point.label === 1 && point.predicted === 1) tp++;
    else if (point.label === 0 && point.predicted === 1) fp++;
    else if (point.label === 0 && point.predicted === 0) tn++;
    else if (point.label === 1 && point.predicted === 0) fn++;
  }

  const total = tp + fp + tn + fn;
  const accuracy = total > 0 ? (tp + tn) / total : 0;

  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;

  const f1Score =
    precision + recall > 0
      ? (2 * precision * recall) / (precision + recall)
      : 0;

  return {
    accuracy,
    precision,
    recall,
    f1Score,
    confusionMatrix: {
      truePositive: tp,
      falsePositive: fp,
      trueNegative: tn,
      falseNegative: fn,
    },
  };
}
