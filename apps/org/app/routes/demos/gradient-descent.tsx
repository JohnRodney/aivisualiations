import React from 'react';
import ComingSoonDemo from '../../components/ComingSoonDemo';

export default function GradientDescentDemo() {
  return (
    <ComingSoonDemo
      title="Gradient Descent Visualization"
      description="Watch optimization algorithms in action! See how gradient descent finds the minimum of cost functions and understand the core algorithm behind machine learning."
      difficulty="Advanced"
      concepts={['Optimization', 'Cost Functions', 'Learning Rate']}
      features={[
        {
          title: 'Interactive Cost Function',
          description:
            'Explore 3D cost surfaces and watch the algorithm navigate to minima',
        },
        {
          title: 'Learning Rate Control',
          description:
            'Adjust learning rates and see how it affects convergence speed',
        },
        {
          title: 'Multiple Algorithms',
          description:
            'Compare SGD, Adam, RMSprop, and other optimization methods',
        },
        {
          title: 'Momentum Visualization',
          description:
            'See how momentum helps escape local minima and accelerates convergence',
        },
        {
          title: 'Convergence Analysis',
          description:
            'Track loss curves and understand when algorithms converge or diverge',
        },
        {
          title: 'Custom Functions',
          description:
            'Test optimizers on different mathematical functions and landscapes',
        },
      ]}
    />
  );
}
