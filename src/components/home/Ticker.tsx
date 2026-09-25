import { site } from '@/config/site'
import { TOURNAMENT_RULES, groupFixtureCount } from '@/config/tournament'
import { useTournament } from '@/hooks/useTournament'

export const Ticker = () => {
  const { teams, fixtures, groupComplete, championId, teamName } = useTournament()
  const completed = fixtures.filter((fixture) => fixture.status === 'completed').length

  const items = [
    { label: 'Registered squads', value: `${teams.length} / ${TOURNAMENT_RULES.maxTeams}` },
    { label: 'Group fixtures', value: String(groupFixtureCount(TOURNAMENT_RULES.maxTeams)) },
    { label: 'Results filed', value: `${completed} / ${fixtures.length || 0}` },
    { label: 'Group stage', value: groupComplete ? 'Closed' : 'In progress' },
    { label: 'Prize pool', value: `${site.currency} ${site.prizePool}` },
    { label: 'Champion', value: championId ? teamName(championId) : 'Undecided' },
    { label: 'Broadcast', value: site.broadcast },
  ]

  const track = [...items, ...items]

  return (
    <div className="ticker">
      <div className="ticker__track">
        {track.map((item, index) => (
          <span className="ticker__item" key={`${item.label}-${index}`}>
            {item.label}
            <b>{item.value}</b>
          </span>
        ))}
      </div>
    </div>
  )
}
