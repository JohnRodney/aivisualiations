// Decision Boundary Visualization
// Functions for creating and visualizing decision boundaries

import {
  ClassificationPoint,
  DecisionBoundary,
  LogisticRegressionParams,
  SVMParams,
  DecisionTreeNode,
} from '../types';
import { predictSVM, predictDecisionTree } from '../algorithms';

export function createDecisionBoundary(
  algorithm: 'logistic' | 'svm' | 'tree',
  params: any,
  points: ClassificationPoint[],
  width = 600,
  height = 400
): DecisionBoundary {
  const boundaryPoints: { x: number; y: number }[] = [];
  const step = 5; // Higher resolution for better visualization

  if (algorithm === 'logistic') {
    const { weights, bias } = params as LogisticRegressionParams;

    // Safety check for undefined weights
    if (!weights || weights.length !== 2) {
      console.warn('Logistic regression weights not properly initialized');
      return { type: 'linear', points: [] };
    }

    // For logistic regression, find the decision boundary where probability = 0.5
    // This occurs when weights[0] * x + weights[1] * y + bias = 0
    if (Math.abs(weights[1]) > 0.001) {
      // Create boundary line
      for (let x = 0; x <= width; x += step) {
        const y = -(weights[0] * x + bias) / weights[1];
        if (y >= 0 && y <= height) {
          boundaryPoints.push({ x, y });
        }
      }
    } else if (Math.abs(weights[0]) > 0.001) {
      // Vertical line case
      const x = -bias / weights[0];
      if (x >= 0 && x <= width) {
        for (let y = 0; y <= height; y += step) {
          boundaryPoints.push({ x, y });
        }
      }
    }

    return {
      type: 'linear',
      points: boundaryPoints,
      equation: `${weights[0].toFixed(2)}x + ${weights[1].toFixed(
        2
      )}y + ${bias.toFixed(2)} = 0`,
    };
  }

  if (algorithm === 'svm') {
    const svmParams = params as SVMParams;

    console.log('Creating SVM boundary with params:', svmParams);

    if (svmParams.kernel === 'linear') {
      // Linear SVM - using improved boundary calculation
      const { weights, bias } = svmParams;

      // Safety check for undefined weights
      if (!weights || weights.length !== 2) {
        console.warn('SVM weights not properly initialized');
        return { type: 'linear', points: [] };
      }

      console.log(
        `SVM boundary: weights=[${weights[0].toFixed(6)}, ${weights[1].toFixed(
          6
        )}], bias=${bias.toFixed(6)}`
      );

      // Use the same robust approach as the standalone SVM
      if (Math.abs(weights[1]) > 0.0001) {
        let hasValidPoints = false;

        for (let x = 0; x <= width; x += step) {
          const y = -(weights[0] * x + bias) / weights[1];
          if (y >= 0 && y <= height) {
            boundaryPoints.push({ x, y });
            hasValidPoints = true;
          }
        }

        // If no valid points, try intersection method
        if (!hasValidPoints) {
          console.log('No valid points found, using intersection method');
          const intersections = [];

          // Left edge (x=0)
          const yLeft = -(weights[0] * 0 + bias) / weights[1];
          if (yLeft >= 0 && yLeft <= height) {
            intersections.push({ x: 0, y: yLeft });
          }

          // Right edge (x=width)
          const yRight = -(weights[0] * width + bias) / weights[1];
          if (yRight >= 0 && yRight <= height) {
            intersections.push({ x: width, y: yRight });
          }

          // Top edge (y=0)
          const xTop = -(weights[1] * 0 + bias) / weights[0];
          if (xTop >= 0 && xTop <= width) {
            intersections.push({ x: xTop, y: 0 });
          }

          // Bottom edge (y=height)
          const xBottom = -(weights[1] * height + bias) / weights[0];
          if (xBottom >= 0 && xBottom <= width) {
            intersections.push({ x: xBottom, y: height });
          }

          console.log('Intersections found:', intersections);

          // Add intersection points to boundary
          if (intersections.length >= 2) {
            boundaryPoints.push(...intersections.slice(0, 2));
          }
        }
      } else if (Math.abs(weights[0]) > 0.0001) {
        // Vertical line case
        const x = -bias / weights[0];
        if (x >= 0 && x <= width) {
          for (let y = 0; y <= height; y += step) {
            boundaryPoints.push({ x, y });
          }
        }
      }

      console.log(`Generated ${boundaryPoints.length} boundary points`);

      return {
        type: 'linear',
        points: boundaryPoints,
        equation: `SVM: ${weights[0].toFixed(4)}x + ${weights[1].toFixed(
          4
        )}y + ${bias.toFixed(4)} = 0`,
      };
    } else {
      // RBF SVM - create contour asynchronously
      return {
        type: 'nonlinear',
        points: [], // Will be populated asynchronously
        equation: `RBF SVM (γ=${svmParams.gamma?.toFixed(3)})`,
        async: true, // Flag to indicate async processing needed
      };
    }
  }

  if (algorithm === 'tree') {
    const tree = params as DecisionTreeNode;

    // For decision trees, create rectangular regions
    const regions: { x: number; y: number }[] = [];

    // Sample grid and find boundary transitions
    for (let x = 0; x <= width; x += step) {
      for (let y = 0; y <= height; y += step) {
        const prediction = predictDecisionTree(x, y, tree);
        const rightPred =
          x + step <= width
            ? predictDecisionTree(x + step, y, tree)
            : prediction;
        const downPred =
          y + step <= height
            ? predictDecisionTree(x, y + step, tree)
            : prediction;

        // Add points where prediction changes (boundaries)
        if (prediction !== rightPred || prediction !== downPred) {
          regions.push({ x, y });
        }
      }
    }

    return {
      type: 'nonlinear',
      points: regions,
      equation: `Decision Tree (depth=${tree.depth})`,
    };
  }

  return { type: 'linear', points: [] };
}

