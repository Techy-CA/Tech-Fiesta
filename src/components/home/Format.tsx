import { SectionHead } from '@/components/layout/SectionHead'
import { Reveal } from '@/components/ui/Reveal'
import { TOURNAMENT_RULES, groupFixtureCount } from '@/config/tournament'

const n = TOURNAMENT_RULES.maxTeams
const fixtures = groupFixtureCount(n)

const steps = [
  {
    num: '01',
    title: 'Registration',
    body: `The pool accepts exactly ${n} squads of ${TOURNAMENT_RULES.rosterSize} players. Handles are checked against every other roster, so a player cannot appear twice.`,
    math: `capacity = ${n} squads x ${TOURNAMENT_RULES.rosterSize} players = ${n * TOURNAMENT_RULES.rosterSize} operators`,
  },
  {
    num: '02',
    title: 'Group stage',
    body: 'The generator produces a complete round robin using the circle method. Every squad plays every rival once, with no byes and no repeat pairings.',
    math: `C(${n}, 2) = ${n}(${n} - 1) / 2 = ${fixtures} fixtures`,
  },
  {
    num: '03',
    title: 'Playoffs',
    body: `The table seeds the bracket. Seed one faces seed ${TOURNAMENT_RULES.playoffCut}, seed two faces seed three, and the winners meet in a best of five grand final.`,
    math: `${TOURNAMENT_RULES.playoffCut} qualifiers = 2 semifinals + 1 final = 3 fixtures`,
  },
]

export const Format = () => (
  <section className="section" id="format">
    <div className="wrap">
      <SectionHead
        label="Competition format"
        title="A schedule with no soft draws"
        note="The fixture list is produced by a deterministic generator. Run it twice on the same pool and you get the same ten fixtures in the same order."
      />

      <div className="flow">
        {steps.map((step, index) => (
          <Reveal key={step.num} delay={index * 80} className="flow__step">
            <span className="flow__num">{step.num}</span>
            <h3 className="flow__title">{step.title}</h3>
            <p className="flow__body">{step.body}</p>
            <p className="flow__math">{step.math}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
)
