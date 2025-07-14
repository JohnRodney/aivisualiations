export interface ClassificationPoint {
  x: number;
  y: number;
  label: 0 | 1; // Binary classification
  predicted?: 0 | 1;
}

export interface DecisionBoundary {
  type: 'linear' | 'nonlinear';
  points: { x: number; y: number }[];
  equation?: string;
  async?: boolean;
}

export interface ClassificationDataset {
  name: string;
  description: string;
  points: ClassificationPoint[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ClassificationAlgorithm {
  name: string;
  type: 'linear' | 'nonlinear';
  trainable: boolean;
  hyperparameters?: Record<string, any>;
}

export interface ClassificationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
}

export interface SVMParams {
  weights: number[]; // Linear weights for decision boundary
  bias: number; // Bias term
  C: number; // Regularization parameter
  kernel: 'linear' | 'rbf' | 'polynomial';
  gamma?: number; // For RBF kernel
  degree?: number; // For polynomial kernel
  supportVectors: number[]; // Indices of support vectors
  alphas: number[]; // Alpha coefficients for dual formulation
}

export interface DecisionTreeNode {
  feature?: number;
  threshold?: number;
  prediction?: 0 | 1;
  left?: DecisionTreeNode;
  right?: DecisionTreeNode;
  depth: number;
}

export interface LogisticRegressionParams {
  weights: number[];
  bias: number;
  learningRate: number;
  regularization?: number;
  normalization?: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    xRange: number;
    yRange: number;
  };
}
