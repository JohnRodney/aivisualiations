import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('app.tsx'),
  route('ml-demos', 'routes/demos.tsx'),
  route('about', 'routes/about.tsx'),
  route('demos/linear-regression', 'routes/demos/linear-regression.tsx'),
  route('demos/neural-network', 'routes/demos/neural-network.tsx'),
  route('demos/classification', 'routes/demos/classification.tsx'),
  route('demos/clustering', 'routes/demos/clustering.tsx'),
  route('demos/gradient-descent', 'routes/demos/gradient-descent.tsx'),
] satisfies RouteConfig;
