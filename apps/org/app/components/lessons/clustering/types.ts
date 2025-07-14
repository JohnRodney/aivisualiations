export interface ClusterPoint {
  x: number;
  y: number;
  clusterId?: number;
  originalIndex?: number;
}

export interface Centroid {
  x: number;
  y: number;
  id: number;
  color: string;
}

export interface ClusteringDataset {
  points: ClusterPoint[];
  name: string;
  description: string;
}

export interface ClusteringResult {
  centroids: Centroid[];
  points: ClusterPoint[];
  iterations: number;
  inertia: number;
  converged: boolean;
}

export interface ClusteringAlgorithm {
  name: string;
  type: 'kmeans' | 'hierarchical' | 'dbscan';
  description: string;
  parameters: Record<string, any>;
}

export interface ClusteringMetrics {
  inertia: number;
  silhouetteScore: number;
  iterations: number;
  converged: boolean;
}

export interface KMeansParams {
  k: number;
  maxIterations: number;
  tolerance: number;
  initMethod: 'random' | 'kmeans++';
}

export interface ClusteringCanvasProps {
  onInteraction?: (data: any) => void;
}
