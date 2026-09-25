import { useContext } from 'react'
import { TournamentContext } from '@/app/tournamentContext'

export const useTournament = () => {
  const value = useContext(TournamentContext)
  if (!value) throw new Error('useTournament must be used inside TournamentProvider.')
  return value
}
