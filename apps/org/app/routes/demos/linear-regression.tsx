import React from 'react';
import { useNavigate } from 'react-router';
import { LessonContainer } from '../../components/lessons/LessonContainer';
import { linearRegressionLessons } from '../../components/lessons/linear-regression/lesson-data';

export default function LinearRegression() {
  const navigate = useNavigate();

  const handleComplete = () => {
    console.log('Linear regression course completed!');
    // Navigate back to demos page
    navigate('/demos');
  };

  return (
    <LessonContainer
      lessons={linearRegressionLessons}
      title="Interactive Linear Regression Course"
      description="Learn linear regression through hands-on, interactive lessons. Master the fundamentals from line fitting to making predictions."
      onComplete={handleComplete}
    />
  );
}
