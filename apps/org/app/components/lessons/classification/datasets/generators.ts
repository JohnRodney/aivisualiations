// Dataset Generation Functions
// Main factory function for generating different types of classification datasets

import { ClassificationDataset } from '../types';
import {
  generateLinearSeparable,
  generateBlobs,
  generateCircles,
  generateMoons,
} from './basic-generators';
import {
  generateXOR,
  generateSpiral,
  generateCheckerboard,
} from './complex-generators';

export function generateClassificationDataset(
  type:
    | 'linearly_separable'
    | 'xor'
    | 'circles'
    | 'moons'
    | 'blobs'
    | 'spiral'
    | 'checkerboard',
  samples = 50,
  width = 800,
  height = 600
): ClassificationDataset {
  switch (type) {
    case 'linearly_separable':
      return generateLinearSeparable(samples, width, height);
    case 'blobs':
      return generateBlobs(samples, width, height);
    case 'circles':
      return generateCircles(samples, width, height);
    case 'moons':
      return generateMoons(samples, width, height);
    case 'xor':
      return generateXOR(samples, width, height);
    case 'spiral':
      return generateSpiral(samples, width, height);
    case 'checkerboard':
      return generateCheckerboard(samples, width, height);
    default:
      return generateLinearSeparable(samples, width, height);
  }
}

// Re-export individual generators
export * from './basic-generators';
export * from './complex-generators';
