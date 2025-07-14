import { LessonData } from '../types';
import { KMeansCanvas } from './KMeansCanvas';

export const clusteringLessons: LessonData[] = [
  {
    id: 'kmeans-basics',
    title: 'K-Means Clustering Basics',
    objective: {
      title: 'Understand how K-means groups similar data points',
      description:
        'Learn how the K-means algorithm iteratively finds cluster centers and assigns points to the nearest cluster.',
    },
    explanation:
      'K-means clustering is an unsupervised learning algorithm that groups data points into k clusters. Click on the canvas to add points, choose the number of clusters (k), and watch the algorithm find the optimal cluster centers.',
    canvasComponent: KMeansCanvas,
    keyTakeaways: [
      'K-means requires you to specify the number of clusters (k) beforehand',
      'The algorithm iteratively updates cluster centers until convergence',
      'Points are assigned to the nearest cluster center (centroid)',
      'The algorithm minimizes the within-cluster sum of squares (inertia)',
      'Different initializations can lead to different results',
    ],
    nextButtonText: 'Explore Advanced Clustering',
    completionCriteria: 'Run K-means clustering on different datasets',
  },
  {
    id: 'choosing-k',
    title: 'Choosing the Right Number of Clusters',
    objective: {
      title: 'Learn how to determine the optimal number of clusters',
      description:
        'Explore different methods for selecting the best value of k, including the elbow method and silhouette analysis.',
    },
    explanation:
      'One of the biggest challenges in K-means is choosing the right number of clusters. Try different values of k on the same dataset and observe how the inertia changes.',
    canvasComponent: KMeansCanvas,
    keyTakeaways: [
      'The elbow method helps identify the optimal k by plotting inertia vs k',
      'Too few clusters may under-fit the data',
      'Too many clusters may over-fit and create meaningless groups',
      'Silhouette analysis measures how well-separated clusters are',
      'Domain knowledge often helps in choosing appropriate k',
    ],
    nextButtonText: 'Complete Clustering Course',
    completionCriteria: 'Test different k values and observe the results',
  },
];
