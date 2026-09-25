import { useState } from 'react'
import { PageHead } from '@/components/layout/PageHead'
import { ResultEntry } from '@/components/tournament/ResultEntry'
import { Arrow } from '@/components/ui/Arrow'
import { EmptyState } from '@/components/ui/EmptyState'
import { TextField } from '@/components/ui/Field'
import { Notice } from '@/components/ui/Notice'
import { TOURNAMENT_RULES, groupFixtureCount } from '@/config/tournament'
import { demoPool } from '@/data/demoPool'
import { useTournament } from '@/hooks/useTournament'
import { pad } from '@/lib/format'

const PASSCODE = import.meta.env.VITE_CONTROL_PASSCODE ?? 'techfiesta'
const SESSION_KEY = 'techfiesta.control.unlocked'

const Gate = ({ onUnlock }: { onUnlock: () => void }) => {
  const [value, setValue] = useState('')
  const [failed, setFailed] = useState(false)

  const attempt = (event: React.FormEvent) => {
    event.preventDefault()
    if (value === PASSCODE) {
      window.sessionStorage.setItem(SESSION_KEY, 'true')
      onUnlock()
      return
    }
    setFailed(true)
  }

  return (
    <div className="wrap gate">
      <p className="eyebrow">
        <span className="eyebrow__idx">//</span>
        Restricted
      </p>
      <h1 className="page__title" style={{ fontSize: '2.4rem', marginBottom: '1.5rem' }}>
        Control desk
      </h1>
      <form className="stack" onSubmit={attempt}>
        <TextField
          id="passcode"
          label="Officials passcode"
          type="password"
          autoComplete="off"
          required
          value={value}
          error={failed ? 'That passcode was not recognised.' : undefined}
          onChange={(event) => {
            setValue(event.target.value)
            setFailed(false)
          }}
        />
        <button className="btn btn--primary btn--block" type="submit">
          Unlock
          <Arrow />
        </button>
      </form>
    </div>
  )
}

