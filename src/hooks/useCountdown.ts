import { useEffect, useState } from 'react'

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  elapsed: boolean
}

const distance = (target: number): Countdown => {
  const delta = target - Date.now()
  if (delta <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, elapsed: true }

  return {
    days: Math.floor(delta / 86400000),
    hours: Math.floor((delta / 3600000) % 24),
    minutes: Math.floor((delta / 60000) % 60),
    seconds: Math.floor((delta / 1000) % 60),
    elapsed: false,
  }
}

export const useCountdown = (iso: string): Countdown => {
  const target = new Date(iso).getTime()
  const [value, setValue] = useState(() => distance(target))

  useEffect(() => {
    setValue(distance(target))
    const timer = window.setInterval(() => setValue(distance(target)), 1000)
    return () => window.clearInterval(timer)
  }, [target])

  return value
}
