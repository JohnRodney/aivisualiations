// Support Vector Machine Algorithm
// Training and prediction functions for SVM classifier with kernel support

import { ClassificationPoint, SVMParams } from '../types';

// RBF Kernel function
function rbfKernel(xi: number[], xj: number[], gamma: number): number {
  // Normalize coordinates to 0-1 range for RBF calculation
  // Assuming canvas size of 600x400
  const xi_norm = [xi[0] / 600, xi[1] / 400];
  const xj_norm = [xj[0] / 600, xj[1] / 400];

  const distance = Math.sqrt(
    (xi_norm[0] - xj_norm[0]) ** 2 + (xi_norm[1] - xj_norm[1]) ** 2
  );
  const rbfValue = Math.exp(-gamma * distance * distance);

  // Debug first few RBF calculations
  if (xi[0] === 0 && xi[1] === 200) {
    console.log(`RBF: original=(${xi[0]}, ${xi[1]}) vs (${xj[0]}, ${xj[1]})`);
    console.log(
      `RBF: normalized=(${xi_norm[0].toFixed(3)}, ${xi_norm[1].toFixed(
        3
      )}) vs (${xj_norm[0].toFixed(3)}, ${xj_norm[1].toFixed(3)})`
    );
    console.log(
      `RBF: distance=${distance.toFixed(
        4
      )}, gamma=${gamma}, rbfValue=${rbfValue.toFixed(6)}`
    );
  }

  return rbfValue;
}

export function trainSVM(
  points: ClassificationPoint[],
  kernel: 'linear' | 'rbf' = 'linear',
  C = 1.0,
  gamma = 0.1
): SVMParams {
  // Simplified SVM implementation
  const n = points.length;
  const features = points.map((p) => [p.x, p.y]);
  const labels = points.map((p) => (p.label === 1 ? 1 : -1));

  // Feature normalization for better training
  const xValues = features.map((f) => f[0]);
  const yValues = features.map((f) => f[1]);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const xRange = xMax - xMin;
  const yRange = yMax - yMin;

  // Normalize features
  const normalizedFeatures = features.map((f) => [
    (f[0] - xMin) / xRange,
    (f[1] - yMin) / yRange,
  ]);

  // Better initialization based on data
  let weights = [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2];
  let bias = (Math.random() - 0.5) * 2;
  const learningRate = 0.1; // Higher learning rate
  const epochs = Math.min(2000, points.length * 50); // Adaptive epochs

  // Support vectors (simplified - in real SVM these are found via optimization)
  const supportVectors: number[] = [];
  const alphas: number[] = new Array(n).fill(0);

  if (kernel === 'linear') {
    // Simplified Linear SVM training that works directly in original space
    // This avoids coordinate transformation issues
    weights = [0.01, 0.01];
    bias = 0;

    const originalLearningRate = 0.001; // Much smaller learning rate for original space
    const maxEpochs = 1000;

    for (let epoch = 0; epoch < maxEpochs; epoch++) {
      let hasUpdates = false;

      for (let i = 0; i < n; i++) {
        const x = features[i]; // Use original features, not normalized
        const y = labels[i];

        const prediction = weights[0] * x[0] + weights[1] * x[1] + bias;
        const margin = y * prediction;

        // SVM hinge loss: update if margin < 1
        if (margin < 1) {
          // Subgradient update for hinge loss
          const reg_term = originalLearningRate * 2 * (1 / C);
          weights[0] =
            weights[0] * (1 - reg_term) + originalLearningRate * y * x[0];
          weights[1] =
            weights[1] * (1 - reg_term) + originalLearningRate * y * x[1];
          bias += originalLearningRate * y;

          hasUpdates = true;

          // Mark as potential support vector
          if (!supportVectors.includes(i)) {
            supportVectors.push(i);
          }
        } else {
          // Just apply regularization when margin >= 1
          const reg_term = originalLearningRate * 2 * (1 / C);
          weights[0] *= 1 - reg_term;
          weights[1] *= 1 - reg_term;
        }
      }

      // Early stopping if no updates
      if (!hasUpdates && epoch > 100) {
        console.log(`SVM converged early at epoch ${epoch}`);
        break;
      }

      // Check convergence every 50 epochs
      if (epoch % 50 === 0) {
        let correctPredictions = 0;
        for (let i = 0; i < n; i++) {
          const x = features[i];
          const y = labels[i];
          const prediction = weights[0] * x[0] + weights[1] * x[1] + bias;
          if ((prediction > 0 && y > 0) || (prediction < 0 && y < 0)) {
            correctPredictions++;
          }
        }
        const accuracy = correctPredictions / n;

        // Early stopping if we achieve good accuracy
        if (accuracy > 0.85) {
          console.log(
            `SVM converged with accuracy ${accuracy.toFixed(
              3
            )} at epoch ${epoch}`
          );
          break;
        }
      }
    }

    // No coordinate transformation needed since we trained in original space
    console.log(
      `Final SVM weights: [${weights[0].toFixed(6)}, ${weights[1].toFixed(
        6
      )}], bias: ${bias.toFixed(6)}`
    );
  } else {
    // RBF kernel SVM (simplified and optimized)
    // Initialize alphas with small values
    for (let i = 0; i < n; i++) {
      alphas[i] = 0.1;
    }

    // Use fewer epochs for RBF to prevent freezing
    const rbfEpochs = Math.min(50, epochs / 20);

    for (let epoch = 0; epoch < rbfEpochs; epoch++) {
      for (let i = 0; i < n; i++) {
        let decision = bias;

        // Calculate decision function using RBF kernel (only for active support vectors)
        for (let j = 0; j < n; j++) {
          if (alphas[j] > 0.01) {
            // Only consider significant alphas
            const xi = features[i]; // Use original features for consistency
            const xj = features[j];
            const rbfValue = rbfKernel(xi, xj, gamma);
            decision += alphas[j] * labels[j] * rbfValue;
          }
        }

        const prediction = Math.sign(decision);
        if (prediction !== labels[i]) {
          alphas[i] = Math.min(alphas[i] + learningRate * 2, C);
          if (!supportVectors.includes(i)) {
            supportVectors.push(i);
          }
        }
      }
    }

    // Ensure we have some support vectors
    if (supportVectors.length === 0) {
      // Add a few random support vectors as fallback
      supportVectors.push(0, Math.floor(n / 2), n - 1);
    }

    // For RBF, weights are not directly meaningful, but we need them for the interface
    weights = [0.1, 0.1]; // Dummy weights for RBF

    console.log(
      `RBF SVM trained with gamma=${gamma}, C=${C}, ${supportVectors.length} support vectors`
    );
  }

  return {
    weights: weights || [0, 0], // Ensure weights exist
    bias: bias || 0,
    kernel,
    C,
    gamma,
    supportVectors: Array.from(new Set(supportVectors)),
    alphas,
  };
}

