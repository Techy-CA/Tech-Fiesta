import { formatMatchTime } from '@/lib/format'
import type { Fixture } from '@/types/tournament'

interface BracketBoardProps {
  fixtures: Fixture[]
  teamName: (teamId: string | null) => string
  championId: string | null
}

const Seed = ({
  fixture,
  teamName,
  variant,
}: {
  fixture: Fixture
  teamName: (teamId: string | null) => string
  variant?: 'final'
}) => {
  const decided = fixture.status === 'completed' && fixture.homeScore !== null && fixture.awayScore !== null
  const homeWon = decided && (fixture.homeScore as number) > (fixture.awayScore as number)

  return (
    <div>
      <p className="bracket__label">
        {fixture.code} / {fixture.format} / {formatMatchTime(fixture.scheduledAt)}
      </p>
      <div className={variant === 'final' ? 'seed seed--final' : 'seed'}>
        <div className="seed__row" data-winner={decided ? homeWon : undefined}>
          <span className="seed__pos">{fixture.homeSource ?? 'H'}</span>
          <span className={fixture.homeId ? 'seed__name' : 'seed__name seed__name--tbd'}>
            {fixture.homeId ? teamName(fixture.homeId) : 'Awaiting result'}
          </span>
          <span className="seed__score">{fixture.homeScore ?? '-'}</span>
        </div>
        <div className="seed__row" data-winner={decided ? !homeWon : undefined}>
          <span className="seed__pos">{fixture.awaySource ?? 'A'}</span>
          <span className={fixture.awayId ? 'seed__name' : 'seed__name seed__name--tbd'}>
            {fixture.awayId ? teamName(fixture.awayId) : 'Awaiting result'}
          </span>
          <span className="seed__score">{fixture.awayScore ?? '-'}</span>
        </div>
      </div>
    </div>
  )
}

export const BracketBoard = ({ fixtures, teamName, championId }: BracketBoardProps) => {
  const semifinals = fixtures.filter((fixture) => fixture.stage === 'semifinal')
  const final = fixtures.find((fixture) => fixture.stage === 'final')

  return (
    <div className="scroll-x">
      <div className="bracket">
        <div className="bracket__col">
          {semifinals.map((fixture) => (
            <Seed key={fixture.id} fixture={fixture} teamName={teamName} />
          ))}
        </div>

        <div className="bracket__col">
          {final ? <Seed fixture={final} teamName={teamName} variant="final" /> : null}
          {championId ? (
            <div className="champion">
              <p className="champion__label">Champion</p>
              <p className="champion__name">{teamName(championId)}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
