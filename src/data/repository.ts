import type { Fixture, Team, TeamDraft } from '@/types/tournament'

export type Unsubscribe = () => void

export interface TournamentRepository {
  readonly backend: 'firestore' | 'local'
  subscribeTeams(next: (teams: Team[]) => void, fail: (error: Error) => void): Unsubscribe
  subscribeFixtures(next: (fixtures: Fixture[]) => void, fail: (error: Error) => void): Unsubscribe
  createTeam(draft: TeamDraft): Promise<Team>
  deleteTeam(teamId: string): Promise<void>
  replaceFixtures(fixtures: Fixture[]): Promise<void>
  updateFixture(fixtureId: string, patch: Partial<Fixture>): Promise<void>
  clearFixtures(): Promise<void>
  resetAll(): Promise<void>
}

export const sortFixtures = (fixtures: Fixture[]): Fixture[] => {
  const weight: Record<Fixture['stage'], number> = { group: 0, semifinal: 1, final: 2 }
  return [...fixtures].sort(
    (a, b) => weight[a.stage] - weight[b.stage] || a.round - b.round || a.slot - b.slot,
  )
}

export const sortTeams = (teams: Team[]): Team[] =>
  [...teams].sort((a, b) => a.createdAt - b.createdAt)
