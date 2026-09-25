export const PLAYER_ROLES = ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'Flex'] as const

export type PlayerRole = (typeof PLAYER_ROLES)[number]

export type MatchFormat = 'BO1' | 'BO3' | 'BO5'

export type FixtureStage = 'group' | 'semifinal' | 'final'

export type FixtureStatus = 'scheduled' | 'live' | 'completed'

export interface Player {
  id: string
  name: string
  handle: string
  role: PlayerRole
}

export interface Team {
  id: string
  name: string
  tag: string
  institution: string
  contactEmail: string
  players: Player[]
  createdAt: number
}

export type TeamDraft = Omit<Team, 'id' | 'createdAt'>

export interface Fixture {
  id: string
  code: string
  stage: FixtureStage
  round: number
  slot: number
  format: MatchFormat
  homeId: string | null
  awayId: string | null
  homeSource: string | null
  awaySource: string | null
  homeScore: number | null
  awayScore: number | null
  status: FixtureStatus
  scheduledAt: string
}

export interface StandingRow {
  teamId: string
  position: number
  played: number
  won: number
  lost: number
  mapsWon: number
  mapsLost: number
  mapDiff: number
  points: number
  form: Array<'W' | 'L'>
}

export interface TournamentSummary {
  teamCount: number
  playerCount: number
  fixtureCount: number
  completedCount: number
  championId: string | null
}