const Control = () => {
  const [unlocked, setUnlocked] = useState(
    () => window.sessionStorage.getItem(SESSION_KEY) === 'true',
  )
  const {
    backend,
    teams,
    groupFixtures,
    playoffFixtures,
    standings,
    rosterFull,
    groupComplete,
    hasFixtures,
    error,
    teamTag,
    createTeam,
    deleteTeam,
    generateGroupStage,
    generatePlayoffs,
    submitResult,
    clearFixtures,
    resetAll,
  } = useTournament()
  const [busy, setBusy] = useState<string | null>(null)

  if (!unlocked) return <Gate onUnlock={() => setUnlocked(true)} />

  const run = async (key: string, action: () => Promise<void>) => {
    setBusy(key)
    try {
      await action()
    } catch {
      return
    } finally {
      setBusy(null)
    }
  }

  const confirmThen = (message: string, action: () => Promise<void>) => () => {
    if (window.confirm(message)) void action()
  }

  const groupDone = groupFixtures.filter((fixture) => fixture.status === 'completed').length

  const loadDemoPool = async () => {
    for (const entry of demoPool) {
      await createTeam(entry)
    }
  }

  return (
    <div className="wrap page">
      <PageHead
        label="Officials only"
        title="Control desk"
        lede="Generate the schedule, file results and reset the tournament. Every action writes straight to the live database."
        aside={
          <span className="tag tag--signal">
            <span className="dot dot--pulse" />
            {backend === 'firestore' ? 'Firestore connected' : 'Local store'}
          </span>
        }
      />

      {error ? <Notice tone="error">{error}</Notice> : null}

      <div className="split split--7-5">
        <div className="stack stack--lg">
          <section className="panel">
            <div className="panel__head">
              <span>Group stage results</span>
              <span>
                {pad(groupDone)} / {pad(groupFixtures.length)} filed
              </span>
            </div>
            <div className="panel__body panel__body--flush">
              {groupFixtures.length === 0 ? (
                <div style={{ padding: '1.25rem' }}>
                  <EmptyState
                    title="No fixtures yet"
                    note={`Register all ${TOURNAMENT_RULES.maxTeams} squads, then run the round robin generator.`}
                  />
                </div>
              ) : (
                groupFixtures.map((fixture) => (
                  <ResultEntry
                    key={fixture.id}
                    fixture={fixture}
                    teamTag={teamTag}
                    onSubmit={submitResult}
                  />
                ))
              )}
            </div>
          </section>

          {playoffFixtures.length > 0 ? (
            <section className="panel">
              <div className="panel__head">
                <span>Playoff results</span>
                <span>Seeded from the table</span>
              </div>
              <div className="panel__body panel__body--flush">
                {playoffFixtures.map((fixture) => (
                  <ResultEntry
                    key={fixture.id}
                    fixture={fixture}
                    teamTag={teamTag}
                    onSubmit={submitResult}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section className="panel">
            <div className="panel__head">
              <span>Registered squads</span>
              <span>
                {pad(teams.length)} / {pad(TOURNAMENT_RULES.maxTeams)}
              </span>
            </div>
            <div className="panel__body panel__body--flush">
              {teams.length === 0 ? (
                <div style={{ padding: '1.25rem' }}>
                  <EmptyState title="Pool empty" note="No squads have registered yet." />
                </div>
              ) : (
                teams.map((team, index) => (
                  <div className="result-form" key={team.id} style={{ gridTemplateColumns: 'minmax(0, 1fr) auto' }}>
                    <span className="result-form__pair">
                      <b>
                        {pad(index + 1)} {team.tag}
                      </b>{' '}
                      {team.name} / {team.institution}
                    </span>
                    <button
                      type="button"
                      className="btn btn--sm btn--danger"
                      onClick={confirmThen(
                        `Withdraw ${team.name}? Any generated fixtures are cleared so the schedule stays consistent.`,
                        () => run(`team-${team.id}`, () => deleteTeam(team.id)),
                      )}
                      disabled={busy === `team-${team.id}`}
                    >
                      Withdraw
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <aside className="stack stack--top">
          <div className="panel">
            <div className="panel__head">
              <span>Schedule engine</span>
              <span>Round robin</span>
            </div>
            <div className="panel__body stack">
              <div className="row row--between">
                <span className="team__role">Pool</span>
                <span className={rosterFull ? 'tag tag--win' : 'tag'}>
                  {pad(teams.length)} / {pad(TOURNAMENT_RULES.maxTeams)}
                </span>
              </div>
              <div className="row row--between">
                <span className="team__role">Expected fixtures</span>
                <span className="tag">{groupFixtureCount(TOURNAMENT_RULES.maxTeams)}</span>
              </div>
              <div className="row row--between">
                <span className="team__role">Group stage</span>
                <span className={groupComplete ? 'tag tag--win' : 'tag'}>
                  {groupComplete ? 'Closed' : 'Open'}
                </span>
              </div>

              <button
                type="button"
                className="btn btn--primary btn--block"
                disabled={!rosterFull || busy !== null}
                onClick={() => void run('group', generateGroupStage)}
              >
                {busy === 'group' ? 'Generating' : 'Generate round robin'}
                <Arrow />
              </button>

              <button
                type="button"
                className="btn btn--block"
                disabled={!groupComplete || busy !== null}
                onClick={() => void run('playoffs', generatePlayoffs)}
              >
                {busy === 'playoffs' ? 'Seeding' : 'Seed the playoff bracket'}
              </button>

              {teams.length === 0 ? (
                <button
                  type="button"
                  className="btn btn--block"
                  disabled={busy !== null}
                  onClick={() => void run('demo', loadDemoPool)}
                >
                  {busy === 'demo' ? 'Loading' : 'Load demo pool'}
                </button>
              ) : null}

              {!rosterFull ? (
                <Notice>
                  The generator unlocks at {TOURNAMENT_RULES.maxTeams} verified squads.
                </Notice>
              ) : null}
            </div>
          </div>

          <div className="panel">
            <div className="panel__head">
              <span>Current seeding</span>
              <span>Top {TOURNAMENT_RULES.playoffCut}</span>
            </div>
            <div className="panel__body stack stack--sm">
              {standings.slice(0, TOURNAMENT_RULES.playoffCut).map((row) => (
                <div className="row row--between" key={row.teamId}>
                  <span className="team__role">Seed {row.position}</span>
                  <span className="result-form__pair">
                    <b>{teamTag(row.teamId)}</b> {row.points} pts
                  </span>
                </div>
              ))}
              {standings.length === 0 ? (
                <span className="team__role">No squads to seed.</span>
              ) : null}
            </div>
          </div>

          <div className="panel">
            <div className="panel__head">
              <span>Destructive actions</span>
              <span>Irreversible</span>
            </div>
            <div className="panel__body stack stack--sm">
              <button
                type="button"
                className="btn btn--danger btn--block"
                disabled={!hasFixtures || busy !== null}
                onClick={confirmThen('Clear every generated fixture? Registered squads are kept.', () =>
                  run('clear', clearFixtures),
                )}
              >
                Clear all fixtures
              </button>
              <button
                type="button"
                className="btn btn--danger btn--block"
                disabled={busy !== null}
                onClick={confirmThen(
                  'Reset the tournament? Every squad, roster and fixture is deleted permanently.',
                  () => run('reset', resetAll),
                )}
              >
                Reset tournament
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Control
