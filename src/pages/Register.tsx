import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHead } from '@/components/layout/PageHead'
import { CapacityMeter } from '@/components/tournament/CapacityMeter'
import { Arrow } from '@/components/ui/Arrow'
import { EmptyState } from '@/components/ui/EmptyState'
import { SelectField, TextField } from '@/components/ui/Field'
import { Notice } from '@/components/ui/Notice'
import { TOURNAMENT_RULES } from '@/config/tournament'
import { validateTeamDraft, type FieldErrors } from '@/domain/validation'
import { useTournament } from '@/hooks/useTournament'
import { createId, pad } from '@/lib/format'
import { PLAYER_ROLES, type Player, type PlayerRole, type TeamDraft } from '@/types/tournament'

const blankRoster = (): Player[] =>
  Array.from({ length: TOURNAMENT_RULES.rosterSize }, (_, index) => ({
    id: createId('player'),
    name: '',
    handle: '',
    role: PLAYER_ROLES[Math.min(index, PLAYER_ROLES.length - 1)],
  }))

const blankDraft = (): TeamDraft => ({
  name: '',
  tag: '',
  institution: '',
  contactEmail: '',
  players: blankRoster(),
})

const Register = () => {
  const navigate = useNavigate()
  const { teams, rosterFull, createTeam } = useTournament()
  const [draft, setDraft] = useState<TeamDraft>(blankDraft)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)

  const filled = useMemo(
    () =>
      draft.players.filter((player) => player.name.trim() && player.handle.trim()).length,
    [draft.players],
  )

  const setField = <K extends keyof TeamDraft>(key: K, value: TeamDraft[K]) => {
    setDraft((state) => ({ ...state, [key]: value }))
  }

  const setPlayer = (index: number, patch: Partial<Player>) => {
    setDraft((state) => ({
      ...state,
      players: state.players.map((player, position) =>
        position === index ? { ...player, ...patch } : player,
      ),
    }))
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFailure(null)

    const found = validateTeamDraft(draft, teams)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ block: 'center' })
      return
    }

    setSubmitting(true)
    try {
      await createTeam({
        ...draft,
        name: draft.name.trim(),
        tag: draft.tag.trim().toUpperCase(),
        institution: draft.institution.trim(),
        contactEmail: draft.contactEmail.trim(),
        players: draft.players.map((player) => ({
          ...player,
          name: player.name.trim(),
          handle: player.handle.trim(),
        })),
      })
      setDraft(blankDraft())
      navigate('/squads')
    } catch (cause) {
      setFailure(cause instanceof Error ? cause.message : 'Registration failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (rosterFull) {
    return (
      <div className="wrap page">
        <PageHead
          label="Registration"
          title="Pool closed"
          lede={`All ${TOURNAMENT_RULES.maxTeams} slots are verified. The fixture generator is unlocked on the control desk.`}
        />
        <EmptyState
          title="No slots remaining"
          note="Registration reopens for the next edition. Follow the fixture wall for live results from this one."
          action={
            <button type="button" className="btn btn--primary" onClick={() => navigate('/fixtures')}>
              Open the fixture wall
              <Arrow />
            </button>
          }
        />
      </div>
    )
  }

  return (
    <div className="wrap page">
      <PageHead
        label="Registration"
        title="Submit a squad"
        lede={`One squad name, one callsign and exactly ${TOURNAMENT_RULES.rosterSize} verified players. Handles are checked against every roster already in the pool.`}
        aside={
          <span className="tag tag--signal">
            <span className="dot dot--pulse" />
            {TOURNAMENT_RULES.maxTeams - teams.length} slots open
          </span>
        }
      />

      <CapacityMeter filled={teams.length} />

      <form className="split split--7-5" onSubmit={submit} noValidate>
        <div className="stack stack--lg">
          <section className="panel">
            <div className="panel__head">
              <span>Squad identity</span>
              <span>Step 01</span>
            </div>
            <div className="panel__body stack">
              <div className="split split--1-1" style={{ gap: '1rem' }}>
                <TextField
                  id="team-name"
                  label="Squad name"
                  required
                  maxLength={40}
                  placeholder="Iron Serpents"
                  value={draft.name}
                  error={errors.name}
                  onChange={(event) => setField('name', event.target.value)}
                />
                <TextField
                  id="team-tag"
                  label="Callsign"
                  required
                  maxLength={5}
                  placeholder="IRN"
                  value={draft.tag}
                  error={errors.tag}
                  onChange={(event) => setField('tag', event.target.value.toUpperCase())}
                />
              </div>
              <div className="split split--1-1" style={{ gap: '1rem' }}>
                <TextField
                  id="team-institution"
                  label="Institution"
                  required
                  placeholder="School of Engineering"
                  value={draft.institution}
                  error={errors.institution}
                  onChange={(event) => setField('institution', event.target.value)}
                />
                <TextField
                  id="team-email"
                  label="Captain email"
                  type="email"
                  required
                  placeholder="captain@institute.edu"
                  value={draft.contactEmail}
                  error={errors.contactEmail}
                  onChange={(event) => setField('contactEmail', event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="stack">
            <div className="panel__head" style={{ border: 0, padding: 0 }}>
              <span>Active roster</span>
              <span>
                {pad(filled)} / {pad(TOURNAMENT_RULES.rosterSize)} complete
              </span>
            </div>

            <div className="roster-editor">
              {draft.players.map((player, index) => (
                <div className="roster-editor__row" key={player.id}>
                  <span className="roster-editor__idx">{pad(index + 1)}</span>
                  <TextField
                    id={`player-name-${index}`}
                    label="Full name"
                    placeholder="Ishaan Malhotra"
                    value={player.name}
                    error={errors[`players.${index}.name`]}
                    onChange={(event) => setPlayer(index, { name: event.target.value })}
                  />
                  <TextField
                    id={`player-handle-${index}`}
                    label="In game handle"
                    placeholder="kage#001"
                    value={player.handle}
                    error={errors[`players.${index}.handle`]}
                    onChange={(event) => setPlayer(index, { handle: event.target.value })}
                  />
                  <SelectField
                    id={`player-role-${index}`}
                    label="Role"
                    options={PLAYER_ROLES}
                    value={player.role}
                    onChange={(event) => setPlayer(index, { role: event.target.value as PlayerRole })}
                  />
                </div>
              ))}
            </div>

            {errors.roster ? <Notice tone="error">{errors.roster}</Notice> : null}
            {failure ? <Notice tone="error">{failure}</Notice> : null}
          </section>
        </div>

        <aside className="stack stack--top">
          <div className="panel">
            <div className="panel__head">
              <span>Submission checks</span>
              <span>Step 02</span>
            </div>
            <div className="panel__body stack stack--sm">
              <div className="row row--between">
                <span className="team__role">Squad identity</span>
                <span className={draft.name && draft.tag ? 'tag tag--win' : 'tag'}>
                  {draft.name && draft.tag ? 'Ready' : 'Pending'}
                </span>
              </div>
              <div className="row row--between">
                <span className="team__role">Roster completeness</span>
                <span
                  className={filled === TOURNAMENT_RULES.rosterSize ? 'tag tag--win' : 'tag'}
                >
                  {pad(filled)} of {pad(TOURNAMENT_RULES.rosterSize)}
                </span>
              </div>
              <div className="row row--between">
                <span className="team__role">Handle uniqueness</span>
                <span className="tag">Checked on submit</span>
              </div>
              <div className="row row--between">
                <span className="team__role">Pool slot</span>
                <span className="tag tag--signal">{pad(teams.length + 1)}</span>
              </div>
            </div>
          </div>

          <Notice>
            Submitting locks the roster into the pool. Withdrawing a squad afterwards clears any
            generated fixtures, so the schedule is never out of step with the pool.
          </Notice>

          <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
            {submitting ? 'Submitting' : 'Register squad'}
            <Arrow />
          </button>
        </aside>
      </form>
    </div>
  )
}

export default Register
