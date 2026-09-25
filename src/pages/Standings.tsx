import { Link } from 'react-router-dom'
import { PageHead } from '@/components/layout/PageHead'
import { StandingsTable } from '@/components/tournament/StandingsTable'
import { Arrow } from '@/components/ui/Arrow'
import { EmptyState } from '@/components/ui/EmptyState'
import { Notice } from '@/components/ui/Notice'
import { TOURNAMENT_RULES } from '@/config/tournament'
import { useTournament } from '@/hooks/useTournament'
import { pad } from '@/lib/format'

const Standings = () => {
  const { teams, standings, groupFixtures, groupComplete, loading, error } = useTournament()
  const played = groupFixtures.filter((fixture) => fixture.status === 'completed').length

  return (
    <div className="wrap page">
      <PageHead
        label="League table"
        title="Standings"
        lede={`${TOURNAMENT_RULES.pointsPerWin} points for a win, ${TOURNAMENT_RULES.pointsPerLoss} for a loss. Ties break on map difference, then maps won, then head to head.`}
        aside={
          <span className={groupComplete ? 'tag tag--win' : 'tag tag--signal'}>
            <span className={groupComplete ? 'dot' : 'dot dot--pulse'} />
            {groupComplete ? 'Table final' : `${pad(played)} of ${pad(groupFixtures.length)} played`}
          </span>
        }
      />

      {error ? <Notice tone="error">{error}</Notice> : null}

      {loading ? (
        <EmptyState title="Loading table" note="Recomputing standings from filed results." />
      ) : teams.length === 0 ? (
        <EmptyState
          title="Nothing to rank"
          note="The table is built from registered squads and filed results. Register a squad to begin."
          action={
            <Link className="btn btn--primary" to="/register">
              Register a squad
              <Arrow />
            </Link>
          }
        />
      ) : (
        <>
          <div className="panel">
            <div className="panel__head">
              <span>Group stage table</span>
              <span>Top {TOURNAMENT_RULES.playoffCut} qualify</span>
            </div>
            <div className="panel__body panel__body--flush">
              <StandingsTable standings={standings} teams={teams} />
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <Notice tone={groupComplete ? 'ok' : 'neutral'}>
              {groupComplete
                ? 'Every group fixture is decided. The bracket can be seeded from this table on the control desk.'
                : 'The table updates the moment a result is filed. Positions are provisional until every group fixture is decided.'}
            </Notice>
          </div>
        </>
      )}
    </div>
  )
}

export default Standings
