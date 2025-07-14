// Dataset and Algorithm Configuration
// Centralized configuration for all available datasets and algorithms

// Centralized dataset configuration
export const DATASET_CONFIGS = {
  linearly_separable: {
    id: 'linearly_separable' as const,
    name: 'Linear Separable',
    label: 'Linear',
    description:
      'Two classes separated by a straight line - perfect for linear algorithms',
    difficulty: 'Easy',
    difficultyLevel: 1,
    suitable_algorithms: ['logistic', 'svm', 'tree'],
    icon: '📊',
  },
  blobs: {
    id: 'blobs' as const,
    name: 'Clustered Blobs',
    label: 'Blobs',
    description: 'Multiple clusters - tests algorithm flexibility',
    difficulty: 'Easy',
    difficultyLevel: 1,
    suitable_algorithms: ['logistic', 'svm', 'tree'],
    icon: '🎯',
  },
  circles: {
    id: 'circles' as const,
    name: 'Concentric Circles',
    label: 'Circles',
    description: 'Inner and outer circles - challenges radial classification',
    difficulty: 'Medium',
    difficultyLevel: 2,
    suitable_algorithms: ['svm', 'tree'],
    icon: '⭕',
  },
  moons: {
    id: 'moons' as const,
    name: 'Two Moons',
    label: 'Moons',
    description: 'Crescent-shaped clusters - tests curve detection',
    difficulty: 'Medium',
    difficultyLevel: 2,
    suitable_algorithms: ['svm', 'tree'],
    icon: '🌙',
  },
  xor: {
    id: 'xor' as const,
    name: 'XOR Pattern',
    label: 'XOR',
    description: 'Non-linear XOR pattern - impossible for linear classifiers',
    difficulty: 'Hard',
    difficultyLevel: 3,
    suitable_algorithms: ['tree'],
    icon: '❌',
  },
  spiral: {
    id: 'spiral' as const,
    name: 'Spiral Pattern',
    label: 'Spiral',
    description: 'Intertwined spirals - ultimate non-linear challenge',
    difficulty: 'Hard',
    difficultyLevel: 3,
    suitable_algorithms: ['tree'],
    icon: '🌀',
  },
  checkerboard: {
    id: 'checkerboard' as const,
    name: 'Checkerboard',
    label: 'Checkerboard',
    description: 'Complex grid pattern - for detailed boundary detection',
    difficulty: 'Hard',
    difficultyLevel: 3,
    suitable_algorithms: ['tree'],
    icon: '♟️',
  },
} as const;

// Centralized algorithm configuration
export const ALGORITHM_CONFIGS = {
  logistic: {
    id: 'logistic' as const,
    name: 'Logistic Regression',
    label: 'Logistic Regression',
    description: 'Linear classifier using sigmoid function',
    type: 'Linear',
    complexity: 'Simple',
    strengths: ['Fast training', 'Interpretable', 'Probabilistic output'],
    weaknesses: ['Only linear boundaries', 'Poor on non-linear data'],
    icon: '📈',
  },
  svm: {
    id: 'svm' as const,
    name: 'Support Vector Machine',
    label: 'SVM',
    description: 'Finds optimal separating hyperplane',
    type: 'Linear/Non-linear',
    complexity: 'Moderate',
    strengths: ['Kernel trick', 'Good generalization', 'Margin maximization'],
    weaknesses: ['Slow on large datasets', 'Parameter sensitive'],
    icon: '🎯',
  },
  tree: {
    id: 'tree' as const,
    name: 'Decision Tree',
    label: 'Decision Tree',
    description: 'Rule-based classification using recursive splits',
    type: 'Non-linear',
    complexity: 'Moderate',
    strengths: [
      'Handles non-linear data',
      'Interpretable rules',
      'No assumptions',
    ],
    weaknesses: ['Overfitting prone', 'Unstable', 'Bias toward features'],
    icon: '🌳',
  },
} as const;

// Helper functions for dataset/algorithm compatibility
export function getDatasetOptionsForAlgorithm(
  algorithmId: keyof typeof ALGORITHM_CONFIGS
) {
  return Object.values(DATASET_CONFIGS).filter((dataset) =>
    dataset.suitable_algorithms.includes(algorithmId as any)
  );
}

export function getAlgorithmOptionsForDataset(
  datasetId: keyof typeof DATASET_CONFIGS
) {
  const dataset = DATASET_CONFIGS[datasetId];
  return dataset.suitable_algorithms.map((algId) => ALGORITHM_CONFIGS[algId]);
}
