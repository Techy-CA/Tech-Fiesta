import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { navigation, site } from '@/config/site'
import { TOURNAMENT_RULES } from '@/config/tournament'
import { useCountdown } from '@/hooks/useCountdown'
import { useTournament } from '@/hooks/useTournament'
import { pad } from '@/lib/format'

const links = [...navigation, { label: 'Control', to: '/control' }]

export const Header = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const countdown = useCountdown(site.startsAt)
  const { teams, rosterFull, hasFixtures, championId, teamName } = useTournament()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const phase = championId
    ? `Champion ${teamName(championId)}`
    : hasFixtures
      ? 'Fixtures live'
      : rosterFull
        ? 'Pool closed'
        : `${TOURNAMENT_RULES.maxTeams - teams.length} slots left`

  return (
    <>
      <div className="rail">
        <div className="wrap rail__inner">
          <span>
            {site.code} / {site.city}
          </span>
          <div className="rail__mid">
            <span>{phase}</span>
            <span>{site.venue}</span>
          </div>
          <span className="rail__end">
            {countdown.elapsed
              ? 'Live now'
              : `T-${countdown.days}D ${pad(countdown.hours)}H ${pad(countdown.minutes)}M`}
          </span>
        </div>
      </div>

      <header className="nav">
        <div className="wrap nav__inner">
          <NavLink to="/" className="wordmark">
            <span className="wordmark__dot" />
            {site.shortName}
            <span className="wordmark__sub">{site.edition}</span>
          </NavLink>

          <nav className="nav__links" aria-label="Primary">
            {links.map((item) => (
              <NavLink key={item.to} to={item.to} className="nav__link" end={item.to === '/'}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation"
            onClick={() => setOpen((state) => !state)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {open ? (
        <div className="nav__drawer" id="mobile-nav">
          <div className="wrap">
            {links.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                style={{ '--i': index } as React.CSSProperties}
              >
                <span>{pad(index + 1)}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}
