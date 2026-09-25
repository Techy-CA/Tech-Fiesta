import { TOURNAMENT_RULES } from '@/config/tournament'
import { pad } from '@/lib/format'

export const CapacityMeter = ({ filled }: { filled: number }) => {
  const slots = Array.from({ length: TOURNAMENT_RULES.maxTeams }, (_, index) => index)

  return (
    <div className="capacity">
      <div className="capacity__meta">
        <span>Pool capacity</span>
        <span>
          {pad(filled)} / {pad(TOURNAMENT_RULES.maxTeams)} squads
        </span>
      </div>
      <div className="capacity__bar">
        {slots.map((slot) => (
          <span key={slot} className="capacity__slot" data-filled={slot < filled} />
        ))}
      </div>
    </div>
  )
}
