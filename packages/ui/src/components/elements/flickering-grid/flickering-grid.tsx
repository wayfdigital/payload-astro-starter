import type { HTMLAttributes } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface FlickeringGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Side of each square, in CSS pixels. */
  squareSize?: number
  /** Gap between squares, in CSS pixels. */
  gridGap?: number
  /** Chance per second that a given square re-rolls its opacity. */
  flickerChance?: number
  /** Any CSS color. Defaults to the `--flicker-color` theme token. */
  color?: string
  /** Fixed canvas size; omit to fill the parent (tracked with a ResizeObserver). */
  width?: number
  height?: number
  /** Upper bound on a square's opacity — the knob that keeps the grid subtle. */
  maxOpacity?: number
}

/** Reads a theme token off the live element, falling back when it isn't defined. */
const readToken = (el: HTMLElement, token: string, fallback: string) =>
  getComputedStyle(el).getPropertyValue(token).trim() || fallback

/** Resolves any CSS color string to an `rgba(r, g, b,` prefix via a 1×1 scratch canvas. */
const toRGBAPrefix = (color: string) => {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext('2d')
  if (!ctx) return 'rgba(0, 0, 0,'
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data)
  return `rgba(${r}, ${g}, ${b},`
}

/**
 * Canvas grid of squares that randomly re-roll their opacity — a quiet, animated
 * backdrop for dark sections.
 *
 * Client-only (it paints to a canvas), so in Astro it must be rendered inside a
 * hydrated island. It idles when scrolled out of view via an IntersectionObserver.
 *
 * It flickers for everyone, by request — `prefers-reduced-motion` is deliberately
 * not honoured. To bring that back, skip the initial `requestAnimationFrame` when
 * the query matches; `draw()` has already painted one static frame by then.
 */
export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color,
  width,
  height,
  maxOpacity = 0.3,
  className = '',
  ...props
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // Read by the animation loop rather than closed over, so toggling visibility
  // doesn't tear down and rebuild the canvas.
  const inViewRef = useRef(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number) => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = w * dpr
      canvas.height = h * dpr
      const cols = Math.ceil(w / (squareSize + gridGap))
      const rows = Math.ceil(h / (squareSize + gridGap))
      const squares = new Float32Array(cols * rows)
      for (let i = 0; i < squares.length; i++) squares[i] = Math.random() * maxOpacity
      return { cols, rows, squares, dpr }
    },
    [squareSize, gridGap, maxOpacity],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const ctx = canvas?.getContext('2d') ?? null
    if (!canvas || !container || !ctx) return

    const rgbaPrefix = toRGBAPrefix(color ?? readToken(container, '--flicker-color', '#000000'))

    let frameId: number | null = null
    let grid = setupCanvas(canvas, width || container.clientWidth, height || container.clientHeight)

    const draw = () => {
      const { cols, rows, squares, dpr } = grid
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          ctx.fillStyle = `${rgbaPrefix}${squares[i * rows + j]})`
          ctx.fillRect(
            i * (squareSize + gridGap) * dpr,
            j * (squareSize + gridGap) * dpr,
            squareSize * dpr,
            squareSize * dpr,
          )
        }
      }
    }

    const resize = () => {
      const w = width || container.clientWidth
      const h = height || container.clientHeight
      setCanvasSize({ width: w, height: h })
      grid = setupCanvas(canvas, w, h)
      draw()
    }

    resize()

    let lastTime = 0
    const animate = (time: number) => {
      // First frame after idling has a stale `lastTime`; clamp so squares don't
      // all re-roll at once on scroll-back.
      const deltaTime = Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time
      if (inViewRef.current) {
        const { squares } = grid
        for (let i = 0; i < squares.length; i++) {
          if (Math.random() < flickerChance * deltaTime) squares[i] = Math.random() * maxOpacity
        }
        draw()
      }
      frameId = requestAnimationFrame(animate)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry?.isIntersecting ?? false
      },
      { threshold: 0 },
    )
    intersectionObserver.observe(canvas)

    frameId = requestAnimationFrame(animate)

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [setupCanvas, color, width, height, squareSize, gridGap, flickerChance, maxOpacity])

  return (
    <div ref={containerRef} className={['h-full w-full', className].join(' ')} {...props}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        aria-hidden="true"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />
    </div>
  )
}
