import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import RequireAuth from '../components/RequireAuth'
import Dashboard from '../pages/Dashboard'
import Websites from '../pages/Websites'
import WebsiteDetail from '../pages/WebsiteDetail'
import Settings from '../pages/Settings'
import Login from '../pages/Login'
import Ucs from '../pages/Ucs'

/**
 * Application route tree.
 *
 * - `/login` is wrapped by `AuthLayout` (centered auth card).
 * - Every other route is wrapped by `RequireAuth` + `MainLayout` (top bar +
 *   content shell), so the shared chrome only mounts once for authenticated
 *   pages and unauthenticated users are redirected to `/login`.
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'websites', element: <Websites /> },
      { path: 'websites/:id', element: <WebsiteDetail /> },
      { path: 'websites/:id/ucs', element: <Ucs /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
])
