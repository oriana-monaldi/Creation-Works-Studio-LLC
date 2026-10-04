import { capabilities, type Copy, type Language } from '../data/content'
import { corporate, serviceDetails } from '../data/corporate'
import { Arrow } from '../components/Icons'
import { ServiceNavigation } from './Hero'
import { SectionTitle } from '../components/SectionTitle'

export function Capabilities({
  copy,
  language,
  onContact,
}: {
  copy: Copy
  language: Language
  onContact: (interest?: number) => void
}) {
  const text = corporate[language]
  const l = language === 'en' ? 0 : 1
  return (
    <section
      id="capabilities"
      className="services section-padding"
      aria-labelledby="services-title"
    >
      <div className="section-heading">
        <span className="section-kicker">
          <span className="orange-square" />
          {copy.capabilities}
        </span>
        <div className="heading-row">
          <SectionTitle id="services-title" first={copy.capabilitiesTitle[0]} second={copy.capabilitiesTitle[1]} />
          <p>{copy.capabilitiesText}</p>
        </div>
      </div>
      <ServiceNavigation language={language} />
      <div className="services-grid">
        {serviceDetails.map((service, i) => (
          <article
            id={`service-${service.id}`}
            className="service-detail"
            key={service.id}
            aria-labelledby={`service-title-${i}`}
            onPointerMove={(event) => {
              if (event.pointerType !== 'mouse') return
              const bounds = event.currentTarget.getBoundingClientRect()
              event.currentTarget.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`)
              event.currentTarget.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`)
            }}
          >
            <div className="service-top">
              <span className="service-number">0{i + 1}</span>
              <span className="service-category">{capabilities[i].short}</span>
              <Arrow diagonal />
            </div>
            <h3 id={`service-title-${i}`}>{service.titles[l]}</h3>
            <p className="service-description">{service.descriptions[l]}</p>
            <span className="deliverables-label">{text.deliverables}</span>
            <ul className="deliverables">
              {service.deliverables[l].map((item) => (
                <li key={item}>
                  <span>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <details className="service-platforms">
              <summary>
                {text.allServices}
                <span>+</span>
              </summary>
              <div className="service-tags">
                {capabilities[i].services.map((service) => (
                  <span key={service}>{service}</span>
                ))}
              </div>
            </details>
            <div className="service-outcome">
              <span>{text.outcomeLabel}</span>
              <p>{service.outcomes[l]}</p>
            </div>
            <button className="text-link" onClick={() => onContact(i)}>
              {copy.capabilityLink}
              <Arrow diagonal />
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export function AutomationFeature({
  language,
  onContact,
}: {
  language: Language
  onContact: (interest?: number) => void
}) {
  const text = corporate[language]
  return (
    <section className="automation-feature section-padding" aria-labelledby="automation-title">
      <div className="automation-copy">
        <span className="section-kicker">
          <span className="orange-square" />
          {text.featuredLabel}
        </span>
        <h2 id="automation-title" data-reveal>
          {text.featuredTitle}
        </h2>
        <p>{text.featuredDescription}</p>
        <ul>
          {text.featuredItems.map((item) => (
            <li key={item}>
              <span>✓</span>
              {item}
            </li>
          ))}
        </ul>
        <button className="button primary" onClick={() => onContact(2)}>
          {text.featuredCTA}
          <Arrow diagonal />
        </button>
      </div>
      <div className="workflow-visual">
        <div className="workflow-title">
          <span className="status-dot" />
          {text.workflowTitle}
        </div>
        <ol>
          {text.workflowSteps.map(([number, title, description]) => (
            <li key={number}>
              <span className="workflow-number">{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <span className="workflow-check">✓</span>
            </li>
          ))}
        </ol>
        <p className="workflow-footer">{text.workflowFoot}</p>
      </div>
    </section>
  )
}
