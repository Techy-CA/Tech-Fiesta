import { createContext } from 'react'
import type { Fixture, StandingRow, Team, TeamDraft } from '@/types/tournament'

export interface TournamentContextValue {
  backend: 'firestore' | 'local'
  loading: boolean
  error: string | null
  teams: Team[]
  fixtures: Fixture[]
  standings: StandingRow[]
  groupFixtures: Fixture[]
  playoffFixtures: Fixture[]
  championId: string | null
  rosterFull: boolean
  groupComplete: boolean
  hasFixtures: boolean
  teamName: (teamId: string | null) => string
  teamTag: (teamId: string | null) => string
  createTeam: (draft: TeamDraft) => Promise<void>
  deleteTeam: (teamId: string) => Promise<void>
  generateGroupStage: () => Promise<void>
  generatePlayoffs: () => Promise<void>
  submitResult: (fixtureId: string, homeScore: number, awayScore: number) => Promise<void>
  clearFixtures: () => Promise<void>
  resetAll: () => Promise<void>
}

export const TournamentContext = createContext<TournamentContextValue | null>(null)
