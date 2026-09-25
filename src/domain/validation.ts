import { TOURNAMENT_RULES } from '@/config/tournament'
import type { Team, TeamDraft } from '@/types/tournament'

export type FieldErrors = Record<string, string>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const normalise = (value: string) => value.trim().toLowerCase()

export const validateTeamDraft = (draft: TeamDraft, existing: Team[]): FieldErrors => {
  const errors: FieldErrors = {}
  const name = draft.name.trim()
  const tag = draft.tag.trim()

  if (name.length < 2 || name.length > 40) {
    errors.name = 'Squad name must be between 2 and 40 characters.'
  } else if (existing.some((team) => normalise(team.name) === normalise(name))) {
    errors.name = 'A squad with this name is already registered.'
  }

  if (!/^[A-Za-z0-9]{2,5}$/.test(tag)) {
    errors.tag = 'Callsign must be 2 to 5 letters or digits.'
  } else if (existing.some((team) => normalise(team.tag) === normalise(tag))) {
    errors.tag = 'This callsign is taken.'
  }

  if (draft.institution.trim().length < 2) {
    errors.institution = 'Institution is required.'
  }

  if (!EMAIL.test(draft.contactEmail.trim())) {
    errors.contactEmail = 'Enter a valid contact email.'
  }

  const takenHandles = new Set(
    existing.flatMap((team) => team.players.map((player) => normalise(player.handle))),
  )
  const seen = new Set<string>()

  draft.players.forEach((player, index) => {
    const playerName = player.name.trim()
    const handle = player.handle.trim()

    if (playerName.length < 2) {
      errors[`players.${index}.name`] = 'Required'
    }

    if (handle.length < 2) {
      errors[`players.${index}.handle`] = 'Required'
      return
    }

    const key = normalise(handle)
    if (seen.has(key)) {
      errors[`players.${index}.handle`] = 'Duplicate in this squad'
    } else if (takenHandles.has(key)) {
      errors[`players.${index}.handle`] = 'Already registered elsewhere'
    }
    seen.add(key)
  })

  if (draft.players.length !== TOURNAMENT_RULES.rosterSize) {
    errors.roster = `Submit exactly ${TOURNAMENT_RULES.rosterSize} players.`
  }

  return errors
}

export const validateScore = (home: string, away: string, format: string): string | null => {
  const best = format === 'BO5' ? 5 : format === 'BO3' ? 3 : 1
  const target = Math.ceil(best / 2)
  const homeScore = Number(home)
  const awayScore = Number(away)

  if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore)) return 'Scores must be whole numbers.'
  if (homeScore < 0 || awayScore < 0) return 'Scores cannot be negative.'
  if (homeScore === awayScore) return 'A fixture cannot end level.'
  if (Math.max(homeScore, awayScore) !== target) return `Winner must reach ${target} in a ${format}.`
  if (homeScore + awayScore > best) return `A ${format} cannot exceed ${best} maps.`

  return null
}
