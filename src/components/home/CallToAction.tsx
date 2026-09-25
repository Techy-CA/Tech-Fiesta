import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { Arrow } from '@/components/ui/Arrow'
import { TOURNAMENT_RULES } from '@/config/tournament'
import { useTournament } from '@/hooks/useTournament'

const Ribbons = lazy(() => import('@/components/fx/Ribbons'))

export const CallToAction = () => {
  const { teams, rosterFull } = useTournament()
  const remaining = TOURNAMENT_RULES.maxTeams - teams.length

  return (
    <section className="cta">
      <span className="glow glow--blaze glow--anim cta__glow" aria-hidden="true" />
      <Suspense fallback={null}>
        <Ribbons
          colors={['#ff3d23', '#ff6a3d', '#ffc64b']}
          baseThickness={26}
          baseSpring={0.028}
          baseFriction={0.92}
          offsetFactor={0.06}
          maxAge={620}
          pointCount={46}
          speedMultiplier={0.5}
          enableFade
          enableShaderEffect
          effectAmplitude={1.6}
        />
      </Suspense>

      <div className="wrap cta__inner">
        <h2 className="cta__title">
          {rosterFull ? (
            <>
              The pool is <em>closed</em>
            </>
          ) : (
            <>
              Claim a <em>slot</em>
            </>
          )}
        </h2>
        <p className="cta__note">
          {rosterFull
            ? 'All five squads are verified. The fixture wall is live and the table updates as results are filed.'
            : `${remaining} of ${TOURNAMENT_RULES.maxTeams} slots remain. Registration closes the moment the fifth roster is verified.`}
        </p>
        <div className="cta__actions">
          <Link className="btn btn--primary slash" to={rosterFull ? '/fixtures' : '/register'}>
            <span>{rosterFull ? 'Open the fixture wall' : 'Register your squad'}</span>
            <Arrow />
          </Link>
          <Link className="btn" to="/squads">
            <span>See registered squads</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
