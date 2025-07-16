import { LessonData } from '../types';
import { WhatIsLineCanvas } from './WhatIsLineCanvas';
import { SlopeInterceptCanvas } from './SlopeInterceptCanvas';
import { BestFitCanvas } from './BestFitCanvas';
import { R2Canvas } from './R2Canvas';
import { PredictionCanvas } from './PredictionCanvas';

export const linearRegressionLessons: LessonData[] = [
  {
    id: 'what-makes-good-line',
    title: 'What Makes a Good Line?',
    objective: {
      title: 'Understand the concept of fitting a line to data',
      description:
        'Learn to visually identify which lines best represent the relationship in scattered data points.',
    },
    explanation:
      'Watch the 30-second video explanation first, then practice by drawing different lines through the data points to see what makes one line better than another.',
    canvasComponent: WhatIsLineCanvas,
    keyTakeaways: [
      'A good line should pass close to as many data points as possible',
      'The best line minimizes the overall distance to all points',
      'Visual judgment is a good starting point, but we need mathematical precision',
    ],
    nextButtonText: 'Learn About Slope & Intercept',
  },
  {
    id: 'slope-intercept-magic',
    title: 'Slope & Intercept Magic',
    objective: {
      title: 'Master the equation y = mx + b',
      description:
        'Understand how changing slope (m) and y-intercept (b) affects the line in real-time.',
    },
    explanation:
      'Every line can be described by the equation y = mx + b. Use the sliders below to see how m (slope) and b (y-intercept) change the line.',
    canvasComponent: SlopeInterceptCanvas,
    keyTakeaways: [
      'Slope (m) determines how steep the line is - positive slopes go up, negative go down',
      'Y-intercept (b) is where the line crosses the y-axis',
      'Small changes in slope can dramatically change predictions for large x values',
    ],
    nextButtonText: 'Find the Best Fit',
  },
  {
    id: 'best-fit-challenge',
    title: 'The Best Fit Challenge',
    objective: {
      title: 'Learn how algorithms find the optimal line',
      description:
        'Compare your intuition with mathematical optimization to find the line that best fits the data.',
    },
    explanation:
      'Can you find the best fitting line? Try to minimize the total distance from all points to your line, then see how the algorithm does it.',
    canvasComponent: BestFitCanvas,
    keyTakeaways: [
      'The "best fit" line minimizes the sum of squared distances to all points',
      'This method is called "least squares" regression',
      'Algorithms can find the mathematically optimal solution',
    ],
    nextButtonText: 'Explore R² Values',
  },
  {
    id: 'r2-detective',
    title: 'R² Detective',
    objective: {
      title: 'Understand how R² measures goodness of fit',
      description:
        'Learn to interpret R² values and what they tell us about our model quality.',
    },
    explanation:
      'R² tells us how well our line explains the data. Explore different datasets and try to predict their R² values.',
    canvasComponent: R2Canvas,
    keyTakeaways: [
      'R² ranges from 0 to 1, where 1 is a perfect fit',
      'R² = 0.8+ indicates a strong linear relationship',
      'Low R² might mean the relationship is not linear, or there is a lot of noise',
    ],
    nextButtonText: 'Make Predictions',
  },
  {
    id: 'prediction-master',
    title: 'Prediction Master',
    objective: {
      title: 'Use your model to make real predictions',
      description:
        'Apply your fitted line to predict new values and understand prediction confidence.',
    },
    explanation:
      'Now that you understand linear regression, use your model to make predictions. Click anywhere to predict the y-value!',
    canvasComponent: PredictionCanvas,
    keyTakeaways: [
      'Linear regression can predict y-values for any x-value',
      'Predictions are most reliable within the range of your training data',
      'The further from your data range, the less confident you should be in predictions',
    ],
    nextButtonText: 'Complete Course',
  },
];
