import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHead } from '@/components/layout/PageHead'
import { BracketBoard } from '@/components/tournament/BracketBoard'
import { RoundGroup } from '@/components/tournament/RoundGroup'
import { Arrow } from '@/components/ui/Arrow'
import { EmptyState } from '@/components/ui/EmptyState'
import { Notice } from '@/components/ui/Notice'
import { TOURNAMENT_RULES, groupFixtureCount } from '@/config/tournament'
import { useTournament } from '@/hooks/useTournament'
import { pad } from '@/lib/format'

type View = 'group' | 'playoffs'

const Fixtures = () => {
  const {
    teams,
    groupFixtures,
    playoffFixtures,
    championId,
    teamName,
    teamTag,
    loading,
    error,
    rosterFull,
  } = useTournament()
  const [params, setParams] = useSearchParams()
  const view: View = params.get('view') === 'playoffs' ? 'playoffs' : 'group'
  const setView = (next: View) => setParams(next === 'group' ? {} : { view: next })

  const rounds = useMemo(() => {
    const map = new Map<number, typeof groupFixtures>()
    groupFixtures.forEach((fixture) => {
      map.set(fixture.round, [...(map.get(fixture.round) ?? []), fixture])
    })
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }, [groupFixtures])

  const completed = groupFixtures.filter((fixture) => fixture.status === 'completed').length

  return (
    <div className="wrap page">
      <PageHead
        label="Match schedule"
        title="The fixture wall"
        lede={`A complete round robin produces ${groupFixtureCount(TOURNAMENT_RULES.maxTeams)} group fixtures. The top ${TOURNAMENT_RULES.playoffCut} carry into a seeded bracket.`}
        aside={
          <>
            <button
              type="button"
              className={view === 'group' ? 'btn btn--sm btn--primary' : 'btn btn--sm'}
              onClick={() => setView('group')}
            >
              Group stage
            </button>
            <button
              type="button"
              className={view === 'playoffs' ? 'btn btn--sm btn--primary' : 'btn btn--sm'}
              onClick={() => setView('playoffs')}
            >
              Playoffs
            </button>
          </>
        }
      />

      {error ? <Notice tone="error">{error}</Notice> : null}

      {loading ? (
        <EmptyState title="Loading fixtures" note="Reading the live schedule." />
      ) : view === 'group' ? (
        groupFixtures.length === 0 ? (
          <EmptyState
            title="No fixtures generated"
            note={
              rosterFull
                ? 'The pool is full. Run the generator on the control desk to publish the round robin.'
                : `The generator unlocks once all ${TOURNAMENT_RULES.maxTeams} squads are registered. ${teams.length} are in so far.`
            }
            action={
              <Link className="btn btn--primary" to={rosterFull ? '/control' : '/register'}>
                {rosterFull ? 'Open the control desk' : 'Register a squad'}
                <Arrow />
              </Link>
            }
          />
        ) : (
          <>
            <Notice tone={completed === groupFixtures.length ? 'ok' : 'neutral'}>
              {pad(completed)} of {pad(groupFixtures.length)} group fixtures decided. Results are
              filed on the control desk and propagate to the table instantly.
            </Notice>
            <div className="fixtures" style={{ marginTop: '2rem' }}>
              {rounds.map(([round, list]) => (
                <RoundGroup
                  key={round}
                  label={`Round ${pad(round)}`}
                  count={list.length}
                  fixtures={list}
                  teamName={teamName}
                  teamTag={teamTag}
                />
              ))}
            </div>
          </>
        )
      ) : playoffFixtures.length === 0 ? (
        <EmptyState
          title="Bracket not seeded"
          note="The bracket is seeded from the final table. Every group fixture needs a filed result before the semifinals can be drawn."
          action={
            <Link className="btn btn--primary" to="/standings">
              View the table
              <Arrow />
            </Link>
          }
        />
      ) : (
        <BracketBoard fixtures={playoffFixtures} teamName={teamName} championId={championId} />
      )}
    </div>
  )
}

export default Fixtures
