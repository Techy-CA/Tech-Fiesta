import { TOURNAMENT_RULES } from '@/config/tournament'
import type { Fixture } from '@/types/tournament'

const BYE = '__bye__'

export const buildRoundRobinPairings = (teamIds: string[]): Array<Array<[string, string]>> => {
  const pool = [...teamIds]
  if (pool.length < 2) return []
  if (pool.length % 2 === 1) pool.push(BYE)

  const half = pool.length / 2
  const rotating = pool.slice(1)
  const rounds: Array<Array<[string, string]>> = []

  for (let round = 0; round < pool.length - 1; round += 1) {
    const ordered = [pool[0], ...rotating]
    const pairs: Array<[string, string]> = []

    for (let i = 0; i < half; i += 1) {
      const home = ordered[i]
      const away = ordered[ordered.length - 1 - i]
      if (home === BYE || away === BYE) continue
      pairs.push(round % 2 === 0 ? [home, away] : [away, home])
    }

    rounds.push(pairs)
    rotating.unshift(rotating.pop() as string)
  }

  return rounds
}

const kickoffAt = (index: number, startIso: string) => {
  const base = new Date(startIso)
  base.setMinutes(base.getMinutes() + index * TOURNAMENT_RULES.matchIntervalMinutes)
  return base.toISOString()
}

export const buildGroupFixtures = (teamIds: string[], startIso: string): Fixture[] => {
  const rounds = buildRoundRobinPairings(teamIds)
  const fixtures: Fixture[] = []
  let ordinal = 0

  rounds.forEach((pairs, roundIndex) => {
    pairs.forEach((pair, slotIndex) => {
      ordinal += 1
      fixtures.push({
        id: `group-r${roundIndex + 1}-m${slotIndex + 1}`,
        code: `M${String(ordinal).padStart(2, '0')}`,
        stage: 'group',
        round: roundIndex + 1,
        slot: slotIndex + 1,
        format: TOURNAMENT_RULES.groupFormat,
        homeId: pair[0],
        awayId: pair[1],
        homeSource: null,
        awaySource: null,
        homeScore: null,
        awayScore: null,
        status: 'scheduled',
        scheduledAt: kickoffAt(ordinal - 1, startIso),
      })
    })
  })

  return fixtures
}
