import {
  ClusterPoint,
  Centroid,
  ClusteringDataset,
  KMeansParams,
} from './types';

// Color palette for clusters
export const CLUSTER_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
];

// Calculate Euclidean distance between two points
export const calculateDistance = (
  p1: ClusterPoint,
  p2: ClusterPoint
): number => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

// Find closest centroid to a point
export const findClosestCentroid = (
  point: ClusterPoint,
  centroids: Centroid[]
): number => {
  let minDistance = Infinity;
  let closestId = 0;

  centroids.forEach((centroid, index) => {
    const distance = calculateDistance(point, centroid);
    if (distance < minDistance) {
      minDistance = distance;
      closestId = index;
    }
  });

  return closestId;
};

// Calculate new centroid position based on assigned points
export const calculateCentroid = (
  points: ClusterPoint[],
  clusterId: number
): { x: number; y: number } => {
  const clusterPoints = points.filter((p) => p.clusterId === clusterId);

  if (clusterPoints.length === 0) {
    return { x: 0, y: 0 };
  }

  const sumX = clusterPoints.reduce((sum, p) => sum + p.x, 0);
  const sumY = clusterPoints.reduce((sum, p) => sum + p.y, 0);

  return {
    x: sumX / clusterPoints.length,
    y: sumY / clusterPoints.length,
  };
};

// Initialize centroids using K-means++ algorithm
export const initializeCentroids = (
  points: ClusterPoint[],
  k: number,
  method: 'random' | 'kmeans++' = 'kmeans++',
  canvasWidth: number,
  canvasHeight: number
): Centroid[] => {
  const centroids: Centroid[] = [];

  if (method === 'random') {
    for (let i = 0; i < k; i++) {
      centroids.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        id: i,
        color: CLUSTER_COLORS[i % CLUSTER_COLORS.length],
      });
    }
  } else {
    // K-means++ initialization
    // First centroid is random
    const firstPoint = points[Math.floor(Math.random() * points.length)];
    centroids.push({
      x: firstPoint.x,
      y: firstPoint.y,
      id: 0,
      color: CLUSTER_COLORS[0],
    });

    // Subsequent centroids are chosen based on distance from existing centroids
    for (let i = 1; i < k; i++) {
      const distances = points.map((point) => {
        const minDist = Math.min(
          ...centroids.map((c) => calculateDistance(point, c))
        );
        return minDist * minDist;
      });

      const totalDistance = distances.reduce((sum, d) => sum + d, 0);
      const threshold = Math.random() * totalDistance;

      let sum = 0;
      let chosenIndex = 0;
      for (let j = 0; j < distances.length; j++) {
        sum += distances[j];
        if (sum >= threshold) {
          chosenIndex = j;
          break;
        }
      }

      centroids.push({
        x: points[chosenIndex].x,
        y: points[chosenIndex].y,
        id: i,
        color: CLUSTER_COLORS[i % CLUSTER_COLORS.length],
      });
    }
  }

  return centroids;
};

// Calculate within-cluster sum of squares (inertia)
export const calculateInertia = (
  points: ClusterPoint[],
  centroids: Centroid[]
): number => {
  return points.reduce((sum, point) => {
    const centroid = centroids.find((c) => c.id === point.clusterId);
    if (!centroid) return sum;

    const distance = calculateDistance(point, centroid);
    return sum + distance * distance;
  }, 0);
};

// Generate sample datasets for clustering
export const generateClusteringDataset = (
  type: 'blobs' | 'circles' | 'moons' | 'uniform',
  numPoints: number,
  canvasWidth: number,
  canvasHeight: number
): ClusteringDataset => {
  const points: ClusterPoint[] = [];
  const margin = 50;
  const width = canvasWidth - 2 * margin;
  const height = canvasHeight - 2 * margin;

  switch (type) {
    case 'blobs': {
      // Generate 3 distinct blobs
      const blobCenters = [
        { x: width * 0.25, y: height * 0.3 },
        { x: width * 0.75, y: height * 0.3 },
        { x: width * 0.5, y: height * 0.7 },
      ];

      for (let i = 0; i < numPoints; i++) {
        const center = blobCenters[i % blobCenters.length];
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 60 + 20;
        points.push({
          x: center.x + Math.cos(angle) * radius + margin,
          y: center.y + Math.sin(angle) * radius + margin,
          originalIndex: i,
        });
      }
      break;
    }

    case 'circles': {
      // Generate concentric circles
      for (let i = 0; i < numPoints; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() < 0.5 ? 80 : 150;
        const centerX = width * 0.5;
        const centerY = height * 0.5;
        points.push({
          x: centerX + Math.cos(angle) * radius + margin,
          y: centerY + Math.sin(angle) * radius + margin,
          originalIndex: i,
        });
      }
      break;
    }

    case 'uniform': {
      // Random uniform distribution
      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: Math.random() * width + margin,
          y: Math.random() * height + margin,
          originalIndex: i,
        });
      }
      break;
    }

    default:
      // Default to blobs
      return generateClusteringDataset(
        'blobs',
        numPoints,
        canvasWidth,
        canvasHeight
      );
  }

  return {
    points,
    name: type,
    description: `${type} dataset with ${numPoints} points`,
  };
};
