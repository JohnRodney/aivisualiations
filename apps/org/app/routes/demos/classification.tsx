import React from 'react';
import ComingSoonDemo from '../../components/ComingSoonDemo';

export default function ClassificationDemo() {
  return (
    <ComingSoonDemo
      title="Classification Algorithms"
      description="Master classification techniques with hands-on visualizations. Explore different algorithms, understand decision boundaries, and see how they perform on various datasets."
      difficulty="Beginner"
      concepts={['Classification', 'Decision Boundaries', 'Model Evaluation']}
      features={[
        {
          title: 'Multiple Algorithms',
          description:
            'Compare SVM, Decision Trees, Random Forest, and more side-by-side',
        },
        {
          title: 'Interactive Data Points',
          description:
            'Click to add data points and see how algorithms adapt in real-time',
        },
        {
          title: 'Decision Boundary Visualization',
          description:
            'Watch how different algorithms create decision boundaries',
        },
        {
          title: 'Performance Metrics',
          description:
            'View accuracy, precision, recall, and F1-score for each algorithm',
        },
        {
          title: 'Feature Importance',
          description:
            'Understand which features matter most for each classification method',
        },
        {
          title: 'Confusion Matrix',
          description:
            'Interactive confusion matrices to analyze classification performance',
        },
      ]}
    />
  );
}
