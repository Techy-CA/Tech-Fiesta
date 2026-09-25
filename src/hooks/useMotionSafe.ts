import { useEffect, useState } from 'react'

export const useMotionSafe = (minWidth = 0) => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const wide = window.matchMedia(`(min-width: ${minWidth}px)`)
    const sync = () => setEnabled(!reduce.matches && wide.matches)

    sync()
    reduce.addEventListener('change', sync)
    wide.addEventListener('change', sync)

    return () => {
      reduce.removeEventListener('change', sync)
      wide.removeEventListener('change', sync)
    }
  }, [minWidth])

  return enabled
}
