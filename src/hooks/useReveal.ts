import { useEffect, useRef } from 'react'
import { registerReveal } from '@/lib/revealRegistry'

export const useReveal = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    return registerReveal(node)
  }, [])

  return ref
}
