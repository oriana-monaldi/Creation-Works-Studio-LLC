import { useEffect, type RefObject } from 'react'
export function useNarrative(ref: RefObject<HTMLElement>, reduced: boolean, language: string) {
  useEffect(() => {
    if (reduced) return
    let disposed = false
    let context: { revert: () => void } | undefined
    const removeInteractions: (() => void)[] = []
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (disposed) return
      gsap.registerPlugin(ScrollTrigger)
      context = gsap.context(() => {
        const desktop = matchMedia('(min-width: 768px)').matches
        gsap.to('.opening-wordmark', { z: desktop ? 460 : 280, scale: 1.6, rotationX: -7, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.brand-opening', start: 'top top', end: 'bottom 70%', scrub: .8 } })
        gsap.to('.opening-caption', { autoAlpha: 0, y: -24, ease: 'none', scrollTrigger: { trigger: '.brand-opening', start: 'top top', end: 'bottom 70%', scrub: .8 } })
        gsap.from('.hero-content h1 > span', { y: 65, opacity: 0, duration: 1.2, stagger: .12, ease: 'power4.out', scrollTrigger: { trigger: '.hero-content', start: 'top 80%', once: true } })
        gsap.from('.hero-intro, .hero-buttons, .hero-note', { y: 25, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.hero-content', start: 'top 60%', once: true } })
        gsap.to('.hero-content', { y: -65, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
        gsap.utils.toArray<HTMLElement>('[data-reveal], .introduction h2, .heading-row h2, .studio-layout h2').forEach((element) => {
          gsap.from(element, { y: 65, rotation: 1.5, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } })
        })
        gsap.utils.toArray<HTMLElement>('.project-panel').forEach((element) => {
          gsap.from(element, { y: 90, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 95%', once: true } })
        })
        gsap.utils.toArray<HTMLElement>('.project-visual').forEach((element) => {
          gsap.fromTo(element, { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 1.2 } })
        })
        gsap.from('.intro-pillars > div', { y: 50, stagger: .13, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.intro-pillars', start: 'top 90%', once: true } })
        gsap.utils.toArray<HTMLElement>('.service-detail').forEach((element, i) => {
          gsap.from(element, { y: desktop ? 65 : 25, rotationX: desktop ? 5 : 0, duration: 1.1, delay: desktop ? (i % 2) * .1 : 0, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 96%', once: true } })
        })
        gsap.from('.workflow-visual li', { x: 35, duration: .8, stagger: .18, ease: 'power3.out', scrollTrigger: { trigger: '.workflow-visual', start: 'top 85%', once: true } })
        gsap.from('.inquiry-panel', { y: 50, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '#contact', start: 'top 85%', once: true } })
        if (matchMedia('(pointer: fine)').matches) {
          gsap.utils.toArray<HTMLElement>('.service-detail, .project-open, .workflow-visual, .intro-pillars > div, .reasons-grid article, .technology-groups > div, .inquiry-panel').forEach(card => {
            const move = (event: PointerEvent) => {
              const box = card.getBoundingClientRect()
              const x = (event.clientX - box.left) / box.width
              const y = (event.clientY - box.top) / box.height
              card.style.setProperty('--card-x', `${x * 100}%`)
              card.style.setProperty('--card-y', `${y * 100}%`)
              card.style.setProperty('--card-glow', '1')
              gsap.to(card, { rotationY: (x - .5) * 8, rotationX: (.5 - y) * 6, transformPerspective: 1100, scale: 1.012, duration: .45, ease: 'power2.out', overwrite: 'auto' })
            }
            const leave = () => {
              card.style.setProperty('--card-glow', '0')
              gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: .7, ease: 'power3.out', overwrite: 'auto' })
            }
            card.addEventListener('pointermove', move)
            card.addEventListener('pointerleave', leave)
            removeInteractions.push(() => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave); card.style.removeProperty('--card-glow'); gsap.killTweensOf(card); gsap.set(card, { rotationX: 0, rotationY: 0, scale: 1 }) })
          })
        }
        if (desktop && matchMedia('(pointer: fine)').matches) {
          gsap.utils.toArray<HTMLElement>('.button.primary, .header-cta, .circle-link').forEach(button => {
            const move = (event: PointerEvent) => {
              const bounds = button.getBoundingClientRect()
              gsap.to(button, { x: (event.clientX - bounds.left - bounds.width / 2) * .15, y: (event.clientY - bounds.top - bounds.height / 2) * .2, duration: .5, ease: 'power3.out', overwrite: 'auto' })
            }
            const leave = () => gsap.to(button, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1, .4)' })
            button.addEventListener('pointermove', move); button.addEventListener('pointerleave', leave)
            removeInteractions.push(() => { button.removeEventListener('pointermove', move); button.removeEventListener('pointerleave', leave); gsap.set(button, { x: 0, y: 0 }) })
          })
        }
      }, ref)
    }).catch(() => { /* Content remains visible if animation loading fails. */ })
    return () => { disposed = true; removeInteractions.forEach(remove => remove()); context?.revert() }
  }, [ref, reduced, language])
}




