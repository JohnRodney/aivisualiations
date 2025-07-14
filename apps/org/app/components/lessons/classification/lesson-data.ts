import { LessonData } from '../types';
import { DecisionBoundaryCanvas } from './DecisionBoundaryCanvas';
import { LogisticRegressionCanvas } from './LogisticRegressionCanvas';
import { SVMCanvas } from './SVMCanvas';
import { DecisionTreeCanvas } from './DecisionTreeCanvas';
import { EnsembleCanvas } from './EnsembleCanvas';

export const classificationLessons: LessonData[] = [
  {
    id: 'decision-boundaries',
    title: 'Understanding Decision Boundaries',
    objective: {
      title: 'Learn how algorithms separate different classes',
      description:
        'Explore how classification algorithms create boundaries to distinguish between different classes of data.',
    },
    explanation:
      'Classification is about drawing boundaries in data to separate different classes. Click to add points and see how algorithms adapt their decision boundaries.',
    canvasComponent: DecisionBoundaryCanvas,
    keyTakeaways: [
      'Decision boundaries separate different classes in the feature space',
      'Different algorithms create different types of boundaries',
      'The choice of algorithm depends on the data distribution',
      'Adding more data points can change the decision boundary',
    ],
    nextButtonText: 'Learn Logistic Regression',
  },
  {
    id: 'logistic-regression',
    title: 'Logistic Regression Deep Dive',
    objective: {
      title: 'Master the sigmoid function and gradient descent',
      description:
        'Understand how logistic regression uses the sigmoid function to make probability-based predictions.',
    },
    explanation:
      'Logistic regression uses the sigmoid function to map any real number to a probability between 0 and 1. Watch the training process and see how weights are updated.',
    canvasComponent: LogisticRegressionCanvas,
    keyTakeaways: [
      'Sigmoid function maps linear combinations to probabilities (0-1)',
      'Decision boundary is where probability equals 0.5',
      'Gradient descent optimizes weights to minimize cross-entropy loss',
      'Training involves iterative weight updates based on prediction errors',
    ],
    nextButtonText: 'Explore Support Vector Machines',
  },
  {
    id: 'support-vector-machines',
    title: 'Support Vector Machines',
    objective: {
      title: 'Find the optimal separating hyperplane',
      description:
        'Learn how SVMs find the best decision boundary by maximizing the margin between classes.',
    },
    explanation:
      'SVMs find the optimal decision boundary by maximizing the margin between classes. Support vectors are the data points closest to the decision boundary.',
    canvasComponent: SVMCanvas,
    keyTakeaways: [
      'SVMs maximize the margin between classes for better generalization',
      'Support vectors are the critical points that define the decision boundary',
      'Different kernels (linear, RBF) can handle different data distributions',
      'The C parameter controls the trade-off between margin and classification errors',
    ],
    nextButtonText: 'Learn Decision Trees',
  },
  {
    id: 'decision-trees',
    title: 'Decision Trees',
    objective: {
      title: 'Understand rule-based classification',
      description:
        'See how decision trees create interpretable rules by splitting data based on feature values.',
    },
    explanation:
      'Decision trees classify data by asking a series of yes/no questions. Each split is chosen to maximize information gain.',
    canvasComponent: DecisionTreeCanvas,
    keyTakeaways: [
      'Decision trees make predictions using interpretable if-then rules',
      'Splits are chosen to maximize information gain or minimize impurity',
      'Trees can handle both numerical and categorical features naturally',
      'Single trees can overfit, but they form the basis for ensemble methods',
    ],
    nextButtonText: 'Explore Ensemble Methods',
  },
  {
    id: 'ensemble-methods',
    title: 'Ensemble Methods',
    objective: {
      title: 'Combine multiple models for better performance',
      description:
        'Discover how Random Forest combines many decision trees to create more robust predictions.',
    },
    explanation:
      'Ensemble methods combine multiple models to make better predictions. Random Forest trains many trees on different subsets of data and combines their votes.',
    canvasComponent: EnsembleCanvas,
    keyTakeaways: [
      'Ensemble methods combine multiple models for better performance',
      'Random Forest uses bootstrap sampling to create diverse trees',
      'Majority voting reduces overfitting and improves generalization',
      'Individual weak learners become strong when combined properly',
    ],
    nextButtonText: 'Complete Course',
  },
];
