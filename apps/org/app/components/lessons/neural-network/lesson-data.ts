import { LessonData } from '../types';
import { NetworkArchitectureCanvas } from './NetworkArchitectureCanvas';
import { ForwardPassCanvas } from './ForwardPassCanvas';
import { ActivationCanvas } from './ActivationCanvas';
import { BackpropagationCanvas } from './BackpropagationCanvas';
import { TrainingCanvas } from './TrainingCanvas';

export const neuralNetworkLessons: LessonData[] = [
  {
    id: 'network-architecture',
    title: 'Network Architecture',
    objective: {
      title: 'Understand how neural networks are structured',
      description:
        'Learn about neurons, layers, and connections. Build your own network architecture and see how it affects the model.',
    },
    explanation:
      'Neural networks are composed of interconnected nodes (neurons) organized in layers. Each connection has a weight that determines how much influence one neuron has on another.',
    canvasComponent: NetworkArchitectureCanvas,
    keyTakeaways: [
      'Neurons are the basic building blocks of neural networks',
      'Networks are organized in layers: input, hidden, and output layers',
      'More layers and neurons can capture more complex patterns',
      'Each connection between neurons has a weight that can be learned',
    ],
    nextButtonText: 'Explore Forward Pass',
  },
  {
    id: 'forward-pass',
    title: 'Forward Pass',
    objective: {
      title: 'Watch data flow through the network',
      description:
        'See how input data is transformed as it passes through each layer of the network.',
    },
    explanation:
      'The forward pass is how a neural network makes predictions. Data enters through the input layer, gets transformed at each hidden layer, and produces an output.',
    canvasComponent: ForwardPassCanvas,
    keyTakeaways: [
      'Data flows from input layer to output layer',
      'Each neuron computes a weighted sum of its inputs',
      'The network transforms data at each layer',
      "The final output is the network's prediction",
    ],
    nextButtonText: 'Learn Activation Functions',
  },
  {
    id: 'activation-functions',
    title: 'Activation Functions',
    objective: {
      title: 'Discover how neurons decide when to activate',
      description:
        "Explore different activation functions and see how they affect the network's behavior.",
    },
    explanation:
      'Activation functions determine whether a neuron should be activated or not. They introduce non-linearity, allowing networks to learn complex patterns.',
    canvasComponent: ActivationCanvas,
    keyTakeaways: [
      'Activation functions introduce non-linearity to the network',
      'Different functions have different properties (ReLU, Sigmoid, Tanh)',
      'The choice of activation function affects learning speed and performance',
      'Without activation functions, networks would only learn linear patterns',
    ],
    nextButtonText: 'Understand Backpropagation',
  },
  {
    id: 'backpropagation',
    title: 'Backpropagation',
    objective: {
      title: 'Learn how neural networks learn from mistakes',
      description:
        'Understand how errors are propagated backward through the network to update weights.',
    },
    explanation:
      'Backpropagation is the learning algorithm that allows neural networks to improve. It calculates how much each weight contributed to the error and adjusts them accordingly.',
    canvasComponent: BackpropagationCanvas,
    keyTakeaways: [
      'Backpropagation calculates gradients for each weight in the network',
      'Errors are propagated backward from output to input layers',
      'Weights are updated to minimize the prediction error',
      'This process is repeated many times to train the network',
    ],
    nextButtonText: 'Watch Training',
  },
  {
    id: 'training-visualization',
    title: 'Training Visualization',
    objective: {
      title: 'Watch a neural network learn in real-time',
      description:
        'See how loss decreases and accuracy improves as the network trains on different datasets.',
    },
    explanation:
      'Training combines forward pass and backpropagation repeatedly. Watch as the network learns patterns from data and improves its predictions over time.',
    canvasComponent: TrainingCanvas,
    keyTakeaways: [
      'Training is an iterative process of forward pass and backpropagation',
      "Loss function measures how wrong the network's predictions are",
      'Learning rate controls how fast the network learns',
      'Different datasets require different network architectures and training strategies',
    ],
    nextButtonText: 'Complete Course',
  },
];
