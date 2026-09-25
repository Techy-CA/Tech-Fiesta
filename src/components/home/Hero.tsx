import { Link } from 'react-router-dom'
import { ChampionArt } from '@/components/fx/ChampionArt'
import { EmberField } from '@/components/fx/EmberField'
import { Arrow } from '@/components/ui/Arrow'
import { site } from '@/config/site'
import { useParallax } from '@/hooks/useParallax'
import { useTournament } from '@/hooks/useTournament'

export const Hero = () => {
  const { rosterFull } = useTournament()
  const stageRef = useParallax<HTMLDivElement>(0.2)

  return (
    <section className="hero">
      <div className="hero__stage" ref={stageRef} aria-hidden="true">
        <span className="hero__beam" />
        <span className="glow glow--blaze glow--anim hero__glow-a" />
        <span className="glow glow--deep glow--anim-slow hero__glow-b" />
        <div className="floor">
          <div className="floor__grid" />
        </div>
        <EmberField />
      </div>

      <div className="hero__art" aria-hidden="true">
        <ChampionArt />
      </div>

      <div className="wrap hero__inner">
        <p className="hero__edition">
          <b>{site.code}</b>
          {site.dateLabel}
        </p>

        <h1 className="hero__title">
          <span style={{ '--line': 0 } as React.CSSProperties}>Five squads</span>
          <span style={{ '--line': 1 } as React.CSSProperties}>enter</span>
          <span className="hero__accent" style={{ '--line': 2 } as React.CSSProperties}>
            One leaves
          </span>
        </h1>

        <p className="hero__lede">{site.tagline}</p>

        <div className="hero__cta">
          <Link className="btn btn--primary slash" to={rosterFull ? '/fixtures' : '/register'}>
            <span>{rosterFull ? 'Enter the arena' : 'Register a squad'}</span>
            <Arrow />
          </Link>
          <Link className="btn" to="/standings">
            <span>Live standings</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
