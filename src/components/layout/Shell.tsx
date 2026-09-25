import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ScrollProgress } from '@/components/fx/ScrollProgress'
import { Spotlight } from '@/components/fx/Spotlight'
import { Footer } from './Footer'
import { Header } from './Header'

export const Shell = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return (
    <div className="shell">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <ScrollProgress />
      <Spotlight />
      <div className="fx-grain" aria-hidden="true" />
      <div className="fx-vignette" aria-hidden="true" />
      <Header />
      <main className="shell__main" id="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
