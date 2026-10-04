(() => {
  const sections = Array.from(document.querySelectorAll('.legal-body section'))
  const links = Array.from(document.querySelectorAll('nav a'))
  const media = matchMedia('(prefers-reduced-motion: reduce)')
  let frame = 0
  const update = () => {
    frame = 0
    const available = document.documentElement.scrollHeight - innerHeight
    document.documentElement.style.setProperty('--legal-progress', String(available > 0 ? scrollY / available : 0))
    const active = sections.reduce((current, section) => section.getBoundingClientRect().top < innerHeight * .35 ? section : current, sections[0])
    links.forEach(link => {
      const selected = link.hash === '#' + active.id
      link.dataset.active = String(selected)
      if (selected) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    })
  }
  const scroll = () => { if (!frame) frame = requestAnimationFrame(update) }
  addEventListener('scroll', scroll, { passive: true })
  addEventListener('resize', scroll, { passive: true })
  if (!media.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.dataset.visible = 'true'; observer.unobserve(entry.target) }
    }), { rootMargin: '0px 0px 100px 0px', threshold: 0 })
    sections.forEach(section => { section.dataset.visible = String(section.getBoundingClientRect().top < innerHeight); observer.observe(section) })
    document.documentElement.classList.add('legal-enhanced')
    addEventListener('hashchange', () => {
      const target = document.getElementById(location.hash.slice(1))
      if (target) target.dataset.visible = 'true'
    })
  }
  update()
})()
