import React from 'react';
import { useNavigate } from 'react-router';
import { LessonContainer } from '../../components/lessons/LessonContainer';
import { clusteringLessons } from '../../components/lessons/clustering';

export default function ClusteringDemo() {
  const navigate = useNavigate();

  const handleComplete = () => {
    console.log('Clustering course completed!');
    // Navigate back to demos page
    navigate('/ml-demos');
  };

  return (
    <LessonContainer
      lessons={clusteringLessons}
      title="Clustering Algorithms"
      description="Discover patterns in data with unsupervised learning. Watch clustering algorithms group similar data points and understand how they find hidden structures."
      onComplete={handleComplete}
    />
  );
}
