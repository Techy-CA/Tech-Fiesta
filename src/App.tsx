import { RouterProvider } from 'react-router-dom'
import { TournamentProvider } from '@/app/TournamentProvider'
import { router } from '@/app/routes'

export const App = () => (
  <TournamentProvider>
    <RouterProvider router={router} />
  </TournamentProvider>
)
