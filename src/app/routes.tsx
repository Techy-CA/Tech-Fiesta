import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Shell } from '@/components/layout/Shell'
import { EmptyState } from '@/components/ui/EmptyState'

const Home = lazy(() => import('@/pages/Home'))
const Squads = lazy(() => import('@/pages/Squads'))
const Fixtures = lazy(() => import('@/pages/Fixtures'))
const Standings = lazy(() => import('@/pages/Standings'))
const Register = lazy(() => import('@/pages/Register'))
const Control = lazy(() => import('@/pages/Control'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const Loading = () => (
  <div className="wrap page">
    <EmptyState title="Loading" note="Preparing the view." />
  </div>
)

const withSuspense = (node: React.ReactNode) => <Suspense fallback={<Loading />}>{node}</Suspense>

export const router = createBrowserRouter([
  {
    element: <Shell />,
    children: [
      { path: '/', element: withSuspense(<Home />) },
      { path: '/squads', element: withSuspense(<Squads />) },
      { path: '/fixtures', element: withSuspense(<Fixtures />) },
      { path: '/standings', element: withSuspense(<Standings />) },
      { path: '/register', element: withSuspense(<Register />) },
      { path: '/control', element: withSuspense(<Control />) },
      { path: '*', element: withSuspense(<NotFound />) },
    ],
  },
])