export function predictSVM(
  x: number,
  y: number,
  params: SVMParams,
  points: ClassificationPoint[]
): 0 | 1 {
  const { weights, bias, kernel, gamma, supportVectors, alphas } = params;

  // Safety check for undefined parameters
  if (!weights || !supportVectors || !alphas) {
    console.warn('SVM parameters not properly initialized');
    return 0;
  }

  if (kernel === 'linear') {
    const decision = weights[0] * x + weights[1] * y + bias;
    return decision >= 0 ? 1 : 0;
  } else {
    // RBF kernel prediction (optimized)
    let decision = bias;
    const gammaValue = gamma || 0.1; // Default gamma if undefined

    // Debug: log first few predictions
    const debugPrediction = x === 0 && y === 200; // Debug point at (0, 200)

    if (debugPrediction) {
      console.log(`\nRBF Debug for point (${x}, ${y}):`);
      console.log(`Initial decision (bias): ${decision}`);
      console.log(`Gamma: ${gammaValue}`);
      console.log(`Support vectors: ${supportVectors.length}`);
      console.log(`Alphas length: ${alphas.length}`);
    }

    // Limit the number of support vectors to prevent excessive computation
    const maxSupportVectors = Math.min(supportVectors.length, 20);

    for (let i = 0; i < maxSupportVectors; i++) {
      const svIndex = supportVectors[i];
      if (svIndex < points.length && alphas[svIndex] > 0.01) {
        // Only consider significant alphas
        const sv = points[svIndex];
        const rbfValue = rbfKernel([x, y], [sv.x, sv.y], gammaValue);
        const label = sv.label === 1 ? 1 : -1;
        const contribution = alphas[svIndex] * label * rbfValue;
        decision += contribution;

        if (debugPrediction) {
          console.log(
            `SV ${i}: idx=${svIndex}, pos=(${sv.x}, ${sv.y}), label=${sv.label}, alpha=${alphas[svIndex]}, rbf=${rbfValue}, contrib=${contribution}`
          );
        }
      }
    }

    const finalPrediction = decision >= 0 ? 1 : 0;

    if (debugPrediction) {
      console.log(
        `Final decision: ${decision}, prediction: ${finalPrediction}`
      );
    }

    return finalPrediction;
  }
}

export { rbfKernel };
