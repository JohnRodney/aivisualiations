export interface Neuron {
  id: string;
  x: number;
  y: number;
  value: number;
  activation: number;
  bias: number;
  layer: number;
  isActive: boolean;
}

export interface Connection {
  id: string;
  fromNeuron: string;
  toNeuron: string;
  weight: number;
  isActive: boolean;
}

export interface NetworkLayer {
  id: string;
  neurons: Neuron[];
  layerIndex: number;
  type: 'input' | 'hidden' | 'output';
}

export interface NetworkArchitecture {
  layers: NetworkLayer[];
  connections: Connection[];
  inputSize: number;
  hiddenSizes: number[];
  outputSize: number;
}

export type ActivationFunction = 'relu' | 'sigmoid' | 'tanh' | 'linear';

// Activation functions
export const activationFunctions = {
  relu: (x: number) => Math.max(0, x),
  sigmoid: (x: number) => 1 / (1 + Math.exp(-x)),
  tanh: (x: number) => Math.tanh(x),
  linear: (x: number) => x,
};

// Derivatives for backpropagation
export const activationDerivatives = {
  relu: (x: number) => (x > 0 ? 1 : 0),
  sigmoid: (x: number) => {
    const sig = activationFunctions.sigmoid(x);
    return sig * (1 - sig);
  },
  tanh: (x: number) => 1 - Math.pow(Math.tanh(x), 2),
  linear: (x: number) => 1,
};

// Create a simple network architecture
export function createNetwork(
  inputSize: number,
  hiddenSizes: number[],
  outputSize: number
): NetworkArchitecture {
  const layers: NetworkLayer[] = [];
  const connections: Connection[] = [];

  // Layer dimensions and spacing
  const layerSpacing = 150;
  const neuronSpacing = 60;
  const canvasWidth = 600;
  const canvasHeight = 400;

  // Create layers
  const allLayerSizes = [inputSize, ...hiddenSizes, outputSize];
  const layerTypes: Array<'input' | 'hidden' | 'output'> = [
    'input',
    ...hiddenSizes.map(() => 'hidden' as const),
    'output',
  ];

  allLayerSizes.forEach((layerSize, layerIndex) => {
    const neurons: Neuron[] = [];
    const layerType = layerTypes[layerIndex];

    // Calculate layer position
    const layerX = 50 + layerIndex * layerSpacing;
    const startY = (canvasHeight - (layerSize - 1) * neuronSpacing) / 2;

    // Create neurons for this layer
    for (let i = 0; i < layerSize; i++) {
      const neuronY = startY + i * neuronSpacing;
      neurons.push({
        id: `layer-${layerIndex}-neuron-${i}`,
        x: layerX,
        y: neuronY,
        value: 0,
        activation: 0,
        bias: (Math.random() - 0.5) * 0.5,
        layer: layerIndex,
        isActive: false,
      });
    }

    layers.push({
      id: `layer-${layerIndex}`,
      neurons,
      layerIndex,
      type: layerType,
    });
  });

  // Create connections between adjacent layers
  for (let layerIndex = 0; layerIndex < layers.length - 1; layerIndex++) {
    const currentLayer = layers[layerIndex];
    const nextLayer = layers[layerIndex + 1];

    currentLayer.neurons.forEach((fromNeuron) => {
      nextLayer.neurons.forEach((toNeuron) => {
        connections.push({
          id: `conn-${fromNeuron.id}-${toNeuron.id}`,
          fromNeuron: fromNeuron.id,
          toNeuron: toNeuron.id,
          weight: (Math.random() - 0.5) * 2,
          isActive: false,
        });
      });
    });
  }

  return {
    layers,
    connections,
    inputSize,
    hiddenSizes,
    outputSize,
  };
}

// Forward pass through the network
export function forwardPass(
  network: NetworkArchitecture,
  input: number[],
  activationFunction: ActivationFunction = 'relu'
): number[] {
  const { layers, connections } = network;
  const activationFn = activationFunctions[activationFunction];

  // Set input values
  layers[0].neurons.forEach((neuron, index) => {
    neuron.value = input[index] || 0;
    neuron.activation = neuron.value;
  });

  // Process each layer
  for (let layerIndex = 1; layerIndex < layers.length; layerIndex++) {
    const currentLayer = layers[layerIndex];
    const previousLayer = layers[layerIndex - 1];

    currentLayer.neurons.forEach((neuron) => {
      let weightedSum = neuron.bias;

      // Sum weighted inputs from previous layer
      previousLayer.neurons.forEach((prevNeuron) => {
        const connection = connections.find(
          (conn) =>
            conn.fromNeuron === prevNeuron.id && conn.toNeuron === neuron.id
        );
        if (connection) {
          weightedSum += prevNeuron.activation * connection.weight;
        }
      });

      neuron.value = weightedSum;
      neuron.activation = activationFn(weightedSum);
    });
  }

  // Return output layer values
  return layers[layers.length - 1].neurons.map((neuron) => neuron.activation);
}

