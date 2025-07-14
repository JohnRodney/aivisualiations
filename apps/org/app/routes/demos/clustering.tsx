import React from 'react';
import ComingSoonDemo from '../../components/ComingSoonDemo';

export default function ClusteringDemo() {
  return (
    <ComingSoonDemo
      title="Clustering Algorithms"
      description="Discover patterns in data with unsupervised learning. Watch clustering algorithms group similar data points and understand how they find hidden structures."
      difficulty="Intermediate"
      concepts={['Unsupervised Learning', 'K-Means', 'Hierarchical Clustering']}
      features={[
        {
          title: 'K-Means Visualization',
          description:
            'Watch centroids move and clusters form through iterative optimization',
        },
        {
          title: 'Hierarchical Clustering',
          description:
            'Build and explore dendrograms showing cluster relationships',
        },
        {
          title: 'DBSCAN Algorithm',
          description:
            'Discover clusters of arbitrary shapes with density-based clustering',
        },
        {
          title: 'Elbow Method',
          description:
            'Find the optimal number of clusters with interactive elbow plots',
        },
        {
          title: 'Custom Data Generation',
          description:
            'Create your own datasets with different distributions and shapes',
        },
        {
          title: 'Cluster Validation',
          description:
            'Evaluate clustering quality with silhouette analysis and other metrics',
        },
      ]}
    />
  );
}
