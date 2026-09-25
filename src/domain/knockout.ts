import { TOURNAMENT_RULES } from '@/config/tournament'
import type { Fixture, StandingRow } from '@/types/tournament'

const playoffStart = (endIso: string, offsetIndex: number) => {
  const base = new Date(endIso)
  base.setMinutes(base.getMinutes() + offsetIndex * 120)
  return base.toISOString()
}

export const buildPlayoffFixtures = (standings: StandingRow[], anchorIso: string): Fixture[] => {
  const qualified = standings.slice(0, TOURNAMENT_RULES.playoffCut)
  if (qualified.length < TOURNAMENT_RULES.playoffCut) return []

  const [first, second, third, fourth] = qualified

  return [
    {
      id: 'semifinal-1',
      code: 'SF1',
      stage: 'semifinal',
      round: 1,
      slot: 1,
      format: TOURNAMENT_RULES.semifinalFormat,
      homeId: first.teamId,
      awayId: fourth.teamId,
      homeSource: 'Seed 1',
      awaySource: 'Seed 4',
      homeScore: null,
      awayScore: null,
      status: 'scheduled',
      scheduledAt: playoffStart(anchorIso, 0),
    },
    {
      id: 'semifinal-2',
      code: 'SF2',
      stage: 'semifinal',
      round: 1,
      slot: 2,
      format: TOURNAMENT_RULES.semifinalFormat,
      homeId: second.teamId,
      awayId: third.teamId,
      homeSource: 'Seed 2',
      awaySource: 'Seed 3',
      homeScore: null,
      awayScore: null,
      status: 'scheduled',
      scheduledAt: playoffStart(anchorIso, 1),
    },
    {
      id: 'final',
      code: 'GF',
      stage: 'final',
      round: 2,
      slot: 1,
      format: TOURNAMENT_RULES.finalFormat,
      homeId: null,
      awayId: null,
      homeSource: 'Winner SF1',
      awaySource: 'Winner SF2',
      homeScore: null,
      awayScore: null,
      status: 'scheduled',
      scheduledAt: playoffStart(anchorIso, 2),
    },
  ]
}

export const winnerOf = (fixture: Fixture | undefined): string | null => {
  if (!fixture || fixture.status !== 'completed') return null
  if (fixture.homeScore === null || fixture.awayScore === null) return null
  if (fixture.homeScore === fixture.awayScore) return null
  return fixture.homeScore > fixture.awayScore ? fixture.homeId : fixture.awayId
}

export const resolveFinalSlots = (fixtures: Fixture[]): Fixture[] => {
  const final = fixtures.find((fixture) => fixture.stage === 'final')
  if (!final) return fixtures

  const homeId = winnerOf(fixtures.find((fixture) => fixture.id === 'semifinal-1'))
  const awayId = winnerOf(fixtures.find((fixture) => fixture.id === 'semifinal-2'))
  if (homeId === final.homeId && awayId === final.awayId) return fixtures

  return fixtures.map((fixture) =>
    fixture.stage === 'final' ? { ...fixture, homeId, awayId } : fixture,
  )
}

export const championOf = (fixtures: Fixture[]): string | null =>
  winnerOf(fixtures.find((fixture) => fixture.stage === 'final'))
