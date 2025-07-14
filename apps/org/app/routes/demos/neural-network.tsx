import React from 'react';
import ComingSoonDemo from '../../components/ComingSoonDemo';

export default function NeuralNetworkDemo() {
  return (
    <ComingSoonDemo
      title="Neural Network Visualization"
      description="Explore how neural networks learn with this interactive visualization. Build, train, and visualize neural networks with different architectures and watch them learn in real-time."
      difficulty="Intermediate"
      concepts={['Neural Networks', 'Backpropagation', 'Activation Functions']}
      features={[
        {
          title: 'Interactive Network Builder',
          description:
            'Design custom neural network architectures with drag-and-drop layers',
        },
        {
          title: 'Real-time Training',
          description:
            'Watch weights and biases update as the network learns from your data',
        },
        {
          title: 'Activation Visualizations',
          description:
            'See how different activation functions affect neuron outputs',
        },
        {
          title: 'Loss Function Tracking',
          description:
            'Monitor training progress with live loss and accuracy graphs',
        },
        {
          title: 'Weight Visualization',
          description:
            'Explore learned features through interactive weight matrices',
        },
        {
          title: 'Dataset Selection',
          description:
            'Train on various datasets from simple XOR to complex image recognition',
        },
      ]}
    />
  );
}
