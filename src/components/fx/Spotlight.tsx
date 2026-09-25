import { useEffect, useState } from 'react'
import { useMotionSafe } from '@/hooks/useMotionSafe'

export const Spotlight = () => {
  const enabled = useMotionSafe(1024)
  const [point, setPoint] = useState({ x: 50, y: 40, active: false })

  useEffect(() => {
    if (!enabled) return

    let raf = 0
    let next = { x: 0, y: 0 }

    const apply = () => {
      raf = 0
      setPoint({
        x: (next.x / window.innerWidth) * 100,
        y: (next.y / window.innerHeight) * 100,
        active: true,
      })
    }

    const onMove = (event: PointerEvent) => {
      next = { x: event.clientX, y: event.clientY }
      if (raf) return
      raf = requestAnimationFrame(apply)
    }

    const onLeave = () => setPoint((state) => ({ ...state, active: false }))

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      className="fx-spotlight"
      data-active={point.active}
      style={{ '--mx': `${point.x}%`, '--my': `${point.y}%` } as React.CSSProperties}
    />
  )
}
