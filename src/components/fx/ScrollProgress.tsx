import { useEffect, useState } from 'react'

export const ScrollProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0

    const update = () => {
      raf = 0
      const reach = document.documentElement.scrollHeight - window.innerHeight
      setProgress(reach > 0 ? Math.min(window.scrollY / reach, 1) : 0)
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div className="fx-progress" style={{ '--progress': progress } as React.CSSProperties} />
}
