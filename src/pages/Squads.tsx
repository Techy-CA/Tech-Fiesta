import { Link } from 'react-router-dom'
import { PageHead } from '@/components/layout/PageHead'
import { CapacityMeter } from '@/components/tournament/CapacityMeter'
import { TeamCard } from '@/components/tournament/TeamCard'
import { Arrow } from '@/components/ui/Arrow'
import { EmptyState } from '@/components/ui/EmptyState'
import { Notice } from '@/components/ui/Notice'
import { TOURNAMENT_RULES } from '@/config/tournament'
import { useTournament } from '@/hooks/useTournament'
import { pad } from '@/lib/format'

const Squads = () => {
  const { teams, loading, error, rosterFull } = useTournament()
  const operators = teams.reduce((total, team) => total + team.players.length, 0)

  return (
    <div className="wrap page">
      <PageHead
        label="Confirmed pool"
        title="Registered squads"
        lede="Every roster below has been verified against the handle register. The pool locks at five."
        aside={
          <>
            <span className="tag">{pad(operators)} operators</span>
            <span className={rosterFull ? 'tag tag--win' : 'tag tag--signal'}>
              <span className="dot" />
              {rosterFull ? 'Pool locked' : 'Registration open'}
            </span>
          </>
        }
      />

      <CapacityMeter filled={teams.length} />

      {error ? <Notice tone="error">{error}</Notice> : null}

      {loading ? (
        <EmptyState title="Loading pool" note="Reading the live roster register." />
      ) : teams.length === 0 ? (
        <EmptyState
          title="No squads registered"
          note={`The pool is empty. Register the first of ${TOURNAMENT_RULES.maxTeams} squads to start the competition.`}
          action={
            <Link className="btn btn--primary" to="/register">
              Register the first squad
              <Arrow />
            </Link>
          }
        />
      ) : (
        <div className="teams">
          {teams.map((team, index) => (
            <TeamCard key={team.id} team={team} seed={index + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Squads
