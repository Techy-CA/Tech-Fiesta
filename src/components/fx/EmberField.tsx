import { useEffect, useRef } from 'react'

interface Ember {
  x: number
  y: number
  radius: number
  drift: number
  speed: number
  life: number
  maxLife: number
  hue: number
}

export const EmberField = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const context = canvas.getContext('2d')
    if (!context) return

    const dense = window.matchMedia('(min-width: 900px)').matches
    const count = dense ? 78 : 34
    const ratio = Math.min(window.devicePixelRatio || 1, 2)

    let width = 0
    let height = 0
    let raf = 0
    let running = true
    let embers: Ember[] = []

    const spawn = (initial: boolean): Ember => {
      const maxLife = 300 + Math.random() * 420
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : height + Math.random() * 60,
        radius: 0.7 + Math.random() * 2.1,
        drift: (Math.random() - 0.5) * 0.28,
        speed: 0.22 + Math.random() * 0.72,
        life: initial ? Math.random() * maxLife : 0,
        maxLife,
        hue: Math.random() > 0.78 ? 41 : 14,
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      embers = Array.from({ length: count }, () => spawn(true))
    }

    const draw = () => {
      raf = 0
      context.clearRect(0, 0, width, height)

      embers.forEach((ember, index) => {
        ember.life += 1
        ember.y -= ember.speed
        ember.x += ember.drift + Math.sin(ember.life / 46) * 0.24

        if (ember.life > ember.maxLife || ember.y < -20) {
          embers[index] = spawn(false)
          return
        }

        const progress = ember.life / ember.maxLife
        const alpha = Math.sin(progress * Math.PI) * 0.72
        const glow = ember.radius * 4.2

        const gradient = context.createRadialGradient(ember.x, ember.y, 0, ember.x, ember.y, glow)
        gradient.addColorStop(0, `hsla(${ember.hue}, 100%, 68%, ${alpha})`)
        gradient.addColorStop(0.42, `hsla(${ember.hue}, 100%, 52%, ${alpha * 0.36})`)
        gradient.addColorStop(1, 'hsla(14, 100%, 50%, 0)')

        context.fillStyle = gradient
        context.beginPath()
        context.arc(ember.x, ember.y, glow, 0, Math.PI * 2)
        context.fill()
      })

      if (running) raf = requestAnimationFrame(draw)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        running = entries[0].isIntersecting
        if (running && !raf) raf = requestAnimationFrame(draw)
      },
      { threshold: 0 },
    )

    resize()
    observer.observe(canvas)
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      running = false
      observer.disconnect()
      window.removeEventListener('resize', resize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="embers" aria-hidden="true" />
}
