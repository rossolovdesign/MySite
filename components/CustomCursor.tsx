'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor="pointer"]'

export function CustomCursor() {
  const pathname = usePathname()
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pathname.startsWith('/studio')) return
    if (typeof window === 'undefined') return

    const finePointer = window.matchMedia('(any-pointer: fine)').matches
    const hoverCapable = window.matchMedia('(any-hover: hover)').matches
    if (!finePointer || !hoverCapable) return

    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    document.body.classList.add('custom-cursor-enabled')

    const state = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      visible: false,
      hovering: false,
      pressed: false,
      rafId: 0 as number,
      running: false,
    }

    const render = () => {
      state.x += (state.targetX - state.x) * 0.2
      state.y += (state.targetY - state.y) * 0.2

      const ringScale = state.pressed ? 0.88 : state.hovering ? 1.45 : 1
      const dotScale = state.pressed ? 1.25 : state.hovering ? 0.78 : 1
      const opacity = state.visible ? 1 : 0

      ring.style.transform = `translate3d(${state.x - 15}px, ${state.y - 15}px, 0) scale(${ringScale})`
      dot.style.transform = `translate3d(${state.targetX - 4}px, ${state.targetY - 4}px, 0) scale(${dotScale})`
      ring.style.opacity = String(opacity)
      dot.style.opacity = String(opacity)

      const deltaX = Math.abs(state.targetX - state.x)
      const deltaY = Math.abs(state.targetY - state.y)
      const shouldKeepAnimating = state.visible || state.pressed || state.hovering || deltaX > 0.1 || deltaY > 0.1

      if (shouldKeepAnimating) {
        state.rafId = window.requestAnimationFrame(render)
      } else {
        state.running = false
        state.rafId = 0
      }
    }

    const ensureRender = () => {
      if (state.running) return
      state.running = true
      state.rafId = window.requestAnimationFrame(render)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      state.targetX = event.clientX
      state.targetY = event.clientY
      state.visible = true
      ensureRender()
    }

    const onPointerDown = () => {
      state.pressed = true
      ensureRender()
    }

    const onPointerUp = () => {
      state.pressed = false
      ensureRender()
    }

    const onPointerLeaveWindow = () => {
      state.visible = false
      state.hovering = false
      state.pressed = false
    }

    const onPointerOver = (event: Event) => {
      const target = event.target as HTMLElement | null
      const nextHovering = Boolean(target?.closest(INTERACTIVE_SELECTOR))
      if (nextHovering === state.hovering) return
      state.hovering = nextHovering
      ensureRender()
    }

    const onVisibilityChange = () => {
      if (document.hidden) onPointerLeaveWindow()
    }

    ensureRender()

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointerleave', onPointerLeaveWindow)
    window.addEventListener('blur', onPointerLeaveWindow)
    document.addEventListener('pointerover', onPointerOver, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.cancelAnimationFrame(state.rafId)
      document.body.classList.remove('custom-cursor-enabled')
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointerleave', onPointerLeaveWindow)
      window.removeEventListener('blur', onPointerLeaveWindow)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [pathname])

  return (
    <div className="custom-cursor-layer" aria-hidden>
      <div ref={ringRef} className="custom-cursor-ring" />
      <div ref={dotRef} className="custom-cursor-dot" />
    </div>
  )
}
