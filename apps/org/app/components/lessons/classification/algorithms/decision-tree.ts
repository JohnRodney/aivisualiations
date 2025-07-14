// Decision Tree Algorithm
// Training and prediction functions for decision tree classifier

import { ClassificationPoint, DecisionTreeNode } from '../types';

// Helper function for calculating information gain
function calculateInformationGain(
  points: ClassificationPoint[],
  feature: number,
  threshold: number
): number {
  const total = points.length;
  const left = points.filter((p) => (feature === 0 ? p.x : p.y) <= threshold);
  const right = points.filter((p) => (feature === 0 ? p.x : p.y) > threshold);

  if (left.length === 0 || right.length === 0) return 0;

  const entropy = (group: ClassificationPoint[]) => {
    const p1 = group.filter((p) => p.label === 1).length / group.length;
    const p0 = 1 - p1;
    return p1 === 0 || p0 === 0
      ? 0
      : -(p1 * Math.log2(p1) + p0 * Math.log2(p0));
  };

  const originalEntropy = entropy(points);
  const weightedEntropy =
    (left.length / total) * entropy(left) +
    (right.length / total) * entropy(right);
  return originalEntropy - weightedEntropy;
}

// Build a proper decision tree
export function trainDecisionTree(
  points: ClassificationPoint[],
  depth = 0,
  maxDepth = 3
): DecisionTreeNode {
  // Base cases
  if (depth >= maxDepth || points.length === 0) {
    // Create leaf node with majority class
    const labels = points.map((p) => p.label);
    const count1 = labels.filter((l) => l === 1).length;
    const count0 = labels.length - count1;

    return {
      feature: undefined,
      threshold: undefined,
      prediction: (count1 > count0 ? 1 : 0) as 0 | 1,
      depth,
    };
  }

  // Check if all points have the same label
  const labels = points.map((p) => p.label);
  const allSame = labels.every((l) => l === labels[0]);

  if (allSame) {
    return {
      feature: undefined,
      threshold: undefined,
      prediction: labels[0],
      depth,
    };
  }

  let bestGain = 0;
  let bestFeature = 0;
  let bestThreshold = 0;

  // Try splits on both features
  for (let feature = 0; feature < 2; feature++) {
    const values = points.map((p) => (feature === 0 ? p.x : p.y)).sort();

    for (let i = 0; i < values.length - 1; i++) {
      const threshold = (values[i] + values[i + 1]) / 2;
      const gain = calculateInformationGain(points, feature, threshold);

      if (gain > bestGain) {
        bestGain = gain;
        bestFeature = feature;
        bestThreshold = threshold;
      }
    }
  }

  // If no good split found, create leaf node
  if (bestGain === 0) {
    const count1 = labels.filter((l) => l === 1).length;
    const count0 = labels.length - count1;

    return {
      feature: undefined,
      threshold: undefined,
      prediction: (count1 > count0 ? 1 : 0) as 0 | 1,
      depth,
    };
  }

  // Split the data
  const leftPoints = points.filter(
    (p) => (bestFeature === 0 ? p.x : p.y) <= bestThreshold
  );
  const rightPoints = points.filter(
    (p) => (bestFeature === 0 ? p.x : p.y) > bestThreshold
  );

  // Recursively build subtrees
  const leftChild = trainDecisionTree(leftPoints, depth + 1, maxDepth);
  const rightChild = trainDecisionTree(rightPoints, depth + 1, maxDepth);

  return {
    feature: bestFeature,
    threshold: bestThreshold,
    prediction: undefined,
    left: leftChild,
    right: rightChild,
    depth,
  };
}

export function predictDecisionTree(
  x: number,
  y: number,
  tree: DecisionTreeNode
): 0 | 1 {
  // Safety check
  if (!tree) {
    console.warn('Decision tree is undefined');
    return 0;
  }

  let current = tree;

  while (current && current.feature !== undefined) {
    const value = current.feature === 0 ? x : y;
    if (value <= current.threshold!) {
      current = current.left!;
    } else {
      current = current.right!;
    }

    // Safety check to prevent infinite loops
    if (!current) {
      console.warn('Decision tree navigation failed');
      return 0;
    }
  }

  return current.prediction !== undefined ? current.prediction : 0;
}
