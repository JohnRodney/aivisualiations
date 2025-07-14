// Re-export all classification algorithms
export {
  trainLogisticRegression,
  predictLogistic,
} from './algorithms/logistic-regression';
export { trainSVM, predictSVM } from './algorithms/svm';
export {
  trainDecisionTree,
  predictDecisionTree,
} from './algorithms/decision-tree';

// Re-export dataset generation functions
export { generateClassificationDataset } from './datasets/generators';
export {
  generateLinearSeparable,
  generateBlobs,
  generateCircles,
  generateMoons,
} from './datasets/basic-generators';
export {
  generateXOR,
  generateSpiral,
  generateCheckerboard,
} from './datasets/complex-generators';

// Re-export configurations
export { DATASET_CONFIGS, ALGORITHM_CONFIGS } from './datasets/configs';

// Re-export utility functions
export { calculateMetrics } from './utils/metrics';
export {
  createDecisionBoundary,
  createRBFBoundaryAsync,
} from './utils/decision-boundary';

// Re-export types
export * from './types';
