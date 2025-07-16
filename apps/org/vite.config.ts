/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import unusedCode from 'vite-plugin-unused-code';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/org',
  server: {
    port: 4200,
    host: 'localhost',
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/manim-visuals/**'],
    },
    // Add specific MIME type for video files
    middlewareMode: false,
    fs: {
      allow: ['..', '../..'],
    },
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [
    !process.env.VITEST && reactRouter(),
    // Temporarily disable unused code plugin to reduce file system pressure
    // unusedCode({
    //   patterns: ['app/**/*.*'],
    //   exclude: ['**/*.spec.*', '**/*.test.*', '**/test*'],
    //   detectUnusedFiles: true,
    //   detectUnusedExport: true,
    //   log: 'unused',
    //   exportJSON: true,
    // }),
  ],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
    ],
    exclude: ['manim-visuals'],
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
