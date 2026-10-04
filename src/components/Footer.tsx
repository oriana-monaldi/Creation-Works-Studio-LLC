import { useEffect, useState } from 'react'
import type { Copy, Language } from '../data/content'
import { Arrow } from './Icons'
import { Modal } from './Modal'
import { contactEmail, socialUrl, whatsappUrl } from '../utils/config'
import { localizedTerms } from '../data/terms'
import transparentLogo from '../LOGO_de_CREATIONSWORKS_STUDIO_LLC_-removebg-preview.png'
export function Footer({
  copy,
  language,
  reduced,
  motionLocked,
  toggleMotion,
  onContact,
}: {
  copy: Copy
  language: Language
  reduced: boolean
  motionLocked: boolean
  toggleMotion: () => void
  onContact: () => void
}) {
  const [privacy, setPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(() => location.hash === '#terms')
  const termsLabel = language === 'es' ? 'Términos y Condiciones' : 'Terms & Conditions'
  useEffect(() => {
    const update = () => setShowTerms(location.hash === '#terms')
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  return (
    <footer className="footer section-padding">
      <a className="legal-banner" href={language === 'es' ? '/terms' : '/terms/en/'}>
        <span>LEGAL / CREATIONWORKS STUDIO LLC</span>
        <strong>{termsLabel}</strong>
        <span>
          {language === 'es' ? 'Leer los 22 puntos' : 'Read all 22 sections'} <Arrow diagonal />
        </span>
      </a>
      <div className="footer-top">
        <a className="brand" href="#top">
          <img
            className="brand-logo"
            src={transparentLogo}
            alt="CreationWorks Studio LLC"
            lang="en"
            translate="no"
            width="629"
            height="396"
          />
        </a>
        <p>{copy.footerStatement}</p>
        <a href="#top" className="back-top" aria-label={copy.back}>
          <Arrow diagonal />
        </a>
      </div>
      <div className="footer-links">
        <nav className="footer-navigation" aria-label={language === 'en' ? 'Footer navigation' : 'Navegación al pie'}>
          {['capabilities', 'work', 'studio', 'contact'].map((id, i) => <a key={id} href={`#${id}`}>{copy.nav[i]}</a>)}
        </nav>
        <span>{language === 'es' ? 'FLORIDA, EE. UU. · TODO EL MUNDO' : 'FLORIDA, USA · WORLDWIDE'}</span>
        <button onClick={onContact}>
          {copy.inquiries}
          <Arrow diagonal />
        </button>
        {contactEmail && <a href={`mailto:${contactEmail}`}>{contactEmail}</a>}
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">WhatsApp <Arrow diagonal /></a>
        {socialUrl && (
          <a href={socialUrl} target="_blank" rel="noopener noreferrer">
            {language === 'es' ? 'Redes' : 'Social'}
            <Arrow diagonal />
          </a>
        )}
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} CreationWorks Studio LLC. {copy.rights}
        </span>
        <div>
          <button onClick={toggleMotion} aria-pressed={reduced} disabled={motionLocked}>
            {motionLocked
              ? language === 'es'
                ? 'Movimiento reducido · dispositivo'
                : 'Reduced motion · device preference'
              : reduced
                ? copy.motionOn
                : copy.motion}
          </button>
          <button onClick={() => setPrivacy(true)}>{copy.legal}</button>
          <a
            href="#terms"
            onClick={(event) => {
              event.preventDefault()
              history.replaceState(null, '', '#terms')
              setShowTerms(true)
            }}
          >
            {termsLabel}
          </a>
          <span>{language === 'es' ? 'CREADO PARA EVOLUCIONAR' : 'BUILT TO EVOLVE'} ↗</span>
        </div>
      </div>
      {privacy && (
        <Modal language={language} onClose={() => setPrivacy(false)} label={copy.legal}>
          <div className="privacy-content">
            <span className="section-kicker">{copy.legal}</span>
            <h2>{copy.privacyTitle}</h2>
            <p>{copy.privacyText}</p>
          </div>
        </Modal>
      )}
      {showTerms && (
        <Modal language={language}
          onClose={() => {
            setShowTerms(false)
            history.replaceState(null, '', location.pathname + location.search)
          }}
          label={termsLabel}
        >
          <article className="terms-content" lang={language}>
            <span className="section-kicker">CREATIONWORKS STUDIO LLC</span>
            <h2>{termsLabel}</h2>
            <a className="terms-contact" href="#contact" onClick={() => setShowTerms(false)}>
              {language === 'es' ? 'Contactar a CreationWorks' : 'Contact CreationWorks'} <Arrow diagonal />
            </a>
            {localizedTerms[language].map(([title, body], index) => (
              <section key={title}>
                <h3>
                  {index + 1}. {title}
                </h3>
                <p>{body}</p>
              </section>
            ))}
          </article>
        </Modal>
      )}
    </footer>
  )
}