// Async RBF SVM boundary calculation
export async function createRBFBoundaryAsync(
  svmParams: SVMParams,
  points: ClassificationPoint[],
  width = 600,
  height = 400,
  onProgress?: (progress: number, points: { x: number; y: number }[]) => void
): Promise<{ x: number; y: number }[]> {
  console.log('Starting RBF boundary calculation with params:', svmParams);
  console.log('Points for prediction:', points.length);

  const contourPoints: { x: number; y: number }[] = [];
  const step = 15; // Balanced step size
  const totalSteps = Math.ceil(width / step) * Math.ceil(height / step);
  let currentStep = 0;

  const batchSize = 100; // Process 100 points at a time

  // Sample a few predictions to check if they're varying
  const samplePredictions: { x: number; y: number; pred: 0 | 1 }[] = [];
  for (let i = 0; i < Math.min(10, Math.ceil(width / step)); i++) {
    const x = i * step;
    const y = height / 2; // Middle row
    const pred = predictSVM(x, y, svmParams, points);
    samplePredictions.push({ x, y, pred });
  }
  console.log('Sample predictions:', samplePredictions);

  // Check if all predictions are the same
  const allSame = samplePredictions.every(
    (p) => p.pred === samplePredictions[0].pred
  );
  console.log(
    `All predictions the same: ${allSame}, value: ${samplePredictions[0]?.pred}`
  );

  if (allSame) {
    console.log('All predictions are identical - no boundary will be found');
    console.log(
      'This suggests bias is too large or RBF contributions are too small'
    );
  }

  for (let x = 0; x <= width; x += step) {
    const rowPromises: Promise<void>[] = [];

    for (let y = 0; y <= height; y += step) {
      rowPromises.push(
        new Promise<void>((resolve) => {
          setTimeout(() => {
            const prediction = predictSVM(x, y, svmParams, points);

            // Check right neighbor
            if (x + step <= width) {
              const nextX = predictSVM(x + step, y, svmParams, points);
              if (prediction !== nextX) {
                contourPoints.push({ x, y });
                console.log(
                  `Boundary point found at (${x}, ${y}): ${prediction} -> ${nextX}`
                );
                resolve();
                return;
              }
            }

            // Check bottom neighbor
            if (y + step <= height) {
              const nextY = predictSVM(x, y + step, svmParams, points);
              if (prediction !== nextY) {
                contourPoints.push({ x, y });
                console.log(
                  `Boundary point found at (${x}, ${y}): ${prediction} -> ${nextY}`
                );
              }
            }

            currentStep++;
            resolve();
          }, 0);
        })
      );

      // Process in batches to avoid overwhelming the event loop
      if (rowPromises.length >= batchSize) {
        await Promise.all(rowPromises);
        rowPromises.length = 0;

        // Report progress
        const progress = currentStep / totalSteps;
        onProgress?.(progress, [...contourPoints]);

        // Allow UI to update
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    }

    // Process remaining promises
    if (rowPromises.length > 0) {
      await Promise.all(rowPromises);
      const progress = currentStep / totalSteps;
      onProgress?.(progress, [...contourPoints]);
    }
  }

  console.log(
    `RBF boundary calculation complete. Found ${contourPoints.length} boundary points`
  );
  return contourPoints;
}
