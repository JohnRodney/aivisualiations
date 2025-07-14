import React from 'react';
import { useNavigate } from 'react-router';
import { LessonContainer } from '../../components/lessons/LessonContainer';
import { classificationLessons } from '../../components/lessons/classification/lesson-data';

export default function ClassificationDemo() {
  const navigate = useNavigate();

  const handleComplete = () => {
    console.log('Classification course completed!');
    // Navigate back to demos page
    navigate('/demos');
  };

  return (
    <LessonContainer
      lessons={classificationLessons}
      title="Interactive Classification Course"
      description="Master classification algorithms through hands-on visualizations. Learn about decision boundaries, logistic regression, SVMs, decision trees, and ensemble methods."
      onComplete={handleComplete}
    />
  );
}
