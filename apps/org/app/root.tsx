import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type MetaFunction,
  type LinksFunction,
} from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { CustomThemeProvider, useTheme } from './theme/ThemeContext';
import { store } from './store/store';

import { AppNav } from './app-nav';

export const meta: MetaFunction = () => [
  {
    title: 'New Nx React Router App',
  },
];

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
  },
];

// Internal component that consumes the theme
function AppContent({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppNav />
      <div style={{ paddingTop: '64px' }}>
        {' '}
        {/* Add padding to account for fixed header */}
        {children}
      </div>
    </ThemeProvider>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Provider store={store}>
          <CustomThemeProvider>
            <AppContent>{children}</AppContent>
          </CustomThemeProvider>
        </Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
