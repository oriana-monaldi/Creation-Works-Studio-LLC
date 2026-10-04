import { useState } from 'react'
import { SectionTitle } from '../components/SectionTitle'

import { Arrow } from '../components/Icons'
import { corporate, serviceDetails } from '../data/corporate'
import type { Copy, Language } from '../data/content'


export function Hero({
  copy,
  language,
  onContact,
}: {
  copy: Copy
  language: Language
  onContact: () => void
}) {
  const text = corporate[language]
  const [active, setActive] = useState(0)
  return (
    <>
    <section id="vision" className="hero" aria-labelledby="hero-title">
      <div className="hero-layout">
        <div className="hero-content">
          <span className="section-kicker">
            <span className="status-dot" />
            {text.heroLabel}
          </span>
          <h1 id="hero-title" className="section-title">
            <span className="section-title-first">{language === 'es' ? 'Tecnología que impulsa' : 'Technology that drives'}</span>
            <span className="section-title-second accent">{language === 'es' ? 'tu negocio.' : 'your business.'}</span>
          </h1>
          <p className="hero-intro">{copy.intro}</p>
          <div className="hero-buttons">
            <button className="button primary" onClick={onContact}>
              {copy.start}
              <Arrow diagonal />
            </button>
            <a href="#work" className="button outline">
              {copy.explore}
              <Arrow />
            </a>
          </div>
          <p className="hero-note">{text.heroNote}</p>
          <a className="hero-legal-link" href={language === 'es' ? '/terms' : '/terms/en/'}>
            {language === 'es' ? 'Términos y Condiciones' : 'Terms & Conditions'} <Arrow diagonal />
          </a>
        </div>
        <div className="hero-experience"><div className="scene-label"><span>{language === 'es' ? '01 / ALQUIMIA DIGITAL' : '01 / DIGITAL ALCHEMY'}</span><span>{language === 'en' ? 'MOVE TO EXPLORE' : 'MOVÉ EL CURSOR'}</span></div>

          <div className="solution-visual">
            <div className="solution-top">
              <span className="solution-brand">
                cw<span>↗</span>
              </span>
              <span>{text.visualLabel}</span>
            </div>
            <div
              className="solution-tabs"
              role="tablist"
              aria-label={language === 'en' ? 'Business solutions' : 'Soluciones de negocio'}
            >
              {text.visualTabs.map((tab, i) => (
                <button
                  key={tab}
                  id={`solution-tab-${i}`}
                  aria-controls="solution-panel"
                  role="tab"
                  aria-selected={active === i}
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => {
                    if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) {
                      e.preventDefault()
                      const next =
                        e.key === 'Home'
                          ? 0
                          : e.key === 'End'
                            ? 2
                            : (i + (e.key === 'ArrowRight' ? 1 : -1) + 3) % 3
                      setActive(next)
                      document.getElementById(`solution-tab-${next}`)?.focus()
                    }
                  }}
                >
                  <span>0{i + 1}</span>
                  {tab}
                </button>
              ))}
            </div>
            <div
              className="solution-panel"
              role="tabpanel"
              id="solution-panel"
              aria-labelledby={`solution-tab-${active}`}
              tabIndex={0}
            >
              <div className="solution-preview" data-view={active} aria-hidden="true">
                <div className="preview-toolbar">
                  <i />
                  <i />
                  <i />
                  <span>creationworks / {text.visualTabs[active].toLowerCase()}</span>
                </div>
                {active === 0 ? (
                  <div className="preview-website">
                    <div className="preview-site-nav">
                      <b>{language === 'es' ? 'tu empresa.' : 'your business.'}</b>
                      <span>↗</span>
                    </div>
                    <div className="preview-site-body">
                      <div>
                        <span>{language === 'es' ? 'A TU MEDIDA' : 'BUILT AROUND YOU'}</span>
                        <strong>
                          {language === 'es' ? 'Buenas ideas.' : 'Good ideas.'}
                          <br />
                          {language === 'es' ? 'Grandes experiencias.' : 'Great experiences.'}
                        </strong>
                        <i>{language === 'es' ? 'Explorá' : 'Explore'} →</i>
                      </div>
                      <div className="preview-window-stack">
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                    <div className="preview-site-bottom">
                      <span>{language === 'es' ? 'Sitio web' : 'Website'}</span>
                      <span>{language === 'es' ? 'Aplicación' : 'App'}</span>
                      <span>{language === 'es' ? 'Plataforma' : 'Platform'}</span>
                    </div>
                  </div>
                ) : active === 1 ? (
                  <div className="preview-automation">
                    <span className="preview-node">↗</span>
                    <div>
                      <span className="preview-route" />
                      <span className="preview-node">{language === 'es' ? 'IA' : 'AI'}</span>
                      <span className="preview-route" />
                    </div>
                    <div className="preview-automation-end">
                      <span>CRM</span>
                      <span>WhatsApp</span>
                      <span>{language === 'es' ? 'Equipo' : 'Team'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="preview-growth">
                    <div className="growth-label">
                      <span>{language === 'es' ? 'ADQUISICIÓN' : 'ACQUISITION'} → {language === 'es' ? 'CONVERSIÓN' : 'CONVERSION'}</span>
                      <span>↗</span>
                    </div>
                    <div className="growth-bars">
                      {[22, 35, 30, 49, 44, 64, 57, 76, 69, 93].map((height, i) => (
                        <i key={i} style={{ height: `${height}%` }} />
                      ))}
                    </div>
                    <div className="growth-legend">
                      <span>{language === 'es' ? 'Alcanzar' : 'Reach'}</span>
                      <span>{language === 'es' ? 'Conectar' : 'Engage'}</span>
                      <span>{language === 'es' ? 'Convertir' : 'Convert'}</span>
                    </div>
                  </div>
                )}
              </div>
              <h2>{text.visualTitles[active]}</h2>
              <p>{text.visualDescriptions[active]}</p>
              <div className="solution-flow">
                {text.visualSteps[active].map((step, i) => (
                  <span key={step}>
                    {i > 0 && <Arrow />}
                    <b>{step}</b>
                  </span>
                ))}
              </div>
            </div>
            <div className="solution-foot">
              <span className="status-dot" />
              {text.visualFoot}
            </div>
            <div className="solution-float">
              <span>↗</span>
              <div>
                {language === 'en' ? 'Built around your business.' : 'A la medida de tu empresa.'}
                <small>{text.heroServices}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-proof">
        {text.proof.map((label) => (
          <span key={label}>
            <span className="checkmark">✓</span>
            {label}
          </span>
        ))}
      </div>
    </section>
    <div className="world-transition" aria-hidden="true"><span>{language === 'es' ? 'MÁS ALLÁ DE LO ESPERADO.' : 'BEYOND THE EXPECTED.'}</span><small>{language === 'es' ? 'DESLIZÁ / ENTRÁ EN LA SIGUIENTE DIMENSIÓN' : 'SCROLL / ENTER THE NEXT DIMENSION'}</small></div>
    </>
  )
}

