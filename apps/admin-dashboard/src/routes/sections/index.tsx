import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';
import { mainRoutes } from './main';

// ----------------------------------------------------------------------
const TranscriptDemoPage = lazy(
  () => import('src/pages/dashboard/transcript/demo')
);

// ----------------------------------------------------------------------

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: <TranscriptDemoPage />,
    },

    // Auth
    ...authRoutes,

    // Dashboard
    ...dashboardRoutes,

    // Main
    ...mainRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
