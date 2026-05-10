import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { route } from 'ziggy-js';
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1F6F5F', // green
    },
    secondary: {
      main: '#a5e4d7ff', // blue
    },
  },
})

const appName = import.meta.env.VITE_APP_NAME || 'Sotta.';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        // Initialize Ziggy with the server-provided config from Inertia shared data
        const ziggyConfig = props.initialPage.props.ziggy;
        window.Ziggy = ziggyConfig;
        window.route = (name, params, absolute) => route(name, params, absolute, ziggyConfig);

        const root = createRoot(el);
        root.render(
            <ThemeProvider theme={theme}>
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#6366f1',
    },
});
