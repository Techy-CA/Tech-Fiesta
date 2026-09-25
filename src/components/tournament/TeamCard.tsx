import { pad } from '@/lib/format'
import type { Team } from '@/types/tournament'

interface TeamCardProps {
  team: Team
  seed: number
  onRemove?: (teamId: string) => void
}

export const TeamCard = ({ team, seed, onRemove }: TeamCardProps) => (
  <article className="team">
    <header className="team__head">
      <div>
        <p className="team__tag">
          {team.tag} / SEED {pad(seed)}
        </p>
        <h3 className="team__name">{team.name}</h3>
        <p className="team__inst">{team.institution}</p>
      </div>
      <span className="tag tag--signal">
        <span className="dot" />
        Verified
      </span>
    </header>

    <ul className="team__roster">
      {team.players.map((player, index) => (
        <li className="team__player" key={player.id}>
          <i>{pad(index + 1)}</i>
          <span>
            <span className="team__handle">{player.handle}</span>
            <span className="team__real">{player.name}</span>
          </span>
          <span className="team__role">{player.role}</span>
        </li>
      ))}
    </ul>

    <footer className="team__foot">
      <span>{team.players.length} operators</span>
      {onRemove ? (
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => onRemove(team.id)}>
          Withdraw
        </button>
      ) : (
        <span>{team.contactEmail}</span>
      )}
    </footer>
  </article>
)
