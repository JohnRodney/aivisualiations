# NX React App with Material UI and Redux Toolkit

This is a starter template for a React application built with:

- **NX** - Development tools and build system
- **React** with TypeScript
- **Material UI** - React component library
- **Redux Toolkit** - State management
- **React Router** - Routing

## Project Structure

```
apps/org/
├── app/
│   ├── store/
│   │   ├── store.ts          # Redux store configuration
│   │   ├── hooks.ts          # Typed Redux hooks
│   │   └── counterSlice.ts   # Example Redux slice
│   ├── theme/
│   │   └── theme.ts          # Material UI theme
│   ├── app.tsx               # Main app component
│   ├── root.tsx              # Root layout with providers
│   └── app-nav.tsx           # Navigation component
```

## Getting Started

1. **Install dependencies** (if not already done):

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:4200`

## Features

- **Material UI Integration**: Pre-configured theme and components
- **Redux Toolkit**: Example counter slice with typed hooks
- **TypeScript**: Full TypeScript support
- **Responsive Design**: Material UI responsive components
- **Modern React**: Uses React 19 with latest patterns

## Adding New Features

### Redux Slices

1. Create new slice in `app/store/`
2. Add reducer to `store.ts`
3. Use typed hooks from `hooks.ts`

### Material UI Components

- Import components from `@mui/material`
- Use theme from `theme/theme.ts`
- Customize theme as needed

### Navigation

- Add new routes in `app/routes/`
- Update `app-nav.tsx` with new navigation items

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run linter
