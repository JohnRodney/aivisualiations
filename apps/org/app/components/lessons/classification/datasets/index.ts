// Dataset Generation Index
// Re-exports all dataset generation functions for easy importing

export { generateClassificationDataset } from './generators';

// Re-export basic generators
export {
  generateLinearSeparable,
  generateBlobs,
  generateCircles,
  generateMoons,
} from './basic-generators';

// Re-export complex generators
export {
  generateXOR,
  generateSpiral,
  generateCheckerboard,
} from './complex-generators';

// Re-export configuration
export * from './configs';