// Calculate loss (mean squared error)
export function calculateLoss(
  predictions: number[],
  targets: number[]
): number {
  const loss = predictions.reduce((sum, pred, index) => {
    const error = pred - targets[index];
    return sum + error * error;
  }, 0);
  return loss / predictions.length;
}

// Generate sample training data
export function generateTrainingData(
  type: 'xor' | 'classification' | 'regression',
  samples = 100
): { inputs: number[][]; targets: number[][] } {
  const inputs: number[][] = [];
  const targets: number[][] = [];

  switch (type) {
    case 'xor':
      for (let i = 0; i < samples; i++) {
        const x1 = Math.random() > 0.5 ? 1 : 0;
        const x2 = Math.random() > 0.5 ? 1 : 0;
        const output = x1 ^ x2; // XOR operation
        inputs.push([x1, x2]);
        targets.push([output]);
      }
      break;

    case 'classification':
      for (let i = 0; i < samples; i++) {
        const x1 = Math.random() * 2 - 1; // -1 to 1
        const x2 = Math.random() * 2 - 1; // -1 to 1
        const output = x1 + x2 > 0 ? 1 : 0; // Simple linear classification
        inputs.push([x1, x2]);
        targets.push([output]);
      }
      break;

    case 'regression':
      for (let i = 0; i < samples; i++) {
        const x1 = Math.random() * 2 - 1;
        const x2 = Math.random() * 2 - 1;
        const output = x1 * x1 + x2 * x2; // Quadratic function
        inputs.push([x1, x2]);
        targets.push([output]);
      }
      break;
  }

  return { inputs, targets };
}

// Canvas drawing utilities
export function drawNeuron(
  ctx: CanvasRenderingContext2D,
  neuron: Neuron,
  radius = 20,
  color = '#3f51b5'
): void {
  ctx.beginPath();
  ctx.arc(neuron.x, neuron.y, radius, 0, 2 * Math.PI);

  // Fill based on activation
  const intensity = Math.abs(neuron.activation);
  ctx.fillStyle = neuron.isActive
    ? `rgba(76, 175, 80, ${0.3 + intensity * 0.7})`
    : `rgba(63, 81, 181, ${0.3 + intensity * 0.7})`;
  ctx.fill();

  // Border
  ctx.strokeStyle = neuron.isActive ? '#4caf50' : color;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw activation value
  ctx.fillStyle = '#fff';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(neuron.activation.toFixed(2), neuron.x, neuron.y);
}

export function drawConnection(
  ctx: CanvasRenderingContext2D,
  connection: Connection,
  fromNeuron: Neuron,
  toNeuron: Neuron,
  maxWeight = 2
): void {
  const opacity = Math.abs(connection.weight) / maxWeight;
  const color = connection.weight > 0 ? '#4caf50' : '#f44336';

  ctx.beginPath();
  ctx.moveTo(fromNeuron.x, fromNeuron.y);
  ctx.lineTo(toNeuron.x, toNeuron.y);

  ctx.strokeStyle = connection.isActive
    ? `rgba(255, 193, 7, ${opacity})`
    : `${color}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0')}`;
  ctx.lineWidth = Math.max(1, Math.abs(connection.weight) * 2);
  ctx.stroke();
}

export function drawNetwork(
  ctx: CanvasRenderingContext2D,
  network: NetworkArchitecture,
  canvas: HTMLCanvasElement
): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw connections first (behind neurons)
  network.connections.forEach((connection) => {
    const fromNeuron = network.layers
      .flatMap((layer) => layer.neurons)
      .find((n) => n.id === connection.fromNeuron);
    const toNeuron = network.layers
      .flatMap((layer) => layer.neurons)
      .find((n) => n.id === connection.toNeuron);

    if (fromNeuron && toNeuron) {
      drawConnection(ctx, connection, fromNeuron, toNeuron);
    }
  });

  // Draw neurons
  network.layers.forEach((layer) => {
    layer.neurons.forEach((neuron) => {
      const color =
        layer.type === 'input'
          ? '#2196f3'
          : layer.type === 'output'
          ? '#ff9800'
          : '#3f51b5';
      drawNeuron(ctx, neuron, 15, color);
    });
  });

  // Draw layer labels
  ctx.fillStyle = '#666';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  network.layers.forEach((layer) => {
    if (layer.neurons.length > 0) {
      const x = layer.neurons[0].x;
      const y = Math.min(...layer.neurons.map((n) => n.y)) - 30;
      ctx.fillText(
        layer.type === 'input'
          ? 'Input'
          : layer.type === 'output'
          ? 'Output'
          : `Hidden ${layer.layerIndex}`,
        x,
        y
      );
    }
  });
}
