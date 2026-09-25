import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { site } from '@/config/site'
import { TOURNAMENT_RULES } from '@/config/tournament'
import { getRepository } from '@/data'
import { buildPlayoffFixtures, championOf, resolveFinalSlots } from '@/domain/knockout'
import { buildGroupFixtures } from '@/domain/roundRobin'
import { computeStandings, isGroupStageComplete } from '@/domain/standings'
import type { Fixture, Team, TeamDraft } from '@/types/tournament'
import { TournamentContext, type TournamentContextValue } from './tournamentContext'

export const TournamentProvider = ({ children }: { children: ReactNode }) => {
  const repository = useMemo(() => getRepository(), [])
  const [teams, setTeams] = useState<Team[]>([])
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [loaded, setLoaded] = useState({ teams: false, fixtures: false })
  const [error, setError] = useState<string | null>(null)
  const syncing = useRef(false)

  useEffect(() => {
    const fail = (cause: Error) => setError(cause.message)

    const stopTeams = repository.subscribeTeams((next) => {
      setTeams(next)
      setLoaded((state) => ({ ...state, teams: true }))
    }, fail)

    const stopFixtures = repository.subscribeFixtures((next) => {
      setFixtures(next)
      setLoaded((state) => ({ ...state, fixtures: true }))
    }, fail)

    return () => {
      stopTeams()
      stopFixtures()
    }
  }, [repository])

  useEffect(() => {
    if (syncing.current) return
    const resolved = resolveFinalSlots(fixtures)
    const final = resolved.find((fixture) => fixture.stage === 'final')
    const current = fixtures.find((fixture) => fixture.stage === 'final')
    if (!final || !current) return
    if (final.homeId === current.homeId && final.awayId === current.awayId) return

    syncing.current = true
    repository
      .updateFixture(final.id, { homeId: final.homeId, awayId: final.awayId })
      .catch((cause: Error) => setError(cause.message))
      .finally(() => {
        syncing.current = false
      })
  }, [fixtures, repository])

  const standings = useMemo(() => computeStandings(teams, fixtures), [teams, fixtures])
  const groupFixtures = useMemo(
    () => fixtures.filter((fixture) => fixture.stage === 'group'),
    [fixtures],
  )
  const playoffFixtures = useMemo(
    () => fixtures.filter((fixture) => fixture.stage !== 'group'),
    [fixtures],
  )
  const nameIndex = useMemo(() => new Map(teams.map((team) => [team.id, team])), [teams])

  const teamName = useCallback(
    (teamId: string | null) => (teamId ? nameIndex.get(teamId)?.name ?? 'Unknown squad' : 'TBD'),
    [nameIndex],
  )

  const teamTag = useCallback(
    (teamId: string | null) => (teamId ? nameIndex.get(teamId)?.tag ?? '???' : '---'),
    [nameIndex],
  )

  const guard = useCallback(async (action: () => Promise<void>) => {
    setError(null)
    try {
      await action()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The operation could not be completed.')
      throw cause
    }
  }, [])

  const createTeam = useCallback(
    (draft: TeamDraft) =>
      guard(async () => {
        if (teams.length >= TOURNAMENT_RULES.maxTeams) {
          throw new Error(`The pool is full at ${TOURNAMENT_RULES.maxTeams} squads.`)
        }
        await repository.createTeam(draft)
      }),
    [guard, repository, teams.length],
  )

  const deleteTeam = useCallback(
    (teamId: string) =>
      guard(async () => {
        await repository.deleteTeam(teamId)
        if (fixtures.length > 0) await repository.clearFixtures()
      }),
    [fixtures.length, guard, repository],
  )

  const generateGroupStage = useCallback(
    () =>
      guard(async () => {
        if (teams.length !== TOURNAMENT_RULES.maxTeams) {
          throw new Error(`Register all ${TOURNAMENT_RULES.maxTeams} squads before generating fixtures.`)
        }
        await repository.replaceFixtures(
          buildGroupFixtures(
            teams.map((team) => team.id),
            site.startsAt,
          ),
        )
      }),
    [guard, repository, teams],
  )

  const generatePlayoffs = useCallback(
    () =>
      guard(async () => {
        if (!isGroupStageComplete(fixtures)) {
          throw new Error('Every group stage fixture needs a result before the bracket is seeded.')
        }
        const playoffs = buildPlayoffFixtures(standings, site.endsAt)
        if (playoffs.length === 0) throw new Error('Not enough qualified squads to seed a bracket.')
        await repository.replaceFixtures([...groupFixtures, ...playoffs])
      }),
    [fixtures, groupFixtures, guard, repository, standings],
  )

  const submitResult = useCallback(
    (fixtureId: string, homeScore: number, awayScore: number) =>
      guard(async () => {
        await repository.updateFixture(fixtureId, {
          homeScore,
          awayScore,
          status: 'completed',
        })
      }),
    [guard, repository],
  )

  const clearFixtures = useCallback(
    () => guard(() => repository.clearFixtures()),
    [guard, repository],
  )

  const resetAll = useCallback(() => guard(() => repository.resetAll()), [guard, repository])

  const value: TournamentContextValue = {
    backend: repository.backend,
    loading: !loaded.teams || !loaded.fixtures,
    error,
    teams,
    fixtures,
    standings,
    groupFixtures,
    playoffFixtures,
    championId: championOf(fixtures),
    rosterFull: teams.length >= TOURNAMENT_RULES.maxTeams,
    groupComplete: isGroupStageComplete(fixtures),
    hasFixtures: fixtures.length > 0,
    teamName,
    teamTag,
    createTeam,
    deleteTeam,
    generateGroupStage,
    generatePlayoffs,
    submitResult,
    clearFixtures,
    resetAll,
  }

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>
}
