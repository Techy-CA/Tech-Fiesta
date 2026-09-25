import { useState } from 'react'
import { validateScore } from '@/domain/validation'
import type { Fixture } from '@/types/tournament'

interface ResultEntryProps {
  fixture: Fixture
  teamTag: (teamId: string | null) => string
  onSubmit: (fixtureId: string, homeScore: number, awayScore: number) => Promise<void>
}

export const ResultEntry = ({ fixture, teamTag, onSubmit }: ResultEntryProps) => {
  const [home, setHome] = useState(fixture.homeScore === null ? '' : String(fixture.homeScore))
  const [away, setAway] = useState(fixture.awayScore === null ? '' : String(fixture.awayScore))
  const [issue, setIssue] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const locked = !fixture.homeId || !fixture.awayId

  const file = async (event: React.FormEvent) => {
    event.preventDefault()
    const problem = validateScore(home, away, fixture.format)
    setIssue(problem)
    if (problem) return

    setBusy(true)
    try {
      await onSubmit(fixture.id, Number(home), Number(away))
    } catch {
      setIssue('The result could not be saved.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="result-form" onSubmit={file}>
      <span className="result-form__pair">
        <b>{fixture.code}</b> {teamTag(fixture.homeId)} vs {teamTag(fixture.awayId)}
        {issue ? <span className="field__error"> {issue}</span> : null}
      </span>
      <input
        className="input"
        inputMode="numeric"
        aria-label={`Home score for ${fixture.code}`}
        value={home}
        disabled={locked}
        onChange={(event) => setHome(event.target.value.replace(/\D/g, '').slice(0, 1))}
      />
      <span className="result-form__sep">:</span>
      <input
        className="input"
        inputMode="numeric"
        aria-label={`Away score for ${fixture.code}`}
        value={away}
        disabled={locked}
        onChange={(event) => setAway(event.target.value.replace(/\D/g, '').slice(0, 1))}
      />
      <button type="submit" className="btn btn--sm" disabled={busy || locked}>
        {fixture.status === 'completed' ? 'Amend' : 'File'}
      </button>
    </form>
  )
}