export function Introduction({ copy, language }: { copy: Copy; language: Language }) {
  const text = corporate[language]
  return (
    <section id="intro" className="introduction section-padding" aria-labelledby="intro-title">
      <div>
        <span className="section-kicker">
          <span className="orange-square" />
          {text.servicesIntro}
        </span>
        <SectionTitle id="intro-title"
          first={language === 'es' ? 'Tu socio digital.' : 'Your digital partner.'}
          second={language === 'es' ? 'De la idea al resultado.' : 'Strategy into action.'} />
      </div>
      <div className="introduction-body">
        <p>{copy.approachText}</p>
        <div className="intro-pillars">
          {text.introPoints.map(([title, description]) => (
            <div key={title}>
              <span>↗</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ServiceNavigation({ language }: { language: Language }) {
  const l = language === 'en' ? 0 : 1
  return (
    <nav
      className="service-navigation"
      aria-label={language === 'en' ? 'Find a service' : 'Encontrar un servicio'}
    >
      {serviceDetails.map((service, i) => (
        <a href={`#service-${service.id}`} key={service.id}>
          <span>0{i + 1}</span>
          {service.titles[l]}
          <Arrow diagonal />
        </a>
      ))}
    </nav>
  )
}

export function ServicesRibbon({ language }: { language: Language }) {
  return (
    <div className="services-ribbon" aria-hidden="true">
      <div>
        {[0, 1].map((i) => (
          <span key={i}>
            {language === 'es' ? 'WEB Y SOFTWARE' : 'WEB & SOFTWARE'} <b>↗</b> {language === 'es' ? 'IA Y AUTOMATIZACIÓN' : 'AI & AUTOMATION'} <b>↗</b> E-COMMERCE <b>↗</b> {language === 'es' ? 'CRECIMIENTO Y CREATIVIDAD' : 'GROWTH & CREATIVE'}{' '}
            <b>↗</b>
          </span>
        ))}
      </div>
    </div>
  )
}






