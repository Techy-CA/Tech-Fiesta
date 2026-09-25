import { TOURNAMENT_RULES } from '@/config/tournament'
import { pad } from '@/lib/format'
import type { StandingRow, Team } from '@/types/tournament'

interface StandingsTableProps {
  standings: StandingRow[]
  teams: Team[]
}

export const StandingsTable = ({ standings, teams }: StandingsTableProps) => {
  const index = new Map(teams.map((team) => [team.id, team]))

  return (
    <div className="scroll-x">
      <table className="table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Squad</th>
            <th className="table__num">P</th>
            <th className="table__num">W</th>
            <th className="table__num">L</th>
            <th className="table__num">MW</th>
            <th className="table__num">ML</th>
            <th className="table__num">Diff</th>
            <th className="table__num">Pts</th>
            <th>Form</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => {
            const team = index.get(row.teamId)
            const qualified = row.position <= TOURNAMENT_RULES.playoffCut

            return (
              <tr key={row.teamId} data-qualified={qualified}>
                <td className="table__rank">{pad(row.position)}</td>
                <td>
                  <span className="fixture__team">{team?.name ?? 'Unknown squad'}</span>
                  <span className="team__real">{team?.institution ?? ''}</span>
                </td>
                <td className="table__num">{row.played}</td>
                <td className="table__num">{row.won}</td>
                <td className="table__num">{row.lost}</td>
                <td className="table__num">{row.mapsWon}</td>
                <td className="table__num">{row.mapsLost}</td>
                <td className="table__num">
                  {row.mapDiff > 0 ? `+${row.mapDiff}` : row.mapDiff}
                </td>
                <td className="table__num">
                  <b>{row.points}</b>
                </td>
                <td>
                  <span className="row" style={{ gap: '0.3rem' }}>
                    {row.form.length === 0 ? (
                      <span className="team__role">No fixtures played</span>
                    ) : (
                      row.form.slice(-5).map((result, position) => (
                        <span
                          key={`${row.teamId}-${position}`}
                          className={result === 'W' ? 'tag tag--win' : 'tag'}
                          style={{ height: 20, paddingInline: '0.4rem' }}
                        >
                          {result}
                        </span>
                      ))
                    )}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
