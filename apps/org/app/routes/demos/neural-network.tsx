import React from 'react';
import { useNavigate } from 'react-router';
import { LessonContainer } from '../../components/lessons/LessonContainer';
import { neuralNetworkLessons } from '../../components/lessons/neural-network/lesson-data';

export default function NeuralNetworkDemo() {
  const navigate = useNavigate();

  const handleComplete = () => {
    console.log('Neural network course completed!');
    // Navigate back to demos page
    navigate('/ml-demos');
  };

  return (
    <LessonContainer
      lessons={neuralNetworkLessons}
      title="Interactive Neural Network Course"
      description="Dive deep into neural networks through hands-on visualizations. Learn how networks are structured, how data flows through them, and how they learn."
      onComplete={handleComplete}
    />
  );
}
