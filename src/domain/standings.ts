import { TOURNAMENT_RULES } from '@/config/tournament'
import type { Fixture, StandingRow, Team } from '@/types/tournament'

interface Accumulator extends Omit<StandingRow, 'position'> {
  beat: Set<string>
}

const blank = (teamId: string): Accumulator => ({
  teamId,
  played: 0,
  won: 0,
  lost: 0,
  mapsWon: 0,
  mapsLost: 0,
  mapDiff: 0,
  points: 0,
  form: [],
  beat: new Set<string>(),
})

export const computeStandings = (teams: Team[], fixtures: Fixture[]): StandingRow[] => {
  const table = new Map<string, Accumulator>()
  teams.forEach((team) => table.set(team.id, blank(team.id)))

  const played = fixtures
    .filter(
      (fixture) =>
        fixture.stage === 'group' &&
        fixture.status === 'completed' &&
        fixture.homeId !== null &&
        fixture.awayId !== null &&
        fixture.homeScore !== null &&
        fixture.awayScore !== null,
    )
    .sort((a, b) => a.round - b.round || a.slot - b.slot)

  played.forEach((fixture) => {
    const home = table.get(fixture.homeId as string)
    const away = table.get(fixture.awayId as string)
    if (!home || !away) return

    const homeScore = fixture.homeScore as number
    const awayScore = fixture.awayScore as number

    home.played += 1
    away.played += 1
    home.mapsWon += homeScore
    home.mapsLost += awayScore
    away.mapsWon += awayScore
    away.mapsLost += homeScore

    const homeWon = homeScore > awayScore
    const winner = homeWon ? home : away
    const loser = homeWon ? away : home

    winner.won += 1
    winner.points += TOURNAMENT_RULES.pointsPerWin
    winner.form.push('W')
    winner.beat.add(loser.teamId)

    loser.lost += 1
    loser.points += TOURNAMENT_RULES.pointsPerLoss
    loser.form.push('L')
  })

  const nameOf = new Map(teams.map((team) => [team.id, team.name]))

  return [...table.values()]
    .map((row) => ({ ...row, mapDiff: row.mapsWon - row.mapsLost }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.mapDiff !== a.mapDiff) return b.mapDiff - a.mapDiff
      if (b.mapsWon !== a.mapsWon) return b.mapsWon - a.mapsWon
      if (a.beat.has(b.teamId)) return -1
      if (b.beat.has(a.teamId)) return 1
      return (nameOf.get(a.teamId) ?? '').localeCompare(nameOf.get(b.teamId) ?? '')
    })
    .map(({ beat: _beat, ...row }, index) => ({ ...row, position: index + 1 }))
}

export const isGroupStageComplete = (fixtures: Fixture[]) => {
  const group = fixtures.filter((fixture) => fixture.stage === 'group')
  return group.length > 0 && group.every((fixture) => fixture.status === 'completed')
}
