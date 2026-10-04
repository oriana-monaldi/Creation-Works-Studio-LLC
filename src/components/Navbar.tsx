import { useEffect, useState } from 'react'
import type { Copy, Language } from '../data/content'
import { Arrow } from './Icons'
import { Modal } from './Modal'
const links = ['capabilities', 'work', 'studio', 'contact']
export function Navbar({
  copy,
  language,
  setLanguage,
  onContact,
}: {
  copy: Copy
  language: Language
  setLanguage: (language: Language) => void
  onContact: () => void
}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 30)
      const height = document.documentElement.scrollHeight - innerHeight
      document.documentElement.style.setProperty('--reading-progress', String(height > 0 ? window.scrollY / height : 0))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  const languageSwitch = (
    <div className="language-switch" aria-label={language === 'es' ? 'Idioma' : 'Language'}>
      <button aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>
        EN
      </button>
      <span>/</span>
      <button aria-pressed={language === 'es'} onClick={() => setLanguage('es')}>
        ES
      </button>
    </div>
  )
  return (
    <>
      <div className="reading-progress" aria-hidden="true" />
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <a className="brand" href="#top" aria-label={language === 'es' ? 'CreationWorks — Inicio' : 'CreationWorks home'}>
          <img
            className="brand-logo"
            src="/creationworks-logo.png"
            alt="CreationWorks Studio LLC"
            lang="en"
            translate="no"
            width="629"
            height="396"
          />
        </a>
        <nav className="desktop-nav" aria-label={language === 'es' ? 'Navegación principal' : 'Main navigation'}>
          {links.map((link, i) => (
            <a key={link} href={`#${link}`}>
              {copy.nav[i]}
            </a>
          ))}
        </nav>
        <a className="nav-legal" href={language === 'es' ? '/terms' : '/terms/en/'}>
          {language === 'es' ? 'Términos' : 'Terms'}
        </a>
        <div className="header-actions">
          {languageSwitch}
          <button className="header-cta" onClick={onContact}>
            {copy.start}
            <Arrow diagonal />
          </button>
          <button
            className="menu-toggle"
            onClick={() => setOpen(true)}
            aria-label={copy.menu}
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      {open && (
        <Modal language={language} onClose={() => setOpen(false)} label={copy.menuClose}>
          <nav className="mobile-nav" aria-label={language === 'es' ? 'Navegación móvil' : 'Mobile navigation'}>
            {links.map((link, i) => (
              <a key={link} href={`#${link}`} onClick={() => setOpen(false)}>
                <span>0{i + 1}</span>
                {copy.nav[i]}
                <Arrow diagonal />
              </a>
            ))}
          </nav>
          <div className="mobile-menu-bottom">
            <a href={language === 'es' ? '/terms' : '/terms/en/'}>{language === 'es' ? 'Términos y Condiciones' : 'Terms & Conditions'} ↗</a>
            {languageSwitch}
            <p>{copy.based}</p>
          </div>
        </Modal>
      )}
    </>
  )
}
