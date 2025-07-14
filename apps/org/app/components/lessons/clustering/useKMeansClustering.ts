import { useState, useCallback, useEffect } from 'react';
import {
  ClusterPoint,
  Centroid,
  ClusteringDataset,
  ClusteringResult,
  KMeansParams,
  ClusteringMetrics,
} from './types';
import {
  calculateDistance,
  findClosestCentroid,
  calculateCentroid,
  initializeCentroids,
  calculateInertia,
  generateClusteringDataset,
} from './utils';

interface UseKMeansClusteringReturn {
  dataset: ClusteringDataset;
  centroids: Centroid[];
  result: ClusteringResult | null;
  metrics: ClusteringMetrics | null;
  isRunning: boolean;
  iterations: number;
  params: KMeansParams;
  setParams: (params: Partial<KMeansParams>) => void;
  generateDataset: (type: 'blobs' | 'circles' | 'moons' | 'uniform') => void;
  runKMeans: (canvasWidth: number, canvasHeight: number) => Promise<void>;
  reset: () => void;
  addPoint: (point: ClusterPoint) => void;
  clearPoints: () => void;
}

export const useKMeansClustering = (
  initialDatasetType: 'blobs' | 'circles' | 'moons' | 'uniform' = 'blobs',
  canvasWidth = 600,
  canvasHeight = 400
): UseKMeansClusteringReturn => {
  const [dataset, setDataset] = useState<ClusteringDataset>(() =>
    generateClusteringDataset(initialDatasetType, 60, canvasWidth, canvasHeight)
  );
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [result, setResult] = useState<ClusteringResult | null>(null);
  const [metrics, setMetrics] = useState<ClusteringMetrics | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [iterations, setIterations] = useState(0);
  const [params, setParamsState] = useState<KMeansParams>({
    k: 3,
    maxIterations: 100,
    tolerance: 0.001,
    initMethod: 'kmeans++',
  });

  const setParams = useCallback((newParams: Partial<KMeansParams>) => {
    setParamsState((prev) => ({ ...prev, ...newParams }));
  }, []);

  const generateDataset = useCallback(
    (type: 'blobs' | 'circles' | 'moons' | 'uniform') => {
      const newDataset = generateClusteringDataset(
        type,
        60,
        canvasWidth,
        canvasHeight
      );
      setDataset(newDataset);
      setCentroids([]);
      setResult(null);
      setMetrics(null);
      setIterations(0);
    },
    [canvasWidth, canvasHeight]
  );

  const addPoint = useCallback((point: ClusterPoint) => {
    setDataset((prev) => ({
      ...prev,
      points: [...prev.points, { ...point, originalIndex: prev.points.length }],
    }));
  }, []);

  const clearPoints = useCallback(() => {
    setDataset((prev) => ({
      ...prev,
      points: [],
    }));
    setCentroids([]);
    setResult(null);
    setMetrics(null);
    setIterations(0);
  }, []);

  const runKMeans = useCallback(
    async (canvasWidth: number, canvasHeight: number) => {
      if (dataset.points.length < params.k) {
        console.warn('Not enough points for clustering');
        return;
      }

      setIsRunning(true);
      setIterations(0);

      // Initialize centroids
      let currentCentroids = initializeCentroids(
        dataset.points,
        params.k,
        params.initMethod,
        canvasWidth,
        canvasHeight
      );
      setCentroids(currentCentroids);

      let currentPoints = [...dataset.points];
      let converged = false;
      let iteration = 0;

      while (iteration < params.maxIterations && !converged) {
        // Assignment step: assign each point to nearest centroid
        const newPoints = currentPoints.map((point) => ({
          ...point,
          clusterId: findClosestCentroid(point, currentCentroids),
        }));

        // Update step: recalculate centroids
        const newCentroids = currentCentroids.map((centroid) => {
          const newPosition = calculateCentroid(newPoints, centroid.id);
          return {
            ...centroid,
            x: newPosition.x,
            y: newPosition.y,
          };
        });

        // Check for convergence
        const maxMovement = Math.max(
          ...newCentroids.map((newCentroid, index) =>
            calculateDistance(newCentroid, currentCentroids[index])
          )
        );

        converged = maxMovement < params.tolerance;

        currentPoints = newPoints;
        currentCentroids = newCentroids;
        iteration++;

        // Update state
        setCentroids(currentCentroids);
        setIterations(iteration);

        // Add small delay for visualization
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      // Calculate final metrics
      const inertia = calculateInertia(currentPoints, currentCentroids);
      const finalMetrics: ClusteringMetrics = {
        inertia,
        silhouetteScore: 0, // Simplified for now
        iterations: iteration,
        converged,
      };

      const finalResult: ClusteringResult = {
        centroids: currentCentroids,
        points: currentPoints,
        iterations: iteration,
        inertia,
        converged,
      };

      setResult(finalResult);
      setMetrics(finalMetrics);
      setIsRunning(false);
    },
    [dataset.points, params]
  );

  const reset = useCallback(() => {
    setCentroids([]);
    setResult(null);
    setMetrics(null);
    setIterations(0);
  }, []);

  return {
    dataset,
    centroids,
    result,
    metrics,
    isRunning,
    iterations,
    params,
    setParams,
    generateDataset,
    runKMeans,
    reset,
    addPoint,
    clearPoints,
  };
};
