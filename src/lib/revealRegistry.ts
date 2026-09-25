const pending = new Set<HTMLElement>()

let timer = 0

const SWEEP_MS = 120
const SETTLE_MS = 1500
const AHEAD = 1.2
const BEHIND = 0.25

const show = (node: HTMLElement) => {
  node.dataset.visible = 'true'
  window.setTimeout(() => {
    node.dataset.revealDone = 'true'
  }, SETTLE_MS)
}

const inReach = (node: HTMLElement, viewport: number) => {
  const rect = node.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) return false
  return rect.top < viewport * AHEAD && rect.bottom > -viewport * BEHIND
}

const sweep = () => {
  const viewport = window.innerHeight

  pending.forEach((node) => {
    if (!node.isConnected) {
      pending.delete(node)
      return
    }
    if (!inReach(node, viewport)) return
    show(node)
    pending.delete(node)
  })

  if (pending.size === 0 && timer) {
    window.clearInterval(timer)
    timer = 0
  }
}

export const registerReveal = (node: HTMLElement) => {
  if (typeof window === 'undefined') return () => undefined

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    node.dataset.visible = 'true'
    node.dataset.revealDone = 'true'
    return () => undefined
  }

  pending.add(node)

  if (inReach(node, window.innerHeight)) {
    show(node)
    pending.delete(node)
  } else if (!timer) {
    timer = window.setInterval(sweep, SWEEP_MS)
  }

  return () => {
    pending.delete(node)
    if (pending.size === 0 && timer) {
      window.clearInterval(timer)
      timer = 0
    }
  }
}
