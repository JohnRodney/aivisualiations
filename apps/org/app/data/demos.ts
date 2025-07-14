export interface DemoData {
  title: string;
  description: string;
  route: string;
  status: 'Ready' | 'Coming Soon';
  color: 'success' | 'warning' | 'error' | 'info';
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  concepts?: string[];
}

export const featuredDemos: DemoData[] = [
  {
    title: 'Linear Regression',
    description:
      'Interactive scatter plot with real-time regression line fitting',
    route: '/demos/linear-regression',
    status: 'Ready',
    color: 'success',
    difficulty: 'Beginner',
    concepts: ['Supervised Learning', 'Regression', 'Statistics'],
  },
  {
    title: 'Neural Network',
    description: 'Visualize data flowing through neural network layers',
    route: '/demos/neural-network',
    status: 'Coming Soon',
    color: 'warning',
    difficulty: 'Intermediate',
    concepts: ['Deep Learning', 'Neural Networks', 'Backpropagation'],
  },
  {
    title: 'Classification',
    description: 'Explore binary classification with decision boundaries',
    route: '/demos/classification',
    status: 'Coming Soon',
    color: 'warning',
    difficulty: 'Beginner',
    concepts: ['Supervised Learning', 'Classification', 'Decision Boundaries'],
  },
];

export const benefitsData = [
  {
    icon: '🎯',
    title: 'Visual Understanding',
    description: 'See algorithms in action rather than just reading about them',
  },
  {
    icon: '🎮',
    title: 'Hands-On Experience',
    description: 'Manipulate parameters and see immediate results',
  },
  {
    icon: '🧠',
    title: 'Intuitive Learning',
    description: 'Build intuition through experimentation and play',
  },
];
