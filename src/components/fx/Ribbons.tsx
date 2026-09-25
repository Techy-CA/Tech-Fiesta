import { useEffect, useMemo, useRef } from 'react'
import { Color, Polyline, Renderer, Transform, Vec3 } from 'ogl'

interface RibbonsProps {
  colors?: string[]
  baseSpring?: number
  baseFriction?: number
  baseThickness?: number
  offsetFactor?: number
  maxAge?: number
  pointCount?: number
  speedMultiplier?: number
  enableFade?: boolean
  enableShaderEffect?: boolean
  effectAmplitude?: number
  backgroundColor?: [number, number, number, number]
}

interface Ribbon {
  spring: number
  friction: number
  mouseVelocity: Vec3
  mouseOffset: Vec3
  points: Vec3[]
  polyline: Polyline
}

const vertex = `
precision highp float;

attribute vec3 position;
attribute vec3 next;
attribute vec3 prev;
attribute vec2 uv;
attribute float side;

uniform vec2 uResolution;
uniform float uDPR;
uniform float uThickness;
uniform float uTime;
uniform float uEnableShaderEffect;
uniform float uEffectAmplitude;

varying vec2 vUV;

vec4 getPosition() {
    vec4 current = vec4(position, 1.0);
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 nextScreen = next.xy * aspect;
    vec2 prevScreen = prev.xy * aspect;
    vec2 tangent = normalize(nextScreen - prevScreen);
    vec2 normal = vec2(-tangent.y, tangent.x);
    normal /= aspect;
    normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0));
    float dist = length(nextScreen - prevScreen);
    normal *= smoothstep(0.0, 0.02, dist);
    float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
    float pixelWidth = current.w * pixelWidthRatio;
    normal *= pixelWidth * uThickness;
    current.xy -= normal * side;
    if (uEnableShaderEffect > 0.5) {
        current.xy += normal * sin(uTime + current.x * 10.0) * uEffectAmplitude;
    }
    return current;
}

void main() {
    vUV = uv;
    gl_Position = getPosition();
}
`

const fragment = `
precision highp float;

uniform vec3 uColor;
uniform float uOpacity;
uniform float uEnableFade;

varying vec2 vUV;

void main() {
    float fadeFactor = 1.0;
    if (uEnableFade > 0.5) {
        fadeFactor = 1.0 - smoothstep(0.0, 1.0, vUV.y);
    }
    gl_FragColor = vec4(uColor, uOpacity * fadeFactor);
}
`

export const Ribbons = ({
  colors = ['#ff3d23'],
  baseSpring = 0.03,
  baseFriction = 0.9,
  baseThickness = 30,
  offsetFactor = 0.05,
  maxAge = 500,
  pointCount = 50,
  speedMultiplier = 0.6,
  enableFade = false,
  enableShaderEffect = false,
  effectAmplitude = 2,
  backgroundColor = [0, 0, 0, 0],
}: RibbonsProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const palette = useMemo(() => colors.join('|'), [colors])
  const ground = useMemo(() => backgroundColor.join('|'), [backgroundColor])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const swatches = palette.split('|')
    const clear = ground.split('|').map(Number)

    let renderer: Renderer
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: true })
    } catch {
      return
    }

    const gl = renderer.gl
    gl.clearColor(clear[0], clear[1], clear[2], clear[3])

    const canvas = gl.canvas as HTMLCanvasElement
    canvas.style.position = 'absolute'
    canvas.style.inset = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    container.appendChild(canvas)

    const scene = new Transform()
    const ribbons: Ribbon[] = []
    const center = (swatches.length - 1) / 2

    swatches.forEach((swatch, index) => {
      const points = Array.from({ length: pointCount }, () => new Vec3())

      const polyline = new Polyline(gl, {
        points,
        vertex,
        fragment,
        uniforms: {
          uColor: { value: new Color(swatch) },
          uThickness: { value: baseThickness + (Math.random() - 0.5) * 3 },
          uOpacity: { value: 1 },
          uTime: { value: 0 },
          uEnableShaderEffect: { value: enableShaderEffect ? 1 : 0 },
          uEffectAmplitude: { value: effectAmplitude },
          uEnableFade: { value: enableFade ? 1 : 0 },
        },
      })

      polyline.mesh.setParent(scene)

      ribbons.push({
        spring: baseSpring + (Math.random() - 0.5) * 0.05,
        friction: baseFriction + (Math.random() - 0.5) * 0.05,
        mouseVelocity: new Vec3(),
        mouseOffset: new Vec3(
          (index - center) * offsetFactor + (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.1,
          0,
        ),
        points,
        polyline,
      })
    })

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight)
      ribbons.forEach((ribbon) => ribbon.polyline.resize())
    }

    resize()

    const pointer = new Vec3()
    let lastPointerAt = 0
    let idlePhase = Math.random() * 100

    const trackPointer = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      lastPointerAt = performance.now()
      pointer.set((x / rect.width) * 2 - 1, (y / rect.height) * -2 + 1, 0)
    }

    const scratch = new Vec3()
    let frame = 0
    let running = true
    let last = performance.now()

    const draw = () => {
      frame = 0
      const now = performance.now()
      const delta = now - last
      last = now

      if (now - lastPointerAt > 1600) {
        idlePhase += delta * 0.00042
        pointer.set(Math.sin(idlePhase * 1.4) * 0.62, Math.cos(idlePhase) * 0.34, 0)
      }

      ribbons.forEach((ribbon) => {
        scratch
          .copy(pointer)
          .add(ribbon.mouseOffset)
          .sub(ribbon.points[0])
          .multiply(ribbon.spring)
        ribbon.mouseVelocity.add(scratch).multiply(ribbon.friction)
        ribbon.points[0].add(ribbon.mouseVelocity)

        for (let i = 1; i < ribbon.points.length; i += 1) {
          if (Number.isFinite(maxAge) && maxAge > 0) {
            const segmentDelay = maxAge / (ribbon.points.length - 1)
            const alpha = Math.min(1, (delta * speedMultiplier) / segmentDelay)
            ribbon.points[i].lerp(ribbon.points[i - 1], alpha)
          } else {
            ribbon.points[i].lerp(ribbon.points[i - 1], 0.9)
          }
        }

        const uniforms = ribbon.polyline.mesh.program.uniforms
        if (uniforms.uTime) uniforms.uTime.value = now * 0.001
        ribbon.polyline.updateGeometry()
      })

      renderer.render({ scene })
      if (running) frame = requestAnimationFrame(draw)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        running = entries[0].isIntersecting
        if (running && !frame) {
          last = performance.now()
          frame = requestAnimationFrame(draw)
        }
      },
      { threshold: 0 },
    )

    observer.observe(container)
    window.addEventListener('pointermove', trackPointer, { passive: true })
    window.addEventListener('resize', resize)
    frame = requestAnimationFrame(draw)

    return () => {
      running = false
      observer.disconnect()
      window.removeEventListener('pointermove', trackPointer)
      window.removeEventListener('resize', resize)
      if (frame) cancelAnimationFrame(frame)
      if (canvas.parentNode === container) container.removeChild(canvas)
      const context = gl.getExtension('WEBGL_lose_context')
      if (context) context.loseContext()
    }
  }, [
    palette,
    ground,
    baseSpring,
    baseFriction,
    baseThickness,
    offsetFactor,
    maxAge,
    pointCount,
    speedMultiplier,
    enableFade,
    enableShaderEffect,
    effectAmplitude,
  ])

  return <div ref={containerRef} className="ribbons" aria-hidden="true" />
}

export default Ribbons
