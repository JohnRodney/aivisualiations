// Basic Dataset Generators
// Simple dataset generation functions for linear and blob patterns

import { ClassificationPoint, ClassificationDataset } from '../types';

export function generateLinearSeparable(
  samples = 50,
  width = 800,
  height = 600
): ClassificationDataset {
  const points: ClassificationPoint[] = [];
  const margin = 50; // Keep points away from edges

  for (let i = 0; i < samples; i++) {
    const x = Math.random() * (width - 2 * margin) + margin;
    const y = Math.random() * (height - 2 * margin) + margin;

    // Create diagonal separation - adjust threshold based on canvas size
    const noise = (Math.random() - 0.5) * (width * 0.05); // Noise proportional to canvas size
    const threshold = width * 0.6 + height * 0.4; // Dynamic threshold based on canvas size
    const label = x + y * 0.8 + noise > threshold ? 1 : 0;

    points.push({ x, y, label: label as 0 | 1 });
  }

  return {
    name: 'Linear Separable',
    description:
      'Two classes separated by a straight line - perfect for linear algorithms',
    points,
    difficulty: 'easy',
  };
}

export function generateBlobs(
  samples = 50,
  width = 800,
  height = 600
): ClassificationDataset {
  const points: ClassificationPoint[] = [];
  const margin = 100; // Keep clusters away from edges

  // Generate 4 distinct clusters, 2 for each class - scaled to canvas size
  const centers = [
    { x: width * 0.3, y: height * 0.3, label: 0 },
    { x: width * 0.7, y: height * 0.3, label: 1 },
    { x: width * 0.3, y: height * 0.7, label: 0 },
    { x: width * 0.7, y: height * 0.7, label: 1 },
  ];

  for (let i = 0; i < samples; i++) {
    const center = centers[i % centers.length];
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * (Math.min(width, height) * 0.08) + 20; // Radius proportional to canvas size

    const x = center.x + Math.cos(angle) * radius;
    const y = center.y + Math.sin(angle) * radius;

    // Keep points within bounds
    const clampedX = Math.max(margin, Math.min(width - margin, x));
    const clampedY = Math.max(margin, Math.min(height - margin, y));

    points.push({ x: clampedX, y: clampedY, label: center.label as 0 | 1 });
  }

  return {
    name: 'Blob Clusters',
    description: 'Multiple clusters of each class - tests clustering ability',
    points,
    difficulty: 'medium',
  };
}

export function generateCircles(
  samples = 50,
  width = 800,
  height = 600
): ClassificationDataset {
  const points: ClassificationPoint[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.3; // Scale to canvas size

  // Inner circle (class 0) and outer ring (class 1)
  for (let i = 0; i < samples; i++) {
    const angle = Math.random() * 2 * Math.PI;

    if (i % 2 === 0) {
      // Inner circle
      const radius = Math.random() * (maxRadius * 0.4) + 20;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      points.push({ x, y, label: 0 });
    } else {
      // Outer ring
      const radius = Math.random() * (maxRadius * 0.3) + maxRadius * 0.6;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      points.push({ x, y, label: 1 });
    }
  }

  return {
    name: 'Concentric Circles',
    description: 'Inner and outer circles - challenges radial classification',
    points,
    difficulty: 'medium',
  };
}

export function generateMoons(
  samples = 50,
  width = 800,
  height = 600
): ClassificationDataset {
  const points: ClassificationPoint[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const moonRadius = Math.min(width, height) * 0.15; // Scale to canvas size

  // Two crescent shapes
  for (let i = 0; i < samples; i++) {
    const t = ((i % (samples / 2)) / (samples / 2)) * Math.PI;
    const noise = (Math.random() - 0.5) * (Math.min(width, height) * 0.08);

    if (i < samples / 2) {
      // Upper moon
      const x = centerX - moonRadius + Math.cos(t) * moonRadius + noise;
      const y =
        centerY - moonRadius * 0.3 + Math.sin(t) * (moonRadius * 0.6) + noise;
      points.push({ x, y, label: 0 });
    } else {
      // Lower moon (inverted)
      const x = centerX + moonRadius - Math.cos(t) * moonRadius + noise;
      const y =
        centerY + moonRadius * 0.3 - Math.sin(t) * (moonRadius * 0.6) + noise;
      points.push({ x, y, label: 1 });
    }
  }

  return {
    name: 'Two Moons',
    description: 'Crescent-shaped clusters - tests curve detection',
    points,
    difficulty: 'medium',
  };
}
