import type { ElementType, ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'

interface RevealProps {
  children: ReactNode
  as?: ElementType
  delay?: number
  variant?: 'wipe' | 'up' | 'scale'
  className?: string
}

export const Reveal = ({ children, as, delay = 0, variant = 'wipe', className }: RevealProps) => {
  const ref = useReveal<HTMLDivElement>()
  const Tag = (as ?? 'div') as ElementType
  const base = variant === 'wipe' ? 'reveal' : `reveal reveal--${variant}`

  return (
    <Tag
      ref={ref}
      className={className ? `${base} ${className}` : base}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}
