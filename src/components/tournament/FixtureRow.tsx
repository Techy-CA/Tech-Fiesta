import { formatMatchTime } from '@/lib/format'
import type { Fixture } from '@/types/tournament'

interface FixtureRowProps {
  fixture: Fixture
  teamName: (teamId: string | null) => string
  teamTag: (teamId: string | null) => string
}

const winnerFlag = (fixture: Fixture, side: 'home' | 'away'): boolean | undefined => {
  if (fixture.status !== 'completed') return undefined
  if (fixture.homeScore === null || fixture.awayScore === null) return undefined
  const homeWon = fixture.homeScore > fixture.awayScore
  return side === 'home' ? homeWon : !homeWon
}

export const FixtureRow = ({ fixture, teamName, teamTag }: FixtureRowProps) => {
  const pending = fixture.status !== 'completed'
  const homeWon = winnerFlag(fixture, 'home')
  const awayWon = winnerFlag(fixture, 'away')

  return (
    <article className="fixture" data-status={fixture.status}>
      <span className="fixture__id">{fixture.code}</span>

      <div className="fixture__side fixture__side--home" data-winner={homeWon}>
        <span className="fixture__abbr">{fixture.homeId ? teamTag(fixture.homeId) : 'TBD'}</span>
        <span className="fixture__team" data-winner={homeWon}>
          {fixture.homeId ? teamName(fixture.homeId) : (fixture.homeSource ?? 'To be decided')}
        </span>
      </div>

      <div className="fixture__score">
        {pending ? (
          <span>versus</span>
        ) : (
          <>
            {fixture.homeScore}
            <span>:</span>
            {fixture.awayScore}
          </>
        )}
      </div>

      <div className="fixture__side fixture__side--away" data-winner={awayWon}>
        <span className="fixture__abbr">{fixture.awayId ? teamTag(fixture.awayId) : 'TBD'}</span>
        <span className="fixture__team" data-winner={awayWon}>
          {fixture.awayId ? teamName(fixture.awayId) : (fixture.awaySource ?? 'To be decided')}
        </span>
      </div>

      <div className="fixture__meta">
        <span>{fixture.format}</span>
        <span>{pending ? formatMatchTime(fixture.scheduledAt) : 'Full time'}</span>
      </div>
    </article>
  )
}
