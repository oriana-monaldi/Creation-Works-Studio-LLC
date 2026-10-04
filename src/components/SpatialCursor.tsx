import { useEffect, useRef } from 'react'
import type { Language } from '../data/content'

export function SpatialCursor({ reduced, language }: { reduced: boolean; language: Language }) {
  const cursor = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = cursor.current
    if (!element || reduced || !matchMedia('(pointer: fine)').matches) return
    let frame = 0, x = -100, y = -100, targetX = -100, targetY = -100
    const tick = () => {
      x += (targetX - x) * .18; y += (targetY - y) * .18
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`
      frame = requestAnimationFrame(tick)
    }
    const move = (event: PointerEvent) => {
      targetX = event.clientX; targetY = event.clientY
      element.dataset.visible = 'true'
      element.dataset.kind = (event.target as HTMLElement).closest('.project-open') ? 'project' : (event.target as HTMLElement).closest('button, a, summary') ? 'link' : 'default'
    }
    const leave = () => { element.dataset.visible = 'false'; cancelAnimationFrame(frame); frame = 0 }
    const enter = () => { if (!frame) frame = requestAnimationFrame(tick) }
    const visibility = () => { if (document.hidden) leave(); else enter() }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave); document.addEventListener('pointerenter', enter); document.addEventListener('visibilitychange', visibility)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame); element.dataset.visible = 'false'
      window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); document.removeEventListener('pointerenter', enter); document.removeEventListener('visibilitychange', visibility)
    }
  }, [reduced])
  return <div className="spatial-cursor" ref={cursor} aria-hidden="true"><span>{language === 'en' ? 'Explore ↗' : 'Explorar ↗'}</span></div>
}
