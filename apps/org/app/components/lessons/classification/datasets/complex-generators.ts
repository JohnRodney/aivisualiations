// Complex Dataset Generators
// Advanced dataset generation functions for non-linear patterns

import { ClassificationPoint, ClassificationDataset } from '../types';

export function generateXOR(
  samples = 50,
  width = 800,
  height = 600
): ClassificationDataset {
  const points: ClassificationPoint[] = [];
  const margin = 50;

  // Four quadrants: top-left and bottom-right = class 1, others = class 0
  for (let i = 0; i < samples; i++) {
    const x = Math.random() * (width - 2 * margin) + margin;
    const y = Math.random() * (height - 2 * margin) + margin;

    const centerX = width / 2;
    const centerY = height / 2;
    const label =
      (x > centerX && y > centerY) || (x < centerX && y < centerY) ? 1 : 0;

    points.push({ x, y, label: label as 0 | 1 });
  }

  return {
    name: 'XOR Pattern',
    description: 'Non-linear XOR pattern - impossible for linear classifiers',
    points,
    difficulty: 'hard',
  };
}

export function generateSpiral(
  samples = 50,
  width = 800,
  height = 600
): ClassificationDataset {
  const points: ClassificationPoint[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.3;

  // Two intertwined spirals
  for (let i = 0; i < samples; i++) {
    const t = (i / samples) * 4 * Math.PI;
    const radius = (t / (4 * Math.PI)) * maxRadius;
    const noise = (Math.random() - 0.5) * (Math.min(width, height) * 0.04);

    if (i % 2 === 0) {
      // First spiral
      const x = centerX + Math.cos(t) * radius + noise;
      const y = centerY + Math.sin(t) * radius + noise;
      points.push({ x, y, label: 0 });
    } else {
      // Second spiral (offset by π)
      const x = centerX + Math.cos(t + Math.PI) * radius + noise;
      const y = centerY + Math.sin(t + Math.PI) * radius + noise;
      points.push({ x, y, label: 1 });
    }
  }

  return {
    name: 'Spiral Pattern',
    description: 'Intertwined spirals - requires complex decision boundaries',
    points,
    difficulty: 'hard',
  };
}

export function generateCheckerboard(
  samples = 50,
  width = 800,
  height = 600
): ClassificationDataset {
  const points: ClassificationPoint[] = [];
  const margin = 50;
  const gridSize = 4; // 4x4 checkerboard

  for (let i = 0; i < samples; i++) {
    const x = Math.random() * (width - 2 * margin) + margin;
    const y = Math.random() * (height - 2 * margin) + margin;

    // Determine grid position
    const gridX = Math.floor(((x - margin) / (width - 2 * margin)) * gridSize);
    const gridY = Math.floor(((y - margin) / (height - 2 * margin)) * gridSize);

    // Checkerboard pattern
    const label = (gridX + gridY) % 2;

    points.push({ x, y, label: label as 0 | 1 });
  }

  return {
    name: 'Checkerboard',
    description: 'Alternating grid pattern - extremely complex boundaries',
    points,
    difficulty: 'hard',
  };
}
