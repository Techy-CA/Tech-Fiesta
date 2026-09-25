import { Reveal } from '@/components/ui/Reveal'
import { FixtureRow } from './FixtureRow'
import type { Fixture } from '@/types/tournament'

interface RoundGroupProps {
  label: string
  count: number
  fixtures: Fixture[]
  teamName: (teamId: string | null) => string
  teamTag: (teamId: string | null) => string
}

export const RoundGroup = ({ label, count, fixtures, teamName, teamTag }: RoundGroupProps) => (
  <section className="round">
    <p className="round__head">
      <b>{label}</b>
      {count} fixtures
    </p>
    {fixtures.map((fixture, index) => (
      <Reveal key={fixture.id} delay={index * 70} variant="up">
        <FixtureRow fixture={fixture} teamName={teamName} teamTag={teamTag} />
      </Reveal>
    ))}
  </section>
)
