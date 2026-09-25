import { createId } from '@/lib/format'
import type { Fixture, Team, TeamDraft } from '@/types/tournament'
import { sortFixtures, sortTeams, type TournamentRepository, type Unsubscribe } from './repository'

const KEY = 'techfiesta.tournament.v1'

interface Snapshot {
  teams: Team[]
  fixtures: Fixture[]
}

const empty: Snapshot = { teams: [], fixtures: [] }

const read = (): Snapshot => {
  if (typeof window === 'undefined') return empty
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as Partial<Snapshot>
    return { teams: parsed.teams ?? [], fixtures: parsed.fixtures ?? [] }
  } catch {
    return empty
  }
}

const listeners = new Set<(snapshot: Snapshot) => void>()

const write = (snapshot: Snapshot) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(snapshot))
  } catch {
    return
  }
  listeners.forEach((listener) => listener(snapshot))
}

const subscribe = (listener: (snapshot: Snapshot) => void): Unsubscribe => {
  listeners.add(listener)
  listener(read())
  return () => {
    listeners.delete(listener)
  }
}

export const createLocalRepository = (): TournamentRepository => ({
  backend: 'local',

  subscribeTeams(next) {
    return subscribe((snapshot) => next(sortTeams(snapshot.teams)))
  },

  subscribeFixtures(next) {
    return subscribe((snapshot) => next(sortFixtures(snapshot.fixtures)))
  },

  async createTeam(draft: TeamDraft) {
    const snapshot = read()
    const team: Team = { ...draft, id: createId('team'), createdAt: Date.now() }
    write({ ...snapshot, teams: [...snapshot.teams, team] })
    return team
  },

  async deleteTeam(teamId: string) {
    const snapshot = read()
    write({
      teams: snapshot.teams.filter((team) => team.id !== teamId),
      fixtures: snapshot.fixtures.filter(
        (fixture) => fixture.homeId !== teamId && fixture.awayId !== teamId,
      ),
    })
  },

  async replaceFixtures(fixtures: Fixture[]) {
    write({ ...read(), fixtures })
  },

  async updateFixture(fixtureId: string, patch: Partial<Fixture>) {
    const snapshot = read()
    write({
      ...snapshot,
      fixtures: snapshot.fixtures.map((fixture) =>
        fixture.id === fixtureId ? { ...fixture, ...patch } : fixture,
      ),
    })
  },

  async clearFixtures() {
    write({ ...read(), fixtures: [] })
  },

  async resetAll() {
    write({ teams: [], fixtures: [] })
  },
})
